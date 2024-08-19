// appディレクトリ内ではuse clientは良くないという記事があったが...
// https://qiita.com/miumi/items/359b8a77bbb6f9666950
"use client";
import { login } from '@/service/supabase/auth/login';
import { logout } from '@/service/supabase/auth/logout';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const Login: React.FC = () => {
    const [userEmail, setUserEmail] = useState("");  // 型もつけよう
    const [password, setPassword] = useState("");  // 型もつけよう
    const router = useRouter();  // 型もつけよう

    // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const handleLogin = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // ここでログイン処理を実行
        // 例: APIを呼び出してユーザー認証を行う
        try {
            // 仮のログイン処理（実際にはAPIコールなどを行う）
            await login(userEmail, password);

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
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e-mail"
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
                <button onClick={logout}>ログアウトテスト</button>
            </form>

            <Link href="/">ホーム</Link>
        </div>
    );
};

export default Login;
