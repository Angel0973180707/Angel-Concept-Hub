
const KEY = 'angel_concept_hub_notes_v1';

function loadNotes(){
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  catch { return []; }
}
function saveNotes(notes){
  localStorage.setItem(KEY, JSON.stringify(notes));
}

function nowISO(){
  return new Date().toISOString();
}

function render(){
  const box = document.getElementById('notes');
  const notes = loadNotes();
  if(!notes.length){
    box.innerHTML = `<div class="note">
      <div class="hint">目前還沒有筆記。從上面寫一句開始就好。</div>
    </div>`;
    return;
  }
  box.innerHTML = notes.map((n,i)=>`
    <div class="note" data-i="${i}">
      <textarea class="noteText" spellcheck="false">${escapeHTML(n.text)}</textarea>
      <div class="meta">
        <span>更新：${new Date(n.updatedAt||n.createdAt).toLocaleString()}</span>
        <div class="row">
          <button class="mini btn ghost" data-act="copy">複製</button>
          <button class="mini btn ghost" data-act="delete">刪除</button>
        </div>
      </div>
    </div>
  `).join('');
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

document.getElementById('btnSave').addEventListener('click', ()=>{
  const input = document.getElementById('input');
  const text = (input.value || '').trim();
  if(!text) return;
  const notes = loadNotes();
  notes.unshift({ text, createdAt: nowISO(), updatedAt: nowISO() });
  saveNotes(notes);
  input.value = '';
  render();
});

document.getElementById('btnClear').addEventListener('click', ()=>{
  document.getElementById('input').value = '';
});

document.getElementById('notes').addEventListener('input', (e)=>{
  const noteEl = e.target.closest('.note');
  if(!noteEl) return;
  const i = Number(noteEl.dataset.i);
  if(Number.isNaN(i)) return;
  const notes = loadNotes();
  if(!notes[i]) return;
  notes[i].text = e.target.value;
  notes[i].updatedAt = nowISO();
  saveNotes(notes);
  // 不重繪，避免打字跳動
});

document.getElementById('notes').addEventListener('click', async (e)=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  const act = btn.dataset.act;
  const noteEl = e.target.closest('.note');
  const i = Number(noteEl?.dataset?.i);
  const notes = loadNotes();
  if(!notes[i]) return;

  if(act === 'delete'){
    notes.splice(i,1);
    saveNotes(notes);
    render();
  }
  if(act === 'copy'){
    try{
      await navigator.clipboard.writeText(notes[i].text);
      btn.textContent = '已複製';
      setTimeout(()=>btn.textContent='複製', 900);
    }catch{
      // fallback
      const ta = document.createElement('textarea');
      ta.value = notes[i].text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      btn.textContent = '已複製';
      setTimeout(()=>btn.textContent='複製', 900);
    }
  }
});

document.getElementById('btnExportTxt').addEventListener('click', ()=>{
  const notes = loadNotes();
  const txt = notes.map((n,idx)=>`# ${idx+1}\n${n.text}\n`).join('\n');
  const d = new Date();
  const name = `angel-concept-hub-notes-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.txt`;
  download(name, txt);
});

document.getElementById('btnExportJson').addEventListener('click', ()=>{
  const notes = loadNotes();
  const d = new Date();
  const name = `angel-concept-hub-notes-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.json`;
  download(name, JSON.stringify(notes, null, 2), 'application/json;charset=utf-8');
});

// Register service worker
if ('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js').catch(()=>{});
  });
}

render();
