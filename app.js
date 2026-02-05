
const NOTES_KEY = 'angel_concept_hub_notes_v12';
const GUIDES_KEY = 'angel_concept_hub_guides_v12';

const GUIDES = [
  {
    id:'g1',
    title:'引導一｜一句定位（你是誰、幫誰、怎麼幫）',
    desc:'把你腦中的「我想做什麼」變成一段清楚的介紹句。',
    why:'讓你之後寫簡介、做名片、做內容時，不用從零開始。',
    fillLabel:'跟著填（不用漂亮）',
    fillPH:'例如：我幫助＿＿＿（誰），用＿＿＿（方法/工具），解決＿＿＿（哪個痛點），讓他們得到＿＿＿（結果）。',
    keepLabel:'今天先留一句（可直接存到筆記庫）',
    keepPH:'把你覺得最有感的一句留住…'
  },
  {
    id:'g2',
    title:'引導二｜三個亮點（你最能提供什麼）',
    desc:'把你的專業拆成三個最有力量的亮點。',
    why:'讓別人一看就懂你能帶來什麼，自己也更聚焦。',
    fillLabel:'跟著填',
    fillPH:'亮點 1：＿＿＿\n亮點 2：＿＿＿\n亮點 3：＿＿＿\n（提示：用「動詞＋結果」）',
    keepLabel:'今天先留一句',
    keepPH:'你最想被記住的一句是…'
  },
  {
    id:'g3',
    title:'引導三｜素材池（你有哪些可以用的故事/問題）',
    desc:'把分散在生活裡的碎片，放進同一個素材池。',
    why:'素材池一滿，你就不會再害怕「沒內容」。',
    fillLabel:'跟著填',
    fillPH:'1) 我最近的一個小故事：＿＿＿\n2) 我常被問的問題：＿＿＿\n3) 我踩過的坑：＿＿＿\n4) 我最想提醒的事：＿＿＿',
    keepLabel:'今天先留一句',
    keepPH:'把其中一個最有感的碎片記下來…'
  },
  {
    id:'g4',
    title:'引導四｜一句金句（把觀點說得更好懂）',
    desc:'把你想說的道理，變成一句可以被轉貼的話。',
    why:'金句是你的「名片語氣」，會一直重複被用到。',
    fillLabel:'跟著填',
    fillPH:'把這句改寫成更好懂：\n「＿＿＿」\n再寫 2 個不同說法：\nA. ＿＿＿\nB. ＿＿＿',
    keepLabel:'今天先留一句',
    keepPH:'你覺得最像你的那一句…'
  },
  {
    id:'g5',
    title:'引導五｜最小產品（先做一個小而可用的版本）',
    desc:'你不需要一次做大，先做「小而可用」。',
    why:'降低壓力、提高完成率，也讓你更快拿到回饋。',
    fillLabel:'跟著填',
    fillPH:'我先做的最小版本是：＿＿＿\n它只解決這一件事：＿＿＿\n我會用這個形式：文章 / 影片 / 工具 / 活動 / 其他\n我需要準備：＿＿＿',
    keepLabel:'今天先留一句',
    keepPH:'今天我願意做的最小一步是…'
  },
  {
    id:'g6',
    title:'引導六｜下一步（我要怎麼把它變成對外介紹）',
    desc:'把你整理的東西，轉成「可對外使用」的結構。',
    why:'當你需要合作/招生/發佈時，你不用慌張。',
    fillLabel:'跟著填',
    fillPH:'一句自我介紹：＿＿＿\n三個亮點：＿＿＿ / ＿＿＿ / ＿＿＿\n我想提供的入口（未來）：連結/表單/LINE/網站…',
    keepLabel:'今天先留一句',
    keepPH:'我想先讓別人看見的那一句是…'
  }
];

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast._tm);
  toast._tm = setTimeout(()=>t.classList.remove('on'), 1200);
}

function nowISO(){ return new Date().toISOString(); }

function loadNotes(){
  try { return JSON.parse(localStorage.getItem(NOTES_KEY) || '[]'); }
  catch { return []; }
}
function saveNotes(notes){
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}
function addNote(text, source=''){
  const t = (text||'').trim();
  if(!t) return false;
  const notes = loadNotes();
  notes.unshift({ id: crypto.randomUUID?.() || String(Date.now()), text: t, source, createdAt: nowISO(), updatedAt: nowISO() });
  saveNotes(notes);
  return true;
}

function loadGuideState(){
  try { return JSON.parse(localStorage.getItem(GUIDES_KEY) || '{}'); }
  catch { return {}; }
}
function saveGuideState(state){
  localStorage.setItem(GUIDES_KEY, JSON.stringify(state));
}

function escapeHTML(s){
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function download(filename, content, type='text/plain;charset=utf-8'){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
}

/* NAV */
function showPage(page){
  document.querySelectorAll('.page').forEach(p=>{
    const on = p.dataset.page === page;
    p.hidden = !on;
  });
  document.querySelectorAll('.tab').forEach(b=>{
    b.classList.toggle('is-on', b.dataset.nav === page);
  });
  window.scrollTo({top:0, behavior:'instant'});
}
document.querySelectorAll('[data-nav]').forEach(el=>{
  el.addEventListener('click', ()=>showPage(el.dataset.nav));
});
document.getElementById('btnQuick').addEventListener('click', ()=>{
  showPage('guides');
  toast('從引導開始就好');
});

/* HOME quick note */
const badge = document.getElementById('badgeSaved');
document.getElementById('btnQuickSave').addEventListener('click', ()=>{
  const val = document.getElementById('quickInput').value;
  if(addNote(val, '今日一句')){
    document.getElementById('quickInput').value = '';
    badge.textContent = '已存';
    toast('已存到筆記庫');
    renderNotes();
  }
});
document.getElementById('btnQuickClear').addEventListener('click', ()=>{
  document.getElementById('quickInput').value='';
  badge.textContent = '未存';
});

/* GUIDES render */
function renderGuides(){
  const box = document.getElementById('guideList');
  const state = loadGuideState();
  box.innerHTML = GUIDES.map(g=>{
    const s = state[g.id] || {fill:'', keep:''};
    return `
      <div class="guide" data-g="${g.id}">
        <div class="guide__head">
          <div>
            <div class="guide__title">${escapeHTML(g.title)}</div>
            <div class="guide__desc">${escapeHTML(g.desc)}</div>
          </div>
          <button class="miniBtn" data-act="saveKeep">存一句</button>
        </div>
        <div class="guide__body">
          <div class="block">
            <div class="block__t">① 這一塊在幫你做什麼</div>
            <div class="block__d">${escapeHTML(g.why)}</div>
          </div>
          <div class="block">
            <div class="block__t">② ${escapeHTML(g.fillLabel)}</div>
            <textarea class="gFill" placeholder="${escapeHTML(g.fillPH)}">${escapeHTML(s.fill)}</textarea>
          </div>
          <div class="block">
            <div class="block__t">③ ${escapeHTML(g.keepLabel)}</div>
            <textarea class="gKeep" placeholder="${escapeHTML(g.keepPH)}">${escapeHTML(s.keep)}</textarea>
            <div class="row" style="margin-top:10px">
              <button class="btn ghost" data-act="copyKeep">複製</button>
              <button class="btn" data-act="saveKeep2">存到筆記庫</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // autosave input
  box.querySelectorAll('.guide').forEach(el=>{
    const id = el.dataset.g;
    el.addEventListener('input', ()=>{
      const st = loadGuideState();
      st[id] = {
        fill: el.querySelector('.gFill').value,
        keep: el.querySelector('.gKeep').value
      };
      saveGuideState(st);
    });

    el.addEventListener('click', async (e)=>{
      const btn = e.target.closest('button');
      if(!btn) return;
      const act = btn.dataset.act;
      const keep = el.querySelector('.gKeep').value.trim();
      const title = GUIDES.find(x=>x.id===id)?.title || '';
      if(act === 'copyKeep'){
        if(!keep){ toast('先留一句'); return; }
        try{
          await navigator.clipboard.writeText(keep);
          toast('已複製');
        }catch{
          const ta = document.createElement('textarea');
          ta.value = keep;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          toast('已複製');
        }
      }
      if(act === 'saveKeep' || act === 'saveKeep2'){
        if(!keep){ toast('先留一句'); return; }
        if(addNote(keep, title)){
          toast('已存到筆記庫');
          renderNotes();
        }
      }
    });
  });
}

document.getElementById('btnResetGuides').addEventListener('click', ()=>{
  localStorage.removeItem(GUIDES_KEY);
  renderGuides();
  toast('引導內容已重設');
});

/* NOTES render */
function renderNotes(){
  const q = (document.getElementById('q')?.value || '').trim().toLowerCase();
  const box = document.getElementById('notesBox');
  let notes = loadNotes();
  if(q){
    notes = notes.filter(n => (n.text||'').toLowerCase().includes(q) || (n.source||'').toLowerCase().includes(q));
  }
  if(!notes.length){
    box.innerHTML = `<div class="note"><div class="muted">目前沒有筆記。你可以從「首頁今日一句」或「引導」存一句進來。</div></div>`;
    return;
  }
  box.innerHTML = notes.map((n,i)=>`
    <div class="note" data-i="${i}">
      <textarea class="nText" spellcheck="false">${escapeHTML(n.text)}</textarea>
      <div class="note__meta">
        <span>${escapeHTML(n.source||'')} · 更新：${new Date(n.updatedAt||n.createdAt).toLocaleString()}</span>
        <span class="row">
          <button class="miniBtn" data-act="copy">複製</button>
          <button class="miniBtn" data-act="delete">刪除</button>
        </span>
      </div>
    </div>
  `).join('');
}

document.getElementById('notesBox').addEventListener('input', (e)=>{
  const noteEl = e.target.closest('.note');
  if(!noteEl) return;
  const i = Number(noteEl.dataset.i);
  if(Number.isNaN(i)) return;
  const notes = loadNotes();
  if(!notes[i]) return;
  notes[i].text = e.target.value;
  notes[i].updatedAt = nowISO();
  saveNotes(notes);
});

document.getElementById('notesBox').addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const noteEl = e.target.closest('.note');
  const i = Number(noteEl?.dataset?.i);
  const act = btn.dataset.act;
  const notes = loadNotes();
  if(!notes[i]) return;

  if(act==='delete'){
    notes.splice(i,1);
    saveNotes(notes);
    renderNotes();
    toast('已刪除');
  }
  if(act==='copy'){
    const text = notes[i].text || '';
    try{
      await navigator.clipboard.writeText(text);
      toast('已複製');
    }catch{
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast('已複製');
    }
  }
});

document.getElementById('q').addEventListener('input', ()=>renderNotes());

document.getElementById('btnClearAll').addEventListener('click', ()=>{
  const ok = confirm('確定要清空全部筆記嗎？這個動作無法復原。');
  if(!ok) return;
  localStorage.removeItem(NOTES_KEY);
  renderNotes();
  toast('已清空');
});

/* Export / Import */
document.getElementById('btnExportTxt').addEventListener('click', ()=>{
  const notes = loadNotes();
  const txt = notes.map((n,idx)=>`# ${idx+1} ${n.source ? '['+n.source+'] ' : ''}\n${n.text}\n`).join('\n');
  const d = new Date();
  const name = `angel-concept-hub-notes-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.txt`;
  download(name, txt);
  toast('已匯出 TXT');
});

document.getElementById('btnExportJson').addEventListener('click', ()=>{
  const notes = loadNotes();
  const d = new Date();
  const name = `angel-concept-hub-notes-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  download(name, JSON.stringify(notes, null, 2), 'application/json;charset=utf-8');
  toast('已匯出 JSON');
});

document.getElementById('fileImport').addEventListener('change', async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const imported = JSON.parse(text);
    if(!Array.isArray(imported)) throw new Error('format');
    const notes = loadNotes();
    // merge (prepend)
    const merged = imported.concat(notes);
    saveNotes(merged);
    renderNotes();
    toast('已匯入');
  }catch{
    toast('匯入失敗：請選擇正確的 JSON');
  }finally{
    e.target.value = '';
  }
});

/* Initial render */
renderGuides();
renderNotes();

/* SW */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}
