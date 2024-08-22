"use client";

import Message from "@/components/Message";
import { receiveChatType } from "@/constants/receiveChatType";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityChat } from "@/service/supabase/get/getCommunityChat";
import { CommunityType } from "@/constants/communityType";
import { fetchRealtimeData } from "@/service/supabase/realtime/fetchRealtime";
import { addMessageDB } from "@/service/supabase/updates/addCommunityMessage";
import { useEffect, useState, useRef, useCallback } from "react";

const CommunityChat = ({ params }: { params: { id: string } }) => {
    const [chatMs, setChatMs] = useState<string>("");
    const [displayCommunities, setDisplayCommunities] = useState<
        CommunityType[]
    >([]);
    const [receiveChatData, setReceiveChatData] = useState<receiveChatType[]>(
        []
    );
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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
                console.log(newReceiveChat);
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
                const initialMessages: receiveChatType[] =
                    await getCommunityChat(params.id);
                if (isMounted) {
                    setReceiveChatData(initialMessages);
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
        scrollToBottom();
    }, [receiveChatData]);

    useEffect(() => {
        inputRef.current?.focus();

        const initializeAuth = async () => {
            // コミュニティ一覧(最新20件)
            const communities = await getCommunity(0);
            setDisplayCommunities(communities);
        };
        initializeAuth();
    }, []);

    const communityName = displayCommunities.find(
        (community) => community.community_id === params.id
    )?.name;
    const communityDetail = displayCommunities.find(
        (community) => community.community_id === params.id
    )?.detail;

    const handleSendMessage = async () => {
        if (chatMs.trim()) {
            try {
                const newReceiveChat = await addMessageDB(chatMs, params.id);
                if (newReceiveChat) {
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
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-center text-2xl md:text-3xl font-extrabold mb-8 mt-4 text-gray-800 tracking-tight leading-tight">
                『{communityName}』
            </h1>

            {communityDetail && (
                <p className="text-center text-sm md:text-base text-gray-600 mb-8 px-4 leading-relaxed">
                    {communityDetail}
                </p>
            )}

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
    );
};

export default CommunityChat;
