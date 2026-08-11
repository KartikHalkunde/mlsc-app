import { ChatConversation, ChatMessage } from '../types';

export const conversations: ChatConversation[] = [
  {
    id: 'c1',
    participantId: 'aditi',
    lastMessage: 'Hey! Are you coming to HackVerse? 🚀',
    time: '2 min ago',
    unreadCount: 2,
  },
  {
    id: 'c2',
    participantId: 'rohan',
    lastMessage: 'Bro the hackathon prep is going great',
    time: '15 min ago',
    unreadCount: 0,
  },
  {
    id: 'c3',
    participantId: 'sneha',
    lastMessage: 'Check out this UI design I made ✨',
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
  // Conversation with Aditi
  { id: 'm1', conversationId: 'c1', senderId: 'self', text: 'Hey Aditi! What\'s up?', time: '10:30 AM' },
  { id: 'm2', conversationId: 'c1', senderId: 'aditi', text: 'Hey! Working on the MLSC website rn', time: '10:32 AM' },
  { id: 'm3', conversationId: 'c1', senderId: 'self', text: 'Nice! Need any help?', time: '10:33 AM' },
  { id: 'm4', conversationId: 'c1', senderId: 'aditi', text: 'Actually yes! Can you review the event page?', time: '10:35 AM' },
  { id: 'm5', conversationId: 'c1', senderId: 'self', text: 'Sure, send me the link', time: '10:36 AM' },
  { id: 'm6', conversationId: 'c1', senderId: 'aditi', text: 'Hey! Are you coming to HackVerse? 🚀', time: '11:00 AM' },

  // Conversation with Rohan
  { id: 'm7', conversationId: 'c2', senderId: 'rohan', text: 'Yo! Team for HackVerse?', time: '9:00 AM' },
  { id: 'm8', conversationId: 'c2', senderId: 'self', text: 'I\'m in! Who else?', time: '9:05 AM' },
  { id: 'm9', conversationId: 'c2', senderId: 'rohan', text: 'Kunal and maybe Arjun', time: '9:10 AM' },
  { id: 'm10', conversationId: 'c2', senderId: 'self', text: 'Perfect team 💪', time: '9:12 AM' },
  { id: 'm11', conversationId: 'c2', senderId: 'rohan', text: 'Bro the hackathon prep is going great', time: '10:00 AM' },

  // Conversation with Sneha
  { id: 'm12', conversationId: 'c3', senderId: 'sneha', text: 'Check out this UI design I made ✨', time: '10:45 AM' },
];

export const getConversationMessages = (conversationId: string) =>
  messages.filter((m) => m.conversationId === conversationId);
