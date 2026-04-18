import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { groups } from '@/data/mockData';

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return 'сейчас';
  if (hours < 24) return `${hours}ч`;
  return `${days}д`;
}

export default function GroupsPanel() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold gradient-text mb-3">Группы</h2>

        {/* Create group */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-dashed border-violet-500/40 hover:border-violet-500/70 hover:bg-violet-500/10 transition-all duration-300 group mb-3">
          <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon name="Plus" size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold group-hover:text-white transition-colors">Создать группу</p>
            <p className="text-xs text-muted-foreground">Добавь участников и начни общение</p>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
        {groups.map((group, i) => (
          <button
            key={group.id}
            onClick={() => setActiveGroup(g => g === group.id ? null : group.id)}
            className={`
              w-full flex items-start gap-3 p-3 rounded-2xl transition-all duration-300 text-left animate-fade-in
              ${activeGroup === group.id
                ? 'bg-gradient-to-r from-violet-600/25 to-pink-600/15 border border-violet-500/30 glass'
                : 'glass border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5'
              }
            `}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl gradient-btn-blue flex items-center justify-center text-2xl flex-shrink-0">
              {group.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm truncate">{group.name}</span>
                <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-1">{formatTime(group.lastMessageTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground truncate max-w-[160px]">{group.lastMessage}</span>
                {group.unread > 0 && (
                  <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full gradient-btn text-white text-[10px] font-bold flex items-center justify-center">
                    {group.unread}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Icon name="Users" size={10} className="text-muted-foreground/60" />
                <span className="text-[10px] text-muted-foreground/60">{group.members} участников</span>
              </div>

              {/* Expanded actions */}
              {activeGroup === group.id && (
                <div className="flex gap-2 mt-3 animate-fade-in">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl glass border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all text-xs text-muted-foreground hover:text-violet-400">
                    <Icon name="MessageCircle" size={13} />
                    Написать
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl glass border border-white/10 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all text-xs text-muted-foreground hover:text-pink-400">
                    <Icon name="Phone" size={13} />
                    Звонок
                  </button>
                  <button className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl glass border border-white/10 hover:border-white/20 transition-all text-xs text-muted-foreground">
                    <Icon name="Settings" size={13} />
                  </button>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
