const KEY = 'angel_concept_hub_v13_min';
const MODE_KEY = 'angel_concept_hub_mode_v13'; // personal | pro

const labels = {
  personal: {
    brandSub: '名片準備版｜個人',
    homeBtns: ['關於我一句話','我在做的事','我的說話方式'],
    kickers: ['關於你','你目前在做的事','你怎麼說話'],
    placeholders: [
      '我喜歡＿＿＿\n我在乎＿＿＿\n我想做＿＿＿',
      '1\n2\n3',
      '我通常會這樣說……'
    ],
    tabs: ['一句話','做的事','說話方式'],
    nextText: '當你準備好了\n下一步\n我們會把這些內容\n組成你的個人名片'
  },
  pro: {
    brandSub: '名片準備版｜專業',
    homeBtns: ['我幫助誰','我提供什麼','我的對外語氣'],
    kickers: ['定位','你提供的內容','你對外怎麼說'],
    placeholders: [
      '我幫助＿＿＿\n用＿＿＿\n解決＿＿＿',
      '1\n2\n3',
      '我通常會這樣說……'
    ],
    tabs: ['一句話','做的事','說話方式'],
    nextText: '當你準備好了\n下一步\n我們會把這些內容\n組成你的專業名片'
  }
};

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast._tm);
  toast._tm = setTimeout(()=>t.classList.remove('on'), 1100);
}

function loadState(){
  try{ return JSON.parse(localStorage.getItem(KEY) || '{"items":[]}'); }
  catch{ return {items:[]}; }
}
function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
function loadMode(){
  const m = localStorage.getItem(MODE_KEY);
  return (m === 'pro' || m === 'personal') ? m : 'personal';
}
function saveMode(m){ localStorage.setItem(MODE_KEY, m); }
function nowISO(){ return new Date().toISOString(); }
function esc(s=''){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function show(page){
  document.querySelectorAll('.page').forEach(p => p.hidden = (p.dataset.page !== page));
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('isOn', b.dataset.go === page));
  window.scrollTo({top:0, behavior:'instant'});
}
document.body.addEventListener('click', (e)=>{
  const go = e.target.closest('[data-go]')?.dataset?.go;
  if(go) show(go);
});

function upsertOne(type, text){
  const t = (text||'').trim();
  if(!t) return false;
  const s = loadState();
  const existing = s.items.find(x => x.type === type);
  if(existing){
    existing.text = t;
    existing.updatedAt = nowISO();
  }else{
    s.items.push({ id: (crypto.randomUUID?.() || String(Date.now())), type, text: t, createdAt: nowISO(), updatedAt: nowISO() });
  }
  saveState(s);
  return true;
}
function getOne(type){
  const s = loadState();
  return s.items.find(x => x.type === type)?.text || '';
}

function applyMode(mode){
  const L = labels[mode];
  document.getElementById('brandSub').textContent = L.brandSub;

  document.getElementById('btnHeadline').textContent = L.homeBtns[0];
  document.getElementById('btnDoing').textContent = L.homeBtns[1];
  document.getElementById('btnVoice').textContent = L.homeBtns[2];

  document.getElementById('kHeadline').textContent = L.kickers[0];
  document.getElementById('kDoing').textContent = L.kickers[1];
  document.getElementById('kVoice').textContent = L.kickers[2];

  document.getElementById('tHeadline').placeholder = L.placeholders[0];
  document.getElementById('tDoing').placeholder = L.placeholders[1];
  document.getElementById('tVoice').placeholder = L.placeholders[2];

  document.getElementById('tabHeadline').textContent = L.tabs[0];
  document.getElementById('tabDoing').textContent = L.tabs[1];
  document.getElementById('tabVoice').textContent = L.tabs[2];

  document.getElementById('nextText').innerHTML = esc(L.nextText).replace(/\n/g,'<br/>');

  document.getElementById('modePersonal').classList.toggle('isOn', mode==='personal');
  document.getElementById('modePro').classList.toggle('isOn', mode==='pro');
}

function loadInputs(){
  document.getElementById('tHeadline').value = getOne('headline');
  document.getElementById('tDoing').value = getOne('doing');
  document.getElementById('tVoice').value = getOne('voice');
}

let filter = 'headline';
function setFilter(f){
  filter = f;
  document.querySelectorAll('.chip[data-filter]').forEach(c => c.classList.toggle('isOn', c.dataset.filter === f));
  renderVault();
}
document.querySelectorAll('.chip[data-filter]').forEach(c => c.addEventListener('click', ()=>setFilter(c.dataset.filter)));

function tagName(type){
  const mode = loadMode();
  const L = labels[mode];
  if(type==='headline') return L.tabs[0];
  if(type==='doing') return L.tabs[1];
  return L.tabs[2];
}

function renderVault(){
  const s = loadState();
  const items = s.items.filter(x => x.type === filter);
  const box = document.getElementById('vaultList');

  if(items.length === 0){
    box.innerHTML = `<div class="item"><div class="itemTag">${esc(tagName(filter))}</div><div class="plain">（目前空白）</div></div>`;
    return;
  }

  box.innerHTML = items.map(it => `
    <div class="item" data-id="${esc(it.id)}">
      <div class="itemTop">
        <div class="itemTag">${esc(tagName(it.type))}</div>
        <div class="smallBtns">
          <button class="smallBtn" data-act="copy">複製</button>
          <button class="smallBtn" data-act="clear">清空</button>
        </div>
      </div>
      <textarea class="vaultTa">${esc(it.text)}</textarea>
    </div>
  `).join('');
}

document.getElementById('vaultList').addEventListener('input', (e)=>{
  const card = e.target.closest('.item');
  if(!card) return;
  const id = card.dataset.id;
  const val = e.target.value;
  const s = loadState();
  const it = s.items.find(x => x.id === id);
  if(!it) return;
  it.text = val;
  it.updatedAt = nowISO();
  saveState(s);
});

document.getElementById('vaultList').addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const card = e.target.closest('.item');
  const id = card?.dataset?.id;
  if(!id) return;
  const act = btn.dataset.act;

  const s = loadState();
  const it = s.items.find(x => x.id === id);
  if(!it) return;

  if(act === 'clear'){
    it.text = '';
    it.updatedAt = nowISO();
    saveState(s);
    renderVault();
    toast('已清空');
  }
  if(act === 'copy'){
    const text = it.text || '';
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

document.getElementById('saveHeadline').addEventListener('click', ()=>{
  if(upsertOne('headline', document.getElementById('tHeadline').value)){
    toast('已存');
    renderVault();
  }
});
document.getElementById('saveDoing').addEventListener('click', ()=>{
  if(upsertOne('doing', document.getElementById('tDoing').value)){
    toast('已存');
    renderVault();
  }
});
document.getElementById('saveVoice').addEventListener('click', ()=>{
  if(upsertOne('voice', document.getElementById('tVoice').value)){
    toast('已存');
    renderVault();
  }
});

document.getElementById('modePersonal').addEventListener('click', ()=>{
  saveMode('personal'); applyMode('personal'); toast('個人版'); renderVault();
});
document.getElementById('modePro').addEventListener('click', ()=>{
  saveMode('pro'); applyMode('pro'); toast('專業版'); renderVault();
});

document.getElementById('exportJson').addEventListener('click', ()=>{
  const s = loadState();
  const blob = new Blob([JSON.stringify(s, null, 2)], {type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'angel-concept-hub.json';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 0);
  toast('已匯出');
});

document.getElementById('importFile').addEventListener('change', async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const incoming = JSON.parse(text);
    if(!incoming || !Array.isArray(incoming.items)) throw new Error('bad');
    saveState(incoming);
    loadInputs();
    renderVault();
    toast('已匯入');
  }catch{
    toast('匯入失敗');
  }finally{
    e.target.value = '';
  }
});

setFilter('headline');
const mode = loadMode();
applyMode(mode);
loadInputs();
renderVault();
show('home');

if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}