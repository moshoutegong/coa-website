(() => {
  const definitions=window.COA_CLASS.specs;
  const app=document.querySelector('.app'),header=app.querySelector('.top');
  app.style.setProperty('--spec-count',definitions.length);const picker=document.createElement('section');picker.className='specialization-picker';picker.setAttribute('aria-label',`选择${COA_CLASS.zh}专精`);
  picker.innerHTML=`<div class="picker-intro"><div><h1>选择${COA_CLASS.zh}专精</h1><p>选择专精进入天赋模拟器 · 每个分支保留已有加点</p></div></div><div class="specialization-cards"></div>`;
  header.after(picker);
  const open=document.createElement('button');open.className='btn picker-top-button';open.textContent='专精选择';open.onclick=showPicker;header.append(open);
  function samples(id){const ids=definitions.find(d=>d.id===id).examples;return ids.map(spell=>COA_CLASS.sampleAbilities.find(n=>n.id===spell)||DATA.find(n=>n.spellId===spell)).filter(Boolean)}
  const chinese=value=>String(value??'').split('/')[0].trim();
  const roleIcons={坦克:'tank',治疗:'healer',近战:'dps',远程:'rangeddps',法术:'casterdps',法系:'casterdps',施法:'casterdps',辅助:'generic'};
  function roleMarkup(d){const text=chinese(d.role);const roles=[];for(const [label,key] of Object.entries(roleIcons))if(text.includes(label)&&!roles.some(r=>r.key===key))roles.push({key,label:label==='法术'||label==='施法'?'施法者':label});return roles.map(r=>`<span class="game-role"><img src="../../assets/spec-ui/ui-lfg-roleicon-${r.key}.png" alt=""><span>${r.label}</span></span>`).join('')}
  const statIcons={力量:'strength',敏捷:'agility',耐力:'stamina',智力:'intellect',精神:'spirit'};
  function statMarkup(d){return chinese(d.stats).split(/[、，,]/).map(t=>t.trim()).filter(Boolean).map(t=>`<span class="game-stat">${statIcons[t]?`<img src="../../assets/spec-ui/primary-stat-circle-${statIcons[t]}.png" alt="">`:''}<span>${esc(t)}</span></span>`).join('')}
  function refresh(){
    picker.querySelector('.specialization-cards').innerHTML=definitions.map(d=>{
      const active=spec===d.id;
      return `<article class="specialization-card${active?' current':''}" data-specialization="${d.id}"><img class="specialization-art" src="assets/specializations/${d.art}.png" alt="${esc(d.name)} / ${d.en}"><h2>${esc(d.name)}</h2><div class="specialization-english">${esc(d.en)} <span class="specialization-separator">·</span> <span class="specialization-alias">${esc(d.alias)}</span></div><div class="specialization-role">${roleMarkup(d)}</div><div class="specialization-copy"><p>${d.zh}</p></div><div class="specialization-facts"><span class="specialization-stats">${statMarkup(d)}</span><span class="specialization-difficulty">复杂度：${esc(chinese(d.difficulty))}</span></div><div class="specialization-samples">法术示例<div class="sample-icons">${samples(d.id).map(n=>`<span class="sample-ability" title="${esc(n.zh)}"><img src="${esc(n.icon)}" alt="${esc(n.zh)}"></span>`).join('')}</div></div><div class="specialization-state">${active?'当前专精':''}</div><button class="primary" data-spec-select="${d.id}">${active?'查看天赋':'选择天赋'}</button></article>`;
    }).join('');
    picker.querySelectorAll('[data-spec-select]').forEach(b=>b.onclick=()=>enter(Number(b.dataset.specSelect)));
  }
  function enter(id){spec=id;selected=null;render();app.classList.remove('choosing-spec');document.getElementById('floating-talent-tip').hidden=true;document.getElementById('status').textContent=`当前专精：${LABELS[id][0]} / ${LABELS[id][1]}`;document.querySelector(`[data-tab="${id}"]`).focus();}
  function showPicker(){refresh();app.classList.add('choosing-spec');document.getElementById('floating-talent-tip').hidden=true;picker.querySelector(`[data-spec-select="${spec}"]`).focus();}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&app.classList.contains('choosing-spec'))enter(spec)});
  showPicker();
})();
