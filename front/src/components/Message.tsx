import { receiveChatType } from '@/constants/message';
import React from 'react'

interface MessageProps {
    receiveChat: receiveChatType;
}

const Message = ({ receiveChat }: MessageProps) => {
    return (
        <div>
            {receiveChat.message}
        </div>
    )
}

export default Message
