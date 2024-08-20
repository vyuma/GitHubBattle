'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { getUserSession } from '@/service/supabase/auth/getUserSession';
import { getCommunity } from '@/service/supabase/get/getCommunity';

export default function Test() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        async function initializeAuth() {
            const initialSession = await getUserSession();
            setSession(initialSession);
            const community = await getCommunity(0);
            console.log(community);
        }


        initializeAuth();
    }, []);

    if (session) {
        return (
            <div>
                <div>User Metadata: <pre>{JSON.stringify(session, null, 2)}</pre></div>
            </div>
        );
    } else {
        return <div>ログインしていない</div>
    }
}