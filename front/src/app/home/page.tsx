// 左：ランキングtop10 / 中央：自分のコミット情報 / 右：コミュニティの検索・作成

"use client";

import Link from "next/link";
import { useState } from "react";

const Ranking: React.FC = () => {
    const [view, setView] = useState<"user" | "community">("user");

    const users = [
        { name: "ユーザー1", commits: 10 },
        { name: "ユーザー2", commits: 32 },
        { name: "ユーザー3", commits: 12 },
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
        { name: "コミュニティ1", commits: 15 },
        { name: "コミュニティ2", commits: 12 },
        { name: "コミュニティ3", commits: 10 },
        { name: "コミュニティ4", commits: 8 },
        { name: "コミュニティ5", commits: 6 },
        { name: "コミュニティ6", commits: 21 },
        { name: "コミュニティ7", commits: 32 },
        { name: "コミュニティ8", commits: 12 },
        { name: "コミュニティ9", commits: 43 },
        { name: "コミュニティ10", commits: 1 },
        { name: "コミュニティ11", commits: 43 },
        { name: "コミュニティ12", commits: 33 },
    ];

    const currentUser = "あなた";
    const currentCommunity = "コミュニティ6";

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
                    href="/このユーザーが属するコミュニティのチャット画面へのリンク"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    コミュニティのチャット画面へ
                </Link>
            </div>

            {/* 右側: 操作ボタン */}
            <div className="w-1/3 p-4 border-l border-gray-300 flex flex-col space-y-4">
                <Link
                    href="/create"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    コミュニティを作成
                </Link>
                <Link
                    href="/search"
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                    コミュニティを探す
                </Link>
            </div>
        </div>
    );
};

export default Ranking;
