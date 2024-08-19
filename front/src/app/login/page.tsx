'use client';

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { githubLogin } from '@/service/supabase/auth/githubLogin';
import { logout } from '@/service/supabase/auth/logout';

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const code = searchParams.get('code');
        if (code) {
            handleAuthCallback();
        }
    }, [searchParams])

    const handleAuthCallback = async () => {
        //分割代入
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error(error);
        } else if (session) {
            router.push('/test');
        }
    }

    return (
        <div>
            <h1>ログインページ</h1>
            <button onClick={githubLogin}>GitHubでログイン</button>
            <button onClick={logout}>ログアウトテスト</button>
        </div>
    )
}

export default LoginPage