export type ClubId = 'mlsc' | 'csi' | 'gdg' | 'council';

export type Club = {
  id: ClubId;
  name: string;
  shortName: string;
  color: string;
  logo?: string;
  banner?: string;
  tagline: string;
  members: string; // display count
  description: string;
  memberIds: string[]; // user IDs of members
};

export type EventCategory = 'workshop' | 'competition' | 'seminar' | 'cultural' | 'sports';

export type CampusEvent = {
  id: string;
  title: string;
  clubId: ClubId;
  date: string;
  day: number;
  month: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  attendees: number;
  featured?: boolean;
  category: EventCategory;
};

export type Gender = 'male' | 'female';

export type Student = {
  id: string;
  name: string;
  email: string;
  studentId: string;
  branch: string;
  year: string;
  phone: string;
  username: string;
  bio: string;
  avatar: string; // avatar source
  banner?: string;
  gender: Gender;
  clubs: ClubId[];
  clubRoles: Record<string, string>; // clubId → role/badge
  friends: string[]; // user IDs
  enrolledEvents: string[]; // event IDs
};

export type PersonProfile = {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  banner?: string;
  gender: Gender;
  branch: string;
  year: string;
  email: string;
  clubs: ClubId[];
  clubRoles: Record<string, string>;
  friends: string[];
  enrolledEvents: string[];
};

export type Notification = {
  id: string;
  avatarId?: string;
  name: string;
  action: string;
  time: string;
  read: boolean;
  icon: string;
  iconColor?: string;
};

export type ChatConversation = {
  id: string;
  participantId: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isGroup?: boolean;
  typing?: boolean;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  time: string;
  read?: boolean;
  imageUrl?: string;
};

export type ActivityFeedItem = {
  id: string;
  avatarId?: string;
  name: string;
  action: string;
  time: string;
  userId?: string;
};
