"use client";
import { login } from '@/service/supabase/auth/login';
import { logout } from '@/service/supabase/auth/logout';
import { useState, FormEvent } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
            <button onClick={logout}>ログアウトテスト</button>
        </div>
    );
}

export default LoginPage;