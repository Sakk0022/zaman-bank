import React, { useState, useRef, useEffect } from 'react';
import { FiEye, FiEyeOff, FiMic } from 'react-icons/fi';
import logoImage from './assets/zamat.jpeg';
import axios from 'axios';

const BACKEND_URL = 'https://zaman-bank.onrender.com';

export default function ZamanAIPrototype() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'assistant', text: 'Привет! Я — помощник Zaman. Чем могу помочь сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef();
  const chatRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userId, setUserId] = useState('test_user');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioStreamRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  function startRecording() {
    if (listening) return;
    setListening(true);

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioStreamRef.current = stream;
        let mimeType = '';
        let fileExtension = 'webm';
        
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
          fileExtension = 'm4a';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else {
          throw new Error('No supported audio MIME type found.');
        }

        try {
          const recorder = new MediaRecorder(stream, { mimeType });
          
          recorder.ondataavailable = event => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            const audioFile = new File([audioBlob], `recording.${fileExtension}`, { type: mimeType });
            sendAudioToBackend(audioFile);
            audioChunksRef.current = [];
            if (audioStreamRef.current) {
              audioStreamRef.current.getTracks().forEach(track => track.stop());
            }
            mediaRecorderRef.current = null;
            audioStreamRef.current = null;
          };

          mediaRecorderRef.current = recorder;
          audioChunksRef.current = [];
          recorder.start(250);
        } catch (error) {
          console.error('Error creating MediaRecorder:', error);
          alert('Не удалось создать запись.');
          setListening(false);
        }
      })
      .catch(error => {
        console.error('Ошибка доступа к микрофону:', error);
        alert('Не удалось получить доступ к микрофону.');
        setListening(false);
      });
  }

  function stopRecording() {
    if (!listening || !mediaRecorderRef.current) return;
    setListening(false);
    mediaRecorderRef.current.stop();
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
  }

  async function sendAudioToBackend(file) {
    const tempUserMsg = { id: Date.now(), from: 'user', text: 'Голосовое сообщение...' };
    setMessages(m => [...m, tempUserMsg]);
    setIsGenerating(true);
    const generatingMsgId = Date.now() + 1;
    setMessages(m => [...m, { id: generatingMsgId, from: 'assistant', text: 'Думает...', isGenerating: true }]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/transcribe`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const { transcribed, response: aiResponse } = response.data;

      setMessages(m => m.map(msg => msg.id === tempUserMsg.id ? { ...msg, text: transcribed } : msg));
      setMessages(m => m.filter(msg => msg.id !== generatingMsgId));
      const assistantMsg = { id: Date.now(), from: 'assistant', text: aiResponse };
      setMessages(m => [...m, assistantMsg]);
    } catch (error) {
      console.error('Ошибка отправки аудио:', error);
      alert('Не удалось отправить аудио на сервер.');
      setMessages(m => m.filter(msg => msg.id !== tempUserMsg.id && msg.id !== generatingMsgId));
    } finally {
      setIsGenerating(false);
    }
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');

    setIsGenerating(true);
    const generatingMsgId = Date.now() + 1;
    setMessages(m => [...m, { id: generatingMsgId, from: 'assistant', text: 'Думает...', isGenerating: true }]);

    const chatMessages = messages.map(m => ({ role: m.from, content: m.text }));
    chatMessages.push({ role: 'user', content: input });

    try {
      const response = await axios.post(`${BACKEND_URL}/chat`, {
        messages: chatMessages,
        user_id: userId
      });
      const aiResponse = response.data.response;

      setMessages(m => m.filter(msg => msg.id !== generatingMsgId));
      const assistantMsg = { id: Date.now(), from: 'assistant', text: aiResponse };
      setMessages(m => [...m, assistantMsg]);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Не удалось получить ответ от сервера.');
      setMessages(m => m.filter(msg => msg.id !== generatingMsgId));
    } finally {
      setIsGenerating(false);
    }
  }

  function handleAuthSubmit(e) {
    e.preventDefault();
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
    setUserId(username || 'test_user');
    setIsLoggedIn(true);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function toggleAuthMode() {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md p-6 rounded-2xl shadow-md bg-surface">
          <div className="flex justify-center mb-6">
            <img src={logoImage} alt="Логотип Zaman" className="w-14 h-14 rounded-xl object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-text">
            {authMode === 'login' ? 'Вход в Zaman AI Bank' : 'Регистрация в Zaman AI Bank'}
          </h2>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none text-base"
              required
              minLength={1}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none text-base"
                required
                minLength={5}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center pr-3 text-text-muted"
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
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none text-base"
                  required
                  minLength={5}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center pr-3 text-text-muted"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-medium bg-primary"
            >
              {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-text-muted">
            {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={toggleAuthMode} className="text-primary hover:underline">
              {authMode === 'login' ? 'Регистрация' : 'Вход'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 shadow-sm bg-surface">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="Логотип Zaman" className="w-12 h-12 rounded-xl object-cover" />
          <div>
            <div className="text-lg font-semibold text-text">Zaman AI Bank</div>
            <div className="text-xs text-text-muted">Голосовой & текстовый ассистент</div>
          </div>
        </div>
        <nav className="hidden md:flex gap-4 items-center">
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow text-text">Продукты</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow text-text">Цели</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow text-text">Аналитика</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Dream / Goals */}
        <section className="space-y-4">
          <div className="rounded-2xl p-5 shadow-sm border bg-surface">
            <h3 className="text-base font-semibold text-text">Визуализатор мечты</h3>
            <p className="text-text-muted mt-1 text-sm">Проследите путь к вашей цели</p>
            <div className="mt-4 bg-gradient-to-r from-primary to-secondary rounded-xl p-4 text-white">
              <h4 className="font-semibold text-base">Квартира в 5 лет</h4>
              <div className="mt-2 text-sm">Нужно: 15 000 000 ₸</div>
              <div className="mt-3 bg-white/30 rounded-full h-3 w-full">
                <div className="h-3 rounded-full bg-white/90 w-[32%]"></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg border text-sm">Редактировать цель</button>
              <button className="py-2 rounded-lg text-white text-sm bg-primary">Планировать автоматически</button>
            </div>
          </div>

          <div className="rounded-2xl p-5 shadow-sm border bg-surface">
            <h3 className="text-base font-semibold text-text">Смена привычек</h3>
            <p className="text-text-muted text-sm">Небольшие шаги, которые экономят 10-20% в месяц</p>
            <ul className="mt-3 list-disc list-inside text-sm space-y-2 text-text">
              <li>Отписаться от ненужных подписок</li>
              <li>Установить недельный лимит на развлечения</li>
              <li>Автосбережения 10% от каждой зарплаты</li>
            </ul>
          </div>
        </section>

        {/* Center: Chat */}
        <section className="flex flex-col gap-4 min-h-[400px]">
          <div className="rounded-2xl p-4 shadow-sm flex-1 flex flex-col bg-gradient-to-b from-surface to-secondary/5">
            <div ref={chatRef} className="flex-1 overflow-auto p-2">
              {messages.map(m => (
                <div key={m.id} className={`mb-3 max-w-[85%] ${m.from === 'user' ? 'ml-auto text-right' : 'mr-auto text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl shadow-sm ${m.from === 'user' ? 'bg-primary/10' : 'bg-white'} ${m.isGenerating ? 'animate-pulse text-text-muted' : ''}`}>
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input 
                ref={inputRef} 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder="Напишите сообщение или нажмите микрофон" 
                className="flex-1 px-4 py-3 rounded-xl border focus:outline-none text-sm" 
                disabled={isGenerating}
              />
              <button
                onPointerDown={startRecording}
                onPointerUp={stopRecording}
                onPointerCancel={stopRecording}
                className={`p-3 rounded-lg border ${listening ? 'animate-pulse bg-secondary' : 'bg-white'}`}
                style={{ touchAction: 'none' }}
                disabled={isGenerating}
              >
                <FiMic className="w-5 h-5 text-primary" />
              </button>
              <button 
                onClick={sendMessage} 
                className="px-4 py-3 rounded-lg text-white text-sm bg-primary disabled:opacity-50" 
                disabled={isGenerating || !input.trim()}
              >
                Отправить
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border bg-surface">
            <h4 className="text-base font-semibold text-text">Рекомендации</h4>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg border text-sm text-text">Депозит "Надёжный" — доходность 8% годовых</div>
              <div className="p-3 rounded-lg border text-sm text-text">План "Обучение" — автоматическое откладывание 20 000 ₸</div>
            </div>
          </div>
        </section>

        {/* Right: Analytics */}
        <aside className="space-y-4">
          <div className="rounded-2xl p-4 shadow-sm border bg-surface">
            <h4 className="text-base font-semibold text-text">Аналитика расходов</h4>
            <p className="text-text-muted text-sm">Последние 30 дней</p>
            <div className="mt-3 h-36 rounded-lg p-3 flex items-center justify-center border-dashed border-text-muted text-text-muted">График</div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border bg-surface">
            <h4 className="text-base font-semibold text-text">Подобранные продукты</h4>
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-lg border text-sm text-text">Ипотека + накопительный счёт</div>
              <div className="p-3 rounded-lg border text-sm text-text">Сберегательный вклад (исламский)</div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="p-4 text-center text-xs text-text-muted bg-surface">
        Прототип UI — Zaman Bank AI Assistant
      </footer>
    </div>
  );
}