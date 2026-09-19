const DAYS = ["日", "月", "火", "水", "木", "金", "土"];

function nowJst() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function minutesOf(d) {
  return d.getHours() * 60 + d.getMinutes();
}

function currentSlot(d) {
  const day = d.getDay();
  const m = minutesOf(d);

  if (day === 2 && m >= 10 * 60 && m < 12 * 60) {
    return {
      title: "Stardust Playlist",
      note: "火曜のラジオ風配信（YouTube 10:00–12:00）",
    };
  }
  if (m >= 19 * 60 + 45 && m < 24 * 60 + 30 && (day === 0 || day === 4)) {
    return {
      title: "銀河STAGE MusicFES の時間帯",
      note: "月2回の日曜・木曜枠。開催日はXの告知を見てね。",
    };
  }
  if (m >= 20 * 60 && m < 22 * 60 + 30) {
    return {
      title: "Stardust DIVA / メンバーシップ歌枠",
      note: "YouTube と REALITY の夜の歌。当日タイトルは予告へ。",
    };
  }
  if (m >= 23 * 60 || m < 13 * 60 + 30) {
    return {
      title: "fairy room open♡",
      note: "シェリの楽屋部屋。作業・雑談・歌・コラボ。",
    };
  }
  return {
    title: "準備の時間 / 地球のお散歩",
    note: "子ども食堂や作曲のつぶやきは X に落ちてることが多いよ。",
  };
}

function tick() {
  const clock = document.getElementById("clock");
  if (!clock) return;
  const d = nowJst();
  clock.textContent =
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const weekday = document.getElementById("weekday");
  if (weekday) {
    weekday.textContent =
      `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}（${DAYS[d.getDay()]}）`;
  }
  const slot = currentSlot(d);
  const nowTitle = document.getElementById("nowTitle");
  const nowNote = document.getElementById("nowNote");
  if (nowTitle) nowTitle.textContent = slot.title;
  if (nowNote) nowNote.textContent = slot.note;
}

tick();
setInterval(tick, 1000);

const menuBtn = document.getElementById("menuBtn");
if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    document.querySelector(".nav").classList.toggle("open");
  });
}

const QUESTIONS = [
  {
    q: "今月号：シェリが地球でよく手がける、ステージ以外の小さな活動はどれ？",
    choices: ["子ども食堂と社会貢献の発信", "プロ野球解説", "深夜だけ映画レビュー"],
    a: 0,
    explain: "Xでは #こども食堂 #社会貢献 で、ご飯とお菓子と笑顔の話をしてるよ。",
  },
  {
    q: "火曜の朝に開くラジオ風番組の名前は？",
    choices: ["Stardust DIVA", "Stardust Playlist", "fairy room radio"],
    a: 1,
    explain: "毎週火曜 10:00–12:00 YouTube『Stardust Playlist』。",
  },
  {
    q: "23:00から翌朝にかけて開いてることが多い部屋は？",
    choices: ["RECORD店頭", "シェリの楽屋部屋 fairy room open♡", "銀河郵便局"],
    a: 1,
    explain: "歌も作業も雑談もコラボも、楽屋でごちゃまぜ。",
  },
  {
    q: "配信の振り返りを文章で残している note の名前は？",
    choices: ["銀河の記憶", "スターパフェ通信", "マクロス日誌"],
    a: 0,
    explain: "セトリの星図は X のエトワールセトリ、物語寄りの記録は銀河の記憶。",
  },
  {
    q: "ファンネームはどれ？",
    choices: ["#cherylwings", "#galaxywaiters", "#parfaitknights"],
    a: 0,
    explain: "シェリルの羽根を分け合う仲間が #cherylwings。ファンマークは 🦋🌟🌈。",
  },
];

let qi = 0;
let score = 0;
const qEl = document.getElementById("quizQ");
const cEl = document.getElementById("quizChoices");
const pEl = document.getElementById("quizProgress");
const fEl = document.getElementById("quizFeedback");
const nBtn = document.getElementById("quizNext");
const rEl = document.getElementById("quizResult");

function renderQuiz() {
  const item = QUESTIONS[qi];
  pEl.textContent = `${qi + 1} / ${QUESTIONS.length}`;
  qEl.textContent = item.q;
  fEl.textContent = "";
  nBtn.hidden = true;
  rEl.hidden = true;
  cEl.innerHTML = "";
  item.choices.forEach((choice, idx) => {
    const b = document.createElement("button");
    b.textContent = choice;
    b.addEventListener("click", () => answer(idx));
    cEl.appendChild(b);
  });
}

function answer(idx) {
  const item = QUESTIONS[qi];
  const buttons = [...cEl.querySelectorAll("button")];
  buttons.forEach((b) => (b.disabled = true));
  if (idx === item.a) {
    score += 1;
    fEl.textContent = "キラッ。正解♡ " + item.explain;
  } else {
    fEl.textContent = "おしい。 " + item.explain;
  }
  nBtn.hidden = false;
  nBtn.textContent = qi === QUESTIONS.length - 1 ? "結果を見る" : "つぎへ";
}

nBtn.addEventListener("click", () => {
  if (qi < QUESTIONS.length - 1) {
    qi += 1;
    renderQuiz();
  } else {
    cEl.innerHTML = "";
    nBtn.hidden = true;
    rEl.hidden = false;
    rEl.innerHTML = `<p>${score} / ${QUESTIONS.length} 問正解！</p>
      <p>${score >= 4 ? "羽根の具合、いいね。#cherylwings" : "また来月号も遊びに来てね。"}</p>
      <button class="btn ghost" id="quizRetry">もういちど</button>`;
    document.getElementById("quizRetry").addEventListener("click", () => {
      qi = 0;
      score = 0;
      renderQuiz();
    });
  }
});

renderQuiz();

const titleEl = document.getElementById("memoTitle");
const bodyEl = document.getElementById("memoBody");
const statusEl = document.getElementById("memoStatus");

function loadMemo() {
  const raw = localStorage.getItem("gfr-memo");
  if (!raw) return;
  const data = JSON.parse(raw);
  titleEl.value = data.title || "";
  bodyEl.value = data.body || "";
  statusEl.textContent = data.savedAt
    ? `さいごに保存：${data.savedAt}`
    : "読み込んだよ。";
}

document.getElementById("saveMemo").addEventListener("click", () => {
  const savedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  localStorage.setItem(
    "gfr-memo",
    JSON.stringify({ title: titleEl.value, body: bodyEl.value, savedAt })
  );
  statusEl.textContent = `保存したよ（${savedAt}）この端末だけに残るよ。`;
});

document.getElementById("clearMemo").addEventListener("click", () => {
  titleEl.value = "";
  bodyEl.value = "";
  localStorage.removeItem("gfr-memo");
  statusEl.textContent = "消したよ。";
});

document.getElementById("exportMemo").addEventListener("click", () => {
  const text = `${titleEl.value}\n\n${bodyEl.value}\n`;
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${titleEl.value || "sheryl-memo"}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

loadMemo();
