/* Angel Concept Hub v1
   - Warm & minimal
   - localStorage only
   - Private mode default
   - Share mode = copy / download only (no auto publishing)
*/

const STORAGE_KEY = "angel_concept_hub_v1";
const MODE_KEY = "angel_concept_hub_mode_v1"; // "private" | "share"

const pages = Array.from(document.querySelectorAll(".page"));
const modeBtn = document.getElementById("modeBtn");
const modeLabel = document.getElementById("modeLabel");
const modeModal = document.getElementById("modeModal");
const pickPrivate = document.getElementById("pickPrivate");
const pickShare = document.getElementById("pickShare");
const confirmModeBtn = document.getElementById("confirmModeBtn");

const reviewBtn = document.getElementById("reviewBtn");
const reviewPanel = document.getElementById("reviewPanel");
const reviewBox = document.getElementById("reviewBox");
const closeReview = document.getElementById("closeReview");
const copyAllBtn = document.getElementById("copyAllBtn");
const downloadBtn = document.getElementById("downloadBtn");

const t1 = document.getElementById("t1");
const t2 = document.getElementById("t2");
const t3 = document.getElementById("t3");
const t4 = document.getElementById("t4");

// ---- State ----
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { t1: "", t2: "", t3: "", t4: "", updatedAt: "" };
  } catch {
    return { t1: "", t2: "", t3: "", t4: "", updatedAt: "" };
  }
}

function saveState(partial) {
  const state = { ...loadState(), ...partial, updatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getMode() {
  const m = localStorage.getItem(MODE_KEY);
  return (m === "share" || m === "private") ? m : "private";
}

function setMode(m) {
  localStorage.setItem(MODE_KEY, m);
  renderMode();
}

function renderMode() {
  const m = getMode();
  modeLabel.textContent = (m === "private") ? "留給自己" : "願意分享";
  // dot color hint via inline style
  const dot = modeBtn.querySelector(".dot");
  dot.style.background = (m === "private") ? "#2e6b3b" : "#0c2a16";
  dot.style.boxShadow = (m === "private")
    ? "0 0 0 4px rgba(46,107,59,.12)"
    : "0 0 0 4px rgba(12,42,22,.10)";
}

// ---- Navigation ----
function showPage(name) {
  pages.forEach(p => p.classList.toggle("active", p.dataset.page === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) {
    const target = go.getAttribute("data-go");
    showPage(target);
    return;
  }

  const saveBtn = e.target.closest("[data-save]");
  if (saveBtn) {
    const fieldId = saveBtn.getAttribute("data-save");
    const next = saveBtn.getAttribute("data-next");
    const val = (document.getElementById(fieldId)?.value || "").trim();

    // Save even if empty: user may want to keep blank as a state
    saveState({ [fieldId]: val });

    // Light feedback: no toast, no judgement
    showPage(next);
    return;
  }
});

// ---- Init load ----
(function init() {
  const state = loadState();
  t1.value = state.t1 || "";
  t2.value = state.t2 || "";
  t3.value = state.t3 || "";
  t4.value = state.t4 || "";
  renderMode();
})();

// ---- Mode modal ----
let pendingMode = getMode();

modeBtn.addEventListener("click", () => {
  pendingMode = getMode();
  modeModal.showModal();
});

pickPrivate.addEventListener("click", () => {
  pendingMode = "private";
  pickPrivate.style.borderColor = "rgba(46,107,59,.45)";
  pickShare.style.borderColor = "rgba(16,32,22,.12)";
});

pickShare.addEventListener("click", () => {
  pendingMode = "share";
  pickShare.style.borderColor = "rgba(12,42,22,.40)";
  pickPrivate.style.borderColor = "rgba(16,32,22,.12)";
});

confirmModeBtn.addEventListener("click", () => {
  setMode(pendingMode);
  // dialog closes by form method=dialog
});

// ---- Review panel ----
function buildReviewText() {
  const s = loadState();
  const blocks = [
    ["我還在我自己裡面嗎", s.t1],
    ["我其實對什麼有感覺", s.t2],
    ["有哪些東西，我其實不想放掉", s.t3],
    ["如果我願意出現一下", s.t4],
  ];

  const body = blocks.map(([title, text]) => {
    const t = (text || "").trim();
    return `【${title}】\n${t ? t : "（留白）"}`;
  }).join("\n\n");

  const footer = (getMode() === "private")
    ? "\n\n—\n模式：留給自己（內容只存在你的裝置）"
    : "\n\n—\n模式：願意分享（你可自行複製/下載，沒有自動對外）";

  return body + footer;
}

reviewBtn.addEventListener("click", () => {
  reviewPanel.hidden = false;
  reviewBox.textContent = buildReviewText();
});

closeReview.addEventListener("click", () => {
  reviewPanel.hidden = true;
});

copyAllBtn.addEventListener("click", async () => {
  const text = buildReviewText();
  try {
    await navigator.clipboard.writeText(text);
    copyAllBtn.textContent = "已複製";
    setTimeout(() => (copyAllBtn.textContent = "複製"), 900);
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyAllBtn.textContent = "已複製";
    setTimeout(() => (copyAllBtn.textContent = "複製"), 900);
  }
});

downloadBtn.addEventListener("click", () => {
  const text = buildReviewText();
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const ts = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const name = `angel-notes-${ts.getFullYear()}${pad(ts.getMonth()+1)}${pad(ts.getDate())}-${pad(ts.getHours())}${pad(ts.getMinutes())}.txt`;
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Keep state synced while typing, but gently (no heavy autosave)
[t1, t2, t3, t4].forEach((el) => {
  el.addEventListener("blur", () => {
    const id = el.id;
    saveState({ [id]: el.value.trim() });
  });
});