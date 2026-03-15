<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Pulse PRO</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; min-height: 100vh; background: linear-gradient(135deg, #f5f0ff 0%, #fdf2f8 100%); display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: #fff; border-radius: 20px; padding: 28px; max-width: 540px; width: 100%; box-shadow: 0 8px 40px rgba(124,58,237,.12); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 600; margin-bottom: 18px; }
    h1 { font-size: 24px; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
    .sub { color: #6b7280; font-size: 13px; margin-bottom: 24px; }
    .lbl { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: .04em; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 18px; }
    .type-card { border: 2px solid #e5e7eb; border-radius: 12px; padding: 10px 12px; cursor: pointer; background: #fff; transition: all .15s; }
    .type-card:hover { border-color: #c4b5fd; }
    .type-card.active { border-color: #7c3aed; background: #f5f0ff; }
    .type-card .name { font-weight: 600; font-size: 14px; color: #1a1a2e; }
    .type-card .desc { font-size: 11px; color: #9ca3af; margin-top: 2px; }
    .styles { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .style-btn { padding: 7px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; font-weight: 500; border: 2px solid #e5e7eb; background: #f9fafb; color: #374151; transition: all .15s; }
    .style-btn.active { border-color: #7c3aed; background: #ede9fe; color: #6d28d9; }
    input, select, textarea { width: 100%; padding: 11px 14px; border: 1.5px solid #e5e7eb; border-radius: 10px; font-size: 14px; outline: none; font-family: inherit; }
    textarea { resize: vertical; min-height: 68px; }
    .btn { width: 100%; padding: 13px; background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-sec { width: 100%; padding: 11px; background: #f3f4f6; color: #374151; border: none; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; margin-top: 8px; }
    .chip { display: inline-block; background: #ede9fe; color: #6d28d9; border-radius: 20px; padding: 3px 12px; font-size: 12px; font-weight: 600; margin-bottom: 14px; }
    .result-box { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 14px; padding: 18px; font-size: 14px; line-height: 1.8; color: #1f2937; white-space: pre-wrap; min-height: 140px; }
    .spinner { display: flex; flex-direction: column; align-items: center; padding: 32px; gap: 16px; }
    .spin { width: 40px; height: 40px; border: 3px solid #e2d9f3; border-top: 3px solid #7c3aed; border-radius: 50%; animation: spin .8s linear infinite; }
    .spin-text { color: #7c3aed; font-size: 14px; font-weight: 600; text-align: center; }
    .spin-sub { color: #c4b5fd; font-size: 12px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .chat-msg { margin-bottom: 10px; display: flex; }
    .chat-msg.user { justify-content: flex-end; }
    .chat-bubble { max-width: 85%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; }
    .chat-bubble.user { background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; border-bottom-right-radius: 4px; }
    .chat-bubble.bot { background: #f3f4f6; color: #1f2937; border-bottom-left-radius: 4px; }
    .chat-input-row { display: flex; gap: 8px; margin-top: 8px; }
    .chat-input-row input { flex: 1; }
    .send-btn { padding: 0 16px; background: linear-gradient(135deg,#7c3aed,#a855f7); color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 17px; }
    .send-btn:disabled { opacity: 0.5; }
    .divider { border-top: 1px solid #e5e7eb; margin: 14px 0; }
    .mt14 { margin-top: 14px; }
    .mt20 { margin-top: 20px; }
    .error-box { text-align: center; padding: 24px 0; }
    .error-emoji { font-size: 40px; margin-bottom: 12px; }
    .error-title { font-weight: 600; font-size: 16px; color: #1a1a2e; margin-bottom: 8px; }
    .error-sub { font-size: 13px; color: #6b7280; margin-bottom: 24px; line-height: 1.6; }
    #screen-result { display: none; }
  </style>
</head>
<body>
<div class="card" id="screen-main">
  <div class="badge">✦ AI Pulse PRO активирован</div>
  <h1>Создать текст</h1>
  <p class="sub">Выбери формат — напишу с душой и пониманием аудитории</p>
  <label class="lbl">Формат</label>
  <div class="grid" id="types-grid"></div>
  <div id="styles-section" style="display:none; margin-bottom:16px;">
    <label class="lbl">Стиль подачи</label>
    <div class="styles" id="styles-grid"></div>
  </div>
  <label class="lbl" id="topic-label">Тема / о чём *</label>
  <input type="text" id="topic-input" placeholder="Например: курс по инвестициям для мам…" />
  <div id="length-section" class="mt14">
    <label class="lbl">Длина</label>
    <select id="length-select">
      <option>Короткий (до 100 слов)</option>
      <option>Средний (100–250 слов)</option>
      <option>Длинный (250+ слов)</option>
    </select>
  </div>
  <div class="mt14">
    <label class="lbl">Контекст (необязательно)</label>
    <textarea id="extra-input" placeholder="ЦА, боли, УТП, ключевые смыслы…"></textarea>
  </div>
  <button class="btn mt20" id="generate-btn" disabled onclick="generate()">✨ Написать текст</button>
</div>

<div class="card" id="screen-result" style="display:none;">
  <div class="chip" id="result-chip"></div>
  <h1 id="result-title">Твой текст готов</h1>
  <p class="sub" id="result-sub">Написано с пониманием русского менталитета 🧠</p>
  <div id="result-content"></div>
  <div id="chat-section" style="display:none; margin-top:20px;">
    <div class="divider"></div>
    <div id="chat-messages"></div>
    <div class="chat-input-row">
      <input type="text" id="followup-input" placeholder="Хочу мягче / добавь CTA / переделай хук…" onkeydown="if(event.key==='Enter')sendFollowUp()" />
      <button class="send-btn" id="send-btn" onclick="sendFollowUp()">↑</button>
    </div>
  </div>
  <button class="btn-sec" onclick="resetApp()" style="margin-top:8px;">← Написать ещё один текст</button>
</div>

<script>
const TYPES = [
  { id:"post",     label:"📱 Пост / Мотивация",   desc:"Instagram, Telegram, VK",      styles:["Живой / Кухонный","Через личную историю","Через боль и инсайт"] },
  { id:"sales",    label:"💰 Оффер / УТП",         desc:"Продающий текст, лендинг",     styles:["Прямой и честный","Через страх и решение","Через результат клиента"] },
  { id:"reels",    label:"🎬 Reels / Видео",       desc:"Сценарий с хуком и CTA",       styles:["Провокационный хук","Сторителлинг","Список / Инструкция"] },
  { id:"promo",    label:"🔥 Прогрев / Сторис",    desc:"Серия дней, воронка",          styles:["Уязвимость + Экспертность","День за днём к офферу","Через ценности и смыслы"] },
  { id:"threads",  label:"🧵 Threads",             desc:"Цепочка постов с вовлечением", styles:["Провокационный старт","Через личную историю","Список / Инсайты"] },
  { id:"plan",     label:"📅 Контент-план",        desc:"План публикаций на месяц",     styles:["По болям аудитории","По воронке продаж","Микс форматов"] },
  { id:"niche",    label:"🔍 Анализ ниши",         desc:"Темы, боли, контент-план",     styles:["Стратегический разбор","Через боли аудитории","Вирусные форматы"] },
  { id:"bio",      label:"✨ Шапка профиля",        desc:"Bio для Instagram / Telegram", styles:["Чёткая и конкретная","С характером и голосом","Через результат клиента"] },
  { id:"strategy", label:"📈 Стратегия блога",     desc:"С чего начать и как расти",    styles:["Пошаговый план","Через точку А в точку Б","Быстрый старт с результатом"] },
];
const NO_LENGTH = ["niche","strategy","bio","plan","promo","threads"];
const MOTIVATIONS = ["Уже думаю над смыслами… 🧠","Ищу правильные слова… ✍️","Чувствую твою аудиторию… 👥","Выстраиваю структуру… 📐","Добавляю живость и душу… 💜","Убираю всю воду… 🧹","Почти готово, дошлифовываю… ✨","Последний штрих — и всё! 🎯"];

let currentType = null, currentStyle = "", chatHistory = [], currentResult = "";
let motIdx = 0, motTimer = null;

function buildPrompt(typeId, style) {
  const base = "Ты — AI Pulse PRO. Маркетолог с опытом 20+ лет и глубоким пониманием русского менталитета.\n\nТы знаешь:\n- Русский человек не верит громким обещаниям — нужна честность и конкретика\n- Доверие строится через уязвимость, а не через регалии\n- Живой текст продаёт лучше правильного\n- Боль надо называть своими именами\n- Цифры и сроки снижают тревогу\n\nСТИЛЬ: " + style + "\n\nПРАВИЛА:\n- Никаких звёздочек и markdown-разметки\n- Никаких клише: уникальный, комплексный подход — в мусор\n- Короткие и длинные фразы вперемешку. Паузы. Многоточия\n- Пиши как человек который понимает проблему изнутри\n";
  const map = {
    post: "\nСТРУКТУРА ПОСТА:\n1. ХУК — 1-2 строки которые останавливают скролл\n2. ИСТОРИЯ / БОЛЬ — личная ситуация или узнаваемая проблема\n3. ИНСАЙТ — неожиданный поворот или вывод\n4. ПОЛЬЗА — конкретный совет или шаг\n5. МЯГКИЙ CTA — вопрос к аудитории без давления\n",
    sales: "\nСТРУКТУРА ОФФЕРА:\n1. КОМУ — точный портрет человека в его ситуации\n2. БОЛЬ — острая проблема своими словами без смягчений\n3. РЕЗУЛЬТАТ — что конкретно получит в измеримых словах\n4. МЕТОД — как работает, в чём уникальность\n5. СРОКИ — когда будет результат\n6. CTA — конкретный следующий шаг без давления\n",
    reels: "\nСЦЕНАРИЙ REELS:\n0-3 сек: ХУК — провокация, боль или обещание\n3-10 сек: ПРОБЛЕМА — раскрываешь боль\n10-25 сек: РЕШЕНИЕ — 3 шага или одна сильная идея\n25-30 сек: CTA — что сделать прямо сейчас\nПиши как сценарий: что говорить, что показывать, текст на экране\n",
    promo: "\nСЕРИЯ ПРОГРЕВА НА 6 ДНЕЙ:\nДень 1: Контекст — кто ты, через историю без регалий\nДень 2: Боль — понимаешь проблему изнутри\nДень 3: Уязвимость — личная история провала, строит доверие\nДень 4: Ценности — во что веришь, как смотришь на мир\nДень 5: Решение — продукт через результат или кейс\nДень 6: Оффер — мягкое закрытие с ограничением\nКаждый день заканчивается вопросом или интригой\n",
    threads: "\nЦЕПОЧКА ДЛЯ THREADS:\nПост 1 (хук): провокация или неожиданное утверждение\nПосты 2-4: раскрываешь идею по шагам, каждый заканчивается интригой\nПост 5: инсайт или неожиданный поворот\nПост 6 (финал): вывод + мягкий CTA\nКаждый пост до 500 символов, читается отдельно но тянет к следующему\n",
    plan: "\nКОНТЕНТ-ПЛАН НА МЕСЯЦ:\n30 постов: день / формат / тема / суть в одном предложении\nСоотношение: 40% польза, 30% личное и доверие, 20% продажи, 10% вовлечение\nФорматы чередуй: пост, Reels, сторис, карусель\nТемы ведут по воронке: знакомство — доверие — желание — покупка\n",
    niche: "\nАНАЛИЗ НИШИ:\nПортрет аудитории — кто, что тревожит, о чём мечтают\nТоп-10 вирусных тем с объяснением почему зайдут\nБоли и страхи — явные и глубокие\nКонтент-план на 2 недели — тема, формат, суть\n5 идей для Reels с хуком\nПозиционирование — как выделиться среди конкурентов\n",
    bio: "\nШАПКА ПРОФИЛЯ INSTAGRAM:\nСтрого до 150 символов включая эмодзи\nНикаких заголовков — только живой текст\nДай 3 варианта пронумерованных\nВ каждом: кто ты + что даёшь + призыв к действию\nТолько конкретика\n",
    strategy: "\nСТРАТЕГИЯ БЛОГА:\nДиагностика точки А — где человек сейчас\nТочка Б — что хочет через 3-6 месяцев\nФундамент — позиционирование, голос, отличие\nКонтент-система на 30 дней\n5 первых шагов с гарантированным результатом\nТоп-3 ошибки которые тормозят рост\nМетрики победы через 30/60/90 дней\n",
  };
  return base + (map[typeId] || "") + "\nЗАВЕРШЕНИЕ: Мягко заверши и задай один вопрос — откликается ли результат.\nПиши только на русском языке.";
}

function clean(t) { return t.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1"); }

function renderTypes() {
  const grid = document.getElementById("types-grid");
  grid.innerHTML = TYPES.map(t =>
    '<div class="type-card" id="tc-'+t.id+'" onclick="selectType(\''+t.id+'\')">' +
    '<div class="name">'+t.label+'</div>' +
    '<div class="desc">'+t.desc+'</div></div>'
  ).join("");
}

function selectType(id) {
  currentType = TYPES.find(t => t.id === id);
  document.querySelectorAll(".type-card").forEach(el => el.classList.remove("active"));
  document.getElementById("tc-"+id).classList.add("active");
  currentStyle = currentType.styles[0];
  renderStyles();
  document.getElementById("styles-section").style.display = "block";
  const noLen = NO_LENGTH.includes(id);
  document.getElementById("length-section").style.display = noLen ? "none" : "block";
  const lbl = document.getElementById("topic-label");
  if (id === "niche" || id === "plan") lbl.textContent = "Ниша / тема бизнеса *";
  else if (id === "strategy") lbl.textContent = "Ниша / тема блога *";
  else lbl.textContent = "Тема / о чём *";
  checkBtn();
}

function renderStyles() {
  const grid = document.getElementById("styles-grid");
  grid.innerHTML = currentType.styles.map(st =>
    '<div class="style-btn'+(st===currentStyle?" active":"")+'" onclick="selectStyle(\''+st.replace(/'/g,"\\'")+'\')">' + st + '</div>'
  ).join("");
}

function selectStyle(st) {
  currentStyle = st;
  renderStyles();
}

function checkBtn() {
  const btn = document.getElementById("generate-btn");
  const topic = document.getElementById("topic-input").value.trim();
  btn.disabled = !currentType || !topic;
  if (currentType) {
    const id = currentType.id;
    btn.textContent = id === "niche" ? "🔍 Запустить анализ" : id === "strategy" ? "📈 Построить стратегию" : id === "plan" ? "📅 Составить план" : "✨ Написать текст";
  }
}

function startSpinner() {
  motIdx = 0;
  const content = document.getElementById("result-content");
  content.innerHTML = '<div class="spinner"><div class="spin"></div><div class="spin-text" id="mot-text">'+MOTIVATIONS[0]+'</div><div class="spin-sub">Осталось совсем немного…</div></div>';
  motTimer = setInterval(() => {
    motIdx = (motIdx + 1) % MOTIVATIONS.length;
    const el = document.getElementById("mot-text");
    if (el) el.textContent = MOTIVATIONS[motIdx];
  }, 1800);
}

function stopSpinner() { clearInterval(motTimer); }

async function generate() {
  if (!currentType) return;
  const topic = document.getElementById("topic-input").value.trim();
  const extra = document.getElementById("extra-input").value.trim();
  const length = document.getElementById("length-select").value;
  if (!topic) return;
  chatHistory = []; currentResult = "";
  document.getElementById("screen-main").style.display = "none";
  document.getElementById("screen-result").style.display = "block";
  document.getElementById("result-chip").textContent = currentType.label + " · " + currentStyle;
  const id = currentType.id;
  document.getElementById("result-title").textContent = "Генерируем...";
  document.getElementById("result-sub").textContent = id === "niche" ? "Стратегический разбор ниши 🔍" : id === "strategy" ? "Персональная стратегия блога 📈" : id === "plan" ? "Контент-план на месяц 📅" : "Написано с пониманием русского менталитета 🧠";
  document.getElementById("chat-section").style.display = "none";
  startSpinner();
  const lenMap = {"Короткий (до 100 слов)":"короткий текст до 100 слов","Средний (100–250 слов)":"текст 100–250 слов","Длинный (250+ слов)":"длинный текст 250+ слов"};
  let q = "";
  if (id === "niche") q = "Проведи полный анализ ниши: " + topic + "." + (extra ? "\n" + extra : "");
  else if (id === "strategy") q = "Разработай стратегию блога для: " + topic + "." + (extra ? "\n" + extra : "");
  else if (id === "plan") q = "Составь контент-план на месяц для ниши: " + topic + "." + (extra ? "\n" + extra : "");
  else if (id === "promo") q = "Напиши серию прогрева на 6 дней для: " + topic + "." + (extra ? "\n" + extra : "");
  else if (id === "threads") q = "Напиши цепочку из 6 постов для Threads на тему: " + topic + "." + (extra ? "\n" + extra : "");
  else q = "Напиши " + currentType.label + " на тему: " + topic + ".\nДлина: " + lenMap[length] + ".\n" + (extra || "");
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: buildPrompt(id, currentStyle),
        messages: [{ role: "user", content: q }]
      })
    });
    const data = await res.json();
    currentResult = clean(data.content?.map(b => b.text || "").join("") || "Ошибка генерации.");
    stopSpinner();
    document.getElementById("result-title").textContent = id === "niche" ? "Анализ готов" : id === "strategy" ? "Стратегия готова" : id === "plan" ? "Контент-план готов" : "Твой текст готов";
    document.getElementById("result-content").innerHTML =
      '<div class="result-box" style="font-size:'+(NO_LENGTH.includes(id)?"13":"14")+'px">'+currentResult.replace(/</g,"&lt;")+'</div>' +
      '<button class="btn" onclick="copyResult()">📋 Скопировать</button>';
    document.getElementById("chat-section").style.display = "block";
    document.getElementById("chat-messages").innerHTML = "";
  } catch(e) {
    stopSpinner();
    document.getElementById("result-title").textContent = "Что-то пошло не так";
    document.getElementById("result-content").innerHTML =
      '<div class="error-box"><div class="error-emoji">😔</div><div class="error-title">Ошибка соединения</div><div class="error-sub">Попробуй ещё раз.</div>' +
      '<button class="btn" style="margin-top:0" onclick="resetApp()">🔄 Попробовать снова</button></div>';
  }
}

async function sendFollowUp() {
  const input = document.getElementById("followup-input");
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  const messages = document.getElementById("chat-messages");
  messages.innerHTML += '<div class="chat-msg user"><div class="chat-bubble user">'+msg.replace(/</g,"&lt;")+'</div></div>';
  chatHistory.push({ role: "user", content: msg });
  messages.innerHTML += '<div class="chat-msg" id="typing"><div class="chat-bubble bot">…</div></div>';
  messages.scrollTop = messages.scrollHeight;
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        system: buildPrompt(currentType.id, currentStyle),
        messages: [
          { role: "user", content: "Ты уже написал:\n\n" + currentResult },
          { role: "assistant", content: currentResult },
          ...chatHistory
        ]
      })
    });
    const data = await res.json();
    const reply = clean(data.content?.map(b => b.text || "").join("") || "Ошибка.");
    chatHistory.push({ role: "assistant", content: reply });
    document.getElementById("typing").remove();
    messages.innerHTML += '<div class="chat-msg"><div class="chat-bubble bot">'+reply.replace(/</g,"&lt;")+'</div></div>';
    messages.scrollTop = messages.scrollHeight;
  } catch(e) {
    document.getElementById("typing").remove();
    messages.innerHTML += '<div class="chat-msg"><div class="chat-bubble bot">Ошибка соединения.</div></div>';
  }
}

function copyResult() {
  navigator.clipboard.writeText(currentResult);
  const btn = event.target;
  btn.textContent = "✅ Скопировано!";
  setTimeout(() => btn.textContent = "📋 Скопировать", 2000);
}

function resetApp() {
  document.getElementById("screen-result").style.display = "none";
  document.getElementById("screen-main").style.display = "block";
  currentType = null; currentStyle = ""; chatHistory = []; currentResult = "";
  document.querySelectorAll(".type-card").forEach(el => el.classList.remove("active"));
  document.getElementById("styles-section").style.display = "none";
  document.getElementById("topic-input").value = "";
  document.getElementById("extra-input").value = "";
  document.getElementById("generate-btn").disabled = true;
  document.getElementById("generate-btn").textContent = "✨ Написать текст";
}

document.getElementById("topic-input").addEventListener("input", checkBtn);
renderTypes();
</script>
</body>
</html>
