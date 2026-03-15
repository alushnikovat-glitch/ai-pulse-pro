import { useState } from "react";

const TEXT_TYPES = [
  { id: "post",     label: "📱 Пост / Мотивация",   desc: "Instagram, Telegram, VK",      styles: ["Живой / Кухонный", "Через личную историю", "Через боль и инсайт"] },
  { id: "sales",    label: "💰 Оффер / УТП",         desc: "Продающий текст, лендинг",     styles: ["Прямой и честный", "Через страх и решение", "Через результат клиента"] },
  { id: "reels",    label: "🎬 Reels / Видео",       desc: "Сценарий с хуком и CTA",       styles: ["Провокационный хук", "Сторителлинг", "Список / Инструкция"] },
  { id: "promo",    label: "🔥 Прогрев / Сторис",    desc: "Серия дней, воронка",          styles: ["Уязвимость + Экспертность", "День за днём к офферу", "Через ценности и смыслы"] },
  { id: "threads",  label: "🧵 Threads",             desc: "Цепочка постов с вовлечением", styles: ["Провокационный старт", "Через личную историю", "Список / Инсайты"] },
  { id: "plan",     label: "📅 Контент-план",        desc: "План публикаций на месяц",     styles: ["По болям аудитории", "По воронке продаж", "Микс форматов"] },
  { id: "niche",    label: "🔍 Анализ ниши",         desc: "Темы, боли, контент-план",     styles: ["Стратегический разбор", "Через боли аудитории", "Вирусные форматы"] },
  { id: "bio",      label: "✨ Шапка профиля",        desc: "Bio для Instagram / Telegram", styles: ["Чёткая и конкретная", "С характером и голосом", "Через результат клиента"] },
  { id: "strategy", label: "📈 Стратегия блога",     desc: "С чего начать и как расти",    styles: ["Пошаговый план", "Через точку А в точку Б", "Быстрый старт с результатом"] },
];

const LENGTHS = ["Короткий (до 100 слов)", "Средний (100–250 слов)", "Длинный (250+ слов)"];
const NO_LENGTH = ["niche", "strategy", "bio", "plan", "promo", "threads"];

const MOTIVATIONS = [
  "Уже думаю над смыслами… 🧠",
  "Ищу правильные слова… ✍️",
  "Чувствую твою аудиторию… 👥",
  "Выстраиваю структуру… 📐",
  "Добавляю живость и душу… 💜",
  "Убираю всю воду… 🧹",
  "Почти готово, дошлифовываю… ✨",
  "Последний штрих — и всё! 🎯",
];

function buildPrompt(typeId, style) {
  const base =
    "Ты — AI Pulse PRO. Маркетолог с опытом 20+ лет и глубоким пониманием русского менталитета.\n\n" +
    "Ты знаешь:\n" +
    "- Русский человек не верит громким обещаниям — нужна честность и конкретика\n" +
    "- Доверие строится через уязвимость, а не через регалии\n" +
    "- Живой текст продаёт лучше правильного\n" +
    "- Боль надо называть своими именами\n" +
    "- Цифры и сроки снижают тревогу\n\n" +
    "СТИЛЬ: " + style + "\n\n" +
    "ПРАВИЛА:\n" +
    "- Никаких звёздочек и markdown-разметки\n" +
    "- Никаких клише: уникальный, комплексный подход — в мусор\n" +
    "- Короткие и длинные фразы вперемешку. Паузы. Многоточия\n" +
    "- Пиши как человек который понимает проблему изнутри\n";

  const map = {
    post:
      "\nСТРУКТУРА ПОСТА:\n" +
      "1. ХУК — 1-2 строки которые останавливают скролл\n" +
      "2. ИСТОРИЯ / БОЛЬ — личная ситуация или узнаваемая проблема\n" +
      "3. ИНСАЙТ — неожиданный поворот или вывод\n" +
      "4. ПОЛЬЗА — конкретный совет или шаг\n" +
      "5. МЯГКИЙ CTA — вопрос к аудитории без давления\n",
    sales:
      "\nСТРУКТУРА ОФФЕРА:\n" +
      "1. КОМУ — точный портрет человека в его ситуации\n" +
      "2. БОЛЬ — острая проблема своими словами без смягчений\n" +
      "3. РЕЗУЛЬТАТ — что конкретно получит в измеримых словах\n" +
      "4. МЕТОД — как работает, в чём уникальность\n" +
      "5. СРОКИ — когда будет результат\n" +
      "6. CTA — конкретный следующий шаг без давления\n",
    reels:
      "\nСЦЕНАРИЙ REELS:\n" +
      "0-3 сек: ХУК — провокация, боль или обещание\n" +
      "3-10 сек: ПРОБЛЕМА — раскрываешь боль\n" +
      "10-25 сек: РЕШЕНИЕ — 3 шага или одна сильная идея\n" +
      "25-30 сек: CTA — что сделать прямо сейчас\n" +
      "Пиши как сценарий: что говорить, что показывать, текст на экране\n",
    promo:
      "\nСЕРИЯ ПРОГРЕВА НА 6 ДНЕЙ:\n" +
      "День 1: Контекст — кто ты, через историю без регалий\n" +
      "День 2: Боль — понимаешь проблему изнутри\n" +
      "День 3: Уязвимость — личная история провала, строит доверие\n" +
      "День 4: Ценности — во что веришь, как смотришь на мир\n" +
      "День 5: Решение — продукт через результат или кейс\n" +
      "День 6: Оффер — мягкое закрытие с ограничением\n" +
      "Каждый день заканчивается вопросом или интригой\n",
    threads:
      "\nЦЕПОЧКА ДЛЯ THREADS:\n" +
      "Пост 1 (хук): провокация или неожиданное утверждение\n" +
      "Посты 2-4: раскрываешь идею по шагам, каждый заканчивается интригой\n" +
      "Пост 5: инсайт или неожиданный поворот\n" +
      "Пост 6 (финал): вывод + мягкий CTA\n" +
      "Каждый пост до 500 символов, читается отдельно но тянет к следующему\n",
    plan:
      "\nКОНТЕНТ-ПЛАН НА МЕСЯЦ:\n" +
      "30 постов: день / формат / тема / суть в одном предложении\n" +
      "Соотношение: 40% польза, 30% личное и доверие, 20% продажи, 10% вовлечение\n" +
      "Форматы чередуй: пост, Reels, сторис, карусель\n" +
      "Темы ведут по воронке: знакомство — доверие — желание — покупка\n",
    niche:
      "\nАНАЛИЗ НИШИ:\n" +
      "Портрет аудитории — кто, что тревожит, о чём мечтают\n" +
      "Топ-10 вирусных тем с объяснением почему зайдут\n" +
      "Боли и страхи — явные и глубокие\n" +
      "Контент-план на 2 недели — тема, формат, суть\n" +
      "5 идей для Reels с хуком\n" +
      "Позиционирование — как выделиться среди конкурентов\n",
    bio:
      "\nШАПКА ПРОФИЛЯ INSTAGRAM:\n" +
      "Строго до 150 символов включая эмодзи\n" +
      "Никаких заголовков — только живой текст\n" +
      "Дай 3 варианта пронумерованных\n" +
      "В каждом: кто ты + что даёшь + призыв к действию\n" +
      "Только конкретика\n",
    strategy:
      "\nСТРАТЕГИЯ БЛОГА:\n" +
      "Диагностика точки А — где человек сейчас\n" +
      "Точка Б — что хочет через 3-6 месяцев\n" +
      "Фундамент — позиционирование, голос, отличие\n" +
      "Контент-система на 30 дней\n" +
      "5 первых шагов с гарантированным результатом\n" +
      "Топ-3 ошибки которые тормозят рост\n" +
      "Метрики победы через 30/60/90 дней\n",
  };

  return base + (map[typeId] || "") +
    "\nЗАВЕРШЕНИЕ: Мягко заверши и задай один вопрос — откликается ли результат.\n" +
    "Пиши только на русском языке.";
}

const clean = (t) => t.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

function Spinner() {
  const [idx, setIdx] = useState(0);
  useState(() => {
    const timer = setInterval(() => setIdx(i => (i + 1) % MOTIVATIONS.length), 1800);
    return () => clearInterval(timer);
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:32, gap:16 }}>
      <div style={{ width:40, height:40, border:"3px solid #e2d9f3", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
      <div style={{ color:"#7c3aed", fontSize:14, fontWeight:600, textAlign:"center" }}>{MOTIVATIONS[idx]}</div>
      <div style={{ color:"#c4b5fd", fontSize:12 }}>Осталось совсем немного…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("main");
  const [type, setType] = useState(null);
  const [style, setStyle] = useState("");
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState(LENGTHS[0]);
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [chat, setChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const pickType = (t) => { setType(t); setStyle(t.styles[0]); };

  const generate = async () => {
    if (!type || !topic.trim()) return;
    setLoading(true); setScreen("result"); setResult(""); setChat([]);
    const lenMap = ["короткий текст до 100 слов", "текст 100–250 слов", "длинный текст 250+ слов"];
    let q = "";
    if (type.id === "niche") q = "Проведи полный анализ ниши: " + topic + "." + (extra ? "\n" + extra : "");
    else if (type.id === "strategy") q = "Разработай стратегию блога для: " + topic + "." + (extra ? "\n" + extra : "");
    else if (type.id === "plan") q = "Составь контент-план на месяц для ниши: " + topic + "." + (extra ? "\n" + extra : "");
    else if (type.id === "promo") q = "Напиши серию прогрева на 6 дней для: " + topic + "." + (extra ? "\n" + extra : "");
    else if (type.id === "threads") q = "Напиши цепочку из 6 постов для Threads на тему: " + topic + "." + (extra ? "\n" + extra : "");
    else q = "Напиши " + type.label + " на тему: " + topic + ".\nДлина: " + lenMap[LENGTHS.indexOf(length)] + ".\n" + (extra ? extra : "");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: buildPrompt(type.id, style),
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      setResult(clean(data.content?.map(b => b.text || "").join("") || "Ошибка генерации."));
    } catch (e) { setResult("__error__"); }
    setLoading(false);
  };

  const send = async () => {
    if (!followUp.trim() || chatLoading) return;
    const msg = followUp.trim(); setFollowUp("");
    const hist = [...chat, { role: "user", content: msg }];
    setChat(hist); setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: buildPrompt(type.id, style),
          messages: [
            { role: "user", content: "Ты уже написал:\n\n" + result },
            { role: "assistant", content: result },
            ...hist
          ]
        })
      });
      const data = await res.json();
      setChat([...hist, { role: "assistant", content: clean(data.content?.map(b => b.text || "").join("") || "Ошибка.") }]);
    } catch (e) { setChat([...hist, { role: "assistant", content: "Ошибка соединения." }]); }
    setChatLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setType(null); setStyle(""); setTopic(""); setExtra(""); setResult(""); setChat([]); setFollowUp(""); setScreen("main"); };

  const s = {
    wrap: { minHeight:"100vh", background:"linear-gradient(135deg,#f5f0ff 0%,#fdf2f8 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", padding:16 },
    card: { background:"#fff", borderRadius:20, padding:28, maxWidth:540, width:"100%", boxShadow:"0 8px 40px rgba(124,58,237,.12)" },
    title: { fontSize:24, fontWeight:700, color:"#1a1a2e", marginBottom:4 },
    sub: { color:"#6b7280", fontSize:13, marginBottom:24 },
    lbl: { fontSize:12, fontWeight:600, color:"#374151", marginBottom:6, display:"block", textTransform:"uppercase", letterSpacing:".04em" },
    inp: { width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box" },
    ta: { width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, outline:"none", boxSizing:"border-box", resize:"vertical", minHeight:68, fontFamily:"inherit" },
    btn: { width:"100%", padding:13, background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:600, cursor:"pointer", marginTop:8 },
    btnS: { width:"100%", padding:11, background:"#f3f4f6", color:"#374151", border:"none", borderRadius:12, fontSize:14, fontWeight:500, cursor:"pointer", marginTop:8 },
    sel: { width:"100%", padding:"11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, background:"#fff", outline:"none", boxSizing:"border-box" },
    box: { background:"#f9fafb", border:"1.5px solid #e5e7eb", borderRadius:14, padding:18, fontSize:14, lineHeight:1.8, color:"#1f2937", whiteSpace:"pre-wrap", minHeight:140 },
    chip: { display:"inline-block", background:"#ede9fe", color:"#6d28d9", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600, marginBottom:14 },
    badge: { display:"inline-flex", alignItems:"center", gap:6, background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#15803d", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600, marginBottom:18 },
  };

  const tLabel = ["niche","plan"].includes(type?.id) ? "Ниша / тема бизнеса *" : type?.id === "strategy" ? "Ниша / тема блога *" : "Тема / о чём *";
  const tPlaceholder = ["niche","plan"].includes(type?.id) ? "Например: нутрициология, психология…" : type?.id === "strategy" ? "Например: блог психолога, коуч по деньгам…" : "Например: курс по инвестициям для мам…";
  const btnLabel = type?.id === "niche" ? "🔍 Запустить анализ" : type?.id === "strategy" ? "📈 Построить стратегию" : type?.id === "plan" ? "📅 Составить план" : "✨ Написать текст";
  const titleText = loading ? "Генерируем..." : type?.id === "niche" ? "Анализ готов" : type?.id === "strategy" ? "Стратегия готова" : type?.id === "plan" ? "Контент-план готов" : "Твой текст готов";
  const subText = type?.id === "niche" ? "Стратегический разбор ниши 🔍" : type?.id === "strategy" ? "Персональная стратегия блога 📈" : type?.id === "plan" ? "Контент-план на месяц 📅" : "Написано с пониманием русского менталитета 🧠";

  if (screen === "main") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.badge}>✦ AI Pulse PRO активирован</div>
      <div style={s.title}>Создать текст</div>
      <div style={s.sub}>Выбери формат — напишу с душой и пониманием аудитории</div>
      <label style={s.lbl}>Формат</label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 }}>
        {TEXT_TYPES.map(t => (
          <div key={t.id} onClick={() => pickType(t)} style={{
            border: type?.id === t.id ? "2px solid #7c3aed" : "2px solid #e5e7eb",
            borderRadius:12, padding:"10px 12px", cursor:"pointer",
            background: type?.id === t.id ? "#f5f0ff" : "#fff", transition:"all .15s"
          }}>
            <div style={{ fontWeight:600, fontSize:14, color:"#1a1a2e" }}>{t.label}</div>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{t.desc}</div>
          </div>
        ))}
      </div>
      {type && (
        <div style={{ marginBottom:16 }}>
          <label style={s.lbl}>Стиль подачи</label>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {type.styles.map(st => (
              <div key={st} onClick={() => setStyle(st)} style={{
                padding:"7px 14px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:500,
                border: style === st ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                background: style === st ? "#ede9fe" : "#f9fafb",
                color: style === st ? "#6d28d9" : "#374151", transition:"all .15s"
              }}>{st}</div>
            ))}
          </div>
        </div>
      )}
      <label style={s.lbl}>{tLabel}</label>
      <input style={s.inp} placeholder={tPlaceholder} value={topic} onChange={e => setTopic(e.target.value)} />
      {!NO_LENGTH.includes(type?.id) && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Длина</label>
          <select style={s.sel} value={length} onChange={e => setLength(e.target.value)}>
            {LENGTHS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      )}
      <div style={{ marginTop:14 }}>
        <label style={s.lbl}>Контекст (необязательно)</label>
        <textarea style={s.ta} placeholder="ЦА, боли, УТП, ключевые смыслы…" value={extra} onChange={e => setExtra(e.target.value)} />
      </div>
      <button style={{ ...s.btn, marginTop:20, opacity:(!type || !topic.trim()) ? 0.5 : 1 }}
        onClick={generate} disabled={!type || !topic.trim()}>
        {btnLabel}
      </button>
    </div></div>
  );

  if (screen === "result") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.chip}>{type?.label} · {style}</div>
      <div style={s.title}>{titleText}</div>
      <div style={s.sub}>{subText}</div>
      {loading ? <Spinner /> : result === "__error__" ? (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>😔</div>
          <div style={{ fontWeight:600, fontSize:16, color:"#1a1a2e", marginBottom:8 }}>Что-то пошло не так</div>
          <div style={{ fontSize:13, color:"#6b7280", marginBottom:24, lineHeight:1.6 }}>Попробуй ещё раз.</div>
          <button style={{ ...s.btn, marginTop:0 }} onClick={() => { setResult(""); setScreen("main"); }}>🔄 Попробовать снова</button>
        </div>
      ) : (
        <>
          <div style={{ ...s.box, fontSize:NO_LENGTH.includes(type?.id) ? 13 : 14 }}>{result}</div>
          <button style={s.btn} onClick={copy}>{copied ? "✅ Скопировано!" : "📋 Скопировать"}</button>
        </>
      )}
      {!loading && result && result !== "__error__" && (
        <div style={{ marginTop:20 }}>
          <div style={{ borderTop:"1px solid #e5e7eb", marginBottom:14 }} />
          {chat.map((m, i) => (
            <div key={i} style={{ marginBottom:10, display:"flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth:"85%", padding:"10px 14px", borderRadius:14, fontSize:13, lineHeight:1.7, whiteSpace:"pre-wrap",
                background: m.role === "user" ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#1f2937",
                borderBottomRightRadius: m.role === "user" ? 4 : 14,
                borderBottomLeftRadius: m.role === "user" ? 14 : 4,
              }}>{m.content}</div>
            </div>
          ))}
          {chatLoading && <Spinner />}
          <div style={{ display:"flex", gap:8, marginTop:8 }}>
            <input style={{ ...s.inp, flex:1, fontSize:13 }}
              placeholder="Хочу мягче / добавь CTA / переделай хук…"
              value={followUp} onChange={e => setFollowUp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()} />
            <button onClick={send} disabled={!followUp.trim() || chatLoading} style={{
              padding:"0 16px", background:"linear-gradient(135deg,#7c3aed,#a855f7)",
              color:"#fff", border:"none", borderRadius:10, fontWeight:700,
              cursor:"pointer", fontSize:17, opacity:(!followUp.trim() || chatLoading) ? 0.5 : 1
            }}>↑</button>
          </div>
        </div>
      )}
      <button style={s.btnS} onClick={reset}>← Написать ещё один текст</button>
    </div></div>
  );
}
