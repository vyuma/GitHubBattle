"use client";

import Message from "@/components/Message";
import { receiveChatType } from "@/constants/receiveChatType";
import { getCommunityAndCnt } from "@/service/supabase/get/getCommunity";
import { getCommunityChat } from "@/service/supabase/get/getCommunityChat";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";
import { getOneCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getUser } from "@/service/supabase/get/getUser";
import { CommunityType } from "@/constants/communityType";
import { Session } from "@supabase/supabase-js";
import { fetchRealtimeData } from "@/service/supabase/realtime/fetchRealtime";
import { addMessageDB } from "@/service/supabase/updates/addCommunityMessage";
import { useEffect, useState, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const CommunityChat = ({ params }: { params: { id: string } }) => {
    const [chatMs, setChatMs] = useState<string>("");
    const [receiveChatData, setReceiveChatData] = useState<receiveChatType[]>([]);
    const [session, setSession] = useState<Session | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [nickname, setNickname] = useState<string>("匿名");
    const [githubNames, setGithubNames] = useState<string[]>([]);
    const [xNames, setXNames] = useState<string[]>([]);
    const [thirtyDaysLater, setThirtyDaysLater] = useState<Date>(new Date());
    const [userCommunityStartDate, setUserCommunityStartDate] = useState<Date>(new Date());

    const scrollToTop = () => {
        messagesEndRef.current?.parentElement?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const updateMessages = useCallback((newReceiveChat: receiveChatType) => {
        setReceiveChatData((prevMessages) => {
            if (prevMessages.some((msg) => msg.id === newReceiveChat.id)) {
                // console.log(newReceiveChat);
                return prevMessages;
            }
            return [...prevMessages, newReceiveChat];
        });
    }, []);

    useEffect(() => {
        let isMounted = true;
        const cleanupFunction = fetchRealtimeData(
            setReceiveChatData,
            params.id
        );

        const fetchInitialMessages = async () => {
            try {
                const initialMessages: receiveChatType[] | boolean =
                    await getCommunityChat(params.id);

                if (initialMessages == true) {
                    router.push("/home");
                }
                if (typeof initialMessages !== "boolean") {
                    if (isMounted) {
                        setReceiveChatData(
                            initialMessages as receiveChatType[]
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching initial messages:", error);
            }
        };
        fetchInitialMessages();

        return () => {
            isMounted = false;
            cleanupFunction();
        };
    }, [params.id]);

    useEffect(() => {
        const fetchNickname = async () => {
            if (session) {
                const userCommunityInfo = await getUsersCommunityRegistration(
                    session.user.id
                );
                setNickname(userCommunityInfo.UsersCommunityType.nickname!);
            }
        };

        fetchNickname();
    }, [session]);

    useEffect(() => {
        scrollToBottom();
    }, [receiveChatData]);

    useEffect(() => {
        inputRef.current?.focus();

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);

            if (!initialSession) {
                router.push("/login");
            }

            // ユーザーが属しているcommunityのstart_dateを取得
            const userId = session?.user.id;
            const userCommunity = await getUsersCommunityRegistration(userId as string);
            const userCommunityStartDateRow = userCommunity.UsersCommunityType.start_date;
            const userCommunityStartDate = new Date(userCommunityStartDateRow!);
            setUserCommunityStartDate(userCommunityStartDate);

            // そこから、30日後の日付を取得
            const thirtyDaysLater = new Date(userCommunityStartDate);
            thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30); // setDateは日付を変更するメソッド, getDateは日付を取得するメソッド
            setThirtyDaysLater(thirtyDaysLater);

            // メンバー全員のgithub_nameを取得
            const members = await getCommunityMembers(params.id);
            const memberIds = members.map((member) => member.user_id);
            const memberGithubNamesPromises = memberIds.map(
                async (memberId) => {
                    const member = await getUser(memberId as string);
                    if (member.github_name) {
                        return member.github_name;
                    } else {
                        return "github_nameが未登録です";
                    }
                }
            );

            // Promise.all() を使用して全てのPromiseが解決されるのを待つ
            // これでmemberGithubNamesは解決された値の配列になるので、Promiseではなく値そのものを取得できる
            const memberGithubNames = await Promise.all(
                memberGithubNamesPromises
            );
            setGithubNames(memberGithubNames);

            // 同様にメンバー全員のx_nameを取得
            const memberXNamesPromises = memberIds.map(async (memberId) => {
                const member = await getUser(memberId as string);
                if (member.x_name) {
                    return member.x_name;
                } else {
                    return "x_nameが未登録です";
                }
            });
            const memberXNames = await Promise.all(memberXNamesPromises);
            setXNames(memberXNames);
        };

        initializeAuth();
    }, []);

    const handleSendMessage = async () => {
        if (chatMs.trim()) {
            try {
                if (session) {
                    const newReceiveChat = await addMessageDB(
                        chatMs,
                        params.id,
                        nickname
                    );
                    updateMessages(newReceiveChat);
                }

                setChatMs("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            {thirtyDaysLater <= userCommunityStartDate ? (
                <div>
                    <h1>GitHubユーザー名</h1>
                    {githubNames.map((name) => (
                        <p>{name}</p>
                    ))}

                    <h1>Xユーザー名</h1>
                    {xNames.map((name) => (
                        <p>{name}</p>
                    ))}
                </div>
            ) : null}

            {/* テスト用。以下のコメント外せば試すことができます
            <div>
                <h1>GitHubユーザー名</h1>
                {githubNames.map((name) => (
                    <p>{name}</p>
                ))}

                <h1>Xユーザー名</h1>
                {xNames.map((name) => (
                    <p>{name}</p>
                ))}
            </div> */}

            <Navbar session={session} />

            <div className="max-w-2xl mx-auto p-4">
                <h1 className="text-center text-2xl md:text-3xl font-extrabold mb-8 mt-4 text-gray-800 tracking-tight leading-tight">
                    『{"communityName"}』
                </h1>

                <p className="text-center text-sm md:text-base text-gray-600 mb-8 px-4 leading-relaxed">
                    {"communityDetail"}
                </p>

                <div
                    className="text-center text-gray-500 my-4 cursor-pointer hover:text-blue-500"
                    onClick={scrollToTop}
                >
                    ↑古いチャットへ
                </div>

                <div className="h-96 overflow-y-auto mb-4 bg-gray-100 p-4 rounded-lg">
                    {receiveChatData.map((ms, index) => (
                        <Message receiveChat={ms} key={ms.id || index} />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div
                    className="text-center text-gray-500 my-4 cursor-pointer hover:text-blue-500"
                    onClick={scrollToBottom}
                >
                    ↓新しいチャットへ
                </div>

                <div className="flex">
                    <input
                        type="text"
                        value={chatMs}
                        onChange={(e) => setChatMs(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="メッセージを入力..."
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ref={inputRef}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        送信
                    </button>
                </div>
            </div>
        </>
    );
};

export default CommunityChat;
