import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { contacts } from '@/data/mockData';
import { CallType } from '@/store/messengerStore';

interface ContactsPanelProps {
  onCall: (type: CallType, id: string, name: string, avatar: string) => void;
}

export default function ContactsPanel({ onCall }: ContactsPanelProps) {
  const [search, setSearch] = useState('');

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  );

  const grouped: Record<string, typeof contacts> = {};
  filtered.forEach(c => {
    const letter = c.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(c);
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <h2 className="text-lg font-bold gradient-text mb-3">Контакты</h2>
        <div className="relative">
          <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск контакта..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50"
          />
        </div>
      </div>

      {/* Add contact button */}
      <button className="mx-4 mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-dashed border-violet-500/40 hover:border-violet-500/70 hover:bg-violet-500/10 transition-all duration-300 group flex-shrink-0">
        <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon name="UserPlus" size={14} className="text-white" />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Добавить контакт</span>
      </button>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {Object.entries(grouped).sort().map(([letter, contacts]) => (
          <div key={letter} className="mb-3">
            <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-2 px-1">{letter}</div>
            <div className="space-y-1">
              {contacts.map((contact, i) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 rounded-2xl glass border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 group animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full gradient-btn flex items-center justify-center text-sm font-bold text-white">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-background shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{contact.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{contact.status}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onCall('audio', contact.id, contact.name, contact.avatar)}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:border-violet-500/40 transition-all"
                    >
                      <Icon name="Phone" size={14} className="text-muted-foreground hover:text-violet-400" />
                    </button>
                    <button
                      onClick={() => onCall('video', contact.id, contact.name, contact.avatar)}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/40 transition-all"
                    >
                      <Icon name="Video" size={14} className="text-muted-foreground hover:text-pink-400" />
                    </button>
                    <button className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                      <Icon name="MessageCircle" size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
