// 左：ランキングtop10 / 中央：自分のコミット情報 / 右：コミュニティの検索・作成

"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getCommunity } from "@/service/supabase/get/getCommunity";
import { getUserSession } from '@/service/supabase/auth/getUserSession';
import { CommunityType } from "@/constants/communityType";
import { getUsersCommunityRegistration } from "@/service/supabase/get/getUsersCommunityRegistration";

const Ranking: React.FC = () => {
    const [view, setView] = useState<"user" | "community">("user");
    const initializationDone = useRef(false);
    const [displayCommunities, setDisplayCommunities] = useState<CommunityType[]>([]);
    const [displayCurrentCommunityId, setDisplayCurrentCommunityId] = useState<string | null>(null);

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
        { name: "あなた", commits: 31 },
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
                const usersRegistration = await getUsersCommunityRegistration(initialSession.user.id);
                const usersCommunityId = usersRegistration.UsersCommunityType.community_id;
                setDisplayCurrentCommunityId(usersCommunityId);
            }
        };

        initializeAuth();
    }, []);

    const currentUser = "あなた";
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
        <div className="flex flex-row h-screen">
            {/* 左側: ランキング */}
            <div className="w-1/3 p-4 border-r border-gray-300">
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setView("user")}
                        className={`px-4 py-2 rounded-lg border ${
                            view === "user"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-gray-200 text-gray-700 border-gray-400"
                        } hover:bg-blue-700 hover:text-white transition duration-200`}
                    >
                        ユーザーランキング
                    </button>
                    <button
                        onClick={() => setView("community")}
                        className={`px-4 py-2 rounded-lg border ${
                            view === "community"
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-gray-200 text-gray-700 border-gray-400"
                        } hover:bg-blue-700 hover:text-white transition duration-200`}
                    >
                        コミュニティランキング
                    </button>
                </div>

                <h1 className="mb-4 font-bold">
                    {view === "user"
                        ? "今月のコミット数ランキングTop10ユーザー"
                        : "今月のコミット数ランキングTop10コミュニティ"}
                </h1>

                <ol>
                    {view === "user"
                        ? userRankings.map((user, index) => (
                              <li
                                  key={index}
                                  className={`${
                                      user.name === currentUser
                                          ? "text-red-500 font-bold"
                                          : ""
                                  }`}
                              >
                                  {`${user.rank}位: ${user.name}`} (
                                  {user.commits}コミット)
                              </li>
                          ))
                        : communityRankings.map((community, index) => (
                              <li
                                  key={index}
                                  className={`${
                                      community.name === currentCommunity
                                          ? "text-red-500 font-bold"
                                          : ""
                                  }`}
                              >
                                  {`${community.rank}位: ${community.name}`} (
                                  {community.commits}コミット)
                              </li>
                          ))}
                </ol>
            </div>

            {/* 中央: 自分のコミット情報 */}
            <div className="w-1/3 p-4 flex flex-col items-center justify-center">
                <h2 className="text-xl mb-2">
                    あなたのコミット数:{" "}
                    {users.find((user) => user.name === currentUser)?.commits}
                </h2>
                <h2 className="text-xl mb-4">
                    所属コミュニティ: {currentCommunity}
                </h2>
                <Link
                    href={`community/${displayCurrentCommunityId}/chat`}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    コミュニティのチャット画面へ
                </Link>
            </div>

            {/* 右側: 操作ボタン */}
            <div className="w-1/3 p-4 border-l border-gray-300 flex flex-col space-y-4">
                <Link
                    href="/community-create"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    コミュニティを作成
                </Link>
                <Link
                    href="/communities"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                    コミュニティを探す
                </Link>
            </div>
        </div>
    );
};

export default Ranking;
