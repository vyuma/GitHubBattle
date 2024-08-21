// コミュニティ一覧ページ

"use client";

import { useState, useEffect, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { CommunityType } from "@/constants/communityType";
import Link from "next/link";

const CommunitiesPage: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [display, setDisplay] = useState<CommunityType[]>([]);
    const initializationDone = useRef(false);

    useEffect(() => {
        // デバックモードだと２回呼ばれる対策
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);
            // コミュニティ一覧取得
            const community = await getCommunity(0);
            setDisplay(community);
            console.log("あいうえお", community);
        };

        initializeAuth();
    }, []);

    if (session) {
        return (
            <div className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-4xl mx-auto bg-white rounded-md shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-6">
                        コミュニティ一覧
                    </h1>

                    {display.map((community) => (
                        <div
                            key={community.community_id}
                            className="border-b border-gray-200 py-4 flex justify-between items-center"
                        >
                            <div className="flex-1 mr-4">
                                <p className="text-lg font-bold mb-2">
                                    『{community.name}』
                                </p>
                                <div className="text-gray-600 overflow-hidden text-ellipsis whitespace-normal line-clamp-3">
                                    {community.detail}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href={`/community/${community.community_id}`}
                                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md whitespace-nowrap"
                                >
                                    詳細
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-md shadow-lg p-8">
                    <p className="text-lg font-medium">ログインしていない</p>
                </div>
            </div>
        );
    }
};

export default CommunitiesPage;
