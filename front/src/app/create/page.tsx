"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const CreateCommunity: React.FC = () => {
    const [communityName, setCommunityName] = useState("");  // 型もつけよう
    const [description, setDescription] = useState("");  // 型もつけよう
    const router = useRouter(); // 型もつけよう

    const handleCreate = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // ここでコミュニティ作成処理を実行
        // 例: APIを呼び出してコミュニティを作成する
        try {
            // 仮のコミュニティ作成処理（実際にはAPIコールなどを行う）
            const response = await fetch("/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // authorization: `Bearer ${localStorage.getItem("token")}`, // トークンを送信する場合。不要か？
                },
                body: JSON.stringify({ communityName, description }),
            });

            if (response.ok) {
                // コミュニティ作成成功時、/communityページに遷移
                router.push("/community");
            } else {
                // エラー処理
                console.error("Create community failed");
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    return (
        <div>
            <h1>コミュニティ新規作成</h1>

            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="コミュニティ名"
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                    required />
                <br />
                <br />

                <textarea
                    rows={7}
                    cols={30}
                    placeholder="コミュニティの説明"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
                <br />
                <br />

                <button type="submit">作成</button>
            </form>

            <Link href="/">ホーム</Link>
        </div>
    );
};

export default CreateCommunity;
