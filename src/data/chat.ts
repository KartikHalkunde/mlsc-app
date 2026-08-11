import { ChatConversation, ChatMessage } from '../types';

export const conversations: ChatConversation[] = [
  {
    id: 'c2',
    participantId: 'rohan',
    lastMessage: 'Bro the hackathon prep is going great',
    time: '15 min ago',
    unreadCount: 0,
  },
  {
    id: 'c_group',
    participantId: 'mlsc', // using a club ID as a mock group
    lastMessage: 'Neha: New announcement uploaded',
    time: '45 min ago',
    unreadCount: 5,
    isGroup: true,
  },
  {
    id: 'c3',
    participantId: 'sneha',
    lastMessage: '📸 Image',
    time: '1 hr ago',
    unreadCount: 1,
  },
  {
    id: 'c4',
    participantId: 'kunal',
    lastMessage: 'Done with the API integration',
    time: '3 hrs ago',
    unreadCount: 0,
  },
  {
    id: 'c5',
    participantId: 'kavya',
    lastMessage: 'Can you share the poster design?',
    time: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: 'c6',
    participantId: 'arjun',
    lastMessage: 'Meeting at 4 PM in the lab',
    time: 'Yesterday',
    unreadCount: 0,
  },
];

export const messages: ChatMessage[] = [
  // Conversation with Rohan
  { id: 'm7', conversationId: 'c2', senderId: 'rohan', text: 'Yo! Team for HackVerse?', time: '9:00 AM', read: true },
  { id: 'm8', conversationId: 'c2', senderId: 'self', text: 'I\'m in! Who else?', time: '9:05 AM', read: true },
  { id: 'm9', conversationId: 'c2', senderId: 'rohan', text: 'Kunal and maybe Arjun', time: '9:10 AM', read: true },
  { id: 'm10', conversationId: 'c2', senderId: 'self', text: 'Perfect team 💪', time: '9:12 AM', read: true },
  { id: 'm11', conversationId: 'c2', senderId: 'rohan', text: 'Bro the hackathon prep is going great', time: '10:00 AM', read: true },

  // Group Mock
  { id: 'm_g1', conversationId: 'c_group', senderId: 'self', text: 'When is the next meeting?', time: '8:00 AM', read: true },
  { id: 'm_g2', conversationId: 'c_group', senderId: 'kunal', text: 'Tomorrow 5 PM', time: '8:15 AM', read: true },
  { id: 'm_g3', conversationId: 'c_group', senderId: 'aditi', text: 'Neha: New announcement uploaded', time: '8:45 AM', read: false },

  // Conversation with Sneha (Image mock)
  { id: 'm12', conversationId: 'c3', senderId: 'sneha', text: 'Check out this UI design I made ✨', time: '10:45 AM', read: false, imageUrl: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=600' },
];

export const getConversationMessages = (conversationId: string) =>
  messages.filter((m) => m.conversationId === conversationId);
