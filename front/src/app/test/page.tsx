'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'

export default function ClientComponent() {
    const [session, setSession] = useState<Session | null>(null);
    const supabase = createClientComponentClient();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        })

        return () => subscription.unsubscribe();
    }, [])

    if (session) {
        return <div>ログインしているユーザーメール: {session.user.email}</div>
    } else {
        return <div>ログインしていない</div>
    }
}