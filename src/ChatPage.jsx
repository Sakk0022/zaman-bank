import React from 'react';
import { FiTarget, FiPieChart, FiBarChart2, FiZap, FiClock, FiStar, FiPlus, FiMic, FiSend } from 'react-icons/fi';

export default function ChatPage({
  messages,
  input,
  listening,
  isTyping,
  setInput,
  sendMessage,
  handleKeyDown,
  toggleListen,
  askQuick,
  logoImage
}) {
  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="Zaman" className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow" />
            <div>
              <div className="text-base sm:text-lg font-semibold">Zaman AI Bank</div>
              <div className="text-[11px] text-gray-500 -mt-0.5">Голосовой & текстовый ассистент</div>
            </div>
          </div>

          {/* табы-пилюли */}
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

      {/* MAIN */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: Goals & Habits */}
          <section className="space-y-5">
            {/* Dream progress */}
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

              {/* мини-виджеты */}
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

            {/* Habits */}
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
                  <button key={c} onClick={() => askQuick(c)} className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-white/90 transition">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CENTER: Chat */}
          <section className="flex flex-col gap-5">
            <div className="rounded-3xl p-4 sm:p-5 border bg-white/70 backdrop-blur shadow-sm flex-1 flex flex-col"
                 style={{ backgroundImage: 'linear-gradient(180deg,#FFFFFFAA,#F5FFEACC)' }}>
              {/* messages */}
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

              {/* composer */}
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
                  className="px-4 py-3 rounded-xl text-sm text-white shadow-md hover:shadow-lg flex items-center gap-2"
                  style={{ background: '#2D9A86' }}
                >
                  <FiSend className="w-4 h-4" /> Отправить
                </button>
              </div>
            </div>

            {/* рекомендации */}
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

          {/* RIGHT: Analytics & Products */}
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
                onClick={() => askQuick('Сравни ипотеку и накопительный счёт')}
                className="mt-3 w-full py-2 rounded-xl text-xs sm:text-sm text-white shadow-md hover:shadow"
                style={{ background: '#2D9A86' }}
              >
                Сравнить варианты
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* нижняя док-панель */}
      <div className="sticky bottom-3 mx-auto w-full max-w-4xl px-2 sm:px-4">
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

      <footer className="px-2 sm:px-4 py-4 text-center text-[11px] text-gray-500">
        Прототип UI — Zaman Bank AI Assistant
      </footer>
    </>
  );
}