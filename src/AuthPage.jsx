import React from 'react';
import { FiEye, FiEyeOff, FiSearch, FiChevronDown } from 'react-icons/fi';

export default function AuthPage({
  authMode,
  username,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  setUsername,
  setPassword,
  setConfirmPassword,
  setShowPassword,
  setShowConfirmPassword,
  handleAuthSubmit,
  toggleAuthMode,
  setShowAuth,
  setAuthMode, // Added to props
  logoImage
}) {
  return (
    <>
      {/* TOP NAV */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 flex items-center gap-3">
          {/* Logo + search pill */}
          <div className="flex items-center gap-3 flex-1">
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
          </div>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-5 text-sm">
            <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Частным клиентам <FiChevronDown /></button>
            <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Бизнесу <FiChevronDown /></button>
            <button className="flex items-center gap-1 opacity-80 hover:opacity-100">Исламские финансы <FiChevronDown /></button>
            <button className="flex items-center gap-1 opacity-80 hover:opacity-100">О банке <FiChevronDown /></button>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowAuth(true); setAuthMode('register'); }}
              className="hidden sm:inline px-4 py-2 rounded-full bg-white border border-black/10 text-sm shadow-sm"
            >
              Приложение
            </button>
            <button
              onClick={() => { setShowAuth(true); setAuthMode('register'); }}
              className="px-4 py-2 rounded-full text-sm text-white shadow-md"
              style={{ background: 'linear-gradient(90deg,#2D9A86, #B9F754)' }}
            >
              Оформить карту
            </button>
          </div>
        </div>
      </header>

      {/* AUTH PANEL */}
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-10 flex-1 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur border border-black/10 rounded-3xl shadow-lg p-6 md:p-8 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">
            {authMode === 'login' ? 'Вход в Zaman AI Bank' : 'Регистрация в Zaman AI Bank'}
          </h3>
          <form onSubmit={handleAuthSubmit} className="grid gap-3">
            <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="px-4 py-3 rounded-xl border focus:outline-none text-sm"
              required
              minLength={1}
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none text-sm"
                required
                minLength={5}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {authMode === 'register' && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Подтвердите пароль"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none text-sm"
                  required
                  minLength={5}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <button type="submit" className="px-5 py-3 rounded-xl text-white text-sm shadow-md" style={{ background: '#2D9A86' }}>
                {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
              <button type="button" onClick={toggleAuthMode} className="px-5 py-3 rounded-xl bg-white border border-black/10 text-sm">
                {authMode === 'login' ? 'Я новый клиент' : 'У меня есть аккаунт'}
              </button>
            </div>
            <button type="button" onClick={() => setShowAuth(false)} className="px-5 py-3 rounded-xl bg-white border border-black/10 text-sm mt-2">
              Закрыть
            </button>
          </form>
        </div>
      </div>
    </>
  );
}