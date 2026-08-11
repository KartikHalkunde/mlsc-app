// DiceBear Adventurer cartoon avatars — unique colorful faces
// Each seed generates a distinct character; style=adventurer gives friendly cartoon look

const BASE = 'https://api.dicebear.com/9.x/adventurer/png';

export type AvatarOption = { id: string; url: string; gender: 'male' | 'female' };

export const avatarOptions: AvatarOption[] = [
  // Male avatars
  { id: 'm1', url: `${BASE}?seed=Felix&size=256&backgroundColor=b6e3f4`, gender: 'male' },
  { id: 'm2', url: `${BASE}?seed=Aiden&size=256&backgroundColor=c0aede`, gender: 'male' },
  { id: 'm3', url: `${BASE}?seed=Rohan&size=256&backgroundColor=d1d4f9`, gender: 'male' },
  { id: 'm4', url: `${BASE}?seed=Arjun&size=256&backgroundColor=ffd5dc`, gender: 'male' },
  { id: 'm5', url: `${BASE}?seed=Kunal&size=256&backgroundColor=b6e3f4`, gender: 'male' },
  { id: 'm6', url: `${BASE}?seed=Vikram&size=256&backgroundColor=c0aede`, gender: 'male' },
  // Female avatars
  { id: 'f1', url: `${BASE}?seed=Ananya&size=256&backgroundColor=ffd5dc`, gender: 'female' },
  { id: 'f2', url: `${BASE}?seed=Priya&size=256&backgroundColor=b6e3f4`, gender: 'female' },
  { id: 'f3', url: `${BASE}?seed=Sneha&size=256&backgroundColor=d1d4f9`, gender: 'female' },
  { id: 'f4', url: `${BASE}?seed=Aditi&size=256&backgroundColor=c0aede`, gender: 'female' },
  { id: 'f5', url: `${BASE}?seed=Kavya&size=256&backgroundColor=ffd5dc`, gender: 'female' },
  { id: 'f6', url: `${BASE}?seed=Ishita&size=256&backgroundColor=b6e3f4`, gender: 'female' },
];

export const getAvatarUrl = (id: string): string => {
  const opt = avatarOptions.find((a) => a.id === id);
  return opt?.url ?? `${BASE}?seed=default&size=256&backgroundColor=d1d4f9`;
};

export const getAvatarsByGender = (gender: 'male' | 'female') =>
  avatarOptions.filter((a) => a.gender === gender);
