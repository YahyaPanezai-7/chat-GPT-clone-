
import React from 'react';
import type { Message } from '../types';
import { Role } from '../types';
import { BotIcon } from './icons/BotIcon';
import { UserIcon } from './icons/UserIcon';

interface ChatMessageProps {
    message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isModel = message.role === Role.MODEL;
    const textWithLineBreaks = message.text.split('\n').map((str, index, array) => 
        index === array.length - 1 ? str : <React.Fragment key={index}>{str}<br /></React.Fragment>
    );

    return (
        <div className={`flex items-start gap-4 ${isModel ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-500' : 'bg-gray-600'}`}>
                {isModel ? <BotIcon /> : <UserIcon />}
            </div>
            <div className={`max-w-xl p-4 rounded-2xl shadow ${isModel ? 'bg-gray-700 text-gray-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                 <p className="whitespace-pre-wrap">{textWithLineBreaks}</p>
            </div>
        </div>
    );
};

export default ChatMessage;
