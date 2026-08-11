import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, ClubId } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Ctx = {
  student: Student | null;
  register: (s: Student) => void;
  update: (s: Partial<Student>) => void;
  toggleFriend: (id: string) => void;
  enrollEvent: (eventId: string) => void;
  unenrollEvent: (eventId: string) => void;
  joinClub: (clubId: ClubId) => void;
  leaveClub: (clubId: ClubId) => void;

  logout: () => void;
};

const C = createContext<Ctx>({
  student: null,
  register: () => {},
  update: () => {},
  toggleFriend: () => {},
  enrollEvent: () => {},
  unenrollEvent: () => {},
  joinClub: () => {},
  leaveClub: () => {},

  logout: () => {},
});

const STUDENT_STORAGE_KEY = '@campus_circle_student';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const stored = await AsyncStorage.getItem(STUDENT_STORAGE_KEY);
        if (stored) {
          setStudent(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load student', e);
      } finally {
        setIsReady(true);
      }
    };
    loadStudent();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const saveStudent = async () => {
      try {
        if (student) {
          await AsyncStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));
        } else {
          await AsyncStorage.removeItem(STUDENT_STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to save student', e);
      }
    };
    saveStudent();
  }, [student, isReady]);

  const register = (s: Student) => setStudent(s);

  const update = (partial: Partial<Student>) =>
    setStudent((prev) => (prev ? { ...prev, ...partial } : null));

  const toggleFriend = (id: string) =>
    setStudent((prev) => {
      if (!prev) return null;
      const friends = prev.friends.includes(id)
        ? prev.friends.filter((f) => f !== id)
        : [...prev.friends, id];
      return { ...prev, friends };
    });

  const enrollEvent = (eventId: string) =>
    setStudent((prev) => {
      if (!prev) return null;
      if (prev.enrolledEvents.includes(eventId)) return prev;
      return { ...prev, enrolledEvents: [...prev.enrolledEvents, eventId] };
    });

  const unenrollEvent = (eventId: string) =>
    setStudent((prev) => {
      if (!prev) return null;
      return { ...prev, enrolledEvents: prev.enrolledEvents.filter(e => e !== eventId) };
    });

  const joinClub = (clubId: ClubId) =>
    setStudent((prev) => {
      if (!prev || prev.clubs.includes(clubId)) return prev;
      return { ...prev, clubs: [...prev.clubs, clubId] };
    });

  const leaveClub = (clubId: ClubId) =>
    setStudent((prev) => {
      if (!prev) return null;
      return { ...prev, clubs: prev.clubs.filter((c) => c !== clubId) };
    });



  const logout = () => setStudent(null);

  if (!isReady) {
    return null;
  }

  return (
    <C.Provider value={{ student, register, update, toggleFriend, enrollEvent, unenrollEvent, joinClub, leaveClub, logout }}>
      {children}
    </C.Provider>
  );
}

export const useStudent = () => useContext(C);
