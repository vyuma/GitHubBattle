import { receiveChatType } from "@/constants/receiveChatType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const getCommunityChat = async (communityId: string): Promise<receiveChatType[]> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error } = await supabase
            .from('community_messages')
            .select('*')
            .eq('community_id', communityId)
            .order('created_at', { ascending: true })
            .limit(20)

        if (error) {
            throw error
        }

        return data as receiveChatType[]
    } catch (error) {
        console.error('Error fetching initial data:', error)
        return []
    }
}