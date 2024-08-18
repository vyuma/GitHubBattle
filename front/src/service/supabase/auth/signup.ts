import { supabase } from "@/service/supabase/supabase";
import { signUpAddUser } from "../updates/signUpAddUser";

export const signup = async (emailValue: string, ps: string, userName: string) => {

    try {
        // アカウント作成
        const { data, error } = await supabase.auth.signUp({
            email: emailValue,
            password: ps,
        })
        // 特定の条件下
        if (error) {
            throw new Error(error.message)
        }
        alert('アカウントを作成しました。')
        if (data.user !== null && data.user !== undefined) {
            // ユーザテーブルにデータを追加
            signUpAddUser(data.user.id, userName);
        }
        console.log(data)
    } catch (error) {
        console.error('サインアップエラー:', error);
    }
}