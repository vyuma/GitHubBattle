import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
export const logout = async () => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error(error.message);
    }
    else {
        alert("ログアウト");
    }
}