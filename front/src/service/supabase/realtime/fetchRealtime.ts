import { receiveChatType } from "@/constants/message";
import { supabase } from "../supabase";


export const fetchRealtimeData = (
    setReceiveChatData: React.Dispatch<React.SetStateAction<receiveChatType[]>>,
    communityId: string
) => {

    const channel = supabase
        .channel(`public:messages:community_id=eq.${communityId}}`)
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'community_messages', filter: `community_id=eq.${communityId}` },
            payload => {
                console.log(payload.new);
                setReceiveChatData(prevMessages => [...prevMessages, payload.new as receiveChatType]);
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    }
}
