import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const addUserCommunity = async (community_id: string, nickname: string): Promise<boolean> => {
    const supabase = createClientComponentClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
        return false;
    }
    if (!session) {
        return false;
    }
    try {

        const { error } = await supabase
            .from('users_community')
            .upsert({
                user_id: session.user.id,
                community_id: community_id,
                joined_at: new Date().toLocaleDateString('ja-JP', {
                    timeZone: 'Asia/Tokyo',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                }),
                nickname: nickname
            });

        if (error) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in addUser:', error);
        return false;
    }
}
