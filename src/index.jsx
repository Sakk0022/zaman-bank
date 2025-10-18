import React, { useState } from 'react';
import AuthPage from './AuthPage';
import LandingPage from './LandingPage';
import ChatPage from './ChatPage';
import logoImage from './assets/zamat.jpeg';

export default function ZamanAIPrototype() {
  // --- чат/ассистент ---
  const [messages, setMessages] = useState([
    { id: 1, from: 'assistant', text: 'Привет! Я — помощник Zaman. Чем могу помочь сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // --- аутентификация/лендинг ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [showAuth, setShowAuth] = useState(true);   // панель формы отображается по умолчанию

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // helpers
  function pushUser(text) {
    setMessages(m => [...m, { id: Date.now(), from: 'user', text }]);
  }
  function pushAssistant(text) {
    setMessages(m => [...m, { id: Date.now() + 1, from: 'assistant', text }]);
  }

  // чат
  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    pushUser(text);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      pushAssistant('Отлично! Давай разберём цель: «Квартира». Сколько удобно откладывать ежемесячно?');
      setIsTyping(false);
    }, 700);
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
  function askQuick(q) {
    pushUser(q);
    setIsTyping(true);
    setTimeout(() => {
      pushAssistant('Собираю персональные предложения…');
      setTimeout(() => {
        pushAssistant('Готово! Я добавил идеи в секцию «Рекомендации».');
        setIsTyping(false);
      }, 600);
    }, 300);
  }
  function toggleListen() {
    setListening(l => !l);
    if (!listening) {
      setTimeout(() => {
        setMessages(m => [...m, { id: Date.now() + 2, from: 'user', text: 'Хочу копить на квартиру, 50000 ₸ в месяц' }]);
        setIsTyping(true);
        setTimeout(() => {
          setMessages(m => [...m, { id: Date.now() + 3, from: 'assistant', text: 'Понял. Составлю план на 5 лет и подберу подходящие продукты.' }]);
          setIsTyping(false);
          setListening(false);
        }, 800);
      }, 1200);
    }
  }

  // auth
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
    setIsLoggedIn(true);
    setShowAuth(false);
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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: 'Inter, ui-sans-serif, system-ui',
        background:
          'radial-gradient(1100px 700px at 0% -10%, #EEFE6D22, transparent 60%), radial-gradient(900px 600px at 120% -10%, #2D9A8622, transparent 60%), #F9FFFD'
      }}
    >
      {!isLoggedIn ? (
        showAuth ? (
          <AuthPage
            authMode={authMode}
            username={username}
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            setUsername={setUsername}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
            setShowPassword={setShowPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            handleAuthSubmit={handleAuthSubmit}
            toggleAuthMode={toggleAuthMode}
            setShowAuth={setShowAuth}
            setAuthMode={setAuthMode} // Added setAuthMode to props
            logoImage={logoImage}
          />
        ) : (
          <LandingPage
            setIsLoggedIn={setIsLoggedIn}
            setShowAuth={setShowAuth}
            setAuthMode={setAuthMode}
            logoImage={logoImage}
          />
        )
      ) : (
        <ChatPage
          messages={messages}
          input={input}
          listening={listening}
          isTyping={isTyping}
          setInput={setInput}
          sendMessage={sendMessage}
          handleKeyDown={handleKeyDown}
          toggleListen={toggleListen}
          askQuick={askQuick}
          logoImage={logoImage}
        />
      )}
    </div>
  );
}