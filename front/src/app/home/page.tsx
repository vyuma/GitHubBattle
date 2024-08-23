/*
左  :ランキングtop10
中央:自分のコミット情報
右  :コミュニティの検索・作成
*/

"use client";

import { FaPlusCircle, FaSearch } from "react-icons/fa";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getCommunityMembers } from "@/service/supabase/get/getCommunityMembers";
import { getUserSession } from "@/service/supabase/auth/getUserSession";
import { CommunityType } from "@/constants/communityType";
import { UsersCommunityType } from "@/constants/usersCommunityType";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";

const Ranking: React.FC = () => {
    const [view, setView] = useState<"user" | "community">("user");
    const [nickname, setNickname] = useState<string>("");
    const initializationDone = useRef(false);
    const [displayCommunities, setDisplayCommunities] = useState<
        CommunityType[]
    >([]);
    const [displayCurrentCommunityId, setDisplayCurrentCommunityId] =
        useState<string>("");
    const [community_members, setCommunityMembers] = useState<
        UsersCommunityType[]
    >([]);

    const users = [
        { name: "ユーザー1", commits: 10 },
        { name: "ユーザー2", commits: 32 },
        { name: "ユーザー3", commits: 10 },
        { name: "ユーザー4", commits: 32 },
        { name: "ユーザー5", commits: 12 },
        { name: "ユーザー6", commits: 42 },
        { name: "ユーザー7", commits: 11 },
        { name: "ユーザー8", commits: 44 },
        { name: "ユーザー9", commits: 33 },
        { name: "ユーザー10", commits: 12 },
        { name: "ユーザー11", commits: 44 },
        { name: "ユーザー12", commits: 1 },
        { name: nickname, commits: 31 },
    ];

    const communities = [
        { name: "Python初心者カフェ", commits: 15 },
        { name: "Next.js勉強コミュニティ", commits: 12 },
        { name: "Flutterに興味ある人集まれ", commits: 10 },
        { name: "Webデザイン初心者会", commits: 8 },
        { name: "駆け出しコミュニティ", commits: 11 },
        { name: "ゲーム開発の秘密基地", commits: 21 },
        { name: "データサイエンスの一歩", commits: 32 },
        { name: "React同好会", commits: 10 },
        { name: "アルゴリズム大好きの会", commits: 43 },
        { name: "デスクトップアプリ開発", commits: 1 },
        { name: "Kotlin好き", commits: 43 },
        { name: "Kotlinより普通にSwiftが好き～", commits: 33 },
        { name: "Nuxt.js初心者", commits: 11 },
    ];

    useEffect(() => {
        // デバックモードだと２回呼ばれる対策
        if (initializationDone.current) return;
        initializationDone.current = true;

        const initializeAuth = async () => {
            // コミュニティ一覧
            const communities = await getCommunity(0);
            setDisplayCommunities(communities);

            // 現在のユーザーが属するコミュニティのID
            const initialSession = await getUserSession();
            if (initialSession && initialSession.user) {
                const usersRegistration = await getUsersCommunityRegistration(
                    initialSession.user.id
                );
                const userNickname =
                    usersRegistration.UsersCommunityType.nickname;
                setNickname(
                    userNickname || "あなたのnicknameが取得できませんでした"
                );

                const usersCommunityId =
                    usersRegistration.UsersCommunityType.community_id;
                setDisplayCurrentCommunityId(usersCommunityId || "");

                // 現在のユーザーが属するコミュニティのメンバー
                const communityMembers = await getCommunityMembers(
                    usersCommunityId || ""
                );
                setCommunityMembers(communityMembers);
            }
        };

        initializeAuth();
    }, []);

    const currentUser = nickname;
    const currentCommunity = displayCommunities.find(
        (community) => community.community_id === displayCurrentCommunityId
    )?.name;

    const calculateRankings = (items: { name: string; commits: number }[]) => {
        let rankings: { name: string; commits: number; rank: number }[] = [];
        let currentRank = 1;

        for (let i = 0; i < items.length; i++) {
            if (i > 0 && items[i].commits < items[i - 1].commits) {
                currentRank = i + 1;
            }
            rankings.push({ ...items[i], rank: currentRank });
        }

        return rankings.slice(0, 10); // Top10までのみを切り取る
    };

    const userRankings = calculateRankings(
        users.sort((a, b) => b.commits - a.commits)
    );
    const communityRankings = calculateRankings(
        communities.sort((a, b) => b.commits - a.commits)
    );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* 左側: ランキング */}
            <div className="w-full md:w-1/3 p-6 bg-white shadow-lg">
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setView("user")}
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                            view === "user"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                        } hover:bg-blue-700 hover:text-white transition duration-200`}
                    >
                        ユーザー
                    </button>
                    <button
                        onClick={() => setView("community")}
                        className={`flex-1 px-4 py-2 rounded-lg border ${
                            view === "community"
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-700 border-gray-300"
                        } hover:bg-blue-700 hover:text-white transition duration-200`}
                    >
                        コミュニティ
                    </button>
                </div>

                <h1 className="mb-4 text-2xl font-bold text-gray-800">
                    {view === "user"
                        ? "月間コミットランキング"
                        : "コミュニティランキング"}
                </h1>

                <ol className="space-y-2">
                    {(view === "user" ? userRankings : communityRankings).map(
                        (item, index) => (
                            <li
                                key={index}
                                className={`flex justify-between items-center p-3 rounded-lg ${
                                    item.name ===
                                    (view === "user"
                                        ? currentUser
                                        : currentCommunity)
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-50"
                                }`}
                            >
                                <span className="font-semibold">
                                    {`${item.rank}. ${item.name}`}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {item.commits}コミット
                                </span>
                            </li>
                        )
                    )}
                </ol>
            </div>

            {/* 中央: 自分のコミット情報 */}
            <div className="w-full md:w-1/3 p-6 flex flex-col items-center justify-center bg-white shadow-lg">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {
                            users.find((user) => user.name === currentUser)
                                ?.commits
                        }
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
                                    key={member.user_id}
                                    className="text-gray-600"
                                >
                                    {member.nickname} さん
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
            <div className="w-full md:w-1/3 p-6 bg-gradient-to-b from-blue-500 to-purple-600 shadow-lg flex flex-col justify-center space-y-6">
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                    アクション
                </h2>

                <Link
                    href="/community-create"
                    className="bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 transition duration-200 text-center flex items-center justify-center space-x-2 shadow-md"
                >
                    <FaPlusCircle className="text-xl" />
                    <span>コミュニティを作成</span>
                </Link>

                <Link
                    href="/communities"
                    className="bg-yellow-500 text-white px-6 py-4 rounded-lg hover:bg-yellow-600 transition duration-200 text-center flex items-center justify-center space-x-2 shadow-md"
                >
                    <FaSearch className="text-xl" />
                    <span>コミュニティを探す</span>
                </Link>

                <div className="mt-8 text-center">
                    <p className="text-white text-sm mb-2">
                        新しい仲間を見つけよう！
                    </p>
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-white rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ranking;
