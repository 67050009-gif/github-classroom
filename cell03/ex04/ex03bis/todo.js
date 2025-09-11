const COOKIE = 'ft_todos';
function readCookie(name){
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : null;
}
function writeCookie(name, value, days=365){
  const d = new Date(); d.setTime(d.getTime()+days*24*60*60*1000);
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + d.toUTCString() + '; path=/';
}


function loadTodos(){ try{ const raw = readCookie(COOKIE); return raw? JSON.parse(raw):[]; }catch{ return []; } }
function saveTodos(t){ writeCookie(COOKIE, JSON.stringify(t)); }


function render(todos){
  const $list = $('#ft_list').empty();
  if(!todos.length) return $list.append($('<div/>',{class:'empty',text:'No TO DO yet. Click "New".'}));
 
  for(let i=todos.length-1;i>=0;i--){
    const item = todos[i];
    $('<div/>',{class:'todo','data-id':item.id,text:item.text,title:'Click to remove'})
      .on('click', onRemove)
      .appendTo($list);
  }
}

function onNew(){
  const t = prompt('New TO DO:');
  if(t===null) return;
  const text = $.trim(t);
  if(!text) return;
  const todos = loadTodos();
  todos.push({id: Date.now().toString(), text});
  saveTodos(todos);
  render(todos);
}

function onRemove(){
  const id = $(this).data('id');
  if(!confirm('Remove this TO DO?\n"' + $(this).text() + '"')) return;
  let todos = loadTodos().filter(x => x.id !== String(id));
  saveTodos(todos);
  render(todos);
}

$(function(){
  $('#btn-new').on('click', onNew);
  render(loadTodos());
});
