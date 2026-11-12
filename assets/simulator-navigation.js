(() => {
  const stage=document.querySelector('.stage');
  stage.tabIndex=0;
  stage.setAttribute('aria-label','天赋区域，拖动浏览，方向键滚动');
  const help=document.createElement('p');help.className='browse-help';
  help.textContent='拖动天赋区浏览 · Shift + 滚轮横向移动 · 鼠标移开自动收起说明 · 二选一天赋点击后选择';
  stage.before(help);
  const reset=document.getElementById('reset');document.querySelector('.specs').append(reset);
  const tip=document.createElement('aside');tip.id='floating-talent-tip';tip.hidden=true;tip.setAttribute('aria-label','天赋双语说明');document.body.append(tip);
  let hideTimer,drag,suppressClick=false,choiceCell=null;
  function hide(){tip.hidden=true;choiceCell=null;}
  function scheduleHide(){clearTimeout(hideTimer);if(choiceCell)hideTimer=setTimeout(hide,160);else hide()}
  function place(node){
    tip.style.maxHeight='calc(100vh - 24px)';
    const rect=node.getBoundingClientRect(),gap=12,width=tip.offsetWidth;
    let left=rect.right+gap;
    if(left+width>innerWidth-gap)left=rect.left-width-gap;
    left=Math.max(gap,Math.min(left,innerWidth-width-gap));
    let top=rect.top;
    if(left<rect.right&&left+width>rect.left){
      const above=rect.top-gap*2,below=innerHeight-rect.bottom-gap*2;
      tip.style.maxHeight=Math.max(80,Math.max(above,below))+'px';
      top=below>=above?rect.bottom+gap:rect.top-tip.offsetHeight-gap;
    }
    tip.style.left=left+'px';
    tip.style.top=Math.max(gap,Math.min(top,innerHeight-tip.offsetHeight-gap))+'px';
  }
  function show(node,fixed=false){
    clearTimeout(hideTimer);if(choiceCell===node.dataset.cell)return;
    choiceCell=null;
    const content=node.querySelector('.tip');if(!content)return;
    tip.innerHTML=content.innerHTML;tip.hidden=false;tip.style.pointerEvents='none';place(node);
  }
  function showChoices(node){
    clearTimeout(hideTimer);choiceCell=node.dataset.cell;
    const opts=choiceCell.split(',').map(id=>BY_ID.get(Number(id)));
    tip.innerHTML='<b>选择天赋 / Choose a talent</b>'+opts.map(n=>`<section class="choice-option"><img src="${esc(n.icon)}" alt=""><b>${esc(n.zh)}</b><em>${esc(n.name)}</em>${rankDescriptionHtml(n)}<button class="select-choice" data-choice="${n.id}">${ranks.get(n.id)?'已选择 / Selected':'选择此项 / Select'}</button></section>`).join('');
    tip.hidden=false;tip.style.pointerEvents='auto';place(node);
    tip.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{
      const n=BY_ID.get(Number(button.dataset.choice));choose(n,opts,mainNodes(n.tabId));hide();
      document.getElementById('status').textContent=`已选择：${n.zh} / ${n.name}`;
    });
  }
  stage.addEventListener('pointerover',e=>{const node=e.target.closest('.node');if(node&&!drag)show(node)});
  stage.addEventListener('pointerout',e=>{const from=e.target.closest('.node'),to=e.relatedTarget?.closest?.('.node');if(from&&from!==to&&!tip.contains(e.relatedTarget))scheduleHide()});
  tip.addEventListener('pointerenter',()=>clearTimeout(hideTimer));
  tip.addEventListener('pointerleave',scheduleHide);
  stage.addEventListener('focusin',e=>{const node=e.target.closest('.node');if(node&&node.matches(':focus-visible'))show(node)});
  stage.addEventListener('focusout',e=>{if(!choiceCell)hide()});
  stage.addEventListener('click',e=>{
    if(suppressClick){e.preventDefault();e.stopImmediatePropagation();return}
    const node=e.target.closest('.node');if(!node)return;
    if(node.classList.contains('choice')){e.preventDefault();e.stopImmediatePropagation();showChoices(node);return}
    const cell=node.dataset.cell,rail=node.dataset.rail;
    // Node clicks rerender the tree. Resolve its new element afterwards.
    setTimeout(()=>{const current=stage.querySelector(cell?`[data-cell="${cell}"]`:`[data-rail="${rail}"]`);if(current&&(matchMedia('(hover: none)').matches||current.matches(':hover')))show(current,true)},0);
  },true);
  stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:window.scrollY,id:e.pointerId,moved:false}});
  stage.addEventListener('pointermove',e=>{
    if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<6)return;
    drag.moved=true;stage.setPointerCapture(drag.id);stage.classList.add('panning');
    stage.scrollLeft=drag.left-dx;window.scrollTo(window.scrollX,drag.top-dy);e.preventDefault();
    hide();
  });
  function release(){if(!drag)return;suppressClick=drag.moved;drag=null;stage.classList.remove('panning');setTimeout(()=>suppressClick=false,0)}
  stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
  stage.addEventListener('wheel',e=>{if(e.shiftKey){e.preventDefault();stage.scrollLeft+=e.deltaY||e.deltaX}}, {passive:false});
  stage.addEventListener('keydown',e=>{if(e.target!==stage)return;const deltas={ArrowLeft:[-80,0],ArrowRight:[80,0],ArrowUp:[0,-80],ArrowDown:[0,80]};if(deltas[e.key]){e.preventDefault();deltas[e.key][0]?stage.scrollBy(deltas[e.key][0],0):window.scrollBy(0,deltas[e.key][1])}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
  document.addEventListener('pointermove',e=>{if(!tip.hidden&&!e.target.closest('.node')&&!tip.contains(e.target))scheduleHide()});
  document.addEventListener('pointerdown',e=>{if(!tip.contains(e.target)&&!e.target.closest('.node'))hide()});
  stage.addEventListener('scroll',hide);
  addEventListener('scroll',hide,{passive:true});
  addEventListener('resize',hide);
})();
