import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (name: string) => void;
}

type AuthMode = 'login' | 'register';

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'code'>('form');
  const [code, setCode] = useState(['', '', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'register') {
      if (!name.trim()) { setError('Введи своё имя'); return; }
      if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
      if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
    }

    if (!phone.trim()) { setError('Введи номер телефона'); return; }
    if (!password.trim()) { setError('Введи пароль'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (mode === 'register') {
        setStep('code');
      } else {
        onAuth(phone.includes('@') ? 'Пользователь' : phone);
      }
    }, 1200);
  };

  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 3) {
      const el = document.getElementById(`code-${i + 1}`);
      el?.focus();
    }
    if (next.every(d => d !== '') && next.join('').length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onAuth(name || 'Пользователь');
      }, 900);
    }
  };

  const avatarLetters = name ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div className="min-h-screen w-screen flex items-center justify-center mesh-bg overflow-hidden">
      {/* Animated orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none animate-float" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="fixed top-[40%] right-[20%] w-[25vw] h-[25vw] rounded-full bg-blue-600/15 blur-[80px] pointer-events-none animate-float" style={{ animationDelay: '0.8s' }} />

      <div className="relative w-full max-w-sm mx-4 animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl gradient-btn flex items-center justify-center neon-glow mb-3 animate-pulse-glow">
            <Icon name="Zap" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-montserrat gradient-text">ZapChat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {step === 'code' ? 'Код подтверждения' : mode === 'login' ? 'Добро пожаловать!' : 'Создай аккаунт'}
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-6 border border-white/10">
          {step === 'code' ? (
            /* Code verification step */
            <div className="flex flex-col items-center gap-6">
              {/* User preview */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full gradient-btn flex items-center justify-center text-2xl font-bold text-white neon-glow">
                  {avatarLetters}
                </div>
                <p className="font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{phone}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Введи 4-значный код</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">из СМС на номер {phone}</p>
              </div>

              {/* Code input */}
              <div className="flex gap-3 justify-center">
                {code.map((d, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleCodeChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !d && i > 0) {
                        document.getElementById(`code-${i - 1}`)?.focus();
                      }
                    }}
                    className={`
                      w-14 h-14 text-center text-2xl font-bold rounded-2xl transition-all duration-300
                      glass border focus:outline-none
                      ${d ? 'border-violet-500/70 bg-violet-500/10 text-white' : 'border-white/10 text-foreground'}
                      focus:border-violet-500/70 focus:bg-violet-500/10
                    `}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {loading && (
                <div className="flex items-center gap-2 text-violet-400 text-sm">
                  <div className="w-4 h-4 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
                  Проверяем...
                </div>
              )}

              <button
                onClick={() => { setStep('form'); setCode(['', '', '', '']); }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Изменить данные
              </button>

              {/* Demo hint */}
              <div className="w-full px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-center">
                <p className="text-xs text-violet-300">Для демо введи любые 4 цифры</p>
              </div>
            </div>
          ) : (
            /* Main form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Tabs */}
              <div className="flex gap-1 p-1 rounded-2xl glass border border-white/10">
                {(['login', 'register'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(''); }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      mode === m ? 'gradient-btn text-white neon-glow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {m === 'login' ? 'Войти' : 'Регистрация'}
                  </button>
                ))}
              </div>

              {/* Name field (register only) */}
              {mode === 'register' && (
                <div className="relative animate-fade-in">
                  <Icon name="User" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Имя и фамилия"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              )}

              {/* Phone / email */}
              <div className="relative">
                <Icon name="Smartphone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+7 999 000-00-00 или email"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={15} />
                </button>
              </div>

              {/* Confirm password (register) */}
              {mode === 'register' && (
                <div className="relative animate-fade-in">
                  <Icon name="Lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Повтори пароль"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
                  <Icon name="AlertCircle" size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Forgot password */}
              {mode === 'login' && (
                <button type="button" className="text-xs text-muted-foreground hover:text-violet-400 transition-colors text-right -mt-2">
                  Забыл пароль?
                </button>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl gradient-btn text-white font-semibold text-sm neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    {mode === 'login' ? 'Входим...' : 'Создаём...'}
                  </>
                ) : (
                  <>
                    <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={16} />
                    {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-muted-foreground">или</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Social auth */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Google', icon: '🔵' },
                  { label: 'Telegram', icon: '✈️' },
                ].map(s => (
                  <button
                    key={s.label}
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-2xl glass border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Terms */}
              {mode === 'register' && (
                <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed">
                  Регистрируясь, ты соглашаешься с{' '}
                  <button type="button" className="text-violet-400 hover:underline">Условиями использования</button>{' '}
                  и{' '}
                  <button type="button" className="text-violet-400 hover:underline">Политикой конфиденциальности</button>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Version */}
        <p className="text-center text-[10px] text-muted-foreground/40 mt-4">ZapChat v1.0 · 2026</p>
      </div>
    </div>
  );
}
