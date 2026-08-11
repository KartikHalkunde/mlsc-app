import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatConversation, ChatMessage } from '../types';
import { conversations as initialConversations, messages as initialMessages } from '../data/chat';

type ChatContextType = {
  conversations: ChatConversation[];
  messages: ChatMessage[];
  sendMessage: (conversationId: string, text: string, imageUrl?: string) => void;
  markAsRead: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => ChatMessage[];
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const sendMessage = (conversationId: string, text: string, imageUrl?: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `m_${Date.now()}`,
      conversationId,
      senderId: 'self',
      text,
      time,
      read: false,
      imageUrl,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) => 
      prev.map(c => 
        c.id === conversationId 
          ? { ...c, lastMessage: text || (imageUrl ? '📸 Image' : ''), time } 
          : c
      )
    );
  };

  const markAsRead = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const getConversationMessages = (conversationId: string) => {
    return messages.filter((m) => m.conversationId === conversationId);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        sendMessage,
        markAsRead,
        getConversationMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
