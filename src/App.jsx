import { useState } from "react";

const TEXT_TYPES = [
  { id: "post",     label: "📱 Пост / Мотивация",    desc: "Instagram, Telegram, VK",       styles: ["Живой / Кухонный", "Через личную историю", "Через боль и инсайт"] },
  { id: "sales",    label: "💰 Оффер / УТП",          desc: "Продающий текст, лендинг",      styles: ["Прямой и честный", "Через страх и решение", "Через результат клиента"], structure: true },
  { id: "reels",    label: "🎬 Reels / Видео",        desc: "Сценарий с хуком и CTA",        styles: ["Провокационный хук", "Сторителлинг", "Список / Инструкция"] },
  { id: "promo",    label: "🔥 Прогрев / Сторис",     desc: "Серия дней, воронка",           styles: ["Уязвимость + Экспертность", "День за днём к офферу", "Через ценности и смыслы"] },
  { id: "unpack",   label: "🧠 Распаковка эксперта",  desc: "УТП, позиция, смыслы",          styles: ["Через странность и силу", "Через путь и трансформацию", "Через антипозицию"] },
  { id: "niche",    label: "🔍 Анализ ниши",          desc: "Темы, боли, контент-план",      styles: ["Стратегический разбор", "Через боли аудитории", "Вирусные форматы"] },
  { id: "bio",      label: "✨ Шапка профиля",         desc: "Bio для Instagram / Telegram",  styles: ["Чёткая и конкретная", "С характером и голосом", "Через результат клиента"], structure: true },
  { id: "strategy", label: "📈 Стратегия блога",      desc: "С чего начать и как расти",     styles: ["Пошаговый план", "Через точку А в точку Б", "Быстрый старт с результатом"] },
];

const LENGTHS = ["Короткий (до 100 слов)", "Средний (100–250 слов)", "Длинный (250+ слов)"];

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

function buildSystemPrompt(typeId, style) {
  const structureBlock = (typeId === "sales" || typeId === "bio")
    ? "\nОБЯЗАТЕЛЬНАЯ СТРУКТУРА:\n1. КОМУ\n2. РЕЗУЛЬТАТ\n3. МЕТОД\n4. БОЛЬ\n5. СРОКИ\nПиши живо, не как анкету.\n" +
      (typeId === "bio" ? "\nВАЖНО: шапка профиля Instagram строго до 150 символов включая эмодзи.\n" : "")
    : "";

  const nicheBlock = typeId === "niche"
    ? "\nСТРУКТУРА ОТВЕТА:\n## 🎯 Портрет аудитории\n## 🔥 Топ-10 вирусных тем\n## 😣 Боли и страхи\n## 📅 Контент-план на 2 недели\n## 💡 Идеи для вирусных Reels (5 сценариев)\n## 🚀 Позиционирование эксперта\nКонкретно, без воды.\n"
    : "";

  const strategyBlock = typeId === "strategy"
    ? "\nСТРУКТУРА СТРАТЕГИИ БЛОГА:\n## 🔍 Диагностика точки А\n## 🎯 Цель и точка Б\n## 🧱 Фундамент блога\n## 📅 Контент-система на 30 дней\n## 🚀 Первые шаги с гарантированным результатом\n## ⚠️ Главные ошибки которые тормозят рост\n## 📊 Как измерять результат через 30/60/90 дней\nПиши как наставник, который прошёл этот путь. Конкретно, с цифрами, без воды.\n"
    : "";

  return "Ты — AI Pulse PRO. Маркетолог с глубоким пониманием русского менталитета и психологии аудитории.\n\n" +
    "Ты знаешь:\n" +
    "- Русский человек не верит громким обещаниям — нужна честность и конкретика\n" +
    "- Доверие строится через уязвимость, а не через регалии\n" +
    "- Живой текст продаёт лучше правильного\n" +
    "- Боль надо называть своими именами\n" +
    "- Цифры и сроки снижают тревогу\n\n" +
    "СТИЛЬ: " + style + "\n\n" +
    "ПРАВИЛА:\n" +
    "- Пиши как человек, который понимает проблему изнутри\n" +
    "- Никаких клише: уникальный, комплексный подход — в мусор\n" +
    "- Короткие и длинные фразы вперемешку. Паузы. Многоточия\n" +
    "- Один финальный текст, готовый к публикации\n" +
    structureBlock + nicheBlock + strategyBlock +
    "\nЗАВЕРШЕНИЕ: Задай один вопрос — откликается ли результат, нужна ли доработка.\n" +
    "Пиши только на русском языке.";
}

function Spinner() {
  const [idx, setIdx] = useState(0);
  useState(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MOTIVATIONS.length), 1800);
    return () => clearInterval(t);
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 32, gap: 16 }}>
      <div style={{ width: 40, height: 40, border: "3px solid #e2d9f3", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
      <div style={{ color: "#7c3aed", fontSize: 14, fontWeight: 600, textAlign: "center", minHeight: 22 }}>
        {MOTIVATIONS[idx]}
      </div>
      <div style={{ color: "#c4b5fd", fontSize: 12 }}>Осталось совсем немного…</div>
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
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const noLength = ["niche", "strategy", "bio"];

  const selectType = (t) => { setType(t); setStyle(t.styles[0]); };

  const generate = async () => {
    if (!type || !topic.trim()) return;
    setLoading(true); setScreen("result"); setResult(""); setChatHistory([]);
    const lenMap = ["короткий текст до 100 слов", "текст 100–250 слов", "длинный текст 250+ слов"];
    let userPrompt = "";
    if (type.id === "niche") {
      userPrompt = "Проведи полный анализ ниши: «" + topic + "»." + (extra ? "\nДоп. контекст: " + extra : "");
    } else if (type.id === "strategy") {
      userPrompt = "Разработай стратегию блога для: «" + topic + "»." + (extra ? "\nДоп. контекст: " + extra : "");
    } else {
      userPrompt = "Напиши: " + type.label + " на тему «" + topic + "».\nДлина: " + lenMap[LENGTHS.indexOf(length)] + ".\n" + (extra ? "Контекст: " + extra : "");
    }
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: buildSystemPrompt(type.id, style),
          messages: [{ role: "user", content: userPrompt }]
        })
      });
      const data = await res.json();
      setResult(data.content?.map(b => b.text || "").join("") || "Ошибка генерации.");
    } catch (e) {
      setResult("__error__");
    }
    setLoading(false);
  };

  const sendFollowUp = async () => {
    if (!followUp.trim() || chatLoading) return;
    const userMsg = followUp.trim();
    setFollowUp("");
    const newHistory = [...chatHistory, { role: "user", content: userMsg }];
    setChatHistory(newHistory);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: buildSystemPrompt(type.id, style),
          messages: [
            { role: "user", content: "Ты уже написал текст:\n\n" + result },
            { role: "assistant", content: result },
            ...newHistory
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Ошибка.";
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
    } catch (e) {
      setChatHistory([...newHistory, { role: "assistant", content: "__error__" }]);
    }
    setChatLoading(false);
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const reset = () => { setType(null); setStyle(""); setTopic(""); setExtra(""); setResult(""); setChatHistory([]); setFollowUp(""); setScreen("main"); };

  const s = {
    wrap: { minHeight: "100vh", background: "linear-gradient(135deg,#f5f0ff 0%,#fdf2f8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI',sans-serif", padding: 16 },
    card: { background: "#fff", borderRadius: 20, padding: 28, maxWidth: 540, width: "100%", boxShadow: "0 8px 40px rgba(124,58,237,.12)" },
    title: { fontSize: 24, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 },
    sub: { color: "#6b7280", fontSize: 13, marginBottom: 24 },
    label: { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: ".04em" },
    input: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" },
    textarea: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 68, fontFamily: "inherit" },
    btn: { width: "100%", padding: 13, background: "linear-gradient(135deg,#7c3aed,#a855f7)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 8 },
    btnSec: { width: "100%", padding: 11, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 8 },
    select: { width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fff", outline: "none", boxSizing: "border-box" },
    resultBox: { background: "#f9fafb", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: 18, fontSize: 14, lineHeight: 1.8, color: "#1f2937", whiteSpace: "pre-wrap", minHeight: 140 },
    chip: { display: "inline-block", background: "#ede9fe", color: "#6d28d9", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, marginBottom: 14 },
    badge: { display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, marginBottom: 18 },
  };

  const topicLabel = type?.id === "niche" ? "Ниша / тема бизнеса *" : type?.id === "strategy" ? "Ниша / тема блога *" : "Тема / о чём текст *";
  const topicPlaceholder = type?.id === "niche" ? "Например: нутрициология, психология…" : type?.id === "strategy" ? "Например: блог психолога, коуч по деньгам…" : "Например: курс по инвестициям для мам…";
  const extraPlaceholder = noLength.includes(type?.id) ? "Аудитория, гео, специализация, цели…" : "ЦА, боли, УТП, ключевые смыслы…";
  const btnLabel = type?.id === "niche" ? "🔍 Запустить анализ" : type?.id === "strategy" ? "📈 Построить стратегию" : "✨ Написать текст";
  const subText = type?.id === "niche" ? "Стратегический разбор ниши 🔍" : type?.id === "strategy" ? "Персональная стратегия блога 📈" : "Написано с пониманием русского менталитета 🧠";

  if (screen === "main") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.badge}>✦ AI Pulse PRO активирован</div>
      <div style={s.title}>Создать текст</div>
      <div style={s.sub}>Выбери формат — напишу с душой и пониманием аудитории</div>

      <label style={s.label}>Формат</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
        {TEXT_TYPES.map(t => (
          <div key={t.id} onClick={() => selectType(t)} style={{
            border: type?.id === t.id ? "2px solid #7c3aed" : "2px solid #e5e7eb",
            borderRadius: 12, padding: "10px 12px", cursor: "pointer",
            background: type?.id === t.id ? "#f5f0ff" : "#fff", transition: "all .15s"
          }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a2e" }}>{t.label}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{t.desc}</div>
          </div>
        ))}
      </div>

      {type && (
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Стиль подачи</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {type.styles.map(st => (
              <div key={st} onClick={() => setStyle(st)} style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: 500,
                border: style === st ? "2px solid #7c3aed" : "2px solid #e5e7eb",
                background: style === st ? "#ede9fe" : "#f9fafb",
                color: style === st ? "#6d28d9" : "#374151", transition: "all .15s"
              }}>{st}</div>
            ))}
          </div>
        </div>
      )}

      <label style={s.label}>{topicLabel}</label>
      <input style={s.input} placeholder={topicPlaceholder} value={topic} onChange={e => setTopic(e.target.value)} />

      {!noLength.includes(type?.id) && (
        <div style={{ marginTop: 14 }}>
          <label style={s.label}>Длина</label>
          <select style={s.select} value={length} onChange={e => setLength(e.target.value)}>
            {LENGTHS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <label style={s.label}>Контекст (необязательно)</label>
        <textarea style={s.textarea} placeholder={extraPlaceholder} value={extra} onChange={e => setExtra(e.target.value)} />
      </div>

      <button style={{ ...s.btn, marginTop: 20, opacity: (!type || !topic.trim()) ? 0.5 : 1 }}
        onClick={generate} disabled={!type || !topic.trim()}>
        {btnLabel}
      </button>
    </div></div>
  );

  if (screen === "result") return (
    <div style={s.wrap}><div style={s.card}>
      <div style={s.chip}>{type?.label} · {style}</div>
      <div style={s.title}>{type?.id === "niche" ? "Анализ готов" : type?.id === "strategy" ? "Стратегия готова" : "Твой текст готов"}</div>
      <div style={s.sub}>{subText}</div>

      {loading ? <Spinner /> : result === "__error__" ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>😔</div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#1a1a2e", marginBottom: 8 }}>Что-то пошло не так</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 }}>
            Возможно, слабый интернет или временный сбой.<br />Попробуй ещё раз — обычно со второго раза работает.
          </div>
          <button style={{ ...s.btn, marginTop: 0 }} onClick={() => { setResult(""); setScreen("main"); }}>
            🔄 Попробовать снова
          </button>
        </div>
      ) : (
        <>
          <div style={{ ...s.resultBox, fontSize: noLength.includes(type?.id) ? 13 : 14 }}>{result}</div>
          <button style={s.btn} onClick={copy}>{copied ? "✅ Скопировано!" : "📋 Скопировать"}</button>
        </>
      )}

      {!loading && result && result !== "__error__" && (
        <div style={{ marginTop: 20 }}>
          <div style={{ borderTop: "1px solid #e5e7eb", marginBottom: 14 }} />
          {chatHistory.map((m, i) => (
            <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "85%", padding: "10px 14px", borderRadius: 14,
                fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap",
                background: m.role === "user" ? "linear-gradient(135deg,#7c3aed,#a855f7)" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#1f2937",
                borderBottomRightRadius: m.role === "user" ? 4 : 14,
                borderBottomLeftRadius: m.role === "user" ? 14 : 4,
              }}>{m.content}</div>
            </div>
          ))}
          {chatLoading && <Spinner />}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input style={{ ...s.input, flex: 1, fontSize: 13 }}
              placeholder="Хочу мягче / добавь CTA / переделай хук…"
              value={followUp} onChange={e => setFollowUp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendFollowUp()} />
            <button onClick={sendFollowUp} disabled={!followUp.trim() || chatLoading} style={{
              padding: "0 16px", background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              color: "#fff", border: "none", borderRadius: 10, fontWeight: 700,
              cursor: "pointer", fontSize: 17, opacity: (!followUp.trim() || chatLoading) ? 0.5 : 1
            }}>↑</button>
          </div>
        </div>
      )}

      <button style={s.btnSec} onClick={reset}>← Написать ещё один текст</button>
    </div></div>
  );
}
