export type MessageType = 'text' | 'voice' | 'image';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  type: MessageType;
  duration?: number;
  timestamp: Date;
  read: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
  online: boolean;
  isGroup: boolean;
  members?: string[];
  typing?: boolean;
  pinned?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  online: boolean;
  phone: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  members: number;
  lastMessage: string;
  lastMessageTime: Date;
  unread: number;
}

export const currentUser = {
  id: 'me',
  name: 'Алекс Смирнов',
  avatar: 'АС',
  status: 'Онлайн — пишу код 🚀',
  phone: '+7 999 123-45-67',
};

export const contacts: Contact[] = [
  { id: 'u1', name: 'Анна Петрова', avatar: 'АП', status: 'На работе', online: true, phone: '+7 999 111-11-11' },
  { id: 'u2', name: 'Максим Козлов', avatar: 'МК', status: 'В дороге', online: false, phone: '+7 999 222-22-22' },
  { id: 'u3', name: 'Елена Новикова', avatar: 'ЕН', status: 'Свободна', online: true, phone: '+7 999 333-33-33' },
  { id: 'u4', name: 'Иван Волков', avatar: 'ИВ', status: 'Занят', online: false, phone: '+7 999 444-44-44' },
  { id: 'u5', name: 'Мария Соколова', avatar: 'МС', status: '🎵 Слушаю музыку', online: true, phone: '+7 999 555-55-55' },
  { id: 'u6', name: 'Дмитрий Орлов', avatar: 'ДО', status: 'Не беспокоить', online: false, phone: '+7 999 666-66-66' },
  { id: 'u7', name: 'Ксения Морозова', avatar: 'КМ', status: 'Привет всем! 👋', online: true, phone: '+7 999 777-77-77' },
  { id: 'u8', name: 'Артём Белов', avatar: 'АБ', status: 'На встрече', online: false, phone: '+7 999 888-88-88' },
];

export const groups: Group[] = [
  {
    id: 'g1', name: 'Команда разработки', avatar: '💻', members: 12,
    lastMessage: 'Максим: Деплой прошёл успешно!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000), unread: 3,
  },
  {
    id: 'g2', name: 'Дизайн & идеи', avatar: '🎨', members: 8,
    lastMessage: 'Елена: Посмотрите новые макеты',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), unread: 0,
  },
  {
    id: 'g3', name: 'Ребята из офиса', avatar: '🏢', members: 25,
    lastMessage: 'Иван: Кто на обед?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), unread: 7,
  },
  {
    id: 'g4', name: 'Поход в горы 2026', avatar: '⛰️', members: 6,
    lastMessage: 'Мария: Нашла отличный маршрут',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), unread: 0,
  },
  {
    id: 'g5', name: 'Книжный клуб', avatar: '📚', members: 15,
    lastMessage: 'Ксения: Следующая встреча в пятницу',
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), unread: 2,
  },
];

export const chats: Chat[] = [
  {
    id: 'c1', name: 'Анна Петрова', avatar: 'АП',
    lastMessage: 'Отличная работа! Жду твой отчёт 📊',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), unread: 2, online: true, isGroup: false, pinned: true,
  },
  {
    id: 'c2', name: 'Команда разработки', avatar: '💻',
    lastMessage: 'Максим: Деплой прошёл успешно!',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000), unread: 3, online: false, isGroup: true, members: ['u1','u2','u3'], pinned: true,
  },
  {
    id: 'c3', name: 'Максим Козлов', avatar: 'МК',
    lastMessage: 'Голосовое сообщение • 0:42',
    lastMessageTime: new Date(Date.now() - 1 * 60 * 60 * 1000), unread: 0, online: false, isGroup: false,
  },
  {
    id: 'c4', name: 'Елена Новикова', avatar: 'ЕН',
    lastMessage: 'Увидимся завтра! 🙌',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), unread: 1, online: true, isGroup: false, typing: true,
  },
  {
    id: 'c5', name: 'Ребята из офиса', avatar: '🏢',
    lastMessage: 'Иван: Кто на обед?',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), unread: 7, online: false, isGroup: true, members: ['u4','u5','u6'],
  },
  {
    id: 'c6', name: 'Иван Волков', avatar: 'ИВ',
    lastMessage: 'Завтра созвонимся?',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000), unread: 0, online: false, isGroup: false,
  },
  {
    id: 'c7', name: 'Мария Соколова', avatar: 'МС',
    lastMessage: '😊 Спасибо за помощь!',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), unread: 0, online: true, isGroup: false,
  },
];

export const messages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', chatId: 'c1', senderId: 'u1', text: 'Привет! Как дела с проектом?', type: 'text', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
    { id: 'm2', chatId: 'c1', senderId: 'me', text: 'Всё идёт по плану! Заканчиваю последний модуль', type: 'text', timestamp: new Date(Date.now() - 90 * 60 * 1000), read: true },
    { id: 'm3', chatId: 'c1', senderId: 'u1', text: 'Отлично! Когда будет готово?', type: 'text', timestamp: new Date(Date.now() - 60 * 60 * 1000), read: true },
    { id: 'm4', chatId: 'c1', senderId: 'me', text: 'Примерно к вечеру пятницы 🚀', type: 'text', timestamp: new Date(Date.now() - 30 * 60 * 1000), read: true },
    { id: 'm5', chatId: 'c1', senderId: 'u1', text: 'Отличная работа! Жду твой отчёт 📊', type: 'text', timestamp: new Date(Date.now() - 5 * 60 * 1000), read: false },
    { id: 'm6', chatId: 'c1', senderId: 'u1', type: 'voice', duration: 28, timestamp: new Date(Date.now() - 2 * 60 * 1000), read: false },
  ],
  c3: [
    { id: 'm1', chatId: 'c3', senderId: 'me', text: 'Макс, как дела?', type: 'text', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), read: true },
    { id: 'm2', chatId: 'c3', senderId: 'u2', type: 'voice', duration: 42, timestamp: new Date(Date.now() - 60 * 60 * 1000), read: true },
  ],
  c4: [
    { id: 'm1', chatId: 'c4', senderId: 'u3', text: 'Привет! Ты видела новую коллекцию?', type: 'text', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), read: true },
    { id: 'm2', chatId: 'c4', senderId: 'me', text: 'Да! Очень красиво 😍', type: 'text', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), read: true },
    { id: 'm3', chatId: 'c4', senderId: 'u3', text: 'Увидимся завтра! 🙌', type: 'text', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true },
  ],
};
