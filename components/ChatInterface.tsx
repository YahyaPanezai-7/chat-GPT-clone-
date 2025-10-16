
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import type { Message } from '../types';
import { Role } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon } from './icons/SendIcon';

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatSession = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatSession.current = startChat();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { id: Date.now().toString(), role: Role.USER, text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatSession.current) {
                throw new Error("Chat session not initialized");
            }

            const stream = await chatSession.current.sendMessageStream({ message: input });

            let modelResponse = '';
            const modelMessageId = (Date.now() + 1).toString();
            
            // Add a placeholder for the model's message
            setMessages(prev => [...prev, { id: modelMessageId, role: Role.MODEL, text: '...' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => prev.map(msg => 
                    msg.id === modelMessageId ? { ...msg, text: modelResponse } : msg
                ));
            }

        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { id: (Date.now() + 1).toString(), role: Role.MODEL, text: "Sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev.filter(m => m.id !== (Date.now() + 1).toString()), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    return (
        <div className="flex flex-col flex-grow h-full overflow-hidden">
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && messages[messages.length-1]?.role === Role.USER && (
                    <ChatMessage message={{ id: 'loading', role: Role.MODEL, text: '...' }} />
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow bg-gray-700 text-gray-200 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
