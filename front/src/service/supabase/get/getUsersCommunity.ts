import { UsersCommunityType } from "@/constants/usersCommunityType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
export const getUsersCommunity = async (userId: string): Promise<{ UsersCommunityType: UsersCommunityType; error: Error | null }> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('users_community')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') { // ユーザーがどのコミュニティにも所属していない場合
                return {
                    UsersCommunityType: {
                        user_id: null,
                        community_id: null,
                        joined_at: null,
                        created_at: null
                    },
                    error: null
                }
            }
            throw error
        }
        if (data === null) {
            return {
                UsersCommunityType: {
                    user_id: null,
                    community_id: null,
                    joined_at: null,
                    created_at: null
                },
                error: null
            }
        }

        // ユーザーが所属するコミュニティが見つかった場合
        return {
            UsersCommunityType: data as UsersCommunityType,
            error: null
        }
    } catch (error) {
        console.error('予期しないエラー:', error)
        return {
            UsersCommunityType: {
                user_id: null,
                community_id: null,
                joined_at: null,
                created_at: null
            },
            error: error as Error
        }
    }
}
