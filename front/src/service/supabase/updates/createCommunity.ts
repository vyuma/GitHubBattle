import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createCommunity = async (name: string, detail: string, startDate: Date): Promise<void> => {
    const supabase = createClientComponentClient();

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError;
        if (!session) {
            alert('ユーザーが認証されていません');
            throw new Error('ユーザーが認証されていません');
        }
        const userId = session.user.id

        //ユーザーがすでにコミュニティに属していなければ以下実行

        const { data, error } = await supabase
            .from('community')
            .insert({
                name: name,
                detail: detail,
                start_date: startDate,
                owner_id: userId
            })
            .select()
            .single()

        if (error) {
            throw error;
        }

        return;
    } catch (error) {
        console.error('コミュニティ作成エラー:', error)
        return;
    }
}