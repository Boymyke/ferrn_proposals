let items = [];
const list = qs('#adminList');
const modal = qs('#projectModal');
const form = qs('#projectForm');

function openModal(item=null){
  qs('#modalTitle').textContent = item ? 'Edit work' : 'Add work';
  qs('#projectId').value = item?.id || '';
  qs('#projectType').value = item?.type || 'website';
  qs('#projectYear').value = item?.year || new Date().getFullYear();
  qs('#projectTitle').value = item?.title || '';
  qs('#projectUrl').value = item?.url || '';
  qs('#projectCategory').value = item?.category || '';
  qs('#projectImage').value = item?.image || '';
  qs('#projectDescription').value = item?.description || '';
  qs('#projectFeatured').checked = item?.featured === 'true';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  setTimeout(()=>qs('#projectTitle').focus(),80);
}

function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

function renderList(){
  qs('#entryCount').textContent = `${items.length} ${items.length===1?'entry':'entries'} in the archive`;
  if(!items.length){
    list.innerHTML = `<div class="empty-state" style="border:0;border-radius:0;min-height:260px"><div><h3>No archive entries yet.</h3><p>Add your websites and proposal links here.</p></div></div>`;
    return;
  }
  list.innerHTML = items.map(item => `<div class="admin-item">
    <div class="admin-item-main"><div class="admin-item-top"><span class="type-dot ${item.type==='proposal'?'proposal':''}"></span><h3>${escapeHTML(item.title)}</h3></div><div class="admin-url">${escapeHTML(item.url)}</div></div>
    <div class="admin-actions"><button class="small-btn" data-edit="${escapeHTML(item.id)}">Edit</button><button class="small-btn" data-delete="${escapeHTML(item.id)}">Delete</button></div>
  </div>`).join('');
}

async function loadItems(){
  list.innerHTML = '<div style="height:260px" class="skeleton"></div>';
  try{
    const data = await api('admin-items');
    items = data.items || [];
    renderList();
  }catch(err){
    list.innerHTML = `<div class="panel-body"><div class="status-note err">${escapeHTML(err.message)}</div></div>`;
  }
}

qs('#addProjectBtn').addEventListener('click',()=>openModal());
qs('#closeModal').addEventListener('click',closeModal);
qs('#cancelModal').addEventListener('click',closeModal);
modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
qs('#refreshBtn').addEventListener('click',loadItems);

document.addEventListener('click',async e=>{
  const edit = e.target.closest('[data-edit]');
  if(edit){
    const item=items.find(x=>x.id===edit.dataset.edit);
    if(item) openModal(item);
  }
  const del = e.target.closest('[data-delete]');
  if(del){
    const item=items.find(x=>x.id===del.dataset.delete);
    if(!item || !confirm(`Delete “${item.title}” from the archive?`)) return;
    try{
      await api('admin-item',{method:'DELETE',body:JSON.stringify({id:item.id})});
      showToast('Archive entry deleted.');
      await loadItems();
    }catch(err){showToast(err.message)}
  }
});

form.addEventListener('submit',async e=>{
  e.preventDefault();
  const payload={
    id:qs('#projectId').value || undefined,
    type:qs('#projectType').value,
    year:qs('#projectYear').value,
    title:qs('#projectTitle').value.trim(),
    url:qs('#projectUrl').value.trim(),
    category:qs('#projectCategory').value.trim(),
    image:qs('#projectImage').value.trim(),
    description:qs('#projectDescription').value.trim(),
    featured:qs('#projectFeatured').checked
  };
  const btn=qs('#saveProjectBtn');
  btn.disabled=true;
  btn.textContent='Saving…';
  try{
    await api('admin-item',{method:'POST',body:JSON.stringify(payload)});
    closeModal();
    showToast(payload.id?'Work updated.':'Work added.');
    await loadItems();
  }catch(err){
    showToast(err.message);
  }finally{
    btn.disabled=false;
    btn.textContent='Save work';
  }
});

loadItems();
