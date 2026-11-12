(() => {
 'use strict';
 const host=document.querySelector('main'),rows=COA_CHARACTER_SELECT.classes,registry=COA_REGISTRY.classes;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const params=new URLSearchParams(location.hash.slice(1));let current=rows.find(c=>c.slug===params.get('class'))||rows[0],specId=Number(params.get('spec'));
 const dialog=document.createElement('dialog');dialog.className='talent-window';dialog.setAttribute('aria-label','天赋模拟器');document.body.append(dialog);
 const icon=role=>role.includes('坦克')?'tank':role.includes('治疗')?'healer':role.includes('辅助')?'generic':role.includes('远程')?'rangeddps':role.includes('近战')?'dps':'casterdps';
 const badges=s=>s.role.split('、').map(r=>`<span><img src="assets/spec-ui/ui-lfg-roleicon-${icon(r)}.png" alt="">${esc(r)}</span>`).join('');
 function render(){
  const s=current.specs.find(s=>s.id===specId)||current.specs[0];specId=s.id;
  const cfg=COA_TALENT_SHOWCASE.find(c=>c.slug===current.slug),def=cfg.specs.find(d=>d.id===s.id);
  const pub=registry.find(c=>c.slug===current.slug);
  host.innerHTML=`<section class="talent-showcase" style="--talent-scene:url('${esc(new URL(s.background,location.href).href)}')"><p class="talent-kicker">征服艾泽拉斯 · 天赋与职业</p><div class="talent-presentation"><div class="talent-left"><h1>${esc(current.name)}</h1><div class="talent-spec-tabs" role="group" aria-label="选择专精">${current.specs.map(x=>{const d=cfg.specs.find(d=>d.id===x.id),a=d.samples[0];return `<button data-talent-spec="${x.id}" aria-pressed="${x.id===s.id}"><img src="${esc(a?.icon||current.icon)}" alt=""><span>${esc(x.name)}</span></button>`}).join('')}</div><article class="talent-spec-sheet"><div class="talent-sheet-label"><img src="${esc(pub.cartoonIcon||current.icon)}" alt="">专精介绍</div><div class="talent-facts"><span>主要属性<strong>${esc(s.stats.split('/')[0])}</strong></span><span>护甲<strong>${esc((def.armor||current.armor||[]).join(' / '))}</strong></span><span>主要资源<strong>${esc((def.resources||current.resources||[]).join(' / '))}</strong></span><span>第二资源<strong>${esc((def.secondaryResources||current.secondaryResources||[]).join(' / ')||'无')}</strong></span></div><h2>${esc(s.name)}</h2><div class="talent-roles">${badges(s)}</div><p class="talent-description">${esc(s.description)}</p><p class="talent-complexity">复杂度：${esc(s.difficulty.split('/')[0])}</p><h3>技能示例</h3><div class="talent-samples">${def.samples.map(a=>`<a href="${esc(current.codex)}?q=${a.id}" title="在技能图鉴查看${esc(a.zh)}"><img src="${esc(a.icon)}" alt=""><span>${esc(a.zh)}</span></a>`).join('')}</div></article></div><div class="talent-right"><figure><img class="talent-portrait" src="${esc(s.art)}" alt="${esc(current.name+' · '+s.name)}"><figcaption>${esc(current.name)}<strong>${esc(s.name)}</strong></figcaption></figure><p>${esc(current.description)}</p><button class="talent-open">打开天赋模拟器</button></div></div><div class="talent-class-strip" role="group" aria-label="选择职业">${rows.map(c=>{const p=registry.find(p=>p.slug===c.slug);return `<button data-talent-class="${c.slug}" aria-pressed="${c.slug===current.slug}"><img src="${esc(p.cartoonIcon||c.icon)}" alt=""><span>${esc(c.name)}</span></button>`}).join('')}</div></section>`;
  host.querySelectorAll('[data-talent-class]').forEach(b=>b.onclick=()=>{current=rows.find(c=>c.slug===b.dataset.talentClass);specId=current.specs[0].id;refresh()});
  host.querySelectorAll('[data-talent-spec]').forEach(b=>b.onclick=()=>{specId=Number(b.dataset.talentSpec);refresh()});
  host.querySelector('.talent-open').onclick=()=>open(s);
 }
 function refresh(){render();try{history.replaceState(null,'','#'+new URLSearchParams({class:current.slug,spec:specId}))}catch{}}
 function open(s){
  dialog.innerHTML=`<header><img src="${esc(current.icon)}" alt=""><strong>${esc(current.name)} · ${esc(s.name)} · 天赋模拟器</strong><button class="talent-window-close" aria-label="关闭天赋模拟器">×</button></header><iframe title="${esc(current.name+' · '+s.name+'天赋模拟器')}" src="${esc(current.simulator)}?embed=1&spec=${s.id}"></iframe>`;
  dialog.querySelector('button').onclick=()=>dialog.close();dialog.showModal();document.body.classList.add('talent-modal-open');
 }
 dialog.addEventListener('close',()=>{dialog.innerHTML='';document.body.classList.remove('talent-modal-open');host.querySelector('.talent-open').focus()});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 window.addEventListener('message',e=>{if(e.source===dialog.querySelector('iframe')?.contentWindow&&e.data==='coa-close-talents')dialog.close()});
 render();
})();
