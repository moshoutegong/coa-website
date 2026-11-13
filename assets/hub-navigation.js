(() => {
  const current=window.COA_CLASS,classes=window.COA_REGISTRY.classes;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isCodex=location.pathname.endsWith('/skills.html');
  const nav=document.createElement('nav');nav.className='coa-hub-nav';nav.setAttribute('aria-label','全职业导航');
  nav.innerHTML=`<a class="coa-hub-brand" href="../../index.html">COA · 职业总览</a><span class="coa-hub-divider">/</span><a href="index.html">${esc(current.zh)} / ${esc(current.en)}</a><span class="coa-hub-current">${isCodex?'技能图鉴':'天赋模拟器'}</span><label>切换职业<select aria-label="切换职业">${classes.map(c=>`<option value="${esc(c.slug)}" ${c.slug===current.slug?'selected':''} ${c.status==='ready'?'':'disabled'}>${esc(c.zh)} / ${esc(c.en)}${c.status==='ready'?'':' · 待制作'}</option>`).join('')}</select></label>`;
  document.body.prepend(nav);
  const css=document.createElement("link");css.rel="stylesheet";css.href="../../assets/shared-header.css";document.head.append(css);const shared=document.createElement("script");shared.src="../../assets/shared-header.js";document.body.append(shared);
  const tools=document.createElement('nav');tools.className='coa-site-tools';tools.setAttribute('aria-label','资料站栏目');
  tools.innerHTML='<a href="../../index.html">资料站首页</a><a href="../../classes.html">COA 职业</a><a href="../../talents.html">天赋目录</a><a href="../../spells.html">技能目录</a><a href="../../search.html">全站搜索</a><a href="../../worldforge.html">世界铸造</a>';
  nav.after(tools);
  if(!isCodex&&!location.pathname.endsWith('/preview.html')){const orderCSS=document.createElement('link');orderCSS.rel='stylesheet';orderCSS.href='../../assets/talent-order.css';document.head.append(orderCSS);const orderJS=document.createElement('script');orderJS.src='../../assets/talent-order.js';document.body.append(orderJS);}
  const params=new URLSearchParams(location.search);
  if(!isCodex&&params.get('embed')==='1'){
    document.documentElement.classList.add('talent-embedded');
    const baseRender=render;render=function(){baseRender();document.querySelector('.panel h2').textContent=COA_CLASS.zh;document.getElementById('spec-title').textContent=LABELS[spec][0];document.getElementById('class-points').textContent=COA_CLASS.maxAE-spent(mainNodes(87));document.getElementById('spec-points').textContent=COA_CLASS.maxTE-spent(mainNodes(spec))};render();
    const embedCSS=document.createElement('link');embedCSS.rel='stylesheet';embedCSS.href='../../assets/talent-embed.css';document.head.append(embedCSS);
    const footer=document.createElement('div');footer.className='talent-embed-footer';footer.innerHTML='<span class="embed-points"></span><span>等级 <b>60</b></span>';
    const reset=document.getElementById('reset');reset.textContent='重置当前树';footer.append(reset);document.querySelector('.stage').after(footer);
    const update=()=>{footer.querySelector('.embed-points').textContent=`职业天赋 ${spent(mainNodes(87))} / ${COA_CLASS.maxAE} · 专精天赋 ${spent(mainNodes(spec))} / ${COA_CLASS.maxTE}`};
    new MutationObserver(update).observe(document.querySelector('.stage'),{subtree:true,childList:true,characterData:true});update();
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('overlay').classList.contains('open')===false)parent.postMessage('coa-close-talents','*')});
  }
  if(!isCodex&&params.has('spec')){const id=Number(params.get('spec'));if(COA_CLASS.specs.some(s=>s.id===id)){spec=id;render();document.querySelector('.app').classList.remove('choosing-spec');}}
  if(isCodex&&params.has('q')){document.querySelector('#q').value=params.get('q');render();}
  if(!isCodex&&params.has('talent')){
    const target=BY_ID.get(Number(params.get('talent')));
    if(target){
      if(target.tabId!==87&&COA_CLASS.specs.some(s=>s.id===target.tabId))spec=target.tabId;
      selected=target;renderWithoutAutosave();document.querySelector('.app').classList.remove('choosing-spec');
      const marker=document.querySelector(`[data-option="${target.id}"]`);
      if(marker){marker.closest('button').classList.add('search-target');marker.closest('button').focus();}
      document.querySelector('#detail').scrollIntoView({block:'nearest'});
    }
  }
  nav.querySelector('select').addEventListener('change',e=>{const target=classes.find(c=>c.slug===e.target.value&&c.status==='ready');if(target)location.href='../../'+(isCodex?target.codex:target.simulator)});
})();
