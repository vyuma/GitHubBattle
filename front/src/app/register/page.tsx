"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Link from "next/link";
import { signup } from '@/service/supabase/auth/signup';

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [userName, setuserName] = useState<string>('');

    const router = useRouter();

    // const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    const handleRegister = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        try {
            await signup(email, password, userName);
            toast.success("新規登録完了");
        } catch (error) {
            console.error("An error occurred", error);
            toast.error("An error occurred");
        }
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <h1>新規登録</h1>
                <input
                    type="text"
                    placeholder="名前"
                    value={userName}
                    onChange={(e) => setuserName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Sign Up</button>
            </form>
            <Link href="/">ホーム</Link>
        </div>
    );
};

export default Register;
