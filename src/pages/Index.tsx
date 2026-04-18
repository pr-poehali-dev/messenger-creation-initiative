import { useState } from 'react';
import AuthScreen from '@/components/auth/AuthScreen';
import MessengerLayout from '@/components/messenger/MessengerLayout';

const Index = () => {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <AuthScreen onAuth={() => setAuthed(true)} />;
  }

  return <MessengerLayout onLogout={() => setAuthed(false)} />;
};

export default Index;