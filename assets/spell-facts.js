function spellFactsHtml(entry,compact=false){
  const m=entry?.mechanics;if(!m?.facts?.length)return '';
  return `<div class="spell-facts${compact?' compact':''}" aria-label="技能基础参数 / Base spell parameters">${m.facts.map(f=>`<div class="spell-fact" data-fact="${esc(f.key)}">${esc(f.zh)}<small>${esc(f.en)}</small></div>`).join('')}</div>${m.mode==='active'?'<div class="facts-caption">基础参数 · 未计入急速与其他天赋修正<br><small>Base values · Before haste and other talent modifiers</small></div>':''}`;
}
