import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const githubLogin = async () => {
    const supabase = createClientComponentClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo: `${window.location.origin}/login`
        }
    });

    if (error) {
        console.error('GitHub login error:', error);
        throw new Error(error.message);
    }
}