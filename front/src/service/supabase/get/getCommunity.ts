import { CommunityType } from "@/constants/communityType"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const getCommunity = async (offset: number): Promise<{ communities: CommunityType[], total: number }> => {
    const supabase = createClientComponentClient()

    try {
        const { data, error, count } = await supabase
            .from('communities')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + 19)

        if (error) {
            throw error
        }

        return {
            communities: (data as CommunityType[]).reverse(),
            total: count || 0
        };
    } catch (error) {
        console.error('Error fetching data:', error)
        return { communities: [], total: 0 }
    }
}
