const adminSession = sessionStorage.getItem('ferrn_admin');
if(adminSession !== '1') location.replace('/admin.html');

const proposals = [
  { id:'ataam-proposal', title:'Ataam Healthcare Proposal', url:'/ataam-proposal.html', category:'Healthcare', year:'2026' },
  { id:'awjai-proposal', title:'AWJAI Website Proposal', url:'/awjai-proposal.html', category:'NGO', year:'2026' }
];

const list = qs('#adminList');

function renderList(){
  qs('#entryCount').textContent = `${proposals.length} ${proposals.length === 1 ? 'proposal' : 'proposals'} available`;
  list.innerHTML = proposals.map(item => `<div class="admin-item">
    <div class="admin-item-main">
      <div class="admin-item-top"><span class="type-dot proposal"></span><h3>${escapeHTML(item.title)}</h3></div>
      <div class="admin-url">${escapeHTML(item.category)} · ${escapeHTML(item.year)}</div>
    </div>
    <div class="admin-actions"><a class="small-btn brand" href="${escapeHTML(item.url)}">Open proposal</a></div>
  </div>`).join('');
}

qs('#refreshBtn')?.addEventListener('click', renderList);
qs('#adminLogoutBtn')?.addEventListener('click', () => {
  sessionStorage.removeItem('ferrn_admin');
  location.replace('/admin.html');
});

renderList();
