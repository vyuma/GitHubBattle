"use client";

import Message from "@/components/Message";
import { receiveChatType } from "@/constants/receiveChatType";
import { getCommunityChat } from "@/service/supabase/get/getCommunityChat";
import { fetchRealtimeData } from "@/service/supabase/realtime/fetchRealtime";
import { addMessageDB } from "@/service/supabase/updates/addMessage";
import { useEffect, useState, useRef } from "react";

const CommunityChat = ({ params }: { params: { id: string } }) => {
    const [chatMs, setChatMs] = useState("");
    const [receiveChatData, setReceiveChatData] = useState<receiveChatType[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        let isMounted = true;
        const cleanupFunction = fetchRealtimeData(
            setReceiveChatData,
            params.id
        );

        const fetchInitialMessages = async () => {
            try {
                const initialMessages: receiveChatType[] = await getCommunityChat(params.id);
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
    }, []);

    const handleSendMessage = async () => {
        if (chatMs.trim()) {
            await addMessageDB(chatMs, params.id);
            setChatMs("");
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
            <h1 className="text-2xl font-bold mb-4">
                コミュニティチャット：{params.id}
            </h1>
            <div className="h-96 overflow-y-auto mb-4 bg-gray-100 p-4 rounded-lg">
                {receiveChatData.map((ms, index) => (
                    <Message receiveChat={ms} key={ms.id || index} />
                ))}
                <div ref={messagesEndRef} />
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
