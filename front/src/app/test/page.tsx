'use client';

import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { getUserSession } from '@/service/supabase/auth/getUserSession';
import { getUserMetadata } from '@/service/supabase/auth/getUserMetadata';

export default function Test() {
    const [session, setSession] = useState<Session | null>(null);
    const [userMetadata, setUserMetadata] = useState<any>(null);

    useEffect(() => {
        async function initializeAuth() {
            const initialSession = await getUserSession();
            setSession(initialSession);
            if (initialSession) {
                const metadata = await getUserMetadata(initialSession);
                setUserMetadata(metadata);
            }
        }

        initializeAuth();
    }, []);

    if (session && userMetadata) {
        return (
            <div>
                <div>User Metadata: <pre>{JSON.stringify(userMetadata, null, 2)}</pre></div>
            </div>
        );
    } else {
        return <div>ログインしていない</div>
    }
}