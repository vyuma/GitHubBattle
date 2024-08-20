'use client'

import Message from "@/components/Message"
import { receiveChatType } from "@/constants/receiveChatType"
import { fetchRealtimeData } from "@/service/supabase/realtime/fetchRealtime"
import { addMessageDB } from "@/service/supabase/updates/addMessage"
import { useEffect, useState } from "react"

const CommunityChat = ({ params }: { params: { id: string } }) => {
    const [chatMs, setChatMs] = useState('')
    const [receiveChatData, setReceiveChatData] = useState<receiveChatType[]>([])

    useEffect(() => {
        fetchRealtimeData(setReceiveChatData, params.id)
    }, [params.id])

    const handleSendMessage = async () => {
        await addMessageDB(chatMs, params.id)
        setChatMs('')
    }

    return (
        <div className="App">
            <h1>コミュニティチャット：{params.id}</h1>
            <div style={{ height: '400px', overflowY: 'scroll', marginBottom: '20px' }}>
                {receiveChatData.map((ms, index) => <Message receiveChat={ms} key={ms.id || index} />)}
            </div>
            <input
                type="text"
                value={chatMs}
                onChange={(e) => setChatMs(e.target.value)}
                placeholder="メッセージを入力..."
            />
            <button onClick={handleSendMessage}>送信</button>
        </div>
    )
}

export default CommunityChat;