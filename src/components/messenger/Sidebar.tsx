import Icon from '@/components/ui/icon';
import { ActiveTab } from '@/store/messengerStore';
import { currentUser } from '@/data/mockData';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const navItems = [
  { id: 'chats' as ActiveTab, icon: 'MessageCircle', label: 'Чаты' },
  { id: 'contacts' as ActiveTab, icon: 'Users', label: 'Контакты' },
  { id: 'groups' as ActiveTab, icon: 'UsersRound', label: 'Группы' },
  { id: 'search' as ActiveTab, icon: 'Search', label: 'Поиск' },
  { id: 'profile' as ActiveTab, icon: 'User', label: 'Профиль' },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="flex flex-col items-center w-16 md:w-20 h-full glass-strong border-r border-white/10 py-4 gap-2 z-20 flex-shrink-0">
      {/* Logo */}
      <div className="w-10 h-10 rounded-2xl gradient-btn flex items-center justify-center mb-4 neon-glow animate-float">
        <Icon name="Zap" size={20} className="text-white" />
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 group
                ${isActive
                  ? 'gradient-btn neon-glow scale-105'
                  : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={item.icon} size={20} className={isActive ? 'text-white' : ''} />
              <span className={`text-[9px] font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-white/80" />
              )}
            </button>
          );
        })}
      </div>

      {/* Avatar at bottom */}
      <button
        onClick={() => setActiveTab('profile')}
        className="w-10 h-10 rounded-full gradient-btn-blue flex items-center justify-center text-white font-bold text-sm mt-2 hover:scale-105 transition-transform"
      >
        {currentUser.avatar}
      </button>
    </div>
  );
}