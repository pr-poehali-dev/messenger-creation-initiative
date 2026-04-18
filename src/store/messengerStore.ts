import { useState, useCallback } from 'react';
import { chats as initialChats, messages as initialMessages, Chat, Message } from '@/data/mockData';

export type ActiveTab = 'chats' | 'contacts' | 'groups' | 'search' | 'profile';
export type CallType = 'audio' | 'video' | null;

export interface CallState {
  active: boolean;
  type: CallType;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  duration: number;
  muted: boolean;
  videoOff: boolean;
}

export function useMessengerStore() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [activeChatId, setActiveChatId] = useState<string | null>('c1');
  const [chats, setChats] = useState(initialChats);
  const [messagesMap, setMessagesMap] = useState(initialMessages);
  const [call, setCall] = useState<CallState>({
    active: false, type: null, contactId: '', contactName: '',
    contactAvatar: '', duration: 0, muted: false, videoOff: false,
  });
  const [recordingVoice, setRecordingVoice] = useState(false);

  const sendMessage = useCallback((chatId: string, text: string) => {
    const newMsg: Message = {
      id: `m${Date.now()}`, chatId, senderId: 'me',
      text, type: 'text', timestamp: new Date(), read: false,
    };
    setMessagesMap(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, lastMessage: text, lastMessageTime: new Date(), unread: 0 } : c
    ));
  }, []);

  const sendVoice = useCallback((chatId: string, duration: number) => {
    const newMsg: Message = {
      id: `m${Date.now()}`, chatId, senderId: 'me',
      type: 'voice', duration, timestamp: new Date(), read: false,
    };
    setMessagesMap(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg],
    }));
    setChats(prev => prev.map(c =>
      c.id === chatId ? { ...c, lastMessage: `Голосовое • 0:${duration.toString().padStart(2, '0')}`, lastMessageTime: new Date() } : c
    ));
  }, []);

  const startCall = useCallback((type: CallType, contactId: string, contactName: string, contactAvatar: string) => {
    setCall({ active: true, type, contactId, contactName, contactAvatar, duration: 0, muted: false, videoOff: false });
  }, []);

  const endCall = useCallback(() => {
    setCall(prev => ({ ...prev, active: false, type: null, duration: 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    setCall(prev => ({ ...prev, muted: !prev.muted }));
  }, []);

  const toggleVideo = useCallback(() => {
    setCall(prev => ({ ...prev, videoOff: !prev.videoOff }));
  }, []);

  return {
    activeTab, setActiveTab,
    activeChatId, setActiveChatId,
    chats, messagesMap,
    sendMessage, sendVoice,
    call, startCall, endCall, toggleMute, toggleVideo,
    recordingVoice, setRecordingVoice,
  };
}
