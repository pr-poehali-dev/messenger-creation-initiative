import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { CallState } from '@/store/messengerStore';

interface CallOverlayProps {
  call: CallState;
  onEnd: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export default function CallOverlay({ call, onEnd, onToggleMute, onToggleVideo }: CallOverlayProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!call.active) { setSeconds(0); return; }
    const interval = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [call.active]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!call.active) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

      {/* Video background simulation */}
      {call.type === 'video' && !call.videoOff && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 mesh-bg opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
          {/* Animated "video" effect */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 blur-3xl animate-pulse" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-6 p-8 animate-slide-up">
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full gradient-btn flex items-center justify-center text-4xl font-bold text-white neon-glow animate-pulse-glow">
            {call.contactAvatar}
          </div>
          {/* Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-violet-500/40 animate-ping" />
          <div className="absolute -inset-3 rounded-full border border-violet-500/20 animate-ping" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Name & status */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-1">{call.contactName}</h2>
          <p className="text-white/60 text-sm">
            {call.type === 'video' ? '📹 Видеозвонок' : '📞 Голосовой звонок'}
          </p>
          <p className="text-white/80 font-mono text-lg mt-1">{formatTime(seconds)}</p>
        </div>

        {/* Self video preview for video calls */}
        {call.type === 'video' && (
          <div className="absolute top-6 right-6 w-32 h-24 rounded-2xl glass-strong border border-white/20 flex items-center justify-center overflow-hidden">
            {call.videoOff ? (
              <div className="flex flex-col items-center gap-1 text-white/40">
                <Icon name="VideoOff" size={20} />
                <span className="text-xs">Камера выкл</span>
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500/30 to-violet-500/30 flex items-center justify-center">
                <span className="text-white text-xl font-bold">АС</span>
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4 mt-2">
          {/* Mute */}
          <button
            onClick={onToggleMute}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
              call.muted ? 'bg-yellow-500/20 border border-yellow-500/50' : 'glass border border-white/20 hover:bg-white/10'
            }`}
          >
            <Icon name={call.muted ? 'MicOff' : 'Mic'} size={22} className={call.muted ? 'text-yellow-400' : 'text-white'} />
          </button>

          {/* Speaker */}
          <button className="w-14 h-14 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all duration-300">
            <Icon name="Volume2" size={22} className="text-white" />
          </button>

          {/* Video toggle (only for video calls) */}
          {call.type === 'video' && (
            <button
              onClick={onToggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                call.videoOff ? 'bg-yellow-500/20 border border-yellow-500/50' : 'glass border border-white/20 hover:bg-white/10'
              }`}
            >
              <Icon name={call.videoOff ? 'VideoOff' : 'Video'} size={22} className={call.videoOff ? 'text-yellow-400' : 'text-white'} />
            </button>
          )}

          {/* End call */}
          <button
            onClick={onEnd}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/40"
          >
            <Icon name="PhoneOff" size={22} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
