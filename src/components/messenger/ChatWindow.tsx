import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Chat, Message, currentUser } from '@/data/mockData';
import { CallType } from '@/store/messengerStore';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSend: (text: string) => void;
  onSendVoice: (duration: number) => void;
  onCall: (type: CallType) => void;
  recordingVoice: boolean;
  setRecordingVoice: (v: boolean) => void;
}

function formatMsgTime(date: Date) {
  return date.toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
}

function VoiceBubble({ duration, isMe }: { duration: number; isMe: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const step = 100 / (duration * 10);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { setPlaying(false); return 0; }
        return p + step;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [playing, duration]);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 min-w-[180px] rounded-2xl ${isMe ? 'msg-bubble-out' : 'msg-bubble-in'}`}>
      <button
        onClick={() => setPlaying(p => !p)}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isMe ? 'bg-white/20 hover:bg-white/30' : 'bg-white/10 hover:bg-white/20'} transition-colors`}
      >
        <Icon name={playing ? 'Pause' : 'Play'} size={14} className="text-white" />
      </button>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex gap-0.5 items-end h-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-100 ${i / 20 <= progress / 100 ? 'bg-white' : 'bg-white/30'}`}
              style={{ height: `${30 + Math.sin(i * 0.8) * 50}%` }}
            />
          ))}
        </div>
        <span className="text-[10px] text-white/60">
          {playing ? `0:${Math.floor((progress / 100) * duration).toString().padStart(2, '0')}` : `0:${duration.toString().padStart(2, '0')}`}
        </span>
      </div>
    </div>
  );
}

export default function ChatWindow({ chat, messages, onSend, onSendVoice, onCall, recordingVoice, setRecordingVoice }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [voiceSeconds, setVoiceSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  const startRecording = () => {
    setRecordingVoice(true);
    setVoiceSeconds(0);
    voiceTimerRef.current = setInterval(() => setVoiceSeconds(s => s + 1), 1000);
  };

  const stopRecording = (send: boolean) => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    setRecordingVoice(false);
    if (send && voiceSeconds > 0) onSendVoice(voiceSeconds);
    setVoiceSeconds(0);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center mesh-bg">
        <div className="w-24 h-24 rounded-3xl gradient-btn flex items-center justify-center mb-6 neon-glow animate-float">
          <Icon name="MessageCircle" size={44} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold gradient-text mb-2">Выбери чат</h2>
        <p className="text-muted-foreground">Начни общение прямо сейчас</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 glass border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${chat.isGroup ? 'gradient-btn-blue' : 'gradient-btn'}`}>
              {chat.avatar}
            </div>
            {!chat.isGroup && chat.online && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-background" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{chat.name}</h3>
            <p className="text-xs text-muted-foreground">
              {chat.typing ? (
                <span className="text-violet-400">печатает...</span>
              ) : chat.isGroup ? (
                `${chat.members?.length ?? 0} участников`
              ) : chat.online ? 'В сети' : 'Был(а) давно'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCall('audio')}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group"
          >
            <Icon name="Phone" size={16} className="text-muted-foreground group-hover:text-violet-400" />
          </button>
          <button
            onClick={() => onCall('video')}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-pink-500/20 hover:border-pink-500/40 transition-all duration-300 group"
          >
            <Icon name="Video" size={16} className="text-muted-foreground group-hover:text-pink-400" />
          </button>
          <button className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all duration-300">
            <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 mesh-bg">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
            <Icon name="MessageCircle" size={40} className="text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Начните общение</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full gradient-btn flex items-center justify-center text-xs font-bold text-white mr-2 self-end flex-shrink-0">
                  {chat.avatar.charAt(0)}
                </div>
              )}
              <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {msg.type === 'voice' ? (
                  <VoiceBubble duration={msg.duration ?? 0} isMe={isMe} />
                ) : (
                  <div className={`px-4 py-2.5 text-sm text-white ${isMe ? 'msg-bubble-out' : 'msg-bubble-in'}`}>
                    {msg.text}
                  </div>
                )}
                <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] text-muted-foreground">{formatMsgTime(msg.timestamp)}</span>
                  {isMe && (
                    <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12} className={msg.read ? 'text-violet-400' : 'text-muted-foreground'} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 glass border-t border-white/10 flex-shrink-0">
        {recordingVoice ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl glass border border-red-500/40">
            <div className="flex gap-0.5 items-end h-5">
              {[0,1,2,3,4,5,6].map(i => (
                <div key={i} className="w-1 rounded-full bg-red-400 waveform-bar" />
              ))}
            </div>
            <span className="text-red-400 text-sm font-mono flex-1">
              🔴 {`0:${voiceSeconds.toString().padStart(2, '0')}`}
            </span>
            <button onClick={() => stopRecording(false)} className="text-muted-foreground hover:text-destructive transition-colors">
              <Icon name="Trash2" size={18} />
            </button>
            <button onClick={() => stopRecording(true)} className="w-9 h-9 rounded-full gradient-btn flex items-center justify-center neon-glow">
              <Icon name="Send" size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <button className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all flex-shrink-0">
              <Icon name="Paperclip" size={16} className="text-muted-foreground" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Сообщение..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-2xl glass border border-white/10 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-violet-500/50 resize-none"
                style={{ maxHeight: '120px', overflowY: 'auto' }}
              />
            </div>
            {input.trim() ? (
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center neon-glow hover:scale-105 transition-transform flex-shrink-0"
              >
                <Icon name="Send" size={16} className="text-white" />
              </button>
            ) : (
              <button
                onMouseDown={startRecording}
                onMouseUp={() => stopRecording(true)}
                onTouchStart={startRecording}
                onTouchEnd={() => stopRecording(true)}
                className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-violet-500/20 hover:border-violet-500/40 transition-all flex-shrink-0"
              >
                <Icon name="Mic" size={16} className="text-muted-foreground" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
