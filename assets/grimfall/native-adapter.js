/* Adapt the original Grimfall component to local static files and reviewed Chinese data. */
(() => {
 const React=window.React, listeners=new Set(),loads=new Map();window.COA_NATIVE_CATALOGS={};
 const absolute=p=>new URL(p,location.href).href;
 const resolveAssetUrl=p=>{
  if(window.COA_NATIVE_ASSET_MAP[p])return absolute(COA_NATIVE_ASSET_MAP[p]);
  if(p.startsWith('/Web/content/features/conquest-talents/'))return p;
  if(p.startsWith('/Web/'))return absolute('assets/grimfall'+p);
  return absolute(p);
 };
 const selection=()=>new URLSearchParams(location.hash.slice(1));
 function nativeLocation(){const q=selection();return {key:location.hash||'local',pathname:'/features/conquest-of-azeroth/'+(q.get('class')||'necromancer'),search:'?toolbar=0&spec='+(q.get('spec')||'')};}
 function useLocation(){const[state,set]=React.useState(nativeLocation);React.useEffect(()=>{const fn=()=>set(nativeLocation());listeners.add(fn);return()=>listeners.delete(fn)},[]);return state;}
 const Link=React.forwardRef(({to,onClick,children,preventScrollReset,state,...props},ref)=>{
  const full=new URL(to,'https://www.grimfallwow.com'),cls=full.pathname.split('/').pop(),spec=full.searchParams.get('spec'),href=full.pathname==='/features'?'index.html':'#'+new URLSearchParams({class:cls,...(spec?{spec}:{})});
  return React.createElement('a',{...props,ref,href,onClick:e=>{onClick?.(e);if(href.startsWith('#')&&!e.ctrlKey&&!e.metaKey){e.preventDefault();history.replaceState(null,'',href);listeners.forEach(fn=>fn())}}},children);
 });
 window.addEventListener('hashchange',()=>listeners.forEach(fn=>fn()));
 window.COA_NATIVE_LOAD_CATALOG=slug=>{
  if(COA_NATIVE_CATALOGS[slug])return Promise.resolve(COA_NATIVE_CATALOGS[slug]);
  if(loads.has(slug))return loads.get(slug);
  const promise=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=COA_NATIVE_CATALOG_INDEX[slug];s.onload=()=>resolve(COA_NATIVE_CATALOGS[slug]);s.onerror=()=>{loads.delete(slug);reject(Error('天赋资料加载失败'))};document.body.append(s)});loads.set(slug,promise);return promise;
 };
 window.SQWebRuntime={React,ReactDOM:window.ReactDOM,Link,useLocation,useParams:()=>({}),useSiteContent:()=>({resolveAssetUrl})};
 window.COA_NATIVE_MOUNT=()=>{
  function App(){const loc=useLocation(),q=selection(),classes=COA_NATIVE_ROSTER.classes;let c=classes.find(c=>c.slug===q.get('class')||c.localSlug===q.get('class'))||classes.find(c=>c.localSlug==='necromancer');return React.createElement(COA_NATIVE_COMPONENTS.CharacterCreation,{character:c,classes,resolveAssetUrl,Spellbook:COA_NATIVE_COMPONENTS.AbilitySamples})}
  const host=document.querySelector('main');host.innerHTML='';ReactDOM.createRoot(host).render(React.createElement(App));
  const placeRail=()=>{const box=host.getBoundingClientRect();host.style.setProperty('--coa-mobile-rail-top',Math.max(0,box.top)+'px')};
  addEventListener('scroll',placeRail,{passive:true});addEventListener('resize',placeRail);placeRail();
 };
})();
