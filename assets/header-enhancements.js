(()=>{
 const script=document.currentScript,assetBase=new URL('.',script.src);
 if(!document.querySelector('link[rel="icon"]')){const icon=document.createElement('link');icon.rel='icon';icon.type='image/svg+xml';icon.href=new URL('coa-crest.svg',assetBase);document.head.append(icon)}
 const menus=[...document.querySelectorAll('#site-header .primary-menu')],hover=matchMedia('(hover:hover) and (pointer:fine)');
 for(const menu of menus){let timer;menu.addEventListener('pointerenter',()=>{if(!hover.matches)return;clearTimeout(timer);menus.forEach(other=>{if(other!==menu)other.open=false});menu.open=true});menu.addEventListener('pointerleave',()=>{if(hover.matches)timer=setTimeout(()=>{menu.open=false},180)});menu.addEventListener('focusin',()=>{menus.forEach(other=>{if(other!==menu)other.open=false});menu.open=true});menu.addEventListener('focusout',event=>{if(!menu.contains(event.relatedTarget))menu.open=false})}
})();
