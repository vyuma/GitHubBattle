"use client";
import { useState, FormEvent } from 'react';
import { signup } from '@/service/supabase/auth/signup';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        await signup(email, password, "test");
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
