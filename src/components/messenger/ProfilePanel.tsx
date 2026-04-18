import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { currentUser } from '@/data/mockData';

interface ProfilePanelProps {
  onCall: (type: 'audio' | 'video', id: string, name: string, avatar: string) => void;
  onLogout?: () => void;
}

export default function ProfilePanel({ onCall, onLogout }: ProfilePanelProps) {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [status, setStatus] = useState(currentUser.status);
  const [editingStatus, setEditingStatus] = useState(false);

  const stats = [
    { label: 'Контакты', value: '8', icon: 'Users' },
    { label: 'Группы', value: '5', icon: 'UsersRound' },
    { label: 'Сообщений', value: '1.2K', icon: 'MessageCircle' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Profile header */}
      <div className="relative px-4 pt-6 pb-4 flex-shrink-0">
        {/* Background */}
        <div className="absolute inset-0 mesh-bg opacity-60" />

        <div className="relative flex flex-col items-center text-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl gradient-btn flex items-center justify-center text-3xl font-bold text-white neon-glow">
              {currentUser.avatar}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-btn-blue flex items-center justify-center border-2 border-background hover:scale-110 transition-transform">
              <Icon name="Camera" size={12} className="text-white" />
            </button>
            <span className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-green-400 border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
          </div>

          <div>
            <h2 className="text-xl font-bold">{currentUser.name}</h2>
            {editingStatus ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  onBlur={() => setEditingStatus(false)}
                  autoFocus
                  className="text-xs text-center bg-transparent border-b border-violet-500/50 focus:outline-none text-muted-foreground w-full max-w-[180px]"
                />
              </div>
            ) : (
              <button
                onClick={() => setEditingStatus(true)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1 flex items-center gap-1"
              >
                {status}
                <Icon name="Pencil" size={10} />
              </button>
            )}
            <p className="text-xs text-muted-foreground/60 mt-0.5">{currentUser.phone}</p>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => onCall('audio', 'me', currentUser.name, currentUser.avatar)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-btn text-white text-xs font-semibold hover:scale-105 transition-transform neon-glow"
            >
              <Icon name="Phone" size={13} />
              Звонок
            </button>
            <button
              onClick={() => onCall('video', 'me', currentUser.name, currentUser.avatar)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-btn-blue text-white text-xs font-semibold hover:scale-105 transition-transform"
            >
              <Icon name="Video" size={13} />
              Видео
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4 flex-shrink-0">
        <div className="grid grid-cols-3 gap-2">
          {stats.map(stat => (
            <div key={stat.label} className="glass border border-white/10 rounded-2xl p-3 text-center hover:border-violet-500/30 transition-colors">
              <Icon name={stat.icon} size={18} className="text-violet-400 mx-auto mb-1" />
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-4 pb-4 flex-shrink-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Настройки</p>
        <div className="glass border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
          <SettingRow
            icon="Bell"
            label="Уведомления"
            value={notifications}
            onChange={setNotifications}
          />
          <SettingRow
            icon="Volume2"
            label="Звук"
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
          <SettingRow
            icon="Moon"
            label="Тёмная тема"
            value={darkMode}
            onChange={setDarkMode}
          />
        </div>

        <div className="glass border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5 mt-3">
          {[
            { icon: 'Shield', label: 'Конфиденциальность' },
            { icon: 'HelpCircle', label: 'Помощь и поддержка' },
            { icon: 'Info', label: 'О приложении' },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left">
              <Icon name={item.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm flex-1">{item.label}</span>
              <Icon name="ChevronRight" size={14} className="text-muted-foreground/40" />
            </button>
          ))}
        </div>

        <button
          onClick={onLogout}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl glass border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-300 text-sm font-semibold"
        >
          <Icon name="LogOut" size={16} />
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

function SettingRow({ icon, label, value, onChange }: {
  icon: string; label: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon name={icon} size={16} className="text-muted-foreground" />
      <span className="text-sm flex-1">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${value ? 'gradient-btn' : 'bg-white/10'}`}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`}
        />
      </button>
    </div>
  );
}