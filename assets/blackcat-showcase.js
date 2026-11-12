(() => {
 const download=document.getElementById('blackcat-download');if(download)download.innerHTML='<span class="blackcat-download-icon" aria-hidden="true">&#xf0ed;</span>立即下载';
 const preview=document.querySelector('.blackcat-preview');if(!preview)return;
 for(const href of ['assets/blackcat-showcase.css','assets/blackcat-original.css']){const css=document.createElement('link');css.rel='stylesheet';css.href=href;document.head.append(css)}
 preview.classList.add('blackcat-original-preview');
 preview.innerHTML='<img src="assets/blackcat/blackcat-small-foreground-v4.png" alt="原场景中的白袍人物展示黑猫助手窗口">';
 const feature=document.createElement('article');feature.className='blackcat-original-feature';preview.before(feature);feature.append(preview,document.querySelector('.blackcat-copy'));
 document.querySelector('.blackcat-bilibili').innerHTML=`<article class="community-feature"><div class="community-feature-art" aria-hidden="true"></div><div class="community-feature-copy"><p class="eyebrow">共同建设 · 感谢有你</p><h3>感谢网站的贡献者</h3><p>感谢为网站提供工具、插件、汉化与攻略支持的伙伴。</p><div class="community-channel-links"><a href="https://space.bilibili.com/108760600" target="_blank" rel="noopener noreferrer"><img src="assets/blackcat/bilibili.svg" alt=""><span>黑猫插件 · Bilibili</span></a><a href="https://space.bilibili.com/374737088" target="_blank" rel="noopener noreferrer"><img src="assets/blackcat/bilibili.svg" alt=""><span>魔兽特工 · Bilibili</span></a></div></div></article>`;
})();
