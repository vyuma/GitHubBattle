// コミュニティ詳細画面

"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { CommunityType } from "@/constants/communityType";
import { UsersCommunityType } from "@/constants/usersCommunityType";
import Link from "next/link";
import { addUserCommunity } from "@/service/supabase/updates/addUserCommunity";
import { useRouter } from "next/navigation";

// 現在の日時を取得する関数
const getCurrentDate = () => {
    return new Date();
};

// startDateと現在の日時を比較する関数
const isBattleStarted = (startDate: string) => {
    const currentDate = getCurrentDate();
    const battleStartDate = new Date(startDate);
    return currentDate > battleStartDate;
};

const CommunityDetailPage = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [display, setDisplay] = useState<CommunityType[]>([]);
    const [nickname, setNickname] = useState<string>("匿名ユーザー");
    const [community_members, setCommunityMembers] = useState<UsersCommunityType[]>([]);
    const [isBattleAlreadyStarted, setIsBattleAlreadyStarted] = useState<boolean>(false);
    const initializationDone = useRef(false);
    const params = useParams();
    const communityId: string = params.id as string;
    const router = useRouter();

    useEffect(() => {
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            const initialSession = await getUserSession();
            setSession(initialSession);

            const community = await getCommunity(0);
            setDisplay(community);

            const communityMembers = await getCommunityMembers(
                communityId?.toString()
            );
            setCommunityMembers(communityMembers);

            // バトル開始済みかどうかをチェック
            const currentCommunity = community.find(
                (c) => c.community_id === communityId
            );
            if (currentCommunity && currentCommunity.start_date) {
                setIsBattleAlreadyStarted(
                    isBattleStarted(currentCommunity.start_date.toString())
                );
            }
        };

        initializeAuth();
    }, [communityId]);

    const currentCommunity = display.find(
        (community) => community.community_id === communityId
    );
    const startDate = currentCommunity?.start_date.toString();
    const memberLimits = currentCommunity?.member_limits;
    const memberCount = community_members.length;

    const handleJoinCommunity=async ()=>{
       const isSucess= await addUserCommunity(communityId,nickname,startDate as unknown as Date);
       if(isSucess){
        router.push(`/community/${communityId}/chat`);
       }

    }

    if (!session) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <p className="text-xl font-semibold text-red-600">
                        ログインしていません
                    </p>
                    <Link
                        href="/login"
                        className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"
                    >
                        ログインページへ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {currentCommunity ? (
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-blue-700 mb-4">
                            『{currentCommunity.name}』
                        </h1>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            {currentCommunity.detail}
                        </p>
                        <div className="mb-6 bg-gray-50 p-4 rounded-md">
                            {community_members.length === 0 && (
                                <p className="text-gray-600">
                                    メンバーはいません
                                </p>
                            )}

                            {community_members.length !== 0 && (
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                    メンバー
                                </h2>
                            )}

                            <ul className="list-disc list-inside space-y-1">
                                {community_members.map((member) => (
                                    <li
                                        key={member.user_id}
                                        className="text-gray-600"
                                    >
                                        {member.nickname} さん
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-600">
                                バトル開始日：
                                <span className="font-medium">{startDate}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                メンバー数：
                                <span className="font-medium">
                                    {memberCount}/{memberLimits}
                                </span>
                            </p>
                        </div>
                        {!isBattleAlreadyStarted && (
                            <div className="mb-4">
                                <label
                                    htmlFor="nickname"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    ニックネーム
                                </label>
                                <input
                                    type="text"
                                    id="nickname"
                                    onChange={(e) =>
                                        setNickname(e.target.value)
                                    }
                                    placeholder="ニックネームを入力"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        )}
                        {isBattleAlreadyStarted ? (
                            <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                                <p className="font-bold">警告</p>
                                <p>
                                    このコミュニティはすでにバトルを開始しています。新規参加はできません。
                                </p>
                            </div>
                        ) : (
                            <button
                                onClick={handleJoinCommunity}
                                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-center transition duration-300"
                            >
                                このコミュニティに参加
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="p-8">
                        <p className="text-xl font-semibold text-red-600">
                            このIDのコミュニティは存在しません。
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityDetailPage;
