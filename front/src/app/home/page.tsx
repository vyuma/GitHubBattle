/*
左  :ランキングtop10
中央:自分のコミット情報
右  :コミュニティの検索・作成
*/

"use client";

import { FaPlusCircle, FaSearch } from "react-icons/fa";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { CommunityType } from "@/constants/communityType";
import { UsersCommunityType } from "@/constants/usersCommunityType";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";
import { getTopUserContributors } from "@/service/supabase/get/getTopUserContributors";

type RankingItem = {
    id: string;
    name: string;
    commits?: number;
    member_limits?: number;
    rank?: number;
};

const Ranking: React.FC = () => {
    const [view, setView] = useState<"user" | "community">("user");
    const [userId, setUserId] = useState<string>("");
    const [displayCurrentCommunityId, setDisplayCurrentCommunityId] = useState<string>("");
    const [community_members, setCommunityMembers] = useState<UsersCommunityType[]>([]);
    const [topContributors, setTopContributors] = useState<RankingItem[]>([]);
    const [displayCommunities, setDisplayCommunities] = useState<CommunityType[]>([]);
    const [currentCommunity, setCurrentCommunity] = useState<string>("");

    useEffect(() => {
        const initializeData = async () => {
            //await getCommunity(0)は今後ランキング上位１０個取得する関数に置き換える予定
            const communities = await getCommunity(0);
            setDisplayCommunities(communities);

            const session = await getUserSession();
            if (session?.user) {
                const userReg = await getUsersCommunityRegistration(session.user.id);
                setUserId(userReg.UsersCommunityType.nickname || "Unknown");
                setDisplayCurrentCommunityId(userReg.UsersCommunityType.community_id || "");

                const communityMembers = await getCommunityMembers(userReg.UsersCommunityType.community_id || "");
                setCommunityMembers(communityMembers);

                const topContributors = await getTopUserContributors();
                setTopContributors(topContributors.map(c => ({
                    id: c.user_id,
                    name: c.user_name,
                    commits: parseInt(c.total_contributions, 10)
                })));
            }
        };

        initializeData();
    }, []);

    useEffect(() => {
        const community = displayCommunities.find(
            (community) => community.community_id === displayCurrentCommunityId
        );
        setCurrentCommunity(community?.name || "");
    }, [displayCurrentCommunityId, displayCommunities]);

    const calculateRankings = (items: RankingItem[]): RankingItem[] => {
        return items
            .sort((a, b) => (b.commits || 0) - (a.commits || 0))
            .map((item, index, arr) => ({
                ...item,
                rank: index > 0 && item.commits === arr[index - 1].commits ? arr[index - 1].rank : index + 1
            }))
            .slice(0, 10);
    };

    const displayRankings = view === "user" 
        ? calculateRankings(topContributors)
        : calculateRankings(displayCommunities.map(c => ({
            id: c.community_id,
            name: c.name,
            member_limits: c.member_limits,
            commits: 10,
            rank:1,
        })));

        return (
            <div className="flex flex-col md:flex-row h-screen bg-gray-100">
                {/* 左側: ランキング */}
                <div className="w-full md:w-1/3 p-6 bg-white shadow-lg">
                    <div className="flex space-x-4 mb-6">
                        {["user", "community"].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v as "user" | "community")}
                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                    view === v
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300"
                                } hover:bg-blue-700 hover:text-white transition duration-200`}
                            >
                                {v === "user" ? "ユーザー" : "コミュニティ"}
                            </button>
                        ))}
                    </div>
        
                    <h1 className="mb-4 text-2xl font-bold text-gray-800">
                        {view === "user" ? "月間コミットランキング" : "コミュニティランキング"}
                    </h1>
        
                    <ol className="space-y-2">
                        {displayRankings.map((item, index) => (
                            <li
                                key={index}
                                className={`flex justify-between items-center p-3 rounded-lg ${
                                    item.name === (view === "user" ? userId : currentCommunity)
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-50"
                                }`}
                            >
                                <span className="font-semibold">{`${item.rank}. ${item.name}`}</span>
                                <span className="text-sm text-gray-600">
                                    {item.commits}コミット
                                </span>
                            </li>
                        ))}
                    </ol>
                </div>
        
                {/* 中央: 自分のコミット情報 */}
                <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center bg-white shadow-lg">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {topContributors.find((user) => user.id === userId)?.commits || 0}
                        </h2>
                        <p className="text-gray-600">あなたの月間コミット数</p>
                    </div>
        
                    <div className="w-full bg-gray-100 p-6 rounded-lg mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            所属コミュニティ: {currentCommunity}
                        </h2>
        
                        <h3 className="text-lg font-medium text-gray-700 mb-2">
                            メンバー
                        </h3>
                        {community_members.length === 0 ? (
                            <p className="text-gray-600">メンバーはいません</p>
                        ) : (
                            <ul className="list-disc list-inside space-y-1">
                                {community_members.map((member) => (
                                    <li
                                        key={member.user_id || ''}
                                        className="text-gray-600"
                                    >
                                        {member.nickname || 'Unknown'} さん
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
        
                    <Link
                        href={`community/${displayCurrentCommunityId}/chat`}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        コミュニティのチャットへ
                    </Link>
                </div>
        
                {/* 右側: 操作ボタン */}
                <div className="w-full md:w-1/3 p-6 bg-white shadow-lg rounded-lg flex flex-col justify-center space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                        アクション
                    </h2>
        
                    <Link
                        href="/community-create"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <FaPlusCircle className="text-xl" />
                        <span className="font-medium">コミュニティを作成</span>
                    </Link>
        
                    <Link
                        href="/communities"
                        className="bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-all duration-300 text-center flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        <FaSearch className="text-xl" />
                        <span className="font-medium">コミュニティを探す</span>
                    </Link>
        
                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm mb-2">
                            新しい仲間を見つけよう！
                        </p>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default Ranking;
