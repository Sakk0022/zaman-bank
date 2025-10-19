import React, { useState, useEffect, useCallback } from 'react';
import {
  FiEye, FiEyeOff, FiMic, FiSend, FiSearch, FiChevronDown,
  FiTarget, FiPieChart, FiBarChart2, FiZap, FiClock, FiStar, FiPlus
} from 'react-icons/fi';
import logoImage from './assets/zamat.jpeg';

const API_BASE = 'https://zaman-ai.onrender.com';

// Universal API call with retry
const apiCall = async (endpoint, options = {}, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (response.status === 404 && attempt < retries - 1) {
          console.warn(`Attempt ${attempt + 1}: 404, waking up Render...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }
        throw new Error(error.error || `HTTP ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`API call error (attempt ${attempt + 1}):`, error);
      if (error.name === 'AbortError') throw new Error('Request timeout');
      if (attempt === retries - 1) throw error;
      console.warn(`Attempt ${attempt + 1} failed: ${error.message}, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
    }
  }
};

export default function ZamanAIPrototype() {
  // Navigation
  const [screen, setScreen] = useState('auth');
  const [loading, setLoading] = useState(false);

  // Authorization
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null); // Added for error handling

  // User Data
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('zaman_token') || null);
  const [, setUserData] = useState(null);

  // Chat
  const [messages, setMessages] = useState([
    { id: 1, from: 'assistant', text: 'Привет! Я — помощник Zaman. Чем могу помочь сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Load user data with useCallback to stabilize
  const loadUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await apiCall(`/user?user_id=${userId}`);
      setUserData(data);
      console.log('User data loaded:', data);
    } catch (error) {
      console.error('Load user data error:', error);
      setError('Не удалось загрузить данные пользователя. Попробуйте позже.');
    }
  }, [userId]);

  // Auth submit
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 5) {
      setError('Пароль должен содержать минимум 5 символов');
      setLoading(false);
      return;
    }
    if (authMode === 'register' && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const endpoint = authMode === 'login' ? '/login' : '/register';
      const response = await apiCall(endpoint, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      
      setUserId(response.user_id);
      setToken(response.token);
      localStorage.setItem('zaman_token', response.token);
      setScreen('landing');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Chat send
  // Chat send
const sendMessage = async () => {
  const text = input.trim();
  if (!text) return;
  
  pushUser(text);
  setInput('');
  setIsTyping(true);
  setError(null);
  
  try {
    // Форматируем сообщения правильно для бэкенда
    const formattedMessages = messages.map(msg => ({
      role: msg.from === 'user' ? 'user' : 'assistant',
      content: msg.text
    }));
    
    // Добавляем новое сообщение пользователя
    const messagesToSend = [
      ...formattedMessages,
      { role: 'user', content: text }
    ];

    const response = await apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        messages: messagesToSend,
        user_id: userId || 1 
      })
    });
    
    pushAssistant(response.response);
  } catch (error) {
    console.error('Send message error:', error);
    pushAssistant('Извините, произошла ошибка. Попробуйте ещё раз.');
    setError('Ошибка при отправке сообщения: ' + error.message);
  } finally {
    setIsTyping(false);
  }
};
  // Helpers
  function pushUser(text) {
    setMessages(m => [...m, { id: Date.now(), from: 'user', text }]);
  }

  function pushAssistant(text) {
    setMessages(m => [...m, { id: Date.now() + 1, from: 'assistant', text }]);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function toggleAuthMode() {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError(null);
  }

  function toggleListen() {
    setListening(l => !l);
    if (!listening) {
      setTimeout(() => {
        const fakeText = 'Хочу копить на квартиру, 50000 ₸ в месяц';
        pushUser(fakeText);
        setIsTyping(true);
        setTimeout(() => {
          pushAssistant('Понял! Составлю план на 5 лет и подберу халяль-продукты.');
          setIsTyping(false);
          setListening(false);
        }, 800);
      }, 1200);
    }
  }

  // Check token on load
  useEffect(() => {
    if (token) {
      const parts = token.split('_');
      if (parts[0] === 'user') {
        setUserId(parseInt(parts[1]));
        setScreen('landing');
      }
    }
  }, [token]);

  // Load user data when screen is landing and userId exists
  useEffect(() => {
    if (screen === 'landing' && userId) {
      loadUserData();
    }
  }, [loadUserData, screen, userId]);

  // Screen 1: Authorization
  if (screen === 'auth') {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          background:
            'radial-gradient(1100px 700px at 0% -10%, #EEFE6D44, transparent 60%), radial-gradient(900px 600px at 120% -10%, #2D9A8644, transparent 60%), #F9FFFD'
        }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logoImage} alt="Zaman" className="w-20 h-20 mx-auto rounded-xl object-cover ring-2 ring-white shadow-lg" />
            <h1 className="mt-4 text-2xl font-bold bg-gradient-to-r from-[#2D9A86] to-[#EEFE6D] bg-clip-text text-transparent">
              ZAMAN AI
            </h1>
            <p className="text-sm text-gray-600 mt-1">Халяль-банкинг нового поколения</p>
          </div>

          <div className="bg-white/90 backdrop-blur border border-black/10 rounded-3xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">
              {authMode === 'login' ? 'Добро пожаловать!' : 'Присоединяйтесь к нам!'}
            </h2>
            <p className="text-center text-sm text-gray-600">
              {authMode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
            </p>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Логин или телефон"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D9A86] text-sm"
                required
                minLength={1}
              />
              
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D9A86] text-sm pr-10"
                  required
                  minLength={5}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>

              {authMode === 'register' && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Подтвердите пароль"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#2D9A86] text-sm pr-10"
                    required
                    minLength={5}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                style={{ background: 'linear-gradient(90deg,#2D9A86, #B9F754)' }}
              >
                {loading ? 'Загрузка...' : (authMode === 'login' ? 'Войти' : 'Зарегистрироваться')}
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-sm text-[#2D9A86] hover:underline"
              >
                {authMode === 'login' 
                  ? 'Я новый клиент' 
                  : 'У меня уже есть аккаунт'
                }
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Нажимая «Войти» или «Зарегистрироваться», вы соглашаетесь с{' '}
              <button className="text-[#2D9A86] underline">условиями</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Landing
  if (screen === 'landing') {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          background:
            'radial-gradient(1100px 700px at 0% -10%, #EEFE6D22, transparent 60%), radial-gradient(900px 600px at 120% -10%, #2D9A8622, transparent 60%), #F9FFFD'
        }}
      >
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-black/5">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="Zaman" className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow" />
              <div className="text-sm font-semibold tracking-wide">
                ZAMAN <span className="text-[#2D9A86]">AI</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-black/10 shadow-sm ml-2 flex-1 max-w-md">
              <FiSearch className="opacity-60" />
              <input placeholder="Халяль-банкинг нового поколения" className="flex-1 outline-none text-sm bg-transparent" />
            </div>

            <nav className="hidden md:flex items-center gap-5 text-sm">
              <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Частным клиентам <FiChevronDown /></button>
              <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Бизнесу <FiChevronDown /></button>
              <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Исламские финансы <FiChevronDown /></button>
              <button className="flex items-center gap-1 opacity-80 hover:opacity-100">О банке <FiChevronDown /></button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setScreen('chat')}
                className="px-4 py-2 rounded-full bg-white border border-black/10 text-sm shadow-sm"
              >
                Начать
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {error && (
            <div className="max-w-6xl mx-auto px-4 py-4 text-red-600 text-sm">{error}</div>
          )}
          <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur rounded-3xl border border-black/10 p-5 md:p-7 shadow-sm">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full border bg-white">Шариатские принципы</span>
                <span className="px-3 py-1 rounded-full border bg-white">Голос · Текст · RU/KZ/EN</span>
              </div>

              <h1 className="mt-4 leading-tight font-extrabold text-3xl md:text-[44px]">
                <span
                  className="inline-block"
                  style={{ background: 'linear-gradient(90deg,#2D9A86, #EEFE6D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                >
                  ZAMAN AI
                </span>{' '}
                — ваш халяль-навигатор по финансам
              </h1>

              <p className="mt-3 text-sm md:text-base opacity-80">
                Вместо сложного банка — диалог. Ставим цели, меняем привычки, подбираем халяль-решения и ведём к результату.
              </p>

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setScreen('chat')}
                  className="px-4 py-3 rounded-full text-sm text-[#0b0b0b] shadow-md hover:shadow-lg transition"
                  style={{ background: 'linear-gradient(90deg,#B9F754, #EEFE6D)' }}
                >
                  ▶ Начать разговор
                </button>
                <button className="px-4 py-3 rounded-full text-sm bg-white border border-black/10 shadow-sm">
                  Оформить онлайн
                </button>
              </div>

              <div className="mt-4">
                <button className="px-3 py-1 rounded-full border bg-white text-xs">RU / KZ / EN</button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 blur-3xl opacity-30"
                   style={{ background: 'radial-gradient(200px 200px at 20% 20%, #2D9A86, transparent), radial-gradient(220px 220px at 80% 30%, #EEFE6D, transparent)' }} />
              <div className="rounded-3xl border border-black/10 bg-white/60 backdrop-blur shadow-lg p-4">
                <div className="rounded-2xl h-[220px] md:h-[260px] p-5 flex flex-col justify-between text-[#0b0b0b]"
                     style={{ background: 'linear-gradient(135deg,#CBFFE9,#EAFEBD)' }}>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] bg-white/80 border">PLATINUM CARD</span>
                    <span className="w-8 h-6 rounded bg-white/70 border" />
                  </div>
                  <div>
                    <div className="text-[10px] opacity-70">CARD HOLDER</div>
                    <div className="text-xl md:text-2xl font-semibold tracking-wide">ZAMAN USER</div>
                    <div className="mt-2 text-sm tracking-widest opacity-80">****  ****  ****  5284</div>
                  </div>
                  <div className="opacity-70 text-[10px]">Халяль. Без процентов. Прозрачно.</div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 max-w-sm ml-auto">
                <img src={logoImage} className="w-7 h-7 rounded-xl object-cover" alt="bot" />
                <div className="bg-white border border-black/10 rounded-2xl p-3 shadow-sm text-sm">
                  Привет! Я Zaman AI — помогу с целями, расходами и халяль-продуктами.{' '}
                  <span className="opacity-60">Нажмите «Начать разговор»</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { t: 'Пополнить', i: '💳' },
                { t: 'Перевести', i: '🔄' },
                { t: 'Цели', i: '🎯' },
                { t: 'Инвестиции', i: '📈' }
              ].map(x => (
                <button key={x.t} className="h-12 rounded-2xl bg-white border border-black/10 shadow-sm hover:shadow transition flex items-center justify-center gap-2 text-sm">
                  <span>{x.i}</span> {x.t}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Screen 3: Chat
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        background:
          'radial-gradient(1200px 900px at -10% -10%, #EEFE6D22, transparent 60%), radial-gradient(900px 700px at 120% -20%, #2D9A8626, transparent 60%), #F9FFFD'
      }}
    >
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setScreen('landing')} className="p-1 rounded-full bg-white/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="Zaman" className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow" />
              <div>
                <div className="text-base sm:text-lg font-semibold">Zaman AI Bank</div>
                <div className="text-[11px] text-gray-500 -mt-0.5">Голосовой & текстовый ассистент</div>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {[
              { t: 'Продукты', i: <FiBarChart2 /> },
              { t: 'Цели', i: <FiTarget /> },
              { t: 'Аналитика', i: <FiPieChart /> },
            ].map(x => (
              <button key={x.t} className="px-3 py-2 rounded-full bg-white border border-black/10 hover:shadow text-sm flex items-center gap-2">
                {x.i}<span>{x.t}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {error && (
          <div className="max-w-6xl mx-auto px-4 py-4 text-red-600 text-sm">{error}</div>
        )}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
          <section className="space-y-5">
            <div className="rounded-3xl p-5 border border-black/10 bg-white/80 backdrop-blur shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-semibold">Визуализатор мечты</h3>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border bg-white">
                  <FiClock /> 5 лет
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Путь к вашей цели — квартире, путешествию или обучению.</p>

              <div className="mt-4 rounded-2xl p-4 text-[#0b0b0b]" style={{ background: 'linear-gradient(90deg,#2D9A86 0%, #B9F754 60%, #EEFE6D 100%)' }}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm sm:text-base">Квартира в 5 лет</h4>
                  <span className="text-[11px] bg-white/75 px-2 py-1 rounded-full border">Нужно: 15 000 000 ₸</span>
                </div>
                <div className="mt-3 bg-white/40 rounded-full h-[14px] w-full overflow-hidden">
                  <div className="h-[14px] rounded-full bg-white/95" style={{ width: '32%' }} />
                </div>
                <div className="mt-1 text-[11px] opacity-85">Прогресс: 32% • ежемесячно 50 000 ₸</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="py-2 rounded-xl border text-xs sm:text-sm bg-white hover:bg-white/90">Редактировать цель</button>
                <button className="py-2 rounded-xl text-xs sm:text-sm text-white shadow-md hover:shadow" style={{ background: '#2D9A86' }}>
                  Планировать автоматически
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { t: 'Экономия', v: '12%', i: <FiZap /> },
                  { t: 'Срок', v: '5 лет', i: <FiClock /> },
                  { t: 'Приоритет', v: 'Высокий', i: <FiStar /> },
                ].map(x => (
                  <div key={x.t} className="rounded-xl border bg-white p-3 text-xs">
                    <div className="flex items-center justify-center gap-1 opacity-70">{x.i}<span>{x.t}</span></div>
                    <div className="font-semibold mt-1">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl p-5 border bg-white/80 backdrop-blur shadow-sm hover:shadow transition">
              <h3 className="text-sm sm:text-base font-semibold">Смена привычек</h3>
              <p className="text-xs text-gray-500">Небольшие шаги, которые экономят 10–20% в месяц.</p>
              <ul className="mt-3 list-disc list-inside text-xs sm:text-sm space-y-2">
                <li>Отписаться от ненужных подписок</li>
                <li>Установить недельный лимит на развлечения</li>
                <li>Автосбережения 10% от каждой зарплаты</li>
              </ul>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Экономить 20%','Оптимизируй подписки','Включи автосбережения 10%','Сократи такси'].map(c => (
                  <button key={c} onClick={() => {
                    pushUser(c);
                    sendMessage();
                  }} className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-white/90 transition">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <div className="rounded-3xl p-4 sm:p-5 border bg-white/70 backdrop-blur shadow-sm flex-1 flex flex-col"
                 style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFFAA,#F5FFEACC)' }}>
              <div className="flex-1 overflow-auto pr-1" style={{ maxHeight: 'calc(100vh - 260px)' }}>
                {messages.map(m => (
                  <div key={m.id} className={`mb-3 max-w-[85%] ${m.from === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                    <div className={`flex items-end gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.from === 'assistant' && <img src={logoImage} alt="A" className="w-6 h-6 rounded-lg object-cover" />}
                      <div className={`inline-block px-4 py-2 rounded-2xl shadow-sm ${m.from === 'user' ? 'bg-[#2D9A86]/10' : 'bg-white border'}`}>
                        <div className="text-xs sm:text-sm">{m.text}</div>
                      </div>
                      {m.from === 'user' && (
                        <div className="w-6 h-6 rounded-lg bg-[#2D9A86]/15 flex items-center justify-center text-[10px] text-[#2D9A86]">Вы</div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="mr-auto text-left mb-2">
                    <div className="flex items-end gap-2">
                      <img src={logoImage} alt="A" className="w-6 h-6 rounded-lg object-cover" />
                      <div className="inline-block px-3 py-2 rounded-2xl bg-white border shadow-sm">
                        <span className="text-xs sm:text-sm opacity-70 animate-pulse">Ассистент печатает…</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение или нажмите микрофон"
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-2xl border focus:outline-none text-sm min-w-0 resize-none bg-white/90"
                />
                <button
                  onClick={toggleListen}
                  className={`p-3 rounded-xl border ${listening ? 'animate-pulse' : ''}`}
                  title="Голосовой ввод"
                  style={{ background: listening ? '#EEFE6D' : '#fff' }}
                >
                  <FiMic className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={isTyping}
                  className="px-4 py-3 rounded-xl text-sm text-white shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                  style={{ background: '#2D9A86' }}
                >
                  <FiSend className="w-4 h-4" /> Отправить
                </button>
              </div>
            </div>

            <div className="rounded-3xl p-4 border bg-white/80 backdrop-blur shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-semibold">Рекомендации</h4>
                <button className="text-xs px-3 py-1 rounded-full border bg-white hover:bg-white/90 flex items-center gap-1">
                  <FiPlus /> Добавить
                </button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <div className="p-3 rounded-xl border bg-white flex items-center justify-between text-xs sm:text-sm">
                  <span>Депозит «Надёжный» — доходность 8% годовых</span>
                  <button className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-white/90">Сравнить</button>
                </div>
                <div className="p-3 rounded-xl border bg-white flex items-center justify-between text-xs sm:text-sm">
                  <span>План «Обучение» — откладывание 20 000 ₸ после зарплаты</span>
                  <button className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-white/90">Включить</button>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl p-5 border bg-white/80 backdrop-blur shadow-sm hover:shadow transition">
              <div className="flex items-center justify-between">
                <h4 className="text-sm sm:text-base font-semibold">Аналитика расходов</h4>
                <span className="text-[11px] opacity-70">30 дней</span>
              </div>
              <div className="mt-3 h-36 rounded-2xl border-dashed border flex items-center justify-center text-xs text-gray-500">
                График (placeholder)
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl border bg-white">
                  <div className="opacity-70">Продукты питания</div>
                  <div className="font-semibold">-12%</div>
                </div>
                <div className="p-3 rounded-xl border bg-white">
                  <div className="opacity-70">Такси</div>
                  <div className="font-semibold">+6%</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-5 border bg-white/80 backdrop-blur shadow-sm hover:shadow transition">
              <h4 className="text-sm sm:text-base font-semibold">Подобранные продукты</h4>
              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-xl border bg-white text-xs sm:text-sm">Ипотека + накопительный счёт</div>
                <div className="p-3 rounded-xl border bg-white text-xs sm:text-sm">Сберегательный вклад (исламский)</div>
                <div className="p-3 rounded-xl border bg-white text-xs sm:text-sm">Кэшбэк-карта 5% рестораны / 2% транспорт</div>
              </div>
              <button
                onClick={() => {
                  pushUser('Сравни ипотеку и накопительный счёт');
                  sendMessage();
                }}
                className="mt-3 w-full py-2 rounded-xl text-xs sm:text-sm text-white shadow-md hover:shadow"
                style={{ background: '#2D9A86' }}
              >
                Сравнить варианты
              </button>
            </div>
          </aside>
        </div>
      </main>

      <div className="sticky bottom-3 mx-auto w-full max-w-4xl px-4">
        <div className="rounded-2xl bg-white/80 backdrop-blur border border-black/10 shadow-lg p-2 flex items-center justify-around text-sm">
          {[
            { t: 'Пополнить', i: '💳' },
            { t: 'Перевести', i: '🔄' },
            { t: 'Цели', i: '🎯' },
            { t: 'Аналитика', i: '📈' },
          ].map(x => (
            <button key={x.t} className="px-3 py-2 rounded-xl hover:bg-white transition flex items-center gap-2">
              <span>{x.i}</span>{x.t}
            </button>
          ))}
        </div>
      </div>

      <footer className="px-4 sm:px-6 py-4 text-center text-[11px] text-gray-500">
        Прототип UI — Zaman Bank AI Assistant
      </footer>
    </div>
  );
}