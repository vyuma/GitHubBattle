// backendからのランキングのデータを受け取り、表示する
// 自分が10位以内に入っていた場合は、自分の順位を強調表示した上で10位以内に組み込むロジックも忘れずに

// /rankingっていうエンドポイントにGETリクエストを送ってるけど、/communitiesにGETリクエストを送ってそれをfront側でソートするだけでも実現できそうだからそれの方が良いかも？

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

import { Community } from "../types";

const Ranking: React.FC = () => {
    const [communities, setCommunities] = useState<Community[]>([]);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async (): Promise<void> => {
        try {
            const response = await fetch("http://localhost:8000/communities");
            if (response.ok) {
                const data = await response.json();
                setCommunities(data);
                toast.success("Fetched communities");
            } else {
                console.error("Failed to fetch communities");
                toast.error("Failed to fetch communities");
            }
        } catch (error) {
            console.error("An error occurred", error);
            toast.error("An error occurred");
        }
    };

    return (
        <div>
            <Toaster />
            <h1>今月のコミット数ランキングTop10コミュニティ</h1>
            {/* <ol>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                <li>[ユーザー名]: [コミット数]コミット</li>
                . <br />
                . <br />
                . <br />
            </ol>
            <b>You</b> → [自分のユーザー名]: [自分のコミット数]コミット */}
            <br /><br />

            <div>
                {communities
                    .sort((a, b) => b.commitCount - a.commitCount)
                    .slice(0, 10)
                    .map((community) => (
                        <div key={community.id}>
                            <p>コミュニティ名: {community.name} (コミット数: {community.commitCount})</p>
                            <Link href={`/community/${community.id}`}>
                                詳細
                            </Link>
                        </div>
                    ))}
            </div>
            <br /><br />
            
            {/* 以下は上にsticky(へばりつく)なナビゲーションバーに変更したい */}
            <Link href="/">ホーム</Link>
            &nbsp;&nbsp;&nbsp;
            <Link href="/create">コミュニティを作成</Link>
            &nbsp;&nbsp;&nbsp;
            <Link href="/search">コミュニティを探す</Link>
        </div>
    );
};

export default Ranking;
