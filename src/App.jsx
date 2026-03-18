import { useState } from "react";

const TRIAL_CODES = ["TEST", "test", "тест"];
const PAID_CODES  = ["PRO2026", "PRO2027", "КУПИТЬ007"];
const TRIAL_LIMIT = 5;

function checkCode(raw) {
  const c = raw.trim();
  if (TRIAL_CODES.map(x => x.toUpperCase()).includes(c.toUpperCase())) return { valid: true, type: "trial" };
  if (PAID_CODES.map(x => x.toUpperCase()).includes(c.toUpperCase()))  return { valid: true, type: "paid" };
  return { valid: false };
}

const TEXT_TYPES = [
  { id: "post",     label: "📱 Пост",                    desc: "Instagram / Telegram / VK",       styles: ["Живой / Кухонный", "Через личную историю", "Через боль и инсайт"] },
  { id: "carousel", label: "🎠 Карусель Instagram",      desc: "10 идей + готовые слайды",         styles: ["Разрушение мифа", "Это про меня", "Провокация и споры"] },
  { id: "threads",  label: "🧵 Threads / Живой момент",  desc: "Вирусный пост Instagram",           styles: ["Восторг и удивление", "Я в шоке от результата", "Только что произошло"] },
  { id: "reels",    label: "🎬 Reels / Видео",           desc: "Сценарий с хуком и CTA",            styles: ["Провокационный хук", "Сторителлинг", "Список / Инструкция"] },
  { id: "promo",    label: "🔥 Прогрев / Сторис",        desc: "Серия 6 дней, воронка",             styles: ["Уязвимость + Экспертность", "День за днём к офферу", "Через ценности и смыслы"] },
  { id: "sales",    label: "💰 Оффер / УТП",              desc: "Продающий текст, лендинг",          styles: ["Прямой и честный", "Через страх и решение", "Через результат клиента"] },
  { id: "plan",     label: "📅 Контент-план",             desc: "План публикаций на месяц",          styles: ["По болям аудитории", "По воронке продаж", "Микс форматов"] },
  { id: "niche",    label: "🔍 Анализ ниши",              desc: "Боли, темы, позиционирование",      styles: ["Стратегический разбор", "Через боли аудитории", "Вирусные форматы"] },
  { id: "bio",      label: "✨ Шапка профиля",             desc: "Bio Instagram / Telegram",          styles: ["Чёткая и конкретная", "С характером и голосом", "Через результат клиента"] },
  { id: "strategy", label: "📈 Стратегия блога",          desc: "С чего начать и как расти",         styles: ["Пошаговый план", "Через точку А в точку Б", "Быстрый старт с результатом"] },
];

const LENGTHS = ["Короткий (до 100 слов)", "Средний (100–250 слов)", "Длинный (250+ слов)"];
const NO_LEN = ["niche", "strategy", "bio", "plan", "promo", "threads", "carousel"];

const MOTS = [
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
    "- Пиши как человек который понимает проблему изнутри\n" +
    "- ВАЖНО: никогда не пиши названия блоков в тексте — ни КОМУ, ни БОЛЬ, ни РЕЗУЛЬТАТ, ни МЕТОД, ни СРОКИ, ни ХУК, ни CTA, ни ДЕНЬ 1. Только живой текст без меток.\n";

  const map = {
    post:
      "\nТЫ ПИШЕШЬ: пост для соцсетей\n" +
      "Адаптируй под платформу: Instagram — короче, больше воздуха, до 150 слов. Telegram — глубже, экспертнее, до 300 слов. VK — средний формат.\n" +
      "СТРУКТУРА (без меток):\n" +
      "1. Первые 1-2 строки останавливают скролл\n" +
      "2. Личная ситуация или узнаваемая проблема\n" +
      "3. Неожиданный поворот или инсайт\n" +
      "4. Конкретный совет или шаг\n" +
      "5. Мягкий вопрос без давления\n",
    carousel:
      "\nТЫ — топ-1 копирайтер русскоязычного Instagram создающий вирусные карусели.\n\n" +
      "ШАГ 1 — если пользователь не выбрал идею:\n" +
      "Предложи 10 идей каруселей. Для каждой:\n" +
      "— Заголовок до 40 символов\n" +
      "— Суть: 3-5 тезисов\n" +
      "— Главный триггер: почему сохранят или поспорят\n" +
      "— Механика: узнавание / провокация / это про меня / разрушение мифа\n\n" +
      "ШАГ 2 — если пользователь выбрал идею:\n" +
      "Напиши карусель 8-10 слайдов. Каждый слайд: заголовок до 40 символов + текст 1-3 предложения до 160 символов.\n" +
      "Слайд 1: хук. Слайды 2-7: мини-инсайты. Предпоследний: разворот. Последний: мягкий CTA со словом ПУЛЬС.\n" +
      "Запрещено: уникальный, эффективный, качественный.\n",
    threads:
      "\nТЫ ПИШЕШЬ: пост в стиле живого момента для Threads / Instagram\n" +
      "МЕХАНИКА:\n" +
      "1. Начало — эмоция без фильтра. Первые 1-2 строки — живой восторг или удивление. Можно капслок.\n" +
      "2. Середина — конкретика с цифрами прямо в тексте. Показывай процесс изнутри.\n" +
      "3. Один инсайт — одна мысль почему это работает.\n" +
      "4. Финал — мягкий вопрос: кому надо, узнала себя, хочешь попробовать.\n" +
      "ТРЕБОВАНИЯ: короткие строки, много воздуха, 100-180 слов\n" +
      "ЗАПРЕЩЕНО: уникальный, эффективный, качественный\n",
    reels:
      "\nТЫ ПИШЕШЬ: сценарий для Reels\n" +
      "Адаптируй хук под целевую аудиторию.\n" +
      "0-3 сек: хук — провокация, боль или обещание\n" +
      "3-10 сек: раскрываешь боль\n" +
      "10-25 сек: решение в 3 шага или одна идея\n" +
      "25-30 сек: CTA — что сделать прямо сейчас\n" +
      "Пиши как сценарий: что говорить, что показывать, текст на экране\n",
    promo:
      "\nТЫ ПИШЕШЬ: серию прогрева на 6 дней для сторис\n" +
      "Каждый день = отдельная сторис до 100 слов. Разговорный язык. Каждая заканчивается вопросом.\n" +
      "День 1: кто ты — через личную историю без регалий\n" +
      "День 2: понимаешь боль аудитории изнутри\n" +
      "День 3: личная история провала — строит доверие\n" +
      "День 4: ценности — во что веришь\n" +
      "День 5: решение через результат клиента или кейс\n" +
      "День 6: мягкое закрытие с ограничением\n",
    sales:
      "\nТЫ ПИШЕШЬ: продающий текст\n" +
      "Пиши сплошным живым текстом без заголовков.\n" +
      "Последовательно: портрет человека в его ситуации → острая боль → что конкретно получит → как работает → когда результат → следующий шаг без давления.\n" +
      "Русская логика: боль → доверие → действие. Никакого FOMO.\n",
    plan:
      "\nТЫ СОСТАВЛЯЕШЬ: контент-план на месяц\n" +
      "Учти цель месяца — все темы ведут к этой цели.\n" +
      "30 постов: день / формат / тема / суть в одном предложении\n" +
      "Соотношение: 40% польза, 30% личное и доверие, 20% продажи, 10% вовлечение\n" +
      "Форматы: пост, Reels, сторис, карусель\n",
    niche:
      "\nТЫ ПРОВОДИШЬ: анализ ниши\n" +
      "Портрет аудитории — кто, что тревожит, о чём мечтают\n" +
      "Топ-10 вирусных тем с объяснением почему зайдут\n" +
      "Боли и страхи — явные и глубокие\n" +
      "Топ-5 форматов которые работают в этой нише\n" +
      "Позиционирование — как выделиться\n" +
      "Главные ошибки экспертов в этой нише\n",
    bio:
      "\nТЫ ПИШЕШЬ: шапку профиля\n" +
      "Instagram — строго до 150 символов. 3 варианта.\n" +
      "Telegram — до 200 символов. 3 варианта.\n" +
      "В каждом: кто ты + что даёшь + призыв к действию\n" +
      "Только конкретика, никаких общих слов\n",
    strategy:
      "\nТЫ РАЗРАБАТЫВАЕШЬ: стратегию блога\n" +
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
    const t = setInterval(() => setIdx(i => (i + 1) % MOTS.length), 1800);
    return () => clearInterval(t);
  });
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:32, gap:16 }}>
      <div style={{ width:40, height:40, border:"3px solid #e2d9f3", borderTop:"3px solid #7c3aed", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
      <div style={{ color:"#7c3aed", fontSize:14, fontWeight:600, textAlign:"center" }}>{MOTS[idx]}</div>
      <div style={{ color:"#c4b5fd", fontSize:12 }}>Осталось совсем немного…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("access");
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [accessType, setAccessType] = useState(null);
  const [userCode, setUserCode] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [type, setType] = useState(null);
  const [style, setStyle] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [audience, setAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [monthGoal, setMonthGoal] = useState("");
  const [product, setProduct] = useState("");
  const [fact, setFact] = useState("");
  const [carouselIdea, setCarouselIdea] = useState("");
  const [carouselStep, setCarouselStep] = useState(1);
  const [length, setLength] = useState(LENGTHS[0]);
  const [extra, setExtra] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [chat, setChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const isThreads = type?.id === "threads";
  const isCarousel = type?.id === "carousel";
  const isPost = type?.id === "post";
  const isReels = type?.id === "reels";
  const isPlan = type?.id === "plan";
  const isBio = type?.id === "bio";

  const submitCode = () => {
    const res = checkCode(codeInput);
    if (res.valid) {
      setAccessType(res.type); setUserCode(codeInput.trim());
      setUsageCount(0); setScreen("main"); setCodeError("");
    } else { setCodeError("Неверный код. Попробуй ещё раз."); }
  };

  const pickType = (t) => {
    setType(t); setStyle(t.styles[0]);
    setProduct(""); setFact(""); setCarouselIdea(""); setCarouselStep(1);
    setAudience(""); setMonthGoal(""); setPlatform("Instagram");
  };

  const saveToHistory = async (entry) => {
    try {
      await fetch("/api/history", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", code: userCode, entry })
      });
    } catch (e) {}
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/history", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "load", code: userCode })
      });
      const data = await res.json();
      setHistory(data.items || []);
    } catch (e) { setHistory([]); }
    setHistoryLoading(false);
  };

  const buildUserPrompt = () => {
    const lenMap = ["короткий текст до 100 слов", "текст 100–250 слов", "длинный текст 250+ слов"];
    const voice = brandVoice.trim() ? "\nГолос бренда (примеры): " + brandVoice : "";
    const ctx = extra.trim() ? "\nКонтекст: " + extra : "";

    if (isCarousel) {
      if (carouselStep === 1)
        return "ШАГ 1. Предложи 10 идей каруселей.\nНиша: " + topic + "\nПродукт: " + product + "\nБоль: " + fact + voice + ctx;
      return "ШАГ 2. Напиши карусель.\nНиша: " + topic + "\nПродукт: " + product + "\nБоль: " + fact + "\nВыбранная идея: " + carouselIdea + voice;
    }
    if (isThreads)
      return "Напиши пост в стиле живого момента.\nНиша: " + topic + "\nПродукт или результат: " + product + "\nЦифра или факт: " + fact + voice + ctx;
    if (isPost)
      return "Напиши пост для " + platform + " на тему: " + topic + ".\nДлина: " + lenMap[LENGTHS.indexOf(length)] + "." + voice + ctx;
    if (isReels)
      return "Напиши сценарий Reels на тему: " + topic + ".\nЦелевая аудитория: " + audience + voice + ctx;
    if (isPlan)
      return "Составь контент-план на месяц для ниши: " + topic + ".\nЦель месяца: " + monthGoal + voice + ctx;
    if (isBio)
      return "Напиши шапку профиля для " + platform + ".\nО ком: " + topic + voice + ctx;
    if (type?.id === "niche") return "Проведи анализ ниши: " + topic + "." + voice + ctx;
    if (type?.id === "strategy") return "Разработай стратегию блога для: " + topic + "." + voice + ctx;
    if (type?.id === "promo") return "Напиши серию прогрева на 6 дней для: " + topic + "." + voice + ctx;
    if (type?.id === "sales") return "Напиши продающий текст для: " + topic + ".\nДлина: " + lenMap[LENGTHS.indexOf(length)] + "." + voice + ctx;
    return "Напиши " + type.label + " на тему: " + topic + ".\nДлина: " + lenMap[LENGTHS.indexOf(length)] + "." + voice + ctx;
  };

  const generate = async () => {
    if (!type || !topic.trim()) return;
    if (accessType === "trial" && usageCount >= TRIAL_LIMIT) { setScreen("upgrade"); return; }
    setLoading(true); setScreen("result"); setResult(""); setChat([]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1500,
          system: buildPrompt(type.id, style),
          messages: [{ role: "user", content: buildUserPrompt() }]
        })
      });
      const data = await res.json();
      const text = clean(data.content?.map(b => b.text || "").join("") || "Ошибка генерации.");
      setResult(text); setUsageCount(c => c + 1);
      if (isCarousel && carouselStep === 1) setCarouselStep(2);
      await saveToHistory({ type: type.label, topic, text, date: new Date().toLocaleString("ru-RU", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" }) });
    } catch (e) { setResult("__error__"); }
    setLoading(false);
  };

  const send = async () => {
    if (!followUp.trim() || chatLoading) return;
    const msg = followUp.trim(); setFollowUp("");
    const hist = [...chat, { role: "user", content: msg }];
    setChat(hist); setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1500,
          system: buildPrompt(type.id, style),
          messages: [{ role: "user", content: "Ты уже написал:\n\n" + result }, { role: "assistant", content: result }, ...hist]
        })
      });
      const data = await res.json();
      setChat([...hist, { role: "assistant", content: clean(data.content?.map(b => b.text || "").join("") || "Ошибка.") }]);
    } catch (e) { setChat([...hist, { role: "assistant", content: "Ошибка соединения." }]); }
    setChatLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyItem = (text, idx) => { navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); };
  const reset = () => { setType(null); setStyle(""); setTopic(""); setProduct(""); setFact(""); setExtra(""); setBrandVoice(""); setAudience(""); setMonthGoal(""); setCarouselIdea(""); setCarouselStep(1); setResult(""); setChat([]); setFollowUp(""); setScreen("main"); };

  const canGenerate = type && topic.trim() &&
    (!(isThreads || isCarousel) || (product.trim() && fact.trim())) &&
    (!isReels || audience.trim()) &&
    (!isPlan || monthGoal.trim());

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
    badge: { display:"inline-flex", alignItems:"center", gap:6, background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#15803d", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:600 },
    platBtn: (active) => ({ padding:"7px 16px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:500, border: active ? "2px solid #7c3aed" : "2px solid #e5e7eb", background: active ? "#ede9fe" : "#f9fafb", color: active ? "#6d28d9" : "#374151", transition:"all .15s" }),
  };

  const titleText = loading ? "Генерируем..." : type?.id === "niche" ? "Анализ готов" : type?.id === "strategy" ? "Стратегия готова" : type?.id === "plan" ? "Контент-план готов" : "Твой текст готов";
  const subText = type?.id === "niche" ? "Глубокий анализ ниши 🔍" : type?.id === "strategy" ? "Персональная стратегия блога 📈" : type?.id === "plan" ? "Контент-план на месяц 📅" : "Написано с пониманием русского менталитета 🧠";

  if (screen === "access") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🧠</div>
        <div style={s.title}>AI Pulse PRO</div>
        <div style={s.sub}>Маркетинговый ассистент с пониманием русских смыслов</div>
      </div>
      <label style={s.lbl}>Код доступа</label>
      <input style={s.inp} placeholder="Введи код доступа…" value={codeInput}
        onChange={e => setCodeInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submitCode()} />
      {codeError && <div style={{ color:"#ef4444", fontSize:13, marginTop:6 }}>{codeError}</div>}
      <button style={s.btn} onClick={submitCode}>Войти →</button>
      <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:"#9ca3af" }}>
        Нет кода? <span style={{ color:"#7c3aed", fontWeight:600, cursor:"pointer" }} onClick={() => setScreen("upgrade")}>Получить доступ</span>
      </div>
    </div></div>
  );

  if (screen === "upgrade") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🚀</div>
        <div style={s.title}>{accessType === "trial" ? "Тест завершён!" : "Полный доступ"}</div>
        <div style={s.sub}>{accessType === "trial" ? "Ты использовал все 5 бесплатных генераций" : "Открой все возможности AI Pulse PRO"}</div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#f5f0ff,#fdf2f8)", borderRadius:16, padding:24, marginBottom:20 }}>
        <div style={{ fontSize:32, fontWeight:700, color:"#7c3aed", textAlign:"center", marginBottom:4 }}>1 290 ₽</div>
        <div style={{ textAlign:"center", color:"#6b7280", fontSize:13, marginBottom:16 }}>Полный доступ на 3 месяца</div>
        {["Безлимитные генерации", "Все 10 форматов контента", "Голос бренда и адаптация под платформу", "История последних 20 текстов", "Маркетолог с опытом 20+ лет"].map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#374151", marginBottom:6 }}>
            <span style={{ color:"#7c3aed" }}>✓</span> {f}
          </div>
        ))}
      </div>
      <div style={{ background:"#f9fafb", borderRadius:12, padding:16, fontSize:13, color:"#374151", lineHeight:1.7, marginBottom:16 }}>
        Напиши в Telegram: <strong>@твой_ник</strong><br />После оплаты пришлю код в течение 15 минут
      </div>
      <button style={s.btn}>Написать в Telegram</button>
      {accessType && <button style={s.btnS} onClick={() => setScreen("main")}>← Вернуться</button>}
      {!accessType && <button style={s.btnS} onClick={() => setScreen("access")}>← Ввести код</button>}
    </div></div>
  );

  if (screen === "history") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <div style={s.title}>📂 История</div>
        <button style={{ ...s.btnS, width:"auto", padding:"6px 14px", marginTop:0 }} onClick={() => setScreen("main")}>← Назад</button>
      </div>
      <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:12, padding:"12px 16px", fontSize:13, color:"#92400e", marginBottom:20, lineHeight:1.6 }}>
        💡 Сохраняются последние <strong>20 текстов</strong>. Важное — скопируй в заметки.
      </div>
      {historyLoading ? (
        <div style={{ textAlign:"center", padding:32, color:"#9ca3af" }}>Загружаем историю…</div>
      ) : history.length === 0 ? (
        <div style={{ textAlign:"center", padding:32, color:"#9ca3af" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div>История пока пуста</div>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {history.map((item, i) => (
            <div key={i} style={{ border:"1.5px solid #e5e7eb", borderRadius:14, overflow:"hidden" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#f9fafb", cursor:"pointer" }}
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}>
                <div>
                  <div style={{ fontWeight:600, fontSize:13, color:"#1a1a2e" }}>{item.type}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{item.topic} · {item.date}</div>
                </div>
                <div style={{ fontSize:18, color:"#9ca3af" }}>{expandedIdx === i ? "▲" : "▼"}</div>
              </div>
              {expandedIdx === i && (
                <div style={{ padding:"14px 16px", borderTop:"1px solid #e5e7eb" }}>
                  <div style={{ fontSize:13, lineHeight:1.8, color:"#1f2937", whiteSpace:"pre-wrap", marginBottom:12 }}>{item.text}</div>
                  <button style={{ ...s.btn, marginTop:0, fontSize:13, padding:"9px" }} onClick={() => copyItem(item.text, i)}>
                    {copiedIdx === i ? "✅ Скопировано!" : "📋 Скопировать"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div></div>
  );

  if (screen === "main") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div style={s.badge}>✦ AI Pulse PRO</div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {accessType === "trial" && <div style={{ fontSize:12, color:"#9ca3af" }}>{usageCount}/{TRIAL_LIMIT}</div>}
          <button style={{ background:"#f3f4f6", border:"none", borderRadius:10, padding:"6px 12px", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}
            onClick={() => { loadHistory(); setScreen("history"); }}>📂 История</button>
        </div>
      </div>
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

      {(isPost || isBio) && (
        <div style={{ marginBottom:14 }}>
          <label style={s.lbl}>Платформа</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {(isBio ? ["Instagram", "Telegram"] : ["Instagram", "Telegram", "VK"]).map(p => (
              <div key={p} style={s.platBtn(platform === p)} onClick={() => setPlatform(p)}>{p}</div>
            ))}
          </div>
        </div>
      )}

      <label style={s.lbl}>{isThreads || isCarousel ? "Ниша *" : "Тема / о чём *"}</label>
      <input style={s.inp}
        placeholder={isThreads || isCarousel ? "Например: психолог, нутрициолог, коуч…" : "Например: курс по инвестициям для мам…"}
        value={topic} onChange={e => setTopic(e.target.value)} />

      {(isThreads || isCarousel) && (
        <>
          <div style={{ marginTop:14 }}>
            <label style={s.lbl}>{isCarousel ? "Продукт или идея карусели *" : "Продукт или результат *"}</label>
            <input style={s.inp}
              placeholder={isCarousel ? "Например: карусель которая греет к покупке курса" : "Например: пост который привёл заявку"}
              value={product} onChange={e => setProduct(e.target.value)} />
          </div>
          <div style={{ marginTop:14 }}>
            <label style={s.lbl}>{isCarousel ? "Главная боль аудитории *" : "Цифра или факт *"}</label>
            <input style={s.inp}
              placeholder={isCarousel ? "Например: знают что надо копить — но не делают" : "Например: написала за 7 минут, пришла заявка через 2 дня"}
              value={fact} onChange={e => setFact(e.target.value)} />
          </div>
        </>
      )}

      {isReels && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Целевая аудитория *</label>
          <input style={s.inp} placeholder="Например: мамы в декрете 25-35 лет, эксперты-психологи…"
            value={audience} onChange={e => setAudience(e.target.value)} />
        </div>
      )}

      {isPlan && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Цель на месяц *</label>
          <input style={s.inp} placeholder="Например: продажи курса / рост аудитории / прогрев к консультации"
            value={monthGoal} onChange={e => setMonthGoal(e.target.value)} />
        </div>
      )}

      {!NO_LEN.includes(type?.id) && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Длина</label>
          <select style={s.sel} value={length} onChange={e => setLength(e.target.value)}>
            {LENGTHS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      )}

      <div style={{ marginTop:14 }}>
        <label style={s.lbl}>Голос бренда (необязательно)</label>
        <textarea style={{ ...s.ta, minHeight:52 }}
          placeholder="Вставь 2-3 примера своих текстов — AI подстроится под твой стиль…"
          value={brandVoice} onChange={e => setBrandVoice(e.target.value)} />
      </div>

      <div style={{ marginTop:10 }}>
        <label style={s.lbl}>Контекст (необязательно)</label>
        <textarea style={{ ...s.ta, minHeight:52 }} placeholder="ЦА, боли, УТП, ключевые смыслы…"
          value={extra} onChange={e => setExtra(e.target.value)} />
      </div>

      <button style={{ ...s.btn, marginTop:20, opacity: canGenerate ? 1 : 0.5 }}
        onClick={generate} disabled={!canGenerate}>
        {type?.id === "niche" ? "🔍 Запустить анализ" : type?.id === "strategy" ? "📈 Построить стратегию" : isPlan ? "📅 Составить план" : isCarousel ? "🎠 Получить идеи" : "✨ Написать текст"}
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
          <div style={{ fontSize:13, color:"#6b7280", marginBottom:24 }}>Попробуй ещё раз.</div>
          <button style={{ ...s.btn, marginTop:0 }} onClick={() => { setResult(""); setScreen("main"); }}>🔄 Попробовать снова</button>
        </div>
      ) : (
        <>
          <div style={{ ...s.box, fontSize:NO_LEN.includes(type?.id) ? 13 : 14 }}>{result}</div>
          <button style={s.btn} onClick={copy}>{copied ? "✅ Скопировано!" : "📋 Скопировать"}</button>
          {isCarousel && carouselStep === 2 && (
            <div style={{ marginTop:14 }}>
              <label style={s.lbl}>Выбери идею для карусели</label>
              <textarea style={{ ...s.ta, minHeight:52 }} placeholder="Напиши номер или название понравившейся идеи…"
                value={carouselIdea} onChange={e => setCarouselIdea(e.target.value)} />
              <button style={{ ...s.btn, opacity: carouselIdea.trim() ? 1 : 0.5 }}
                disabled={!carouselIdea.trim()} onClick={() => { setCarouselStep(3); generate(); }}>
                🎠 Написать карусель по идее
              </button>
            </div>
          )}
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
