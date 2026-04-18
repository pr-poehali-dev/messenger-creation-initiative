import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { contacts, chats, groups } from '@/data/mockData';

type SearchTab = 'all' | 'chats' | 'contacts' | 'groups';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<SearchTab>('all');

  const q = query.toLowerCase();

  const matchedChats = chats.filter(c => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q));
  const matchedContacts = contacts.filter(c => c.name.toLowerCase().includes(q) || c.status.toLowerCase().includes(q));
  const matchedGroups = groups.filter(g => g.name.toLowerCase().includes(q));

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: 'all', label: 'Всё', count: matchedChats.length + matchedContacts.length + matchedGroups.length },
    { id: 'chats', label: 'Чаты', count: matchedChats.length },
    { id: 'contacts', label: 'Контакты', count: matchedContacts.length },
    { id: 'groups', label: 'Группы', count: matchedGroups.length },
  ];

  const showChats = tab === 'all' || tab === 'chats';
  const showContacts = tab === 'all' || tab === 'contacts';
  const showGroups = tab === 'all' || tab === 'groups';

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold gradient-text mb-3">Поиск</h2>

        {/* Search input */}
        <div className="relative mb-3">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Искать людей, чаты, группы..."
            autoFocus
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="X" size={14} className="text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all duration-300 ${
                tab === t.id ? 'gradient-btn text-white' : 'glass border border-white/10 text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
              {query && t.count > 0 && (
                <span className={`ml-1 ${tab === t.id ? 'text-white/70' : 'text-muted-foreground'}`}>({t.count})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {!query ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-16 h-16 rounded-3xl glass border border-white/10 flex items-center justify-center">
              <Icon name="Search" size={28} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Начни поиск</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Введи имя, группу или ключевое слово</p>
            </div>

            {/* Recent / popular tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {['Анна', 'Команда', 'Работа', 'Встреча'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 rounded-full glass border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/40 transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Chats section */}
            {showChats && matchedChats.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Чаты</p>
                <div className="space-y-1">
                  {matchedChats.map(chat => (
                    <div key={chat.id} className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all cursor-pointer">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${chat.isGroup ? 'gradient-btn-blue' : 'gradient-btn'}`}>
                        {chat.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{chat.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts section */}
            {showContacts && matchedContacts.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Контакты</p>
                <div className="space-y-1">
                  {matchedContacts.map(contact => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all cursor-pointer">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full gradient-btn flex items-center justify-center text-sm font-bold text-white">
                          {contact.avatar}
                        </div>
                        {contact.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.status}</p>
                      </div>
                      <Icon name="Phone" size={15} className="text-muted-foreground ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Groups section */}
            {showGroups && matchedGroups.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Группы</p>
                <div className="space-y-1">
                  {matchedGroups.map(group => (
                    <div key={group.id} className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-violet-500/20 hover:bg-violet-500/5 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-2xl gradient-btn-blue flex items-center justify-center text-xl flex-shrink-0">
                        {group.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.members} участников</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {matchedChats.length === 0 && matchedContacts.length === 0 && matchedGroups.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 gap-2">
                <Icon name="SearchX" size={28} className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Ничего не найдено</p>
                <p className="text-xs text-muted-foreground/60">Попробуй другой запрос</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
