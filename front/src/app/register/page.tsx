"use client";
import { useState, FormEvent } from 'react';
import { supabase } from "@/utils/supabase/supabase";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${location.origin}/auth/callback`,
                },
            });
            if (signUpError) {
                throw signUpError;
            }
            alert("登録完了");
        } catch (error) {
            alert("エラーが発生しました");
        }
    };

    return (
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
    );
};

export default RegisterPage;
