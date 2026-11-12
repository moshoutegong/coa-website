(() => {
  const {summary,classes}=window.COA_REGISTRY,grid=document.getElementById('class-grid'),search=document.getElementById('class-search');
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let filter='all';const order={reaper:0,suncleric:1,prophet:2};
  const sorted=[...classes].sort((a,b)=>((a.status==='ready'?0:1)-(b.status==='ready'?0:1))||(a.status==='ready'?(order[a.slug]??a.id+3)-(order[b.slug]??b.id+3):a.id-b.id));
  const avatar=c=>`<span class="class-avatar">${c.icon?`<img src="${esc(c.icon)}" alt="" loading="lazy">`:esc(c.en[0])}</span>`;
  function render(){
    const q=search.value.trim().toLowerCase();
    const matches=sorted.filter(c=>(filter==='all'||c.status===filter)&&(!q||`${c.zh} ${c.en} ${c.slug} ${(c.aliases||[]).join(' ')} ${c.specNames.join(' ')}`.toLowerCase().includes(q)));
    grid.innerHTML=matches.map(c=>`<article class="class-card ${c.status}" data-class="${c.slug}" style="--accent:${esc(c.accent)}">${c.status==='ready'?`<div class="card-art"><img src="${esc(c.cover)}" alt="${esc(c.zh)}专精游戏插画" loading="lazy"></div>`:''}<div class="card-body"><div class="class-title-row">${avatar(c)}<div><h3>${esc(c.zh)}</h3><div class="class-en">${esc(c.en)}</div></div></div><p class="spec-list">${c.specNames.map(name=>`<span class="spec-chip">${esc(name)}</span>`).join('')}</p>${c.status==='ready'?`<div class="card-counts"><span><b>${c.specCount}</b>专精</span><span><b>${c.talents}</b>天赋条目</span><span><b>${c.skills}</b>技能条目</span></div><div class="card-actions"><a href="${esc(c.simulator)}" aria-label="打开${esc(c.zh)}天赋模拟器">天赋模拟器 ↗</a><a class="secondary" href="${esc(c.codex)}" aria-label="打开${esc(c.zh)}技能图鉴">技能图鉴 ↗</a></div>`:'<div class="pending-state">待制作<small>完成核对后开放</small></div>'}</div></article>`).join('');
    document.getElementById('empty').hidden=matches.length!==0;
    document.getElementById('result-count').textContent=`显示 ${matches.length} / ${summary.totalClasses} 个职业${q?' · 搜索：'+search.value.trim():''}`;
    document.querySelectorAll('[data-filter]').forEach(b=>{const on=b.dataset.filter===filter;b.classList.toggle('selected',on);b.setAttribute('aria-pressed',String(on))});
  }
  document.getElementById('total-talents').textContent=summary.talents;
  document.getElementById('total-skills').textContent=summary.skills;
  document.querySelector('[data-filter="all"] span').textContent=summary.totalClasses;
  document.querySelector('footer p').textContent=`当前收录 ${summary.readyClasses} / ${summary.totalClasses} 个职业 · 技能数值展示基础值及属性公式`;
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;render()});
  search.addEventListener('input',render);
  document.getElementById('clear-search').onclick=()=>{search.value='';filter='all';render();search.focus()};
  render();
})();
