// appディレクトリ内ではuse clientは良くないという記事があったが...
// https://qiita.com/miumi/items/359b8a77bbb6f9666950
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Login: React.FC = () => {
    const [username, setUsername] = useState("");  // 型もつけよう
    const [password, setPassword] = useState("");  // 型もつけよう
    const router = useRouter();  // 型もつけよう

    // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // ここでログイン処理を実行
        // 例: APIを呼び出してユーザー認証を行う
        try {
            // 仮のログイン処理（実際にはAPIコールなどを行う）
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // authorization: `Bearer ${localStorage.getItem("token")}`, // トークンを送信する場合。これはYugは書いたけど今回は不要かな？
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                // ログイン成功時、/rankingページに遷移
                router.push("/ranking");
            } else {
                // エラー処理
                console.error("Login failed");
            }
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    return (
        <div>
            <h1>ログイン</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="GitHubのUsername"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
            </form>

            <Link href="/">ホーム</Link>            
        </div>
    );
};

export default Login;
