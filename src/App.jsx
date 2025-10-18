import React, {useState,  useRef} from 'react';

// Zaman color tokens
// Persian Green: #2D9A86
// Solar: #EEFE6D
// Cloud: white

export default function ZamanAIPrototype(){
  const [messages, setMessages] = useState([
    {id:1, from:'assistant', text:'Привет! Я — помощник Zaman. Чем могу помочь сегодня?'}
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const inputRef = useRef();

  function sendMessage(){
    if(!input.trim()) return;
    const userMsg = {id:Date.now(), from:'user', text: input};
    setMessages(m=>[...m, userMsg]);
    setInput('');
    // placeholder reply logic
    setTimeout(()=>{
      setMessages(m=>[...m, {id:Date.now()+1, from:'assistant', text: 'Отлично! Давай разберём цель: "Квартира". Сколько вы планируете отложить в месяц?'}]);
    }, 700);
  }

  // Minimal pseudo-voice handler (UI-only). Real implementation should use Web Speech / backend Whisper.
  function toggleListen(){
    setListening(l => !l);
    if(!listening){
      // start pseudo-recognition
      setTimeout(()=>{
        const voiceMsg = {id:Date.now()+2, from:'user', text: 'Хочу копить на квартиру, 50000 тенге в месяц'};
        setMessages(m=>[...m, voiceMsg]);
        setMessages(m=>[...m, {id:Date.now()+3, from:'assistant', text: 'Понял. Составлю план на 5 лет и подберу подходящие продукты.'}]);
        setListening(false);
      }, 1600);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white flex flex-col" style={{fontFamily:'Inter, ui-sans-serif, system-ui'}}>
      <header className="flex items-center justify-between px-6 py-4 shadow-sm" style={{background:'#ffffff'}}>
        <div className="flex items-center gap-3">
          <div style={{width:44,height:44,background:'#2D9A86',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700}}>Z</div>
          <div>
            <div className="text-lg font-semibold">Zaman AI Bank</div>
            <div className="text-xs text-gray-500">Голосовой & текстовый ассистент</div>
          </div>
        </div>
        <nav className="flex gap-4 items-center">
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Продукты</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Цели</button>
          <button className="px-3 py-2 rounded-lg font-medium hover:shadow">Аналитика</button>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left: Dream / Goals */}
        <section className="col-span-1 lg:col-span-1 space-y-4">
          <div className="rounded-2xl p-5 shadow-sm border" style={{background:'#ffffff'}}>
            <h3 className="text-sm font-semibold">Визуализатор мечты</h3>
            <p className="text-xs text-gray-500 mt-1">Проследите путь к вашей цели — квартите, путешествию или обучению.</p>
            <div className="mt-4 bg-gradient-to-r from-[#2D9A86] to-[#EEFE6D] rounded-xl p-4 text-white">
              <h4 className="font-semibold">Квартира в 5 лет</h4>
              <div className="mt-2 text-sm">Нужно: 15 000 000 ₸</div>
              <div className="mt-3 bg-white/30 rounded-full h-3 w-full">
                <div style={{width:'32%'}} className="h-3 rounded-full bg-white/90"></div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="py-2 rounded-lg border">Редактировать цель</button>
              <button className="py-2 rounded-lg" style={{background:'#2D9A86',color:'#fff'}}>Планировать автоматически</button>
            </div>
          </div>

          <div className="rounded-2xl p-5 shadow-sm border" style={{background:'#fff'}}>
            <h3 className="text-sm font-semibold">Смена привычек</h3>
            <p className="text-xs text-gray-500">Небольшие шаги, которые экономят 10-20% в месяц.</p>
            <ul className="mt-3 list-disc list-inside text-sm space-y-2">
              <li>Отписаться от ненужных подписок</li>
              <li>Установить недельный лимит на развлечения</li>
              <li>Автосбережения 10% от каждой зарплаты</li>
            </ul>
          </div>
        </section>

        {/* Center: Chat / Assistant */}
        <section className="col-span-1 lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl p-4 shadow-sm flex-1 flex flex-col" style={{background:'linear-gradient(180deg,#FFFFFF, #F7FFF0)'}}>
            <div className="flex-1 overflow-auto p-2" style={{maxHeight: '55vh'}}>
              {messages.map(m=> (
                <div key={m.id} className={`mb-3 max-w-[85%] ${m.from==='user'? 'ml-auto text-right':'mr-auto text-left'}`}>
                  <div className={`inline-block px-4 py-2 rounded-xl ${m.from==='user'? 'bg-[#2D9A86]/10':'bg-white'} shadow-sm`}> 
                    <div className="text-sm">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="Напишите сообщение или нажмите микрофон" className="flex-1 px-4 py-3 rounded-xl border focus:outline-none" />
              <button onClick={toggleListen} title="Голосовой ввод" className={`p-3 rounded-lg border ${listening? 'animate-pulse':''}`} style={{background: listening? '#EEFE6D':'#fff'}}>
                🎤
              </button>
              <button onClick={sendMessage} className="px-4 py-3 rounded-lg" style={{background:'#2D9A86',color:'#fff'}}>Отправить</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border" style={{background:'#fff'}}>
            <h4 className="text-sm font-semibold">Рекомендации</h4>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg border">Депозит "Надёжный" — доходность 8% годовых</div>
              <div className="p-3 rounded-lg border">План "Обучение" — автоматическое откладывание 20 000 ₸</div>
            </div>
          </div>
        </section>

        {/* Right: Analytics / Products */}
        <aside className="col-span-1 lg:col-span-1 space-y-4">
          <div className="rounded-2xl p-4 shadow-sm border" style={{background:'#fff'}}>
            <h4 className="text-sm font-semibold">Аналитика расходов</h4>
            <p className="text-xs text-gray-500">Последние 30 дней</p>
            <div className="mt-3 h-36 rounded-lg p-3 flex items-center justify-center border-dashed">График (placeholder)</div>
          </div>

          <div className="rounded-2xl p-4 shadow-sm border" style={{background:'#fff'}}>
            <h4 className="text-sm font-semibold">Подобранные продукты</h4>
            <div className="mt-3 space-y-2">
              <div className="p-3 rounded-lg border">Ипотека + накопительный счёт</div>
              <div className="p-3 rounded-lg border">Сберегательный вклад (исламский)</div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="p-4 text-center text-xs text-gray-500">Прототип UI — Zaman Bank AI Assistant</footer>
    </div>
  );
}
