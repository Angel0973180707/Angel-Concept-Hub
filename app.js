
function saveNote(){
  const input = document.getElementById('input');
  if(!input.value) return;
  let notes = JSON.parse(localStorage.getItem('notes') || '[]');
  notes.push(input.value);
  localStorage.setItem('notes', JSON.stringify(notes));
  input.value='';
  renderNotes();
}
function renderNotes(){
  let notes = JSON.parse(localStorage.getItem('notes') || '[]');
  document.getElementById('notes').innerHTML = notes.map(n=>'<p>'+n+'</p>').join('');
}
renderNotes();
