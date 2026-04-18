import { Chat } from '@/data/mockData';
import Icon from '@/components/ui/icon';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'сейчас';
  if (mins < 60) return `${mins}м`;
  if (hours < 24) return `${hours}ч`;
  return `${days}д`;
}

export default function ChatList({ chats, activeChatId, onSelectChat }: ChatListProps) {
  const pinned = chats.filter(c => c.pinned);
  const regular = chats.filter(c => !c.pinned);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {pinned.length > 0 && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Закреплённые</span>
        </div>
      )}
      {pinned.map((chat, i) => <ChatItem key={chat.id} chat={chat} active={chat.id === activeChatId} onClick={() => onSelectChat(chat.id)} delay={i * 50} />)}

      {regular.length > 0 && (
        <div className="px-3 pt-3 pb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Все чаты</span>
        </div>
      )}
      {regular.map((chat, i) => <ChatItem key={chat.id} chat={chat} active={chat.id === activeChatId} onClick={() => onSelectChat(chat.id)} delay={(pinned.length + i) * 50} />)}
    </div>
  );
}

function ChatItem({ chat, active, onClick, delay }: { chat: Chat; active: boolean; onClick: () => void; delay: number }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 mx-1.5 rounded-2xl transition-all duration-300 text-left
        animate-fade-in
        ${active
          ? 'bg-gradient-to-r from-violet-600/30 to-pink-600/20 border border-violet-500/30'
          : 'hover:bg-white/5'
        }
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white
          ${chat.isGroup ? 'gradient-btn-blue' : 'gradient-btn'}
        `}>
          {chat.avatar}
        </div>
        {!chat.isGroup && chat.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-semibold text-sm truncate ${active ? 'text-white' : 'text-foreground'}`}>
            {chat.pinned && <Icon name="Pin" size={10} className="inline mr-1 text-muted-foreground" />}
            {chat.name}
          </span>
          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{formatTime(chat.lastMessageTime)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-xs truncate max-w-[150px] ${chat.typing ? 'text-violet-400' : 'text-muted-foreground'}`}>
            {chat.typing ? (
              <span className="flex items-center gap-1">
                <span className="flex gap-0.5">
                  {[0,1,2].map(i => (
                    <span key={i} className="w-1 h-1 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </span>
                печатает...
              </span>
            ) : chat.lastMessage}
          </span>
          {chat.unread > 0 && (
            <span className="ml-1 flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full gradient-btn text-white text-[10px] font-bold flex items-center justify-center">
              {chat.unread > 99 ? '99+' : chat.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
