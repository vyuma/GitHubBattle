import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { signUpAddUser } from "../updates/signUpAddUser";

export const signup = async (emailValue: string, ps: string, userName: string) => {
    try {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase.auth.signUp({
            email: emailValue,
            password: ps,
        });

        if (error) throw new Error(error.message);

        // サインインを実行
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: emailValue,
            password: ps,
        });

        if (signInError) throw new Error(signInError.message);

        // ユーザーが認証された後にデータを挿入
        if (data.user) {
            await signUpAddUser(data.user.id, userName);
        }

        alert('アカウントを作成しました。');
        console.log(data);
    } catch (error) {
        console.error('サインアップエラー:', error);
    }
}

