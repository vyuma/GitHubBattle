// コミュニティ詳細画面

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { CommunityType } from "@/constants/communityType";
import Link from "next/link";

const CommunityDetailPage: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [display, setDisplay] = useState<CommunityType[]>([]);
    const initializationDone = useRef(false);
    const params = useParams();
    const communityId = params.id;

    useEffect(() => {
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);

            const community = await getCommunity(0);
            setDisplay(community);
        };

        initializeAuth();
    }, []);

    const currentCommunity = display.find(
        (community) => community.community_id === communityId
    );

    if (session) {
        return (
            <div className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    {currentCommunity ? (
                        <>
                            <p className="text-3xl font-bold text-blue-700 mb-4">
                                『{currentCommunity.name}』
                            </p>
                            <p className="text-lg text-gray-700 mb-6">
                                {currentCommunity.detail}
                            </p>
                            <p className="text-base text-gray-700 mb-6">
                                id: {currentCommunity.community_id}
                            </p>
                        </>
                    ) : (
                        <p className="text-red-500">
                            このIDのコミュニティは存在しません。
                        </p>
                    )}
                    <Link
                        href={`/community/${communityId}/chat`}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md inline-block"
                    >
                        このコミュニティに参加
                    </Link>
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

export default CommunityDetailPage;
