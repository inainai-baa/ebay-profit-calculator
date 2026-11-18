(function(){
var bootScript=document.currentScript;
var mySrc=bootScript?bootScript.getAttribute('src')||'':'';
function portPin(src){
  var m=(src||'').match(/ebay-profit-calculator@([0-9a-f]+)\//);
  return m?m[1]:'';
}
var myPin=portPin(mySrc);
if(!myPin&&!window.__DETEKOI_PORT_BOOT__) window.__DETEKOI_PORT_BOOT__=1;
if(window.__DETEKOI_PORT_ACTIVE_PIN__){
  if(window.__DETEKOI_PORT_ACTIVE_PIN__===myPin) return;
  if(myPin==='d3982e1'||myPin.length<7) return;
}
if(window.__DETEKOI_PORT_BOOT__&&!myPin) return;
window.__DETEKOI_PORT_ACTIVE_PIN__=myPin||window.__DETEKOI_PORT_ACTIVE_PIN__;
window.__DETEKOI_PORT_BOOT__=1;
try{
  document.querySelectorAll('script[src*="studio-port.js"]').forEach(function(s){
    if(s===bootScript) return;
  if(portPin(s.getAttribute('src')||'')==='d3982e1') s.remove();
  });
}catch(e){}
var cssHref = (document.currentScript && document.currentScript.getAttribute('data-css')) || '';
function ensurePortCss(href){
  if(!href) return;
  var head=document.head||document.documentElement;
  var link=document.getElementById('detekoi-port-css-link');
  if(!link){
    link=document.createElement('link');
    link.id='detekoi-port-css-link';
    link.rel='stylesheet';
    head.insertBefore(link, head.firstChild||null);
  }
  if(link.getAttribute('href')!==href) link.setAttribute('href', href);
  try{ if(link.href!==href) link.href=href; }catch(e){}
  try{
    document.querySelectorAll('link[href*="studio-port.css"]').forEach(function(el){
      if(el===link) return;
      if((el.getAttribute('href')||'').indexOf('ebay-profit-calculator@')!==-1) el.remove();
    });
  }catch(e){}
}
ensurePortCss(cssHref);
function injectMobileHeroCtaFix(){
  if(document.getElementById('dk-mobile-hero-cta-fix')) return;
  var st=document.createElement('style');
  st.id='dk-mobile-hero-cta-fix';
  st.textContent='@media (max-width:720px){#detekoi-hero{min-height:100svh;display:grid!important;place-items:center!important}#detekoi-hero .dk-hero__photo{object-position:center 32%!important}#detekoi-hero .dk-hero__content{width:100%;max-width:48rem;padding:3rem 1rem 4rem!important;text-align:center!important;position:static!important}#detekoi-hero .dk-hero__actions{position:absolute!important;left:50%!important;right:auto!important;transform:translateX(-50%)!important;bottom:max(1.35rem,env(safe-area-inset-bottom,0px))!important;width:min(22rem,calc(100vw - 2rem))!important;margin-top:0!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:.8rem!important;z-index:2!important}#detekoi-hero .dk-hero__btn{width:100%!important}}';
  document.head.appendChild(st);
}
function markPortReady(){
  try{
    document.documentElement.classList.add('detekoi-port-ready');
    document.documentElement.classList.remove('detekoi-await-port');
  }catch(e){}
}

/* Client toggle: set true when pricing accordion may be shown again. */
var SHOW_PRICING=false;
function pricingEnabled(){ return !!SHOW_PRICING; }
function applyPricingVisibility(){
  try{
    var on=pricingEnabled();
    document.documentElement.classList.toggle('detekoi-hide-pricing', !on);
    if(document.body) document.body.classList.toggle('detekoi-hide-pricing', !on);
    if(on) applyPricingCopyAdjustments(document);
  }catch(e){}
}
function restorePricingCopy(scope){
  var root=scope||document;
  root.querySelectorAll('[data-dk-pricing-copy-orig]').forEach(function(el){
    el.innerHTML=el.getAttribute('data-dk-pricing-copy-orig')||'';
    el.removeAttribute('data-dk-pricing-copy-orig');
  });
  root.querySelectorAll('[data-dk-pricing-copy-hidden="1"]').forEach(function(el){
    el.style.removeProperty('display');
    el.style.removeProperty('visibility');
    el.removeAttribute('aria-hidden');
    el.removeAttribute('data-dk-pricing-copy-hidden');
  });
}
function applyPricingCopyAdjustments(scope){
  var root=scope||document;
  if(pricingEnabled()){
    restorePricingCopy(root);
    return;
  }
  var snippets=[
    '料金は下の表を開いてご確認ください。',
    '料金は下の表を開いてご確認ください',
    '料金はカテゴリを開いてご確認ください。',
    '料金はカテゴリを開いてご確認ください',
    '料金は下の表を開いてご確認いただけます。',
    '料金はカテゴリを開いてご確認いただけます。'
  ];
  if(root.querySelector('#detekoi-port #dk-reserve')){
    root.querySelectorAll('#reserve p, #reserve .text, #reserve [class*="text"]').forEach(function(el){
      if(el.closest('#detekoi-port')) return;
      el.setAttribute('data-dk-pricing-copy-hidden','1');
      el.setAttribute('aria-hidden','true');
      el.style.setProperty('display','none','important');
    });
  }
  root.querySelectorAll('#reserve p, #reserve .dk-lede, #dk-reserve p, #dk-reserve .dk-lede, #detekoi-port #dk-reserve p, #detekoi-port #dk-reserve .dk-lede').forEach(function(el){
    if(el.closest('[data-dk-pricing-hidden="1"],.pricing,[data-pricing-root],#pricing')) return;
    var text=el.textContent||'';
    if(!/料金/.test(text)) return;
    var html=el.innerHTML;
    if(!el.getAttribute('data-dk-pricing-copy-orig')) el.setAttribute('data-dk-pricing-copy-orig',html);
    var next=html;
    snippets.forEach(function(s){ next=next.split(s).join(''); });
    next=next.replace(/。{2,}/g,'。').trim();
    el.innerHTML=next;
  });
  root.querySelectorAll('h1,h2,h3,h4,p,span,a,strong').forEach(function(el){
    if(el.closest('[data-dk-pricing-hidden="1"],.pricing,[data-pricing-root],#pricing')) return;
    if((el.textContent||'').trim().length>48) return;
    var t=(el.textContent||'').replace(/\s+/g,'').trim();
    if(t!=='料金表' && t!=='長崎でてこいランド料金表' && !/^料金表を/.test(t)) return;
    el.setAttribute('data-dk-pricing-copy-hidden','1');
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
  });
}
function applyPricingHide(scope){
  if(pricingEnabled()) return;
  applyPricingVisibility();
  var root=scope||document;
  root.querySelectorAll('[data-pricing-root], #detekoi-port .pricing, #detekoi-port #pricing').forEach(function(el){
    el.setAttribute('data-dk-pricing-hidden','1');
    el.setAttribute('aria-hidden','true');
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('height','0','important');
    el.style.setProperty('max-height','0','important');
    el.style.setProperty('margin','0','important');
    el.style.setProperty('padding','0','important');
    el.style.setProperty('overflow','hidden','important');
    el.style.setProperty('border','0','important');
  });
  applyPricingCopyAdjustments(root);
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
function wireMapEmbed(root){
  if(!root) return;
  var img=root.querySelector('#dk-reserve .dk-map__img, .dk-map__img');
  if(!img||img.getAttribute('data-dk-map-wired')==='1') return;
  img.setAttribute('data-dk-map-wired','1');
  try{
    img.loading='eager';
    img.setAttribute('loading','eager');
    img.setAttribute('decoding','async');
    if(!img.complete && !img.getAttribute('src')) return;
    if(img.complete && img.naturalWidth>40) return;
    var src=img.getAttribute('src')||'';
    var kick=function(){ if(src) img.src=src; };
    kick();
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){
        if(es.some(function(e){ return e.isIntersecting; })){ kick(); io.disconnect(); }
      },{rootMargin:'280px 0px',threshold:0.01});
      io.observe(img);
    }
  }catch(e){}
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
  /* Prefer first child of main so nothing can paint a cream/wave band above sky */
  var main=document.querySelector('main')||document.body;
  if(hero.parentNode!==main || main.firstElementChild!==hero){
    main.insertBefore(hero, main.firstElementChild || null);
  }
  collapseBeforeHero();
  /* Keep port after hero when present */
  if(port && port.parentNode && hero.nextSibling!==port){
    /* only reorder if port is a sibling; don't pull contact forms around */
    if(port.parentNode===hero.parentNode){
      hero.parentNode.insertBefore(port, hero.nextSibling);
    }
  }
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
      /* Studio catch may be polluted by injected <style> text (length >> 60).
         Still mark section.section; skip long prose blocks outside .section. */
      if(t.length>60 && !(sec.classList && sec.classList.contains('section'))) return;
      sec.setAttribute('data-dk-studio-hero','1');
      marked=1;
    });
    /* Also collapse any in-flow main siblings before #detekoi-hero (cream band /
       wavy leftover speech-bubble / spacer that can sit between header and sky). */
    collapseBeforeHero();
    var port=document.getElementById('detekoi-port');
    if(port){
      stompStudioNativeIds(port);
      hideStudioMainTail(port);
    }
    /* Studio native hero uses loop-box; its scrollbar pill can flash under the fixed header */
    try{
      document.querySelectorAll('loop-box, .loop-box').forEach(function(el){
        if(el.closest && el.closest('#detekoi-port, #detekoi-hero, #contact')) return;
        el.style.setProperty('display','none','important');
        el.style.setProperty('visibility','hidden','important');
        el.style.setProperty('height','0','important');
        el.style.setProperty('overflow','hidden','important');
      });
    }catch(e){}
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
/* Mark every main child that precedes #detekoi-hero so CSS can zero it.
   Prevents intermittent cream/wave bands when Studio spacers briefly lay out. */
function collapseBeforeHero(){
  try{
    var hero=document.getElementById('detekoi-hero');
    if(!hero || !hero.parentNode) return;
    var kids=[].slice.call(hero.parentNode.children);
    for(var i=0;i<kids.length;i++){
      var el=kids[i];
      if(el===hero) break;
      if(el.id==='detekoi-port' || el.id==='contact') continue;
      if(el.querySelector && el.querySelector('#detekoi-port, #detekoi-hero, #contact, form')) continue;
      el.setAttribute('data-dk-studio-gap','1');
    }
    /* Ensure soft-fade hero is the first in-flow child of main */
    if(hero.parentNode.firstElementChild!==hero){
      hero.parentNode.insertBefore(hero, hero.parentNode.firstElementChild);
    }
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
function stompStudioNativeIds(port){
  if(!port) return;
  var contact=document.getElementById('contact');
  ['about','annai','taiken','omoi','yoyaku','reserve'].forEach(function(id){
    try{
      document.querySelectorAll('[id="'+id+'"]').forEach(function(el){
        if(port.contains(el)) return;
        if(contact && contact.contains(el)) return;
        if(el.getAttribute('data-dk-anchor')==='1') return;
        if(el.id===id) el.id=id+'-legacy';
        el.setAttribute('data-dk-studio-legacy','1');
      });
    }catch(e){}
  });
}
/* Studio re-hydration can re-insert native IA after #detekoi-port (duplicate
   さあ外へ / 施設 / 体験 / 想い blocks before the real #contact form). */
function hideStudioMainTail(port){
  if(!port || !port.parentNode) return;
  var past=false;
  try{
    [].slice.call(port.parentNode.children).forEach(function(el){
      if(el===port){ past=true; return; }
      if(!past) return;
      if(el.id==='contact') return;
      if(el.id==='detekoi-hero') return;
      if(el.contains && el.contains(contact)) return;
      if(el.querySelector && el.querySelector('#contact form, form[name="お問い合わせ_04"]')) return;
      el.setAttribute('data-dk-studio-legacy','1');
    });
  }catch(e){}
}
function adoptLegacyIds(port){
  if(!port) return;
  stompStudioNativeIds(port);
  var contact=document.getElementById('contact');
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
  stompStudioNativeIds(port);
  hideStudioMainTail(port);
  /* Booking hashes must land on the live Studio form, not a hidden block.
     Keep the anchor zero-size — contact-open CSS used to force min-height:50vh on #yoyaku. */
  function zeroAnchor(el){
    if(!el) return;
    el.setAttribute('data-dk-anchor','1');
    el.setAttribute('aria-hidden','true');
    /* position:absolute — stay out of #contact flex gap (Studio uses gap:100px) */
    ['position','left','top','display','height','width','max-height','min-height','overflow','padding','margin','background','border','font-size','line-height','pointer-events'].forEach(function(prop){
      var val={position:'absolute',left:'0',top:'0',display:'block',height:'0',width:'0','max-height':'0','min-height':'0',overflow:'hidden',padding:'0',margin:'0',background:'transparent',border:'0','font-size':'0','line-height':'0','pointer-events':'none'}[prop];
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
    wireMapEmbed(existing);
    hideStudioHero();
    rewriteNav();
    syncHeaderVar();
    mountPricing(existing);
    markPortReady();
    return;
  }
  var mount=document.createElement('div');
  mount.innerHTML="\n<div id=\"detekoi-port\">\n  <section class=\"dk-section\" id=\"dk-services\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">EXPERIENCE</p>\n      <h2>体験できること</h2>\n      <div class=\"dk-services\">\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/08-toys.jpg\" alt=\"でてこいランドのピアノ\" loading=\"lazy\" />\n          <h3>遊べるおもちゃたち</h3>\n          <p>遊具広場　ピアノ　ミニ図書館　ツリーハウスなど子供から大人まで楽しめる遊具が充実してます</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/09-campfire.jpg\" alt=\"長崎でてこいランドの焚き火・BBQキャンプ体験\" loading=\"lazy\" />\n          <h3>BBQやキャンプも</h3>\n          <p>自然の中でバーベキューやキャンプを楽しみ楽しい思い出作り</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/14-star-trails.jpg\" alt=\"諫早・本野町で眺める長崎の星空（星の軌跡）\" loading=\"lazy\" />\n          <h3>夜には満点の星たち</h3>\n          <p>季節の星座を親子で楽しむ星空観察も、「でてこいランド」で過ごす夜の楽しみのひとつです。</p>\n        </article>\n        <article>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/13-totoro-rocks.jpg\" alt=\"でてこいランド周辺の自然のなかで遊ぶ岩場\" loading=\"lazy\" />\n          <h3>自然のなかで遊ぶ</h3>\n          <p>森や広場で思いきり遊べる場所があります。子どもたちがそのままでいられる楽しさを。</p>\n        </article>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section dk-section--soft\" id=\"dk-facilities\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">STAY / 施設案内</p>\n      <h2>施設案内</h2>\n      <figure class=\"dk-facility-overview\">\n        <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/facility-overview.jpg\" alt=\"長崎でてこいランドの広々としたコテージ内観\" loading=\"lazy\" />\n      </figure>\n      <div class=\"dk-stay\">\n        <div class=\"dk-stay__visual\">\n          <p class=\"dk-stay__catch\">ふっと深呼吸したくなる。</p>\n          <ul class=\"dk-cues\" aria-label=\"施設の雰囲気\">\n            <li><span>森林</span></li><li><span>焚き火</span></li><li><span>星空</span></li><li><span>休息</span></li>\n          </ul>\n          <div class=\"dk-slideshow\" data-dk-slideshow>\n            <div class=\"dk-slideshow__vp\"><img class=\"is-active\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-01-night-lodge.jpg\" alt=\"夜、あたたかな灯りがともるログハウス\"  /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-02-genkan.jpg\" alt=\"でてこいランドの玄関\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-03-deck.jpg\" alt=\"デッキとDETEKOIのサイン\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-05-desks.jpg\" alt=\"学校机と黒板のある木の部屋\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-06-bath.jpg\" alt=\"大浴場\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-07-washitsu.jpg\" alt=\"和室のお部屋\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-08-toys.jpg\" alt=\"おもちゃコーナー\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-09-field.jpg\" alt=\"大きな広場\" loading=\"lazy\" /><img class=\"\" src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/slides/slide-10-entrance.jpg\" alt=\"施設へのアプローチ\" loading=\"lazy\" /></div>\n            <div class=\"dk-slideshow__dots\" data-dk-dots></div>\n            <button type=\"button\" class=\"dk-slideshow__btn dk-slideshow__btn--prev\" data-dk-prev aria-label=\"前の写真\">‹</button>\n            <button type=\"button\" class=\"dk-slideshow__btn dk-slideshow__btn--next\" data-dk-next aria-label=\"次の写真\">›</button>\n          </div>\n        </div>\n        <div class=\"dk-stay__copy\">\n          <h3>広々コテージは約50名収容</h3>\n          <p>でてこいランドには大きなコテージや広場があり、子供たちがそのままでいられることの楽しさを感じられるよう日々整えております。見守り人もすぐ見渡せるよう、開放的なつくりにしています。</p>\n          <ul class=\"dk-bullets\">\n            <li>テントもたてられる大きな広場</li>\n            <li>お風呂も大浴場があり、洗濯機なども完備</li>\n            <li>お部屋は和洋室、広さもいろいろ</li>\n            <li>夜には満点の星たち</li>\n          </ul>\n        </div>\n      </div>\n      <div class=\"dk-strip\">\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/04-facility-interior.jpg\" alt=\"円卓のある共用スペース\" loading=\"lazy\" />\n          <figcaption>円卓のある共用スペース</figcaption>\n        </figure>\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/07-bath.jpg\" alt=\"大浴場\" loading=\"lazy\" />\n          <figcaption>お風呂も大浴場があり、洗濯機なども完備</figcaption>\n        </figure>\n        <figure>\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/06-guest-room.jpg\" alt=\"和室\" loading=\"lazy\" />\n          <figcaption>お部屋は和洋室、広さもいろいろ</figcaption>\n        </figure>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section\" id=\"dk-about\">\n    <div class=\"dk-wrap dk-split\">\n      <div>\n        <p class=\"dk-label\">ABOUT</p>\n        <h2>さあ、外へ出よう。</h2>\n        <div class=\"dk-prose\">\n          <p>思いきり走ってもいい。大きな声で笑ってもいい。火を起こしてもいい。</p>\n          <p>自然の中では、大人も子どもも等しく「自由」です。</p>\n          <p>「でも、うちの子はみんなと違うから」「みんなに迷惑がかかるから」——そんな思いから、一歩を踏み出せずにいる人へ。</p>\n          <p class=\"dk-em\">さあ外の世界へ、“でてこい！”</p>\n          <p>長崎でてこいランドという名前には、自然の中へ、人との出会いへ、まだ見ぬ感動へ飛び込もう。そんな願いが込められています。</p>\n        </div>\n      </div>\n      <figure>\n        <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/18-campsite-tents-field.jpg\" alt=\"長崎でてこいランドの広場に並ぶテントとキャンプサイト\" loading=\"lazy\" />\n      </figure>\n    </div>\n  </section>\n\n  <section class=\"dk-section\" id=\"dk-philosophy\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\" style=\"text-align:left\">PHILOSOPHY</p>\n      <h2 style=\"text-align:left\">この場所への想い</h2>\n      <p class=\"dk-lede\" style=\"text-align:left;margin-left:0\">この場所を守り続ける理由。</p>\n      <div class=\"dk-philo\">\n        <figure class=\"dk-portrait\">\n          <img src=\"https://inainai-baa.github.io/ebay-profit-calculator/detekoi-land-mockup/assets/photos/17-director-illust.jpg\" alt=\"長崎でてこいランド 似顔ライター画\" loading=\"lazy\" />\n          <figcaption>長崎でてこいランド</figcaption>\n        </figure>\n        <div class=\"dk-prose\">\n          <p>長崎でてこいランドは、多くの人の想いが受け継がれながら歩んできた場所です。</p>\n          <p>廃業寸前だったこの場所を引き継いでから、少しずつ手を入れ、草を刈り、木を直し、花を植え、十年という歳月をかけて育んできました。</p>\n          <p>豪華な施設をつくりたかったわけではありません。子どもたちが季節の花に足を止め、火を囲み、星空に感動する。そんな「本物にふれる感動」を届けたかったのです。</p>\n          <p>私が大切にしているのは、「来てよかった」と心から思える瞬間。これからも、一人でも多くの人に感動を届け、みんなから愛される長崎でてこいランドを次世代に残し伝えてまいります。</p>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"dk-section dk-section--soft\" id=\"dk-reserve\">\n    <div class=\"dk-wrap\">\n      <p class=\"dk-label\">RESERVATION</p>\n      <h2>ご予約・アクセス</h2>\n      <p class=\"dk-lede\">ご予約は下の<strong>メールフォーム</strong>（Web予約）から。ご相談・空きの確認はお電話でも。</p>\n      <div class=\"dk-reserve-grid\">\n        <div>\n          <div class=\"dk-map\">\n            <a class=\"dk-map__open\" href=\"https://www.google.com/maps/search/?api=1&amp;query=%E9%95%B7%E5%B4%8E%E3%81%A7%E3%81%A6%E3%81%93%E3%81%84%E3%83%A9%E3%83%B3%E3%83%89+%E8%AB%A7%E6%97%A9%E5%B8%82%E6%9C%AC%E9%87%8E%E7%94%BA\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Googleマップで長崎でてこいランドを開く\">\n              <img class=\"dk-map__img\" width=\"640\" height=\"320\" loading=\"eager\" decoding=\"async\" alt=\"長崎でてこいランド周辺の地図（諫早市本野町）\" src=\"https://ows.terrestris.de/osm/service?SERVICE=WMS&amp;VERSION=1.1.1&amp;REQUEST=GetMap&amp;LAYERS=OSM-WMS&amp;STYLES=&amp;FORMAT=image%2Fpng&amp;SRS=EPSG%3A4326&amp;BBOX=130.02,32.865,130.06,32.895&amp;WIDTH=640&amp;HEIGHT=320\" />\n              <span class=\"dk-map__pill\">Googleマップで開く</span>\n            </a>\n          </div>\n          <address class=\"dk-address\">〒854-0093 長崎県諫早市本野町１３０３<br />諫早駅から車で10分※無料駐車場あり</address>\n        </div>\n        <div class=\"dk-actions\">\n          <a class=\"dk-btn dk-btn--outline\" href=\"tel:09052907807\">電話・ご相談<br /><strong>☎ 090-5290-7807</strong></a>\n          <a class=\"dk-btn dk-btn--solid\" href=\"#yoyaku\">Web予約（メールフォーム）</a>\n          <p class=\"dk-note\">※毎週木曜・12/25〜1/7お休み</p>\n        </div>\n      </div>\n      <div class=\"pricing\" id=\"pricing\" data-pricing-root>\n        <div class=\"pricing__head\">\n          <h3 class=\"pricing__title\" data-pricing-title>料金表</h3>\n          <p class=\"pricing__meta\" data-pricing-meta></p>\n        </div>\n        <div class=\"pricing__accordion\" data-pricing-accordion id=\"booking\"></div>\n      </div>\n    </div>\n  </section>\n</div>\n".trim();
  var port=mount.firstElementChild;
  placePort(port);
  placeHero(hero, port);
  adoptLegacyIds(port);
  wireSlideshow(port);
  wireMapEmbed(port);
  hideStudioHero();
  rewriteNav();
  wireNavClicks();
  syncHeaderVar();
  mountPricing(port);
  markPortReady();
}

function pricingScriptUrl(){
  try{
    var cur=document.querySelector('script[src*="studio-port.js"]');
    if(cur && cur.src) return cur.src.replace(/studio-port\.js(\?.*)?$/,'pricing-data.js$1');
  }catch(e){}
  return 'https://cdn.jsdelivr.net/gh/inainai-baa/ebay-profit-calculator@449b684257d479c17845237bb39bf1a631975c77/detekoi-land-mockup/pricing-data.js';
}
function loadPricingData(cb){
  if(window.DETEKOI_PRICING){ cb(window.DETEKOI_PRICING); return; }
  if(window.__DETEKOI_PRICING_LOADING__){
    var n=0; var t=setInterval(function(){
      if(window.DETEKOI_PRICING || ++n>40){ clearInterval(t); if(window.DETEKOI_PRICING) cb(window.DETEKOI_PRICING); }
    },150);
    return;
  }
  window.__DETEKOI_PRICING_LOADING__=1;
  var s=document.createElement('script');
  s.src=pricingScriptUrl();
  s.async=true;
  s.onload=function(){ window.__DETEKOI_PRICING_LOADING__=0; cb(window.DETEKOI_PRICING); };
  s.onerror=function(){ window.__DETEKOI_PRICING_LOADING__=0; };
  (document.head||document.documentElement).appendChild(s);
}
function escapeHtml(s){
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function buildPricingAccordion(root, pricing){
  if(!root || !pricing || root.getAttribute('data-dk-pricing')==='1') return;
  var titleEl=root.querySelector('[data-pricing-title]');
  var metaEl=root.querySelector('[data-pricing-meta]');
  var accordion=root.querySelector('[data-pricing-accordion]');
  if(!accordion) return;
  if(titleEl && pricing.title) titleEl.textContent=pricing.title;
  /* Client: remove Reiwa / 反映日 line under 長崎でてこいランド料金表 */
  if(metaEl){
    metaEl.textContent='';
    metaEl.setAttribute('hidden','');
    metaEl.setAttribute('aria-hidden','true');
  }
  accordion.innerHTML='';
  function facilityTable(rows){
    var body=(rows||[]).map(function(r){
      var label=[r.item,r.category].filter(Boolean).join(' / ');
      return '<tr><th scope="row">'+escapeHtml(label)+(r.unit?'<span class="pricing__unit">'+escapeHtml(r.unit)+'</span>':'')+'</th><td class="pricing__yen">'+escapeHtml(r.green)+'</td><td class="pricing__yen">'+escapeHtml(r.yellow)+'</td></tr>';
    }).join('');
    return '<div class="pricing__table-wrap"><table class="pricing__table"><thead><tr><th scope="col">内容</th><th scope="col">通常価格</th><th scope="col">土日祝</th></tr></thead><tbody>'+body+'</tbody></table></div>';
  }
  function rentalTable(rows){
    var body=(rows||[]).map(function(r){
      return '<tr><th scope="row">'+escapeHtml(r.item)+(r.detail?'<span class="pricing__unit">'+escapeHtml(r.detail)+'</span>':'')+'</th><td class="pricing__yen">'+escapeHtml(r.price)+'</td></tr>';
    }).join('');
    return '<div class="pricing__table-wrap"><table class="pricing__table pricing__table--rental"><thead><tr><th scope="col">商品</th><th scope="col">レンタル価格</th></tr></thead><tbody>'+body+'</tbody></table></div>';
  }
  function notesList(items){
    return '<ul class="pricing__notes">'+(items||[]).map(function(t){ return '<li>'+escapeHtml(t)+'</li>'; }).join('')+'</ul>';
  }
  (pricing.sections||[]).forEach(function(section,i){
    var details=document.createElement('details');
    details.className='pricing__panel';
    details.open=i===0;
    var summary=document.createElement('summary');
    summary.className='pricing__summary';
    summary.innerHTML='<span>'+escapeHtml(section.title)+'</span><span class="pricing__chevron" aria-hidden="true"></span>';
    var body=document.createElement('div');
    body.className='pricing__body';
    if(section.kind==='facility') body.innerHTML=facilityTable(section.rows);
    else if(section.kind==='rental') body.innerHTML=rentalTable(section.rows);
    else if(section.kind==='notes') body.innerHTML=notesList(section.items);
    details.appendChild(summary);
    details.appendChild(body);
    accordion.appendChild(details);
  });
  accordion.addEventListener('toggle', function(e){
    var t=e.target;
    if(!t || t.tagName!=='DETAILS' || !t.open) return;
    accordion.querySelectorAll('details.pricing__panel').forEach(function(d){ if(d!==t) d.open=false; });
  });
  root.setAttribute('data-dk-pricing','1');
}
function mountPricing(scope){
  applyPricingHide(scope);
  if(!pricingEnabled()) return;
  var root=(scope||document).querySelector('[data-pricing-root]');
  if(!root) return;
  loadPricingData(function(pricing){ if(pricing) buildPricingAccordion(root, pricing); });
}
function onRyokinPage(){
  var p=location.pathname||'/';
  return p==='/ryokin' || p.indexOf('/ryokin')===0;
}
function hideStudioPricingMedia(root){
  if(!root) return;
  root.querySelectorAll('a[href*=".pdf"],a[href*=".PDF"]').forEach(function(a){
    a.setAttribute('data-dk-pdf-hide','1');
    a.style.setProperty('display','none','important');
    a.setAttribute('aria-hidden','true');
  });
  root.querySelectorAll('.image').forEach(function(img){
    img.setAttribute('data-dk-pdf-hide','1');
    img.style.setProperty('display','none','important');
    img.setAttribute('aria-hidden','true');
  });
}
function enhanceRyokinPage(){
  if(!onRyokinPage()) return;
  ensureFonts();
  document.body.classList.add('detekoi-sub-on');
  applyPricingVisibility();
  var omoi=document.getElementById('omoi');
  if(!omoi) return;
  if(document.getElementById('dk-ryokin-pricing')){
    hideStudioPricingMedia(omoi);
    return;
  }
  if(!pricingEnabled()){ hideStudioPricingMedia(omoi); return; }
  var host=document.createElement('div');
  host.id='dk-ryokin-pricing';
  host.className='pricing pricing--ryokin';
  host.setAttribute('data-pricing-root','');
  host.innerHTML='<div class="pricing__head"><h3 class="pricing__title" data-pricing-title>料金表</h3><p class="pricing__meta" data-pricing-meta></p></div><div class="pricing__accordion" data-pricing-accordion></div><p class="note pricing__foot">※グリーン＝通常／イエロー＝土日祝・連休。最新情報はお気軽にお問い合わせください。</p>';
  // insert after intro text block, before studio image
  var img=omoi.querySelector('.image');
  if(img && img.parentElement){
    img.parentElement.insertBefore(host, img);
  } else {
    omoi.appendChild(host);
  }
  hideStudioPricingMedia(omoi);
  loadPricingData(function(pricing){ if(pricing) buildPricingAccordion(host, pricing); });
}
function collapseEmptyStudioSections(){
  if(!(onHome() || onRyokinPage() || onRulePage())) return;
  document.querySelectorAll('.StudioCanvas .section.sd, .StudioCanvas .section-inner.sd').forEach(function(el){
    if(el.closest('#detekoi-port,#detekoi-hero,#contact,#omoi,#dk-rules-grid,#dk-ryokin-pricing')) return;
    if(el.getAttribute('data-dk-studio-gap')==='1') return;
    var r=el.getBoundingClientRect();
    if(r.height<500) return;
    var t=(el.innerText||'').replace(/\s+/g,' ').trim();
    if(t.length>40) return;
    if(el.querySelector('img,iframe,video,form,input,textarea,table,details')) return;
    el.setAttribute('data-dk-studio-gap','1');
  });
}

function onRulePage(){
  var p=location.pathname||'/';
  return p==='/rule' || p.indexOf('/rule')===0;
}
function stayRulesScriptUrl(){
  try{
    var cur=document.querySelector('script[src*="studio-port.js"]');
    if(cur && cur.src) return cur.src.replace(/studio-port\.js(\?.*)?$/,'stay-rules-data.js$1');
  }catch(e){}
  return 'https://cdn.jsdelivr.net/gh/inainai-baa/ebay-profit-calculator@292938b/detekoi-land-mockup/stay-rules-data.js';
}
function loadStayRulesData(cb){
  if(window.DETEKOI_STAY_RULES){ cb(window.DETEKOI_STAY_RULES); return; }
  if(window.__DETEKOI_STAY_RULES_LOADING__){
    var n=0; var t=setInterval(function(){
      if(window.DETEKOI_STAY_RULES || ++n>40){ clearInterval(t); if(window.DETEKOI_STAY_RULES) cb(window.DETEKOI_STAY_RULES); }
    },150);
    return;
  }
  window.__DETEKOI_STAY_RULES_LOADING__=1;
  var s=document.createElement('script');
  s.src=stayRulesScriptUrl();
  s.async=true;
  s.onload=function(){ window.__DETEKOI_STAY_RULES_LOADING__=0; cb(window.DETEKOI_STAY_RULES); };
  s.onerror=function(){ window.__DETEKOI_STAY_RULES_LOADING__=0; cb(null); };
  (document.head||document.documentElement).appendChild(s);
}
function ensureRuleOmoiHost(){
  var omoi=document.getElementById('omoi');
  if(omoi) return omoi;
  var host=document.querySelector('main') || document.querySelector('.StudioCanvas') || document.getElementById('__nuxt');
  if(!host) return null;
  omoi=document.createElement('section');
  omoi.id='omoi';
  omoi.className='section sd appear dk-rule-mount';
  host.appendChild(omoi);
  return omoi;
}
function ensureRulePageTitle(omoi, title){
  if(!omoi) return;
  var h2=omoi.querySelector('h2.dk-rule-page__title, h2.text');
  if(!h2){
    h2=document.createElement('h2');
    h2.className='text dk-rule-page__title';
    omoi.insertBefore(h2, omoi.firstChild);
  }
  if(title) h2.textContent=title;
}
function mountRulesGrid(omoi, rules, footer, sourceEl){
  if(!omoi || !rules || !rules.length || document.getElementById('dk-rules-grid')) return;
  var grid=document.createElement('div');
  grid.id='dk-rules-grid';
  grid.className='dk-rules-grid';
  rules.forEach(function(rule){
    var card=document.createElement('article');
    card.className='dk-rule-card';
    var head=document.createElement('div');
    head.className='dk-rule-card__head';
    var num=document.createElement('span');
    num.className='dk-rule-card__num';
    num.textContent=rule.num;
    var title=document.createElement('h3');
    title.className='dk-rule-card__title';
    title.textContent=rule.title;
    head.appendChild(num);
    head.appendChild(title);
    card.appendChild(head);
    if(rule.body && rule.body.length){
      var body=document.createElement('div');
      body.className='dk-rule-card__body';
      rule.body.forEach(function(line){
        var row=document.createElement('p');
        row.textContent=line;
        body.appendChild(row);
      });
      card.appendChild(body);
    }
    grid.appendChild(card);
  });
  if(sourceEl && sourceEl.parentElement){
    sourceEl.parentElement.insertBefore(grid, sourceEl);
    sourceEl.style.setProperty('display','none','important');
    sourceEl.setAttribute('aria-hidden','true');
    sourceEl.setAttribute('data-dk-rules','1');
  } else {
    omoi.appendChild(grid);
    omoi.setAttribute('data-dk-rules','1');
  }
  if(footer && footer.length){
    var foot=document.createElement('div');
    foot.className='dk-rules-footer';
    footer.forEach(function(line){
      var fp=document.createElement('p');
      fp.textContent=line;
      foot.appendChild(fp);
    });
    grid.parentNode.insertBefore(foot, grid.nextSibling);
  }
  hideRulePdfs(omoi);
}
function hideRulePdfs(root){
  if(!root) return;
  root.querySelectorAll('a[href*=".pdf"],a[href*=".PDF"]').forEach(function(a){
    a.setAttribute('data-dk-pdf-hide','1');
    a.style.setProperty('display','none','important');
    a.setAttribute('aria-hidden','true');
    var prev=a.previousElementSibling;
    if(prev && (/\bimage\b/.test(prev.className||'') || prev.getBoundingClientRect().height>300)){
      prev.setAttribute('data-dk-pdf-hide','1');
      prev.style.setProperty('display','none','important');
    }
  });
  root.querySelectorAll('.image').forEach(function(img){
    var h=img.getBoundingClientRect().height;
    if(h>400){
      img.setAttribute('data-dk-pdf-hide','1');
      img.style.setProperty('display','none','important');
    }
  });
  root.querySelectorAll('p,span,a,div').forEach(function(el){
    if(el.children && el.children.length) return;
    var t=(el.textContent||'').trim();
    if(/\.pdf$/i.test(t) || /過ごし方\.pdf/i.test(t)){
      el.setAttribute('data-dk-pdf-hide','1');
      el.style.setProperty('display','none','important');
    }
  });
}
function enhanceRulePage(){
  if(!onRulePage()) return;
  ensureFonts();
  var omoi=ensureRuleOmoiHost();
  if(!omoi) return;
  hideRulePdfs(omoi);
  if(document.getElementById('dk-rules-grid')) return;
  var p=omoi.querySelector('p.text');
  if(p && p.getAttribute('data-dk-rules')!=='1'){
    var lines=[];
    p.childNodes.forEach(function(n){
      if(n.nodeType===3){
        var t=String(n.textContent||'').replace(/\u00a0/g,' ').trim();
        if(t) lines.push(t);
      }
    });
  if(lines.length){
    var rules=[], footer=[], cur=null;
    lines.forEach(function(line){
      var m=line.match(/^(\d+)\.\s*(.*)$/);
      if(m){
        cur={num:m[1], title:m[2], body:[]};
        rules.push(cur);
      } else if(cur){
        cur.body.push(line);
      } else {
        footer.push(line);
      }
    });
    if(rules.length){
      ensureRulePageTitle(omoi, 'でてこいランド過ごし方ルール');
      mountRulesGrid(omoi, rules, footer, p);
      return;
    }
  }
  }
  ensureRulePageTitle(omoi, 'でてこいランド過ごし方ルール');
  loadStayRulesData(function(data){
    if(!data || !data.rules || !data.rules.length) return;
    ensureRulePageTitle(omoi, data.title || 'でてこいランド過ごし方ルール');
    mountRulesGrid(omoi, data.rules, data.footer || [], null);
  });
}
function tightenDesktopDateRow(){
  try{
    if(window.matchMedia('(max-width:900px)').matches) return;
    document.querySelectorAll('.detekoi-date-row,[data-dk-date-row="1"]').forEach(function(row){
      row.style.setProperty('display','inline-flex','important');
      row.style.setProperty('justify-content','flex-start','important');
      row.style.setProperty('gap','8px','important');
      row.style.setProperty('width','auto','important');
      row.style.setProperty('max-width','100%','important');
      row.querySelectorAll('select').forEach(function(s){
        s.style.setProperty('flex','0 0 auto','important');
        s.style.setProperty('width','auto','important');
        s.style.setProperty('min-width','5.25rem','important');
        s.style.setProperty('max-width','7.25rem','important');
      });
      row.querySelectorAll('div,span,p').forEach(function(el){
        if(el.querySelector('select')) return;
        el.style.setProperty('flex','0 0 auto','important');
        el.style.setProperty('width','auto','important');
        el.style.setProperty('justify-content','flex-start','important');
      });
    });
  }catch(e){}
}
function bootAll(){
  injectMobileHeroCtaFix();
  tightenDesktopDateRow();
  applyPricingVisibility();
  if(!pricingEnabled()) applyPricingHide(document);
  if(onHome()) inject();
  if(onRulePage()) enhanceRulePage();
  if(onRyokinPage()) enhanceRyokinPage();
  collapseEmptyStudioSections();
  if(onRulePage() || onRyokinPage()) document.body.classList.add("detekoi-sub-on");
}
/* Guard bootAll against MutationObserver feedback: inject/scrub-style DOM
   writes must not re-enter bootAll synchronously (freezes the tab). */
var bootBusy=0, bootMo=null, bootTimer=0;
function runBoot(){
  if(bootBusy) return;
  bootBusy=1;
  try{
    if(bootMo) bootMo.disconnect();
    bootAll();
  }finally{
    bootBusy=0;
    try{ if(bootMo) bootMo.observe(document.documentElement,{childList:true,subtree:true}); }catch(e0){}
  }
}
function scheduleBoot(){
  if(bootBusy) return;
  clearTimeout(bootTimer);
  bootTimer=setTimeout(runBoot, 80);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', runBoot);
else runBoot();
var n=0; var t=setInterval(function(){ runBoot(); if(++n>=40) clearInterval(t); }, 300);
setTimeout(function(){ clearInterval(t); runBoot(); }, 12000);
try{ window.addEventListener('resize', function(){ syncHeaderVar(); }, {passive:true}); }catch(e){ window.addEventListener('resize', syncHeaderVar); }
try{
  bootMo=new MutationObserver(scheduleBoot);
  bootMo.observe(document.documentElement,{childList:true,subtree:true});
}catch(e){}

})();
