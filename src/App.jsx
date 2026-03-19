import { useState } from "react";

const PAID_DAYS = 90;
const TRIAL_LIMIT = 5;
const TG_SUPPORT = "https://t.me/lavaiai";
const PAYMENT_URL = "https://app.lava.top/products/95189972-28a0-4df9-8bf7-aed0fa5acf95";

const TEXT_TYPES = [
  { id: "post",     label: "📱 Пост",                    desc: "Instagram / Telegram / VK",       styles: ["Живой / Кухонный", "Через личную историю", "Через боль и инсайт"] },
  { id: "carousel", label: "🎠 Карусель Instagram",      desc: "10 идей + готовые слайды",         styles: ["Разрушение мифа", "Это про меня", "Провокация и споры"] },
  { id: "threads",  label: "🧵 Threads / Живой момент",  desc: "Вирусный пост",           styles: ["Восторг и удивление", "Я в шоке от результата", "Только что произошло"] },
  { id: "reels",    label: "🎬 Reels / Видео",           desc: "Сценарий с хуком и CTA",            styles: ["Провокационный хук", "Сторителлинг", "Список / Инструкция"] },
  { id: "promo",    label: "🔥 Прогрев / Сторис",        desc: "Серия 6 дней, воронка",             styles: ["Уязвимость + Экспертность", "День за днём к офферу", "Через ценности и смыслы"] },
  { id: "sales",    label: "💰 Оффер / УТП",              desc: "Продающий текст, лендинг",          styles: ["Прямой и честный", "Через страх и решение", "Через результат клиента"] },
  { id: "plan",     label: "📅 Контент-план",             desc: "План публикаций на месяц",          styles: ["По болям аудитории", "По воронке продаж", "Микс форматов"] },
  { id: "niche",    label: "🔍 Анализ ниши",              desc: "Боли, темы, позиционирование",      styles: ["Стратегический разбор", "Через боли аудитории", "Вирусные форматы"] },
  { id: "bio",      label: "✨ Шапка профиля",             desc: "Bio Instagram / Telegram",          styles: ["Чёткая и конкретная", "С характером и голосом", "Через результат клиента"] },
  { id: "strategy", label: "📈 Стратегия блога",          desc: "С чего начать и как расти",         styles: ["Пошаговый план", "Через точку А в точку Б", "Быстрый старт с результатом"] },
];

const NO_LEN = ["niche", "strategy", "bio", "plan", "promo", "threads", "carousel"];

const POST_LIMITS = {
  Instagram: { label: "до 2 200 символов", max: 2200 },
  Telegram:  { label: "до 4 096 символов", max: 4096 },
  VK:        { label: "до 4 000 символов", max: 4000 },
};

const REELS_LENGTHS = [
  { id: "short",  label: "Короткий (15–30 сек)" },
  { id: "medium", label: "Средний (30–60 сек)" },
  { id: "long",   label: "Длинный (60–90 сек)" },
];

const SALES_LENGTHS = [
  { id: "short",  label: "Короткий (~500 символов)" },
  { id: "medium", label: "Средний (~1 500 символов)" },
  { id: "long",   label: "Длинный (~3 000 символов)" },
];

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

const GENDERS = [
  { id: "female", label: "От женщины" },
  { id: "male",   label: "От мужчины" },
];

const GENDER_TYPES = ["post", "promo", "sales", "threads", "reels", "bio", "strategy", "niche", "plan", "carousel"];

function genderInstruction(genderId) {
  if (genderId === "female") {
    return "\n\nПОЛ АВТОРА: Текст пишется от лица женщины. Используй женский род в глаголах и причастиях (решила, поняла, начала, была). Стиль — тёплый, чувственный, с личными деталями. Местоимения: я/мне/меня — женские формы.";
  }
  if (genderId === "male") {
    return "\n\nПОЛ АВТОРА: Текст пишется от лица мужчины. Используй мужской род (решил, понял, начал, был). Стиль — уверенный, прямой, конкретный. Местоимения: я/мне/меня — мужские формы.";
  }
  return "";
}

function buildPrompt(typeId, style, genderId) {
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
    "- ВАЖНО: никогда не пиши названия блоков — КОМУ, БОЛЬ, РЕЗУЛЬТАТ, МЕТОД, СРОКИ, ХУК, CTA, ДЕНЬ 1. Только живой текст.\n" +
    genderInstruction(genderId);

 const map = {
    post: "\nТЫ ПИШЕШЬ: пост для соцсетей\nInstagram — строго до 2 200 символов. Telegram — до 4 096 символов. VK — до 4 096 символов.\nСТРУКТУРА: хук → история/боль → инсайт → совет → мягкий вопрос\nЭМОДЗИ: можно 2-3 штуки максимум — только в начале абзацев или в конце для акцента. Не в каждой строке.\n",
    carousel: "\nТЫ — топ копирайтер вирусных каруселей Instagram.\nШАГ 1: предложи 10 идей (заголовок до 40 символов, суть, триггер, механика).\nШАГ 2: карусель 8-10 слайдов. Слайд 1: хук. Слайды 2-7: инсайты. Предпоследний: разворот. Последний: CTA со словом ПУЛЬС.\nКаждый слайд: заголовок до 40 символов + 1-3 предложения до 160 символов.\nЭМОДЗИ: 1 эмодзи на слайд максимум — только в заголовке.\n",
    threads: "\nТЫ ПИШЕШЬ: пост живого момента для Threads/Instagram\n1. Эмоция без фильтра — восторг, удивление, можно капслок\n2. Конкретика с цифрами прямо в тексте\n3. Один инсайт почему это работает\n4. Мягкий вопрос в конце\nДо 500 символов. Короткие строки. Много воздуха.\nЭМОДЗИ: 1-2 штуки максимум — в начале или конце, не в середине.\n",
    reels: "\nТЫ ПИШЕШЬ: сценарий Reels\n0-3 сек: хук под целевую аудиторию\n3-10 сек: боль\n10-25 сек: решение в 3 шага\n25-30 сек: CTA\nПиши как сценарий: что говорить, что показывать, текст на экране\nБЕЗ ЭМОДЗИ — это технический сценарий.\n",
    promo: "\nСЕРИЯ ПРОГРЕВА 6 ДНЕЙ. Каждый день = отдельная сторис до 100 слов, заканчивается вопросом.\nД1: кто ты через историю. Д2: боль изнутри. Д3: личный провал. Д4: ценности. Д5: результат/кейс. Д6: мягкое закрытие.\nЭМОДЗИ: 1-2 на каждый день — только в начале или конце сторис.\n",
    sales: "\nПРОДАЮЩИЙ ТЕКСТ — сплошным живым текстом без заголовков.\nПортрет → боль своими словами → что получит → как работает → когда результат → следующий шаг.\nРусская логика: боль → доверие → действие.\nБЕЗ ЭМОДЗИ — серьёзный продающий текст.\n",
    plan: "\nКОНТЕНТ-ПЛАН 30 дней: день / формат / тема / суть.\n40% польза, 30% личное, 20% продажи, 10% вовлечение.\nФорматы: пост, Reels, сторис, карусель. Учти цель месяца.\nБЕЗ ЭМОДЗИ — это структурный документ.\n",
    niche: "\nАНАЛИЗ НИШИ:\nПортрет аудитории. Топ-10 вирусных тем. Боли явные и глубокие. Топ-5 форматов. Позиционирование. Главные ошибки экспертов.\nБЕЗ ЭМОДЗИ — это экспертный разбор.\n",
    bio: "\nШАПКА ПРОФИЛЯ. 3 варианта.\nInstagram: строго до 150 символов. Telegram: до 255 символов.\nВ каждом: кто + что даёшь + CTA. Только конкретика.\nЭМОДЗИ: 1-2 штуки максимум если уместно.\n",
    strategy: "\nСТРАТЕГИЯ БЛОГА:\nТочка А → точка Б → фундамент → контент-система 30 дней → 5 первых шагов → топ-3 ошибки → метрики 30/60/90 дней.\nБЕЗ ЭМОДЗИ — это стратегический документ.\n",
  };

  return base + (map[typeId] || "") +
    "\nЗАВЕРШЕНИЕ: Мягко заверши и задай один вопрос — откликается ли результат.\nПиши только на русском языке.";
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
  const [screen, setScreen] = useState("main");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [accessType, setAccessType] = useState("guest");
  const [usageCount, setUsageCount] = useState(0);
  const [daysLeft, setDaysLeft] = useState(null);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regTelegram, setRegTelegram] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [type, setType] = useState(null);
  const [style, setStyle] = useState("");
  const [gender, setGender] = useState("female");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [audience, setAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [monthGoal, setMonthGoal] = useState("");
  const [product, setProduct] = useState("");
  const [fact, setFact] = useState("");
  const [carouselIdea, setCarouselIdea] = useState("");
  const [carouselStep, setCarouselStep] = useState(1);
  const [reelsLength, setReelsLength] = useState("short");
  const [salesLength, setSalesLength] = useState("medium");
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
  const isSales = type?.id === "sales";
  const showGender = GENDER_TYPES.includes(type?.id);

  const api = async (body) => {
    const r = await fetch("/api/history", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return r.json();
  };

  const register = async () => {
    if (!regName.trim() || !regEmail.trim()) { setRegError("Введи имя и email"); return; }
    if (!regEmail.includes("@")) { setRegError("Введи корректный email"); return; }
    setRegLoading(true);
    try {
      const data = await api({ action: "register", name: regName, email: regEmail, telegram: regTelegram });
      if (data.ok) {
        setUserId(data.userId); setUserName(regName.trim());
        setUsageCount(data.usageCount || 1); setAccessType("trial");
        setScreen("main"); setRegError("");
      } else { setRegError("Ошибка. Попробуй ещё раз."); }
    } catch (e) { setRegError("Ошибка соединения."); }
    setRegLoading(false);
  };

  const loginByEmail = async () => {
    if (!loginEmail.trim()) return;
    setLoginLoading(true);
    try {
      const data = await api({ action: "loginByEmail", email: loginEmail.trim() });
      if (data.ok) {
        setUserId(data.userId); setUserName(data.name || "");
        setUsageCount(data.usageCount || 0); setAccessType(data.type || "trial");
        setDaysLeft(data.daysLeft ?? null); setScreen("main"); setLoginError("");
      } else {
        if (data.reason === "expired") setLoginError("Срок доступа истёк. Напиши нам для продления.");
        else if (data.reason === "not_found") setLoginError("Email не найден. Сначала зарегистрируйся бесплатно.");
        else setLoginError("Ошибка. Попробуй ещё раз.");
      }
    } catch (e) { setLoginError("Ошибка соединения."); }
    setLoginLoading(false);
  };

  const pickType = (t) => {
    setType(t); setStyle(t.styles[0]);
    setProduct(""); setFact(""); setCarouselIdea(""); setCarouselStep(1);
    setAudience(""); setMonthGoal(""); setPlatform("Instagram");
    setReelsLength("short"); setSalesLength("medium");
  };

  const buildUserPrompt = () => {
    const genderNote = gender === "female" ? " (автор — женщина)" : " (автор — мужчина)";
    const voice = brandVoice.trim() ? "\nГолос бренда: " + brandVoice : "";
    const ctx = extra.trim() ? "\nКонтекст: " + extra : "";

    if (isCarousel) {
      if (carouselStep === 1) return "ШАГ 1. 10 идей каруселей" + genderNote + ".\nНиша: " + topic + "\nПродукт: " + product + "\nБоль: " + fact + voice + ctx;
      return "ШАГ 2. Напиши карусель" + genderNote + ".\nНиша: " + topic + "\nПродукт: " + product + "\nБоль: " + fact + "\nИдея: " + carouselIdea + voice;
    }
    if (isThreads) return "Живой момент" + genderNote + ".\nНиша: " + topic + "\nПродукт: " + product + "\nФакт: " + fact + voice + ctx;
    if (isPost) {
      const lim = POST_LIMITS[platform] || POST_LIMITS.Instagram;
      return "Пост для " + platform + genderNote + ": " + topic + ".\nДлина: " + lim.label + voice + ctx;
    }
    if (isReels) {
      const rLen = REELS_LENGTHS.find(l => l.id === reelsLength)?.label || "";
      return "Reels" + genderNote + ": " + topic + ".\nДлина сценария: " + rLen + "\nЦА: " + audience + voice + ctx;
    }
    if (isPlan) return "Контент-план" + genderNote + ": " + topic + ".\nЦель: " + monthGoal + voice + ctx;
    if (isBio) return "Шапка для " + platform + genderNote + ": " + topic + voice + ctx;
    if (isSales) {
      const sLen = SALES_LENGTHS.find(l => l.id === salesLength)?.label || "";
      return "Продающий текст" + genderNote + ": " + topic + ".\nДлина: " + sLen + voice + ctx;
    }
    if (type?.id === "niche") return "Анализ ниши" + genderNote + ": " + topic + voice + ctx;
    if (type?.id === "strategy") return "Стратегия блога" + genderNote + ": " + topic + voice + ctx;
    if (type?.id === "promo") return "Прогрев на 6 дней" + genderNote + ": " + topic + voice + ctx;
    return type.label + genderNote + ": " + topic + voice + ctx;
  };

  const generate = async () => {
    if (!type || !topic.trim()) return;
    if (accessType === "guest" && usageCount >= 1) { setScreen("register"); return; }
    if (accessType === "trial" && usageCount >= TRIAL_LIMIT) { setScreen("upgrade"); return; }
    setLoading(true); setScreen("result"); setResult(""); setChat([]);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: buildPrompt(type.id, style, gender),
          messages: [{ role: "user", content: buildUserPrompt() }]
        })
      });
      const data = await r.json();
      const text = clean(data.content?.map(b => b.text || "").join("") || "Ошибка генерации.");
      setResult(text);
      setUsageCount(usageCount + 1);
      if (isCarousel && carouselStep === 1) setCarouselStep(2);
      if (userId) {
        await api({ action: "increment", userId });
        await api({
          action: "save", userId,
          entry: {
            type: type.label, topic, text, gender,
            date: new Date().toLocaleString("ru-RU", { day:"2-digit", month:"2-digit", year:"numeric", hour:"2-digit", minute:"2-digit" })
          }
        });
        await api({ action: "adminSave", entry: { type: type.label, topic, gender, date: new Date().toISOString(), userId } });
      }
      if (accessType === "guest") setAccessType("guest_used");
    } catch (e) { setResult("__error__"); }
    setLoading(false);
  };

  const send = async () => {
    if (!followUp.trim() || chatLoading) return;
    const msg = followUp.trim(); setFollowUp("");
    const hist = [...chat, { role: "user", content: msg }];
    setChat(hist); setChatLoading(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1500,
          system: buildPrompt(type.id, style, gender),
          messages: [{ role: "user", content: "Ты уже написал:\n\n" + result }, { role: "assistant", content: result }, ...hist]
        })
      });
      const data = await r.json();
      setChat([...hist, { role: "assistant", content: clean(data.content?.map(b => b.text || "").join("") || "Ошибка.") }]);
    } catch (e) { setChat([...hist, { role: "assistant", content: "Ошибка соединения." }]); }
    setChatLoading(false);
  };

  const loadHistory = async () => {
    if (!userId) return;
    setHistoryLoading(true);
    try {
      const data = await api({ action: "load", userId });
      setHistory(data.items || []);
    } catch (e) { setHistory([]); }
    setHistoryLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const copyItem = (text, idx) => { navigator.clipboard.writeText(text); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); };
const reset = () => {
    setType(null); setStyle(""); setTopic(""); setProduct(""); setFact(""); setExtra("");
    setBrandVoice(""); setAudience(""); setMonthGoal(""); setCarouselIdea(""); setCarouselStep(1);
    setResult(""); setChat([]); setFollowUp("");
    if (userId) setScreen("main");
    else setScreen("register");
  };
  const logout = () => { setAccessType("guest"); setUserId(null); setUserName(""); setUsageCount(0); setDaysLeft(null); };

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
    togBtn: (active) => ({
      padding:"8px 18px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:600,
      border: active ? "2px solid #7c3aed" : "2px solid #e5e7eb",
      background: active ? "#ede9fe" : "#f9fafb",
      color: active ? "#6d28d9" : "#374151",
      transition: "all .15s"
    }),
    platBtn: (a) => ({ padding:"7px 16px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:500, border: a ? "2px solid #7c3aed" : "2px solid #e5e7eb", background: a ? "#ede9fe" : "#f9fafb", color: a ? "#6d28d9" : "#374151" }),
  };

  if (screen === "login") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>👋</div>
        <div style={s.title}>Войти в AI Pulse PRO</div>
        <div style={s.sub}>Введи email с которым регистрировался</div>
      </div>
      <label style={s.lbl}>Email</label>
      <input style={s.inp} placeholder="твой@email.com" type="email" value={loginEmail}
        onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && loginByEmail()} />
      {loginError && <div style={{ color:"#ef4444", fontSize:13, marginTop:6 }}>{loginError}</div>}
      <button style={{ ...s.btn, opacity: loginLoading ? 0.7 : 1 }} onClick={loginByEmail} disabled={loginLoading}>
        {loginLoading ? "Проверяем…" : "Войти →"}
      </button>
      <button style={s.btnS} onClick={() => setScreen("main")}>← Назад</button>
    </div></div>
  );

  if (screen === "register") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🎉</div>
        <div style={s.title}>Тебе понравилось?</div>
        <div style={s.sub}>Зарегистрируйся бесплатно и получи ещё 4 генерации</div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#f5f0ff,#fdf2f8)", borderRadius:14, padding:"14px 16px", marginBottom:20, fontSize:13, color:"#6d28d9", lineHeight:1.8 }}>
        ✦ 1 текст без регистрации<br />
        ✦ После регистрации: ещё 4 генерации бесплатно<br />
        ✦ Полный доступ: безлимит за 1 290 ₽ / 3 месяца
      </div>
      <label style={s.lbl}>Имя *</label>
      <input style={{ ...s.inp, marginBottom:12 }} placeholder="Как тебя зовут?" value={regName} onChange={e => setRegName(e.target.value)} />
      <label style={s.lbl}>Email *</label>
      <input style={{ ...s.inp, marginBottom:12 }} placeholder="твой@email.com" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
      <label style={s.lbl}>Telegram (необязательно)</label>
      <input style={{ ...s.inp, marginBottom:4 }} placeholder="@username" value={regTelegram} onChange={e => setRegTelegram(e.target.value)} />
      {regError && <div style={{ color:"#ef4444", fontSize:13, marginTop:6, marginBottom:4 }}>{regError}</div>}
      <button style={{ ...s.btn, opacity: regLoading ? 0.7 : 1 }} onClick={register} disabled={regLoading}>
        {regLoading ? "Регистрируемся…" : "Получить 4 генерации бесплатно →"}
      </button>
      <button style={s.btnS} onClick={() => setScreen("upgrade")}>Сразу купить полный доступ</button>
    </div></div>
  );

  if (screen === "upgrade") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:48, marginBottom:8 }}>🚀</div>
        <div style={s.title}>{accessType === "trial" ? "Генерации закончились" : "Полный доступ"}</div>
        <div style={s.sub}>Безлимит на 3 месяца</div>
      </div>
      <div style={{ background:"linear-gradient(135deg,#f5f0ff,#fdf2f8)", borderRadius:16, padding:24, marginBottom:20 }}>
        <div style={{ fontSize:32, fontWeight:700, color:"#7c3aed", textAlign:"center", marginBottom:4 }}>1 290 ₽</div>
        <div style={{ textAlign:"center", color:"#6b7280", fontSize:13, marginBottom:16 }}>Полный доступ на 3 месяца</div>
        {["Безлимитные генерации", "Все 10 форматов контента", "Голос бренда и адаптация", "История 20 текстов", "Маркетолог с опытом 20+ лет"].map(f => (
          <div key={f} style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color:"#374151", marginBottom:6 }}>
            <span style={{ color:"#7c3aed" }}>✓</span> {f}
          </div>
        ))}
      </div>
      <button style={s.btn} onClick={() => window.open(PAYMENT_URL, "_blank")}>💳 Оплатить 1 290 ₽</button>
      <div style={{ marginTop:16, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#15803d", marginBottom:8 }}>✅ Уже оплатил?</div>
        <div style={{ fontSize:12, color:"#374151", marginBottom:10, lineHeight:1.5 }}>
          Введи email с которого оплачивал — доступ откроется автоматически
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ ...s.inp, flex:1, fontSize:13 }} placeholder="твой@email.com" type="email"
            value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && loginByEmail()} />
          <button onClick={loginByEmail} disabled={loginLoading} style={{
            padding:"0 16px", background:"linear-gradient(135deg,#7c3aed,#a855f7)",
            color:"#fff", border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:14,
            opacity: loginLoading ? 0.7 : 1
          }}>→</button>
        </div>
        {loginError && <div style={{ color:"#ef4444", fontSize:12, marginTop:6 }}>{loginError}</div>}
      </div>
      <div style={{ marginTop:12, textAlign:"center", fontSize:12, color:"#9ca3af" }}>
        Вопросы? <a href={TG_SUPPORT} target="_blank" rel="noreferrer" style={{ color:"#7c3aed", fontWeight:600 }}>Написать в поддержку</a>
      </div>
      {(accessType === "trial" || accessType === "guest_used") && <button style={s.btnS} onClick={() => setScreen("main")}>← Вернуться</button>}
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
        <div style={{ textAlign:"center", padding:32, color:"#9ca3af" }}>Загружаем…</div>
      ) : history.length === 0 ? (
        <div style={{ textAlign:"center", padding:32, color:"#9ca3af" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
          <div>История пока пуста</div>
        </div>
      ) : history.map((item, i) => (
        <div key={i} style={{ border:"1.5px solid #e5e7eb", borderRadius:14, overflow:"hidden", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", background:"#f9fafb", cursor:"pointer" }}
            onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:"#1a1a2e" }}>{item.type}</div>
              <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>
                {item.topic} · {item.date}
                {item.gender && <span style={{ marginLeft:6, background:"#ede9fe", color:"#6d28d9", borderRadius:10, padding:"1px 8px", fontSize:11 }}>
                  {item.gender === "female" ? "♀ женщина" : "♂ мужчина"}
                </span>}
              </div>
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
    </div></div>
  );

  if (screen === "main") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div style={s.badge}>✦ AI Pulse PRO</div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {accessType === "trial" && <div style={{ fontSize:12, color:"#9ca3af" }}>{usageCount}/{TRIAL_LIMIT}</div>}
          {userId && (
            <button style={{ background:"#f3f4f6", border:"none", borderRadius:10, padding:"6px 12px", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}
              onClick={() => { loadHistory(); setScreen("history"); }}>📂</button>
          )}
        </div>
      </div>

      {userName && <div style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>Привет, {userName} 👋</div>}
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
        <>
          <div style={{ marginBottom:16 }}>
            <label style={s.lbl}>Стиль подачи</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {type.styles.map(st => (
                <div key={st} onClick={() => setStyle(st)} style={{
                  padding:"7px 14px", borderRadius:20, fontSize:13, cursor:"pointer", fontWeight:500,
                  border: style === st ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                  background: style === st ? "#ede9fe" : "#f9fafb",
                  color: style === st ? "#6d28d9" : "#374151"
                }}>{st}</div>
              ))}
            </div>
          </div>

          {showGender && (
            <div style={{ marginBottom:16 }}>
              <label style={s.lbl}>От чьего лица пишем</label>
              <div style={{ display:"flex", gap:8 }}>
                {GENDERS.map(g => (
                  <button key={g.id} onClick={() => setGender(g.id)} style={s.togBtn(gender === g.id)}>
                    {g.id === "female" ? "♀ " : "♂ "}{g.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {(isPost || isBio) && (
        <div style={{ marginBottom:14 }}>
          <label style={s.lbl}>Платформа</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {(isBio ? ["Instagram","Telegram"] : ["Instagram","Telegram","VK"]).map(p => (
              <div key={p} style={s.platBtn(platform === p)} onClick={() => setPlatform(p)}>
                {p}
                {isPost && <span style={{ fontSize:10, color:"#9ca3af", marginLeft:4 }}>{POST_LIMITS[p]?.label}</span>}
              </div>
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
            <label style={s.lbl}>{isCarousel ? "Продукт или идея *" : "Продукт или результат *"}</label>
            <input style={s.inp} placeholder={isCarousel ? "Карусель которая греет к покупке" : "Пост который привёл заявку"} value={product} onChange={e => setProduct(e.target.value)} />
          </div>
          <div style={{ marginTop:14 }}>
            <label style={s.lbl}>{isCarousel ? "Главная боль аудитории *" : "Цифра или факт *"}</label>
            <input style={s.inp} placeholder={isCarousel ? "Знают что надо копить — но не делают" : "Написала за 7 минут, пришла заявка"} value={fact} onChange={e => setFact(e.target.value)} />
          </div>
        </>
      )}

      {isReels && (
        <>
          <div style={{ marginTop:14 }}>
            <label style={s.lbl}>Целевая аудитория *</label>
            <input style={s.inp} placeholder="Мамы в декрете 25-35 лет…" value={audience} onChange={e => setAudience(e.target.value)} />
          </div>
          <div style={{ marginTop:14 }}>
            <label style={s.lbl}>Длина сценария</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {REELS_LENGTHS.map(l => (
                <div key={l.id} style={s.platBtn(reelsLength === l.id)} onClick={() => setReelsLength(l.id)}>{l.label}</div>
              ))}
            </div>
          </div>
        </>
      )}

      {isSales && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Длина текста</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {SALES_LENGTHS.map(l => (
              <div key={l.id} style={s.platBtn(salesLength === l.id)} onClick={() => setSalesLength(l.id)}>{l.label}</div>
            ))}
          </div>
        </div>
      )}

      {isPlan && (
        <div style={{ marginTop:14 }}>
          <label style={s.lbl}>Цель на месяц *</label>
          <input style={s.inp} placeholder="Продажи курса / рост аудитории / прогрев" value={monthGoal} onChange={e => setMonthGoal(e.target.value)} />
        </div>
      )}

      <div style={{ marginTop:14 }}>
        <label style={s.lbl}>Голос бренда (необязательно)</label>
        <textarea style={{ ...s.ta, minHeight:52 }} placeholder="Вставь 2-3 примера своих текстов — AI подстроится…" value={brandVoice} onChange={e => setBrandVoice(e.target.value)} />
      </div>
      <div style={{ marginTop:10 }}>
        <label style={s.lbl}>Контекст (необязательно)</label>
        <textarea style={{ ...s.ta, minHeight:52 }} placeholder="ЦА, боли, УТП…" value={extra} onChange={e => setExtra(e.target.value)} />
      </div>

      <button style={{ ...s.btn, marginTop:20, opacity: canGenerate ? 1 : 0.5 }} onClick={generate} disabled={!canGenerate}>
        {type?.id === "niche" ? "🔍 Запустить анализ" : type?.id === "strategy" ? "📈 Построить стратегию" : isPlan ? "📅 Составить план" : isCarousel ? "🎠 Получить идеи" : "✨ Написать текст"}
      </button>

      <div style={{ marginTop:28, borderTop:"1px solid #f3f4f6", paddingTop:20 }}>
        {accessType === "guest" && (
          <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:"#92400e", lineHeight:1.6 }}>
            👋 Это твоя бесплатная генерация. После — быстрая регистрация для ещё 4 текстов.
          </div>
        )}
        {accessType === "trial" && (
          <div style={{ background:"linear-gradient(135deg,#f5f0ff,#fdf2f8)", border:"1.5px solid #e9d5ff", borderRadius:14, padding:"14px 16px", marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:600, color:"#6d28d9", marginBottom:6 }}>⚡ {usageCount} из {TRIAL_LIMIT} генераций использовано</div>
            <div style={{ background:"#e9d5ff", borderRadius:20, height:6, marginBottom:10 }}>
              <div style={{ background:"linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius:20, height:6, width:(usageCount/TRIAL_LIMIT*100)+"%" }} />
            </div>
            <div style={{ fontSize:12, color:"#7c3aed", marginBottom:8 }}>Переходи на полный доступ — безлимит за 1 290 ₽ на 3 месяца</div>
            <button style={{ ...s.btn, marginTop:0, fontSize:13, padding:"10px" }} onClick={() => setScreen("upgrade")}>
              🚀 Купить полный доступ
            </button>
          </div>
        )}
        {accessType === "paid" && (
          <div style={{ display:"flex", alignItems:"center", gap:8, background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"10px 14px", marginBottom:16 }}>
            <span>✅</span>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:"#15803d" }}>Полный доступ активен</div>
              <div style={{ fontSize:11, color:"#6b7280" }}>{daysLeft !== null ? "Осталось " + daysLeft + " дней" : "3 месяца"}</div>
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <a href={TG_SUPPORT} target="_blank" rel="noreferrer" style={{ flex:1, minWidth:100, padding:"9px 12px", background:"#f3f4f6", border:"none", borderRadius:10, fontSize:12, fontWeight:600, color:"#374151", textDecoration:"none", textAlign:"center" }}>
            💬 Поддержка
          </a>
          {accessType === "guest" && (
            <button style={{ flex:1, minWidth:100, padding:"9px 12px", background:"#f3f4f6", border:"none", borderRadius:10, fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" }}
              onClick={() => setScreen("login")}>🔑 Войти</button>
          )}
          {userId && (
            <button style={{ padding:"9px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:12, color:"#9ca3af", cursor:"pointer" }} onClick={logout}>
              Выйти
            </button>
          )}
        </div>
      </div>
    </div></div>
  );

  if (screen === "result") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.chip}>{type?.label} · {style} · {gender === "female" ? "♀" : "♂"}</div>
      <div style={s.title}>{loading ? "Генерируем..." : "Твой текст готов"}</div>
      <div style={s.sub}>Написано с пониманием русского менталитета 🧠</div>

      {loading ? <Spinner /> : result === "__error__" ? (
        <div style={{ textAlign:"center", padding:"24px 0" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>😔</div>
          <div style={{ fontWeight:600, fontSize:16, color:"#1a1a2e", marginBottom:8 }}>Что-то пошло не так</div>
          <button style={{ ...s.btn, marginTop:8 }} onClick={() => { setResult(""); setScreen("main"); }}>🔄 Попробовать снова</button>
        </div>
      ) : (
        <>
          <div style={{ ...s.box, fontSize:NO_LEN.includes(type?.id) ? 13 : 14 }}>{result}</div>
          <button style={s.btn} onClick={copy}>{copied ? "✅ Скопировано!" : "📋 Скопировать"}</button>
          {isCarousel && carouselStep === 2 && (
            <div style={{ marginTop:14 }}>
              <label style={s.lbl}>Выбери идею</label>
              <textarea style={{ ...s.ta, minHeight:52 }} placeholder="Номер или название идеи…" value={carouselIdea} onChange={e => setCarouselIdea(e.target.value)} />
              <button style={{ ...s.btn, opacity: carouselIdea.trim() ? 1 : 0.5 }} disabled={!carouselIdea.trim()}
                onClick={() => { setCarouselStep(3); generate(); }}>🎠 Написать карусель</button>
            </div>
          )}
          {accessType === "guest_used" && (
            <div style={{ background:"linear-gradient(135deg,#f5f0ff,#fdf2f8)", border:"1.5px solid #e9d5ff", borderRadius:14, padding:"16px", marginTop:16 }}>
              <div style={{ fontSize:14, fontWeight:600, color:"#6d28d9", marginBottom:6 }}>Понравилось? 🎉</div>
              <div style={{ fontSize:13, color:"#374151", marginBottom:12, lineHeight:1.6 }}>Зарегистрируйся бесплатно и получи ещё 4 генерации</div>
              <button style={{ ...s.btn, marginTop:0 }} onClick={() => setScreen("register")}>Получить ещё 4 генерации →</button>
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
            <input style={{ ...s.inp, flex:1, fontSize:13 }} placeholder="Хочу мягче / добавь CTA / переделай хук…"
              value={followUp} onChange={e => setFollowUp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
            <button onClick={send} disabled={!followUp.trim() || chatLoading} style={{
              padding:"0 16px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"#fff",
              border:"none", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:17,
              opacity:(!followUp.trim() || chatLoading) ? 0.5 : 1
            }}>↑</button>
          </div>
        </div>
      )}
      {userId && <button style={s.btnS} onClick={reset}>← Написать ещё один текст</button>}
    </div></div>
  );
}
