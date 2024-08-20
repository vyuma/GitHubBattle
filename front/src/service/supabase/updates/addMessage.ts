import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


export const addMessageDB = async (message: string, communityId: string): Promise<void> => {

    try {
        const supabase = createClientComponentClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            throw sessionError
        }
        if (!session) {
            throw new Error('ログイン状態ではない');
        }

        const { data, error } = await supabase
            .from('community_messages')
            .insert({
                community_id: communityId,
                message: message,
                nickname: "test",
                user_id: session.user.id
            })
            .select();

        if (error) throw error;
    } catch (error) {
        console.error('メッセージ追加エラー:', error);
        throw error;
    }
}