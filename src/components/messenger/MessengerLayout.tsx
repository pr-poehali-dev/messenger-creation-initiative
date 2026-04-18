import Sidebar from './Sidebar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import ContactsPanel from './ContactsPanel';
import GroupsPanel from './GroupsPanel';
import SearchPanel from './SearchPanel';
import ProfilePanel from './ProfilePanel';
import CallOverlay from './CallOverlay';
import { useMessengerStore } from '@/store/messengerStore';
import Icon from '@/components/ui/icon';

export default function MessengerLayout() {
  const store = useMessengerStore();

  const activeChat = store.activeChatId
    ? store.chats.find(c => c.id === store.activeChatId) ?? null
    : null;

  const activeMsgs = store.activeChatId
    ? (store.messagesMap[store.activeChatId] ?? [])
    : [];

  const handleCallFromChat = (type: 'audio' | 'video') => {
    if (!activeChat) return;
    store.startCall(type, activeChat.id, activeChat.name, activeChat.avatar);
  };

  const handleCallFromContacts = (type: 'audio' | 'video', id: string, name: string, avatar: string) => {
    store.startCall(type, id, name, avatar);
  };

  const isChatsTab = store.activeTab === 'chats';
  const showChatPanel = isChatsTab;

  return (
    <div className="flex h-screen w-screen overflow-hidden mesh-bg">
      {/* Sidebar */}
      <Sidebar activeTab={store.activeTab} setActiveTab={store.setActiveTab} />

      {/* Left panel */}
      <div className={`
        flex flex-col w-72 xl:w-80 h-full glass border-r border-white/10 flex-shrink-0
        ${showChatPanel ? 'flex' : 'hidden md:flex'}
      `}>
        {/* Panel header for non-chat tabs */}
        {isChatsTab && (
          <div className="flex items-center justify-between px-4 py-4 flex-shrink-0 border-b border-white/5">
            <h2 className="text-lg font-bold gradient-text">Сообщения</h2>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <Icon name="Filter" size={15} className="text-muted-foreground" />
              </button>
              <button className="w-8 h-8 rounded-xl gradient-btn flex items-center justify-center hover:scale-105 transition-transform neon-glow">
                <Icon name="Plus" size={15} className="text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {store.activeTab === 'chats' && (
            <ChatList
              chats={store.chats}
              activeChatId={store.activeChatId}
              onSelectChat={store.setActiveChatId}
            />
          )}
          {store.activeTab === 'contacts' && (
            <ContactsPanel onCall={handleCallFromContacts} />
          )}
          {store.activeTab === 'groups' && <GroupsPanel />}
          {store.activeTab === 'search' && <SearchPanel />}
          {store.activeTab === 'profile' && (
            <ProfilePanel onCall={handleCallFromContacts} />
          )}
        </div>
      </div>

      {/* Main content (chat window for chats tab, or full panel for others on mobile) */}
      {isChatsTab ? (
        <div className="flex-1 flex overflow-hidden">
          <ChatWindow
            chat={activeChat}
            messages={activeMsgs}
            onSend={(text) => store.activeChatId && store.sendMessage(store.activeChatId, text)}
            onSendVoice={(dur) => store.activeChatId && store.sendVoice(store.activeChatId, dur)}
            onCall={handleCallFromChat}
            recordingVoice={store.recordingVoice}
            setRecordingVoice={store.setRecordingVoice}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center mesh-bg md:hidden">
          <p className="text-muted-foreground text-sm">Выберите элемент</p>
        </div>
      )}

      {/* Call Overlay */}
      <CallOverlay
        call={store.call}
        onEnd={store.endCall}
        onToggleMute={store.toggleMute}
        onToggleVideo={store.toggleVideo}
      />
    </div>
  );
}