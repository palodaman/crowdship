import { supabase } from "./supabase";

const chatService = {
    async createOrGetChatSession(userId1: string, userId2: string) {
        try {
            //try to find existing chat session
            const { data: existingSession } = await supabase
                .from('chat_session')
                .select('*')
                .or(`and(user_id_1.eq.${userId1},user_id_2.eq.${userId2}),and(user_id_1.eq.${userId2},user_id_2.eq.${userId1})`)
                .single();

            if (existingSession) {
                return existingSession;
            }

            //create new chat session if none exists
            const { data: newSession, error } = await supabase
                .from('chat_session')
                .insert({
                    user_id_1: userId1,
                    user_id_2: userId2
                })
                .select()
                .single();

            if (error) throw error;
            return newSession;
        } catch (error) {
            console.error("Error in createOrGetChatSession:", error.message);
            throw error;
        }
    },

    async sendMessage(senderId: string, chatSessionId: string, messageText: string) {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .insert({
                    sender_id: senderId,
                    message_text: messageText,
                    chat_session_id: chatSessionId,
                    editable: true
                });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error in sendMessage:", error.message);
            throw error;
        }
    },

    async getChatMessages(chatSessionId: string) {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('chat_session_id', chatSessionId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error in getChatMessages:", error.message);
            throw error;
        }
    }
};

export default chatService;