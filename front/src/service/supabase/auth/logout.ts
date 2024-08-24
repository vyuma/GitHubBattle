import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const logout = async () => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        throw new Error(error.message);
    }
    else {
        alert("ログアウト完了");
        window.location.href = '/login'; // URLを直接変更。これ本番環境でも使えるか？不安...
    }
}