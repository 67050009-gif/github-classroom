const COOKIE_NAME = 'ft_todos';

function readCookie(name) {
  const parts = document.cookie.split(';').map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith(name + '=')) {
      return decodeURIComponent(p.substring(name.length + 1));
    }
  }
  return null;
}
function writeCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie =
    name + '=' + encodeURIComponent(value) +
    '; expires=' + d.toUTCString() +
    '; path=/';
}


function loadTodos() {
  try {
    const raw = readCookie(COOKIE_NAME);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveTodos(todos) {
  writeCookie(COOKIE_NAME, JSON.stringify(todos));
}


const listEl = document.getElementById('ft_list');

function render(todos) {
  listEl.innerHTML = '';
  if (!todos.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No TO DO yet. Click "New" to add one.';
    listEl.appendChild(empty);
    return;
  }
  for (const item of todos) {
    const div = document.createElement('div');
    div.className = 'todo';
    div.dataset.id = item.id;
    div.textContent = item.text;
    div.title = 'Click to remove';
    div.addEventListener('click', onRemove);
    
    listEl.insertBefore(div, listEl.firstChild);
  }
}


function onNew() {
  const text = prompt('New TO DO:');
  if (text === null) return;           
  const trimmed = text.trim();
  if (!trimmed) return;                

  const todos = loadTodos();
  const item = { id: Date.now().toString(), text: trimmed };
 
  todos.push(item); 
  saveTodos(todos);
  render(todos);
}

function onRemove(e) {
  const id = e.currentTarget.dataset.id;
  const msg = 'Remove this TO DO?\n"' + e.currentTarget.textContent + '"';
  if (!confirm(msg)) return;

  let todos = loadTodos();
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  render(todos);
}

// init
document.getElementById('btn-new').addEventListener('click', onNew);
render(loadTodos());
