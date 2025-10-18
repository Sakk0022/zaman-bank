import React, { useState, useRef } from 'react';
import { FiEye, FiEyeOff, FiMic } from 'react-icons/fi';

// Zaman color tokens
// Persian Green: #2D9A86
// Solar: #EEFE6D
// Cloud: white

export default function ZamanAIPrototype() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'assistant', text: 'Привет! Я — помощник Zaman. Чем могу помочь сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    // placeholder reply logic
    setTimeout(() => {
      setMessages(m => [...m, { id: Date.now() + 1, from: 'assistant', text: 'Отлично! Давай разберём цель: "Квартира". Сколько вы планируете отложить в месяц?' }]);
    }, 700);
  }

  // Minimal pseudo-voice handler (UI-only). Real implementation should use Web Speech / backend Whisper.
  function toggleListen() {
    setListening(l => !l);
    if (!listening) {
      // start pseudo-recognition
      setTimeout(() => {
        const voiceMsg = { id: Date.now() + 2, from: 'user', text: 'Хочу копить на квартиру, 50000 тенге в месяц' };
        setMessages(m => [...m, voiceMsg]);
        setMessages(m => [...m, { id: Date.now() + 3, from: 'assistant', text: 'Понял. Составлю план на 5 лет и подберу подходящие продукты.' }]);
        setListening(false);
      }, 1600);
    }
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
    // Dummy authentication logic for prototype
    if (password.length < 5) {
      alert('Пароль должен содержать минимум 5 символов');
      return;
    }
    if (authMode === 'register') {
      if (confirmPassword.length < 5) {
        alert('Подтверждение пароля должно содержать минимум 5 символов');
        return;
      }
      if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
      }
    }
    // Simulate successful login/registration
    setIsLoggedIn(true);
    // Reset form fields
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function toggleAuthMode() {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    // Clear fields when toggling
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-white flex items-center justify-center" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
        <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-md bg-white mx-auto">
          <div className="flex justify-center mb-6">
            <div style={{ width: 60, height: 60, background: '#2D9A86', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '2rem' }}>Z</div>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">{authMode === 'login' ? 'Вход в Zaman AI Bank' : 'Регистрация в Zaman AI Bank'}</h2>
          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none text-sm sm:text-base text-left"
              required
              minLength={1}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none text-sm sm:text-base text-left"
                required
                minLength={5}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 bg-transparent"
              >
                {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
              </button>
            </div>
            {authMode === 'register' && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none text-sm sm:text-base text-left"
                  required
                  minLength={5}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 bg-transparent"
                  aria-label={showConfirmPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-medium text-sm sm:text-base"
              style={{ background: '#2D9A86' }} // Changed to solid Persian Green for a different look
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={toggleAuthMode} className="text-[#2D9A86] hover:underline">
              {authMode === 'login' ? 'Регистрация' : 'Вход'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white flex flex-col" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 shadow-sm" style={{ background: '#ffffff' }}>
        <div className="flex items-center gap-3">
          <div style={{ width: 44, height: 44, background: '#2D9A86', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>Z</div>
          <div>
            <div className="text-base sm:text-lg font-semibold">Zaman AI Bank</div>
            <div className="text-xs text-gray-500">Голосовой & текстовый ассистент</div>
          </div>
        </div>
        <nav className="hidden sm:flex gap-4 items-center">
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Продукты</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Цели</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Аналитика</button>
        </nav>
        {/* Mobile menu (simple toggle could be added, but for prototype, hidden nav on mobile */}
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* Left: Dream / Goals */}
        <section className="col-span-1 space-y-4">
          <div className="rounded-2xl p-4 sm:p-5 shadow-sm border" style={{ background: '#ffffff' }}>
            <h3 className="text-sm sm:text-base font-semibold">Визуализатор мечты</h3>
            <p className="text-xs text-gray-500 mt-1">Проследите путь к вашей цели — квартите, путешествию или обучению.</p>
            <div className="mt-4 bg-gradient-to-r from-[#2D9A86] to-[#EEFE6D] rounded-xl p-4 text-white">
              <h4 className="font-semibold text-sm sm:text-base">Квартира в 5 лет</h4>
              <div className="mt-2 text-xs sm:text-sm">Нужно: 15 000 000 ₸</div>
              <div className="mt-3 bg-white/30 rounded-full h-3 w-full">
                <div style={{ width: '32%' }} className="h-3 rounded-full bg-white/90"></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg border text-xs sm:text-sm">Редактировать цель</button>
              <button className="py-2 rounded-lg text-xs sm:text-sm" style={{ background: '#2D9A86', color: '#fff' }}>Планировать автоматически</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 shadow-sm border" style={{ background: '#fff' }}>
            <h3 className="text-sm sm:text-base font-semibold">Смена привычек</h3>
            <p className="text-xs text-gray-500">Небольшие шаги, которые экономят 10-20% в месяц.</p>
            <ul className="mt-3 list-disc list-inside text-xs sm:text-sm space-y-2">
              <li>Отписаться от ненужных подписок</li>
              <li>Установить недельный лимит на развлечения</li>
              <li>Автосбережения 10% от каждой зарплаты</li>
            </ul>
          </div>
        </section>

        {/* Center: Chat / Assistant */}
        <section className="col-span-1 flex flex-col gap-4 min-h-[400px] md:min-h-0">
          <div className="rounded-2xl p-4 shadow-sm flex-1 flex flex-col min-h-[300px]" style={{ background: 'linear-gradient(180deg,#FFFFFF, #F7FFF0)' }}>
            <div className="flex-1 overflow-auto p-2 min-h-[200px]" style={{ maxHeight: 'calc(100vh - 200px)' }}> {/* Adjusted for better mobile fit */}
              {messages.map(m => (
                <div key={m.id} className={`mb-3 max-w-[85%] ${m.from === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl ${m.from === 'user' ? 'bg-[#2D9A86]/10' : 'bg-white'} shadow-sm`}>
                    <div className="text-xs sm:text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-1 sm:gap-2 flex-wrap">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Напишите сообщение или нажмите микрофон" className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border focus:outline-none text-xs sm:text-sm min-w-0" />
              <button onClick={toggleListen} title="Голосовой ввод" className={`p-2 sm:p-3 rounded-lg border ${listening ? 'animate-pulse' : ''}`} style={{ background: listening ? '#EEFE6D' : '#fff' }}>
              <FiMic className="w-5 h-5" />
              </button>
              <button onClick={sendMessage} className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm whitespace-nowrap" style={{ background: '#2D9A86', color: '#fff' }}>Отправить</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border" style={{ background: '#fff' }}>
            <h4 className="text-sm sm:text-base font-semibold">Рекомендации</h4>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg border text-xs sm:text-sm">Депозит "Надёжный" — доходность 8% годовых</div>
              <div className="p-3 rounded-lg border text-xs sm:text-sm">План "Обучение" — автоматическое откладывание 20 000 ₸</div>
            </div>
          </div>
        </section>

        {/* Right: Analytics / Products */}
        <aside className="col-span-1 space-y-4">
          <div className="rounded-2xl p-4 shadow-sm border" style={{ background: '#fff' }}>
            <h4 className="text-sm sm:text-base font-semibold">Аналитика расходов</h4>
            <p className="text-xs text-gray-500">Последние 30 дней</p>
            <div className="mt-3 h-32 sm:h-36 rounded-lg p-3 flex items-center justify-center border-dashed">График (placeholder)</div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border" style={{ background: '#fff' }}>
            <h4 className="text-sm sm:text-base font-semibold">Подобранные продукты</h4>
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-lg border text-xs sm:text-sm">Ипотека + накопительный счёт</div>
              <div className="p-3 rounded-lg border text-xs sm:text-sm">Сберегательный вклад (исламский)</div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="p-4 text-center text-xs text-gray-500">Прототип UI — Zaman Bank AI Assistant</footer>
    </div>
  );
}