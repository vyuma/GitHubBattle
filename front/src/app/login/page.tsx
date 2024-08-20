'use client';

import { useEffect, useState } from 'react'
import { githubLogin } from '@/service/supabase/auth/githubLogin';
import { logout } from '@/service/supabase/auth/logout';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { addUser } from '@/service/supabase/updates/addUser';

const LoginPage = () => {
    const [xName, setXName] = useState<string>('');
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session && !error) {
                const storedXName = localStorage.getItem('xName');
                const isSuccess = await addUser(session.user, storedXName);
                if (isSuccess) {
                    localStorage.removeItem('xName');
                    router.push('/test');
                } else {
                    console.error('Failed to add user');
                }
            }
        };

        checkSession();
    }, []);

    const handleGithubLogin = async () => {
        localStorage.setItem('xName', xName);
        await githubLogin();
    }

    return (
        <div>
            <h1>ログインページ</h1>
            <input
                type="text"
                value={xName}
                onChange={(e) => setXName(e.target.value)}
                placeholder="Xユーザー名（任意）"
            />
            <button onClick={handleGithubLogin} >
                GitHubでログイン
            </button>
            <button onClick={logout} >ログアウトテスト</button>
        </div>
    )
}

export default LoginPage;