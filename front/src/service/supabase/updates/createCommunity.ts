import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { getUsersCommunity } from '../get/getUsersCommunity';
import { addUserCommunity } from './addUserCommunity';

export const createCommunity = async (name: string, detail: string, startDate: Date, memberLimits: number, nickname: string): Promise<boolean> => {
    const supabase = createClientComponentClient();

    try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError;
        if (!session) {
            alert('ユーザーが認証されていません');
            return false;
        }
        const userId = session.user.id

        const { UsersCommunityType } = await getUsersCommunity(userId, nickname);


        if (UsersCommunityType.community_id) {
            alert('ユーザーは既にコミュニティに所属しています');
            return false;

        }

        const { data, error } = await supabase
            .from('communities')
            .insert({
                name: name,
                detail: detail,
                start_date: startDate,
                owner_id: userId,
                member_limits: memberLimits,
            })
            .select()
            .single()

        if (error) {
            throw error;
        }

        addUserCommunity(data.community_id, nickname);
        return true;
    } catch (error) {
        console.error('コミュニティ作成エラー:', error);
        return false;
    }
}