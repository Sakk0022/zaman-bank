import React from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

export default function LandingPage({ setIsLoggedIn, setShowAuth, setAuthMode, logoImage }) {
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

      {/* HERO */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 md:py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: headline */}
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
              — ваш халяль-навига́тор по финансам
            </h1>

            <p className="mt-3 text-sm md:text-base opacity-80">
              Вместо сложного банка — диалог. Ставим цели, меняем привычки, подбираем халяль-решения и ведём к результату.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-4 py-3 rounded-full text-sm text-[#0b0b0b] shadow-md hover:shadow-lg transition"
                style={{ background: 'linear-gradient(90deg,#B9F754, #EEFE6D)' }}
              >
                ▶ Начать разговор
              </button>
              <button
                onClick={() => { setShowAuth(true); setAuthMode('register'); }}
                className="px-4 py-3 rounded-full text-sm bg-white border border-black/10 shadow-sm"
              >
                Оформить онлайн
              </button>
            </div>

            <div className="mt-4">
              <button className="px-3 py-1 rounded-full border bg-white text-xs">RU / KZ / EN</button>
            </div>
          </div>

          {/* Right: gradient card mock */}
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

            {/* Mini chat bubble */}
            <div className="mt-4 flex items-start gap-2 max-w-sm ml-auto">
              <img src={logoImage} className="w-7 h-7 rounded-xl object-cover" alt="bot" />
              <div className="bg-white border border-black/10 rounded-2xl p-3 shadow-sm text-sm">
                Привет! Я Zaman AI — помогу с целями, расходами и халяль-продуктами.{' '}
                <span className="opacity-60">Спросите: «Подбери халяль вклад»</span>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 pb-6">
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
    </>
  );
}