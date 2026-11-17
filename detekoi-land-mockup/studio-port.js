(function(){
if (window.__DETEKOI_PORT_BOOT__) return;
window.__DETEKOI_PORT_BOOT__ = 1;
var cssHref = (document.currentScript && document.currentScript.getAttribute('data-css')) || '';
if (cssHref && !document.getElementById('detekoi-port-css-link')) {
  var link = document.createElement('link');
  link.id = 'detekoi-port-css-link';
  link.rel = 'stylesheet';
  link.href = cssHref;
  document.head.appendChild(link);
}

var ASSET="https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos";
function onHome(){
  var p=location.pathname||'/';
  return p==='/'||p===''||p==='/index.html';
}
function ensureFonts(){
  if(document.getElementById('detekoi-port-fonts')) return;
  var l=document.createElement('link');
  l.id='detekoi-port-fonts'; l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap';
  document.head.appendChild(l);
}
function wireSlideshow(root){
  var box=root.querySelector('[data-dk-slideshow]');
  if(!box||box.dataset.wired) return;
  box.dataset.wired='1';
  var imgs=[].slice.call(box.querySelectorAll('.dk-slideshow__vp img'));
  var dots=box.querySelector('[data-dk-dots]');
  var i=0;
  function show(n){
    i=(n+imgs.length)%imgs.length;
    imgs.forEach(function(im,idx){ im.classList.toggle('is-active', idx===i); });
    if(dots)[].forEach.call(dots.children,function(d,idx){ d.classList.toggle('is-active', idx===i); });
  }
  if(dots){
    dots.innerHTML='';
    imgs.forEach(function(_,idx){
      var b=document.createElement('button');
      b.type='button'; b.setAttribute('aria-label','スライド '+(idx+1));
      if(idx===0) b.className='is-active';
      b.addEventListener('click',function(){ show(idx); });
      dots.appendChild(b);
    });
  }
  var prev=box.querySelector('[data-dk-prev]');
  var next=box.querySelector('[data-dk-next]');
  if(prev) prev.addEventListener('click',function(){ show(i-1); });
  if(next) next.addEventListener('click',function(){ show(i+1); });
  setInterval(function(){ show(i+1); }, 5000);
}
/* Studio-native section hashes (IDs live on visible port/form via adoptLegacyIds).
   Keep #dk-* as aliases only — never rewrite native hashes away. */
var NAV_HASH={
  '#about':'#about','#annai':'#annai','#taiken':'#taiken','#omoi':'#omoi',
  '#facilities':'#annai','#services':'#taiken','#philosophy':'#omoi',
  '#reserve':'#reserve','#yoyaku':'#yoyaku','#contact':'#yoyaku',
  '#dk-about':'#about','#dk-facilities':'#annai','#dk-services':'#taiken',
  '#dk-philosophy':'#omoi','#dk-reserve':'#reserve'
};
var NAV_TEXT={
  'でてこいランドとは':'#about','でてこいランドについて':'#about',
  '施設案内':'#annai','施設紹介':'#annai',
  '体験できること':'#taiken','この場所の想い':'#omoi',
  '予約・アクセス':'#reserve','予約ホーム・アクセス':'#reserve','ご予約・アクセス':'#reserve'
};
function hashOnly(href){
  href=String(href||'');
  var i=href.indexOf('#');
  if(i===-1) return '';
  /* "/#about", "/index.html#annai", "#dk-services" → "#…" */
  return href.slice(i);
}
function resolveNavTarget(a){
  if(!a) return '';
  var t=(a.textContent||'').replace(/\s+/g,' ').trim();
  var href=a.getAttribute('href')||'';
  var h=hashOnly(href)||href;
  if(t.indexOf('Web予約')===0) return '#yoyaku';
  if(t.indexOf('お問い合わせ')===0) return ''; /* leave /inquiry alone */
  if(NAV_TEXT[t]) return NAV_TEXT[t];
  if(t.indexOf('予約ホーム')===0 || t.indexOf('予約・アクセス')===0) return '#reserve';
  if(t.indexOf('でてこいランドについて')===0 || t.indexOf('でてこいランドとは')===0) return '#about';
  if(NAV_HASH[h]) return NAV_HASH[h];
  if(/^#dk-/.test(h)) return NAV_HASH[h]||h;
  return '';
}
function closeMobileMenu(){
  try{
    var close=document.querySelector('button[aria-label="メニューを閉じる"]')
      || document.querySelector('button[aria-label="閉じる"]')
      || document.querySelector('button[aria-label*="閉じる"]');
    if(close){ close.click(); return; }
    /* Studio mobile drawer X often has short/empty label — click top-right control */
    var btns=document.querySelectorAll('button');
    for(var i=0;i<btns.length;i++){
      var b=btns[i], r=b.getBoundingClientRect();
      if(r.top>=0 && r.top<90 && r.right>window.innerWidth-90 && r.width>18 && r.height>18){
        var t=(b.getAttribute('aria-label')||'')+(b.textContent||'');
        if(/開く/.test(t)) continue;
        b.click(); return;
      }
    }
  }catch(e){}
}
function headerH(){
  try{
    var h=document.querySelector('header.fixed, header.sd, header');
    if(h){
      var hh=Math.round(h.getBoundingClientRect().height);
      if(hh>0 && hh<160) return hh;
    }
  }catch(e){}
  return window.innerWidth<=720?56:64;
}
function syncHeaderVar(){
  try{
    document.documentElement.style.setProperty('--dk-header-h', headerH()+'px');
  }catch(e){}
}
function scrollToEl(el){
  if(!el) return;
  try{
    var hh=headerH();
    var y=el.getBoundingClientRect().top+window.scrollY-hh-6;
    window.scrollTo(0, y<0?0:y);
  }catch(e){}
}
function goSection(hash){
  if(!hash) return;
  closeMobileMenu();
  syncHeaderVar();
  if(NAV_HASH[hash]) hash=NAV_HASH[hash];
  var el=null;
  if(hash==='#contact' || hash==='#yoyaku'){
    /* Prefer visible #contact form — zero-height #yoyaku + scroll-margin caused upward jumps */
    el=document.getElementById('contact')||document.querySelector('form[name="お問い合わせ_04"]')||document.getElementById('yoyaku');
    hash='#yoyaku';
  } else {
    el=document.getElementById(hash.slice(1));
  }
  try{ history.pushState(null,'',hash); }catch(e){}
  /* Mark so custom-code sync skips a second scrollIntoView */
  window.__DETEKOI_PORT_SCROLLED__=hash;
  function scroll(){ scrollToEl(el || document.getElementById(hash.slice(1))); }
  scroll();
  /* One layout retry only — avoid multi-pass scrollIntoView/scrollTo fighting */
  setTimeout(scroll, 140);
}
function rewriteNav(){
  /* Prefer Studio-native legacy hashes that now resolve to visible anchors */
  var native={
    'でてこいランドとは':'#about','でてこいランドについて':'#about',
    '施設案内':'#annai','施設紹介':'#annai','体験できること':'#taiken',
    'この場所の想い':'#omoi','予約・アクセス':'#reserve','予約ホーム・アクセス':'#reserve',
    'ご予約・アクセス':'#reserve'
  };
  document.querySelectorAll('a[href]').forEach(function(a){
    var t=(a.textContent||'').replace(/\s+/g,' ').trim();
    var href=a.getAttribute('href')||'';
    if(t.indexOf('Web予約')===0){ a.setAttribute('href','#yoyaku'); return; }
    if(t.indexOf('お問い合わせ')===0 && !/^https?:/i.test(href) && href.indexOf('/inquiry')!==0){
      a.setAttribute('href','/inquiry'); return;
    }
    if(native[t]){ a.setAttribute('href', native[t]); return; }
    var target=resolveNavTarget(a);
    if(target==='#contact'){ a.setAttribute('href','#yoyaku'); return; }
    if(target && target.indexOf('#dk-')===0) a.setAttribute('href', target);
  });
}
function wireNavClicks(){
  if(window.__DETEKOI_NAV_CLICK__) return;
  window.__DETEKOI_NAV_CLICK__=1;
  document.addEventListener('click', function(ev){
    var a=ev.target && ev.target.closest && ev.target.closest('a');
    if(!a) return;
    var href=a.getAttribute('href')||'';
    if(/^(https?:|mailto:|tel:)/i.test(href)) return;
    /* real multi-page paths without hash — leave */
    if(href.indexOf('/inquiry')===0 || href.indexOf('/rule')===0) return;
    if(href.charAt(0)==='/' && href.indexOf('#')===-1 && href!=='/' && href!=='/index.html') return;
    var target=resolveNavTarget(a);
    if(!target){
      var h=hashOnly(href);
      if(/^#dk-/.test(h)) target=h;
      else return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    if(typeof ev.stopImmediatePropagation==='function') ev.stopImmediatePropagation();
    goSection(target);
  }, true);
  window.addEventListener('hashchange', function(){
    var h=location.hash||'';
    if(!h || h==='#') return;
    /* Scroll to native (or aliased) id — do not rewrite URL to #dk-* */
    if(NAV_HASH[h] || document.getElementById(h.slice(1))) goSection(h);
  });
}
function placePort(port){
  /* Always keep port immediately before #contact (hero → port → form) */
  var contact=document.getElementById('contact');
  if(contact&&contact.parentNode){
    if(port.nextSibling!==contact) contact.parentNode.insertBefore(port, contact);
    return;
  }
  var main=document.querySelector('main')||document.body;
  if(port.parentNode!==main) main.appendChild(port);
}
function placeHero(hero, port){
  if(!hero) return;
  /* Prefer replacing Studio speech-bubble hero slot (under nav) */
  var studio=document.querySelector('[data-dk-studio-hero="1"]');
  if(studio && studio.parentNode){
    if(hero.nextSibling!==studio) studio.parentNode.insertBefore(hero, studio);
    return;
  }
  if(port && port.parentNode){
    if(hero.nextSibling!==port) port.parentNode.insertBefore(hero, port);
    return;
  }
  var contact=document.getElementById('contact');
  if(contact&&contact.parentNode){
    if(hero.nextSibling!==contact) contact.parentNode.insertBefore(hero, contact);
    return;
  }
  var main=document.querySelector('main')||document.body;
  if(hero.parentNode!==main) main.appendChild(hero);
}
/* Hide Studio speech-bubble inset hero + empty spacers above the port.
   Do NOT touch #contact / forms / port / nav. */
function hideStudioHero(){
  try{
    var marked=0;
    document.querySelectorAll('section.section, section').forEach(function(sec){
      if(sec.id==='detekoi-hero' || (sec.closest && sec.closest('#detekoi-port,#detekoi-hero,#contact'))) return;
      if(sec.getAttribute('data-dk-studio-hero')==='1'){ marked=1; return; }
      var t=(sec.innerText||'').replace(/\s+/g,' ').trim();
      if(!t) return;
      if(t.indexOf('五感が喜ぶ')===-1 || t.indexOf('みんなの秘密基地')===-1) return;
      /* Studio hero is short catch-only; port/about prose is longer */
      if(t.length>60) return;
      sec.setAttribute('data-dk-studio-hero','1');
      marked=1;
    });
    if(!marked) return;
    var hero=document.querySelector('[data-dk-studio-hero="1"]');
    if(!hero || !hero.parentNode) return;
    var kids=[].slice.call(hero.parentNode.children);
    var seenHero=false;
    kids.forEach(function(el){
      if(el===hero){ seenHero=true; return; }
      if(!seenHero) return;
      if(el.id==='detekoi-hero' || el.id==='detekoi-port' || el.id==='contact') return;
      if(el.querySelector && (el.querySelector('#detekoi-port, #detekoi-hero, #contact, form') || el.id==='yoyaku')) return;
      var t=(el.innerText||'').replace(/\s+/g,' ').trim();
      var r=el.getBoundingClientRect();
      /* Collapse empty Studio spacer blocks between old hero and port */
      if(!t && r.height>0 && r.height<160){
        el.setAttribute('data-dk-studio-gap','1');
      }
    });
  }catch(e){}
}
function buildHero(){
  var wrap=document.createElement('div');
  wrap.innerHTML=[
    '<section id="detekoi-hero" aria-label="長崎でてこいランド ヒーロー">',
    '  <div class="dk-hero__media" aria-hidden="true">',
    '    <img class="dk-hero__photo" src="'+ASSET+'/hero-bg.jpg" alt="" />',
    '  </div>',
    '  <div class="dk-hero__content">',
    '    <h1 class="dk-hero__brand dk-hero__reveal" data-reveal-delay="0">',
    '      <span class="dk-hero__brand-ja">長崎でてこいランド</span>',
    '      <span class="dk-hero__en">NAGASAKI DETEKOI LAND</span>',
    '    </h1>',
    '    <p class="dk-hero__catch dk-hero__reveal" data-reveal-delay="1">五感が喜ぶ</p>',
    '    <p class="dk-hero__catch dk-hero__reveal" data-reveal-delay="2">みんなの秘密基地</p>',
    '    <p class="dk-hero__support dk-hero__reveal" data-reveal-delay="3">さあ、外へ出よう。自然の中では、大人も子どもも等しく「自由」です。</p>',
    '    <div class="dk-hero__actions dk-hero__reveal" data-reveal-delay="4">',
    '      <a class="dk-hero__btn dk-hero__btn--solid" href="#yoyaku">Web予約</a>',
    '      <a class="dk-hero__btn dk-hero__btn--ghost" href="#taiken">体験できること</a>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');
  return wrap.firstElementChild;
}
/* Move Studio legacy IDs onto VISIBLE port/form so native hash links work
   without depending on the click interceptor (Studio-native friendly). */
function adoptLegacyIds(port){
  if(!port) return;
  var contact=document.getElementById('contact');
  ['about','annai','taiken','omoi','yoyaku','reserve'].forEach(function(id){
    var el=document.getElementById(id);
    if(!el) return;
    if(port.contains(el)) return;
    if(contact && contact.contains(el)) return;
    if(el.getAttribute('data-dk-anchor')==='1') return;
    el.id=id+'-legacy';
  });
  /* Prefer putting Studio-native IDs on the section hosts themselves.
     Keep previous #dk-* as alias spans so old links still resolve. */
  function promoteId(host, nativeId){
    if(!host) return;
    if(document.getElementById(nativeId) && document.getElementById(nativeId)!==host) return;
    var prev=host.id||'';
    if(host.id===nativeId) return;
    if(prev && prev.indexOf('dk-')===0){
      host.setAttribute('data-dk-id', prev);
      var alias=document.createElement('span');
      alias.id=prev; alias.setAttribute('data-dk-anchor','1'); alias.setAttribute('aria-hidden','true');
      alias.style.cssText='position:relative;display:block;height:0;width:0;overflow:hidden;scroll-margin-top:0';
      host.insertBefore(alias, host.firstChild);
    }
    host.id=nativeId;
    host.style.scrollMarginTop='0';
  }
  promoteId(document.getElementById('dk-about'), 'about');
  promoteId(document.getElementById('dk-facilities'), 'annai');
  promoteId(document.getElementById('dk-services'), 'taiken');
  promoteId(document.getElementById('dk-philosophy'), 'omoi');
  promoteId(document.getElementById('dk-reserve'), 'reserve');
  /* Booking hashes must land on the live Studio form, not a hidden block.
     Keep the anchor zero-size — contact-open CSS used to force min-height:50vh on #yoyaku. */
  function zeroAnchor(el){
    if(!el) return;
    el.setAttribute('data-dk-anchor','1');
    el.setAttribute('aria-hidden','true');
    ['position','display','height','width','max-height','min-height','overflow','padding','margin','background','border','font-size','line-height'].forEach(function(prop){
      var val={position:'relative',display:'block',height:'0',width:'0','max-height':'0','min-height':'0',overflow:'hidden',padding:'0',margin:'0',background:'transparent',border:'0','font-size':'0','line-height':'0'}[prop];
      try{ el.style.setProperty(prop, val, 'important'); }catch(e){}
    });
    try{ el.style.setProperty('scroll-margin-top','0'); }catch(e2){}
  }
  var yExist=document.getElementById('yoyaku');
  if(yExist && yExist.getAttribute('data-dk-anchor')==='1'){
    zeroAnchor(yExist);
  } else if(contact && !yExist){
    var y=document.createElement('span');
    y.id='yoyaku';
    zeroAnchor(y);
    contact.insertBefore(y, contact.firstChild);
  } else if(yExist){
    /* Studio-native #yoyaku that isn't our anchor — still collapse empty gap risk */
    zeroAnchor(yExist);
  }
  /* Honor landing hash once only — inject() retries must not keep re-scrolling */
  var h=location.hash||'';
  if(h && h.length>1 && !window.__DETEKOI_HASH_HONORED__){
    window.__DETEKOI_HASH_HONORED__=1;
    setTimeout(function(){ goSection(h); }, 120);
  }
}
function inject(){
  if(!onHome()) return;
  ensureFonts();
  syncHeaderVar();
  document.body.classList.add('detekoi-port-on');
  wireNavClicks();
  hideStudioHero();
  var hero=document.getElementById('detekoi-hero');
  if(!hero){
    hero=buildHero();
  }
  var existing=document.getElementById('detekoi-port');
  if(existing){
    placePort(existing);
    placeHero(hero, existing);
    adoptLegacyIds(existing);
    wireSlideshow(existing);
    hideStudioHero();
    rewriteNav();
    syncHeaderVar();
    return;
  }
  var mount=document.createElement('div');
  mount.innerHTML="\n<div id=\"detekoi-port\">\n  <section class=\"dk-section\" id=\"dk-services\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">EXPERIENCE</p>\n      <h2>体験できること</h2>\n      <div class=\"dk-services\">\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/08-toys.jpg\" alt=\"でてこいランドのピアノ\" loading=\"lazy\" />\n          <h3>遊べるおもちゃたち</h3>\n          <p>遊具広場　ピアノ　ミニ図書館　ツリーハウスなど子供から大人まで楽しめる遊具が充実してます</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/09-campfire.jpg\" alt=\"長崎でてこいランドの焚き火・BBQキャンプ体験\" loading=\"lazy\" />\n          <h3>BBQやキャンプも</h3>\n          <p>自然の中でバーベキューやキャンプを楽しみ楽しい思い出作り</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/14-star-trails.jpg\" alt=\"諫早・本野町で眺める長崎の星空（星の軌跡）\" loading=\"lazy\" />\n          <h3>夜には満点の星たち</h3>\n          <p>季節の星座を親子で楽しむ星空観察も、「でてこいランド」で過ごす夜の楽しみのひとつです。</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/13-totoro-rocks.jpg\" alt=\"でてこいランド周辺の自然のなかで遊ぶ岩場\" loading=\"lazy\" />\n          <h3>自然のなかで遊ぶ</h3>\n          <p>森や広場で思いきり遊べる場所があります。子どもたちがそのままでいられる楽しさを。</p>\n        </article>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section dk-section--soft\" id=\"dk-facilities\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">STAY / 施設案内</p>\n      <h2>施設案内</h2>\n      <figure class=\"dk-facility-overview\">\n        <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/facility-overview.jpg\" alt=\"長崎でてこいランドの広々としたコテージ内観\" loading=\"lazy\" />\n      </figure>\n      <div class=\"dk-stay\">\n        <div class=\"dk-stay__visual\">\n          <p class=\"dk-stay__catch\">ふっと深呼吸したくなる。</p>\n          <ul class=\"dk-cues\" aria-label=\"施設の雰囲気\">\n            <li><span>森林</span></li><li><span>焚き火</span></li><li><span>星空</span></li><li><span>休息</span></li>\n          </ul>\n          <div class=\"dk-slideshow\" data-dk-slideshow>\n            <div class=\"dk-slideshow__vp\"><img class=\"is-active\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-01-night-lodge.jpg\" alt=\"夜、あたたかな灯りがともるログハウス\"  /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-02-genkan.jpg\" alt=\"でてこいランドの玄関\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-03-deck.jpg\" alt=\"デッキとDETEKOIのサイン\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-05-desks.jpg\" alt=\"学校机と黒板のある木の部屋\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-06-bath.jpg\" alt=\"大浴場\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-07-washitsu.jpg\" alt=\"和室のお部屋\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-08-toys.jpg\" alt=\"おもちゃコーナー\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-09-field.jpg\" alt=\"大きな広場\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-10-entrance.jpg\" alt=\"施設へのアプローチ\" loading=\"lazy\" /></div>\n            <div class=\"dk-slideshow__dots\" data-dk-dots></div>\n            <button type=\"button\" class=\"dk-slideshow__btn dk-slideshow__btn--prev\" data-dk-prev aria-label=\"前の写真\">‹</button>\n            <button type=\"button\" class=\"dk-slideshow__btn dk-slideshow__btn--next\" data-dk-next aria-label=\"次の写真\">›</button>\n          </div>\n        </div>\n        <div class=\"dk-stay__copy\">\n          <h3>広々コテージは約50名収容</h3>\n          <p>でてこいランドには大きなコテージや広場があり、子供たちがそのままでいられることの楽しさを感じられるよう日々整えております。見守り人もすぐ見渡せるよう、開放的なつくりにしています。</p>\n          <ul class=\"dk-bullets\">\n            <li>テントもたてられる大きな広場</li>\n            <li>お風呂も大浴場があり、洗濯機なども完備</li>\n            <li>お部屋は和洋室、広さもいろいろ</li>\n            <li>夜には満点の星たち</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"dk-strip\">\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/04-facility-interior.jpg\" alt=\"円卓のある共用スペース\" loading=\"lazy\" />\n          <figcaption>円卓のある共用スペース</figcaption>\n        </figure>\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/07-bath.jpg\" alt=\"大浴場\" loading=\"lazy\" />\n          <figcaption>お風呂も大浴場があり、洗濯機なども完備</figcaption>\n        </figure>\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/06-guest-room.jpg\" alt=\"和室\" loading=\"lazy\" />\n          <figcaption>お部屋は和洋室、広さもいろいろ</figcaption>\n        </figure>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section\" id=\"dk-about\">\n    <div class=\"dk-wrap dk-split\">\n      <div>\n        <p class=\"dk-label\">ABOUT</p>\n        <h2>さあ、外へ出よう。</h2>\n        <div class=\"dk-prose\">\n          <p>思いきり走ってもいい。大きな声で笑ってもいい。火を起こしてもいい。</p>\n          <p>自然の中では、大人も子どもも等しく「自由」です。</p>\n          <p>「でも、うちの子はみんなと違うから」「みんなに迷惑がかかるから」——そんな思いから、一歩を踏み出せずにいる人へ。</p>\n          <p class=\"dk-em\">さあ外の世界へ、“でてこい！”</p>\n          <p>長崎でてこいランドという名前には、自然の中へ、人との出会いへ、まだ見ぬ感動へ飛び込もう。そんな願いが込められています。</p>\n        </div>\n      </div>\n      <figure>\n        <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/18-campsite-tents-field.jpg\" alt=\"長崎でてこいランドの広場に並ぶテントとキャンプサイト\" loading=\"lazy\" />\n      </figure>\n    </div>\n  </section>\n\n  <section class=\"dk-section\" id=\"dk-philosophy\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\" style=\"text-align:left\">PHILOSOPHY</p>\n      <h2 style=\"text-align:left\">この場所への想い</h2>\n      <p class=\"dk-lede\" style=\"text-align:left;margin-left:0\">この場所を守り続ける理由。</p>\n      <div class=\"dk-philo\">\n        <figure class=\"dk-portrait\">\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/17-director-illust.jpg\" alt=\"長崎でてこいランド 似顔ライター画\" loading=\"lazy\" />\n          <figcaption>長崎でてこいランド</figcaption>\n        </figure>\n        <div class=\"dk-prose\">\n          <p>長崎でてこいランドは、多くの人の想いが受け継がれながら歩んできた場所です。</p>\n          <p>廃業寸前だったこの場所を引き継いでから、少しずつ手を入れ、草を刈り、木を直し、花を植え、十年という歳月をかけて育んできました。</p>\n          <p>豪華な施設をつくりたかったわけではありません。子どもたちが季節の花に足を止め、火を囲み、星空に感動する。そんな「本物にふれる感動」を届けたかったのです。</p>\n          <p>私が大切にしているのは、「来てよかった」と心から思える瞬間。これからも、一人でも多くの人に感動を届け、みんなから愛される長崎でてこいランドを次世代に残し伝えてまいります。</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section dk-section--soft\" id=\"dk-reserve\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">RESERVATION</p>\n      <h2>ご予約・アクセス</h2>\n      <p class=\"dk-lede\">ご予約は下の<strong>メールフォーム</strong>（Web予約）から。ご相談・空きの確認はお電話でも承ります。</p>\n      <div class=\"dk-reserve-grid\">\n        <div>\n          <div class=\"dk-map\">\n            <iframe title=\"長崎でてこいランドの地図\" loading=\"lazy\" referrerpolicy=\"no-referrer-when-downgrade\"\n              src=\"https://maps.google.com/maps?q=%E9%95%B7%E5%B4%8E%E3%81%A7%E3%81%A6%E3%81%93%E3%81%84%E3%83%A9%E3%83%B3%E3%83%89+%E8%AB%A7%E6%97%A9%E5%B8%82%E6%9C%AC%E9%87%8E%E7%94%BA&z=15&output=embed&hl=ja\"></iframe>\n          </div>\n          <address class=\"dk-address\">〒854-0093 長崎県諫早市本野町１３０３<br />諫早駅から車で10分※無料駐車場あり</address>\n        </div>\n        <div class=\"dk-actions\">\n          <a class=\"dk-btn dk-btn--outline\" href=\"tel:09052907807\">電話・ご相談<br /><strong>☎ 090-5290-7807</strong></a>\n          <a class=\"dk-btn dk-btn--solid\" href=\"#yoyaku\">Web予約（メールフォーム）</a>\n          <p class=\"dk-note\">※毎週木曜・12/25〜1/7お休み</p>\n        </div>\n      </div>\n    </div>\n  </section>\n</div>\n".trim();
  var port=mount.firstElementChild;
  placePort(port);
  placeHero(hero, port);
  adoptLegacyIds(port);
  wireSlideshow(port);
  hideStudioHero();
  rewriteNav();
  wireNavClicks();
  syncHeaderVar();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', inject);
else inject();
var n=0; var t=setInterval(function(){ inject(); if(++n>=40) clearInterval(t); }, 300);
setTimeout(function(){ clearInterval(t); inject(); }, 12000);
try{ window.addEventListener('resize', function(){ syncHeaderVar(); }, {passive:true}); }catch(e){ window.addEventListener('resize', syncHeaderVar); }
try{ new MutationObserver(function(){ inject(); }).observe(document.documentElement,{childList:true,subtree:true}); }catch(e){}

})();
