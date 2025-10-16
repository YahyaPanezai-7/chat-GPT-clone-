
import { GoogleGenAI, Chat } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export function startChat(): Chat {
    return ai.chats.create({
        model: model,
        config: {
            systemInstruction: 'You are a helpful and friendly conversational AI. Be concise and relevant in your replies.',
        },
    });
}
