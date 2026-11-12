(()=>{
 const hero=document.querySelector('.coa-intro-hero');if(!hero)return;
 const layer=document.createElement('div');layer.className='hero-fire-layer';layer.setAttribute('aria-hidden','true');hero.append(layer);
 const fires=[[551,750],[1338,750]].map(([x,y])=>{const fire=document.createElement('div');fire.className='hero-brazier';fire.innerHTML='<i class="brazier-glow"></i><i class="brazier-flame"></i>'+Array.from({length:5},(_,i)=>`<i class="brazier-ember" style="--ember:${i}"></i>`).join('');layer.append(fire);return {fire,x,y}});
 function place(){const w=hero.clientWidth,h=hero.clientHeight,s=Math.max(w/1920,h/1080),dx=(w-1920*s)/2,dy=(h-1080*s)/2;for(const {fire,x,y} of fires){fire.style.left=dx+x*s+'px';fire.style.top=dy+y*s+'px';fire.style.setProperty('--fire-scale',s)}}
 new ResizeObserver(place).observe(hero);place();
 new IntersectionObserver(([entry])=>hero.classList.toggle('hero-fire-paused',!entry.isIntersecting)).observe(hero);
})();
