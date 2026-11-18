
/* ---------- Supabase: resident accounts. The key is a public, insert/RLS-limited key. ---------- */
window.SUPA = { url: 'https://oativmkpqoagohjrdepr.supabase.co', key: 'sb_publishable_e751otwkIZCayOOPEPg3XQ_KIq_jE1a', prefix: 'hoa_', demo: { neighbor: { email: 'neighbor@demo.orangeshoa.org', password: 'Orange-Demo-2026' }, board: { email: 'board@demo.orangeshoa.org', password: 'Board-Demo-2026' } } };

/* ============================================================
   The Orange's HOA: shared behavior for every layout.
   CONFIG · Google Sheet loaders · request form · Ask box · skins · motion
   ============================================================ */
var CONFIG = {
  boardEmail: 'orangeshoa@gmail.com',
  payLink: '',        // Stripe payment link: when set, the Pay online button goes live
  newsSheetId: '1ZyhU9vLEZCY6NrIuZXuPKBHNfk0fM5mnTzIwWVYEQkw', // News & Events sheet (Date, Type, Title, Details)
  accSheetId: '',     // "Orange's HOA Public Data" sheet ID (Public tab): printed by hoa-backend.gs setup()
  budgetSheetId: ''   // same sheet ID (Summary tab)
};

var HOA = window.HOA = { linkTo: function(page,id){ return '#/'+page+'?to='+encodeURIComponent(id); } };
/* ---------- MOTION (GSAP, loaded only when wanted; never hides content) ---------- */
(function(){
  var html=document.documentElement, reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saved=null; try{ saved=localStorage.getItem('hoa-motion'); }catch(e){}
  var want=saved?saved==='on':(html.getAttribute('data-motion')==='on');
  HOA.motionWanted=function(){ return want; };
  var g=null, ST=null, pending=null, EASE='power3.out';
  HOA.enter=function(container,sel){ if(!want||reduce) return; if(!g){ pending=[container,sel]; return; } run(container,sel); };
  HOA.onMotion=function(cb){ if(!want||reduce) return; if(g) cb(g,ST); else (HOA._cbs=HOA._cbs||[]).push(cb); };
  function run(container,sel){
    var items=container.querySelectorAll(sel||':scope > *'); if(!items.length) return;
    g.killTweensOf(items); g.from(items,{opacity:0,y:18,duration:.65,stagger:.07,ease:EASE,clearProps:'transform,opacity'});
  }
  function hero(){
    var h1=document.querySelector('[data-split]');
    if(h1&&!h1.querySelector('.w')) h1.innerHTML=h1.textContent.trim().split(/\s+/).map(function(w){ return '<span class="w"><span>'+w+'</span></span>'; }).join(' ');
    var grove=document.getElementById('grove'); if(!grove) return;
    var NS='http://www.w3.org/2000/svg', layer=document.createElementNS(NS,'g'); layer.setAttribute('class','glows');
    var homes=grove.querySelector('.homes');
    grove.querySelectorAll('.homes use').forEach(function(u){
      var m=/translate\(([-\d.]+),([-\d.]+)\)\s*scale\(([-\d.]+)\)/.exec(u.getAttribute('transform')||''); if(!m) return;
      var x=+m[1], y=+m[2], k=+m[3], two=(u.getAttribute('href')||u.getAttribute('xlink:href'))==='#home2';
      (two?[[-4.5,4.5],[4.5,4.5]]:[[0,7]]).forEach(function(p){ var c=document.createElementNS(NS,'circle'); c.setAttribute('class','glow'); c.setAttribute('cx',x+p[0]*k); c.setAttribute('cy',y+p[1]*k); c.setAttribute('r',two?5:6.5); layer.appendChild(c); });
    });
    homes.parentNode.insertBefore(layer,homes);
    layer.querySelectorAll('.glow').forEach(function(c){ g.set(c,{opacity:0}); g.to(c,{opacity:g.utils.random(.18,.42),duration:g.utils.random(1.2,2.4),delay:1.1+g.utils.random(0,1.4),ease:'sine.inOut',onComplete:function(){ g.to(c,{opacity:g.utils.random(.12,.5),duration:g.utils.random(1.8,4),repeat:-1,yoyo:true,ease:'sine.inOut'}); }}); });
    var halo=grove.querySelector('.sun circle:last-child'); if(halo) g.to(halo,{attr:{r:118},opacity:.1,duration:4.5,repeat:-1,yoyo:true,ease:'sine.inOut',delay:1.8});
    if(ST) g.to(grove,{yPercent:14,ease:'none',scrollTrigger:{trigger:'.hello',start:'top top',end:'bottom top',scrub:true}});
  }
  HOA.heroEnter=function(){ if(!g) return; var tl=g.timeline({defaults:{ease:EASE}});
    tl.from('.hello .hi',{opacity:0,y:12,duration:.7},0).from('.hello h1 .w > span',{yPercent:110,duration:.9,stagger:.055},.1).from('.hello .wrap > p:last-child',{opacity:0,y:14,duration:.7},.55)
      .from('.menu h2',{opacity:0,duration:.5},.8).from('.cards .card',{opacity:0,y:26,duration:.7,stagger:.06,clearProps:'transform'},.85);
    if(ST&&document.querySelector('.latest')) g.from('.latest .box',{opacity:0,y:30,duration:.8,ease:EASE,scrollTrigger:{trigger:'.latest',start:'top 88%',once:true}}); };
  if(!want||reduce) return;
  function load(src,cb){ var s=document.createElement('script'); s.src=src; s.onload=cb; s.onerror=function(){ pending=null; }; document.head.appendChild(s); }
  load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',function(){ load('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',function(){
    g=window.gsap; ST=window.ScrollTrigger; if(ST) g.registerPlugin(ST); html.classList.add('gs');
    hero(); (HOA._cbs||[]).forEach(function(cb){ cb(g,ST); });
    if(pending){ run(pending[0],pending[1]); pending=null; }
  }); });
})();

var NULLEL={innerHTML:'',textContent:'',href:'',target:'',rel:'',hidden:false,setAttribute:function(){},removeAttribute:function(){},focus:function(){},classList:{add:function(){},remove:function(){},toggle:function(){}}};
function $el(id){ return document.getElementById(id)||NULLEL; }
(function(){ var g=document.getElementById('greeting'); if(g){ var h=new Date().getHours(); g.textContent='Good '+(h<12?'morning':h<17?'afternoon':'evening')+', neighbor.'; } })();

/* Pay online button */
(function(){ var b=$el('pay-online-btn'); if(CONFIG.payLink){ b.href=CONFIG.payLink; b.target='_blank'; b.rel='noopener'; b.removeAttribute('aria-disabled'); b.textContent='Pay online now'; } })();

/* ACC request → pre-filled email */
function submitACC(e){
  e.preventDefault(); var f=e.target, v=function(n){ return (f.elements[n].value||'').trim(); };
  var subject='ACC request: '+v('type')+' at '+v('address');
  var body=['Architectural review request','','Name: '+v('name'),'Email: '+v('email'),'Property: '+v('address'),'Type of change: '+v('type'),'Planned start: '+(v('start')||'not set'),'','Description:',v('description'),'','(Attach photos or drawings before sending.)'].join('\n');
  window.location.href='mailto:'+CONFIG.boardEmail+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body); return false;
}

/* ---------- Google Sheet helpers ---------- */
var MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function esc(s){ var d=document.createElement('div'); d.textContent=String(s==null?'':s); return d.innerHTML; }
function cellDate(v){ if(v==null) return null; var m=/Date\((\d+),(\d+),(\d+)/.exec(String(v)); if(m) return new Date(+m[1],+m[2],+m[3]); var d=new Date(String(v)); return isNaN(d)?null:d; }
function fmtLong(d){ return MONTHS[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear(); }
function sheetRows(id, tab){
  var url='https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:json'+(tab?'&sheet='+encodeURIComponent(tab):'');
  return fetch(url).then(function(r){ return r.text(); }).then(function(t){ var j=JSON.parse(t.substring(t.indexOf('(')+1,t.lastIndexOf(')'))); return (j.table&&j.table.rows)||[]; });
}

/* News & dates (+ home "latest") */
(function(){
  if(!CONFIG.newsSheetId) return;
  sheetRows(CONFIG.newsSheetId).then(function(rows){
    var items=[]; rows.forEach(function(r){ var c=r.c||[]; var date=cellDate(c[0]&&c[0].v), type=String((c[1]&&c[1].v)||'').toLowerCase().trim(), title=(c[2]&&c[2].v)||'', details=(c[3]&&c[3].v)||''; if(date&&title) items.push({date:date,type:type,title:title,details:details}); });
    if(!items.length) return;
    var news=items.filter(function(i){ return i.type!=='event'; }).sort(function(a,b){ return b.date-a.date; }).slice(0,6);
    var today=new Date(); today.setHours(0,0,0,0);
    var events=items.filter(function(i){ return i.type==='event'; });
    var up=events.filter(function(i){ return i.date>=today; }).sort(function(a,b){ return a.date-b.date; }).slice(0,5);
    if(!up.length) up=events.sort(function(a,b){ return b.date-a.date; }).slice(0,3);
    if(news.length){
      $el('news-list').innerHTML=news.map(function(i){ return '<article class="notice"><time datetime="'+i.date.toISOString().slice(0,10)+'">'+fmtLong(i.date)+'</time><h3>'+esc(i.title)+'</h3><p>'+esc(i.details)+'</p></article>'; }).join('');
      $el('home-news').innerHTML='<h3>'+esc(news[0].title)+'</h3><p>'+esc(news[0].details)+'</p>';
      document.querySelectorAll('.updated').forEach(function(u){ u.textContent='Site last updated: '+fmtLong(news[0].date); });
    }
    if(up.length){
      $el('events-list').innerHTML=up.map(function(i){ return '<div class="event"><div class="chip"><span class="m">'+MONTHS[i.date.getMonth()].toUpperCase()+'</span><span class="d">'+i.date.getDate()+'</span></div><div><h3>'+esc(i.title)+'</h3><p>'+esc(i.details)+'</p></div></div>'; }).join('');
      $el('home-event-from-sheet').innerHTML='<h3>'+esc(up[0].title)+', '+fmtLong(up[0].date)+'</h3><p>'+esc(up[0].details)+'</p>';
    }
  }).catch(function(){});
})();

/* Request tracker */
(function(){
  if(!CONFIG.accSheetId) return;
  sheetRows(CONFIG.accSheetId,'Public').then(function(rows){
    var items=rows.map(function(r){ var c=r.c||[]; var g=function(i){ return (c[i]&&c[i].v)||''; }; return {date:cellDate(g(0)),who:g(1),addr:g(2),type:g(3),status:String(g(4)).trim(),note:g(5)}; }).filter(function(i){ return i.date&&i.status; }).sort(function(a,b){ return b.date-a.date; }).slice(0,8);
    if(!items.length) return;
    var cls=function(s){ s=s.toLowerCase(); return s.indexOf('approv')>-1?'approved':s.indexOf('review')>-1?'review':s.indexOf('info')>-1?'info':(s.indexOf('denied')>-1||s.indexOf('not')>-1)?'denied':''; };
    $el('tracker-body').innerHTML='<table><thead><tr><th>Date</th><th>Request</th><th>Status</th></tr></thead><tbody>'+items.map(function(i){ return '<tr><td>'+fmtLong(i.date)+'</td><td>'+esc(i.type)+(i.who?' &middot; '+esc(i.who):'')+(i.note?'<br><small style="color:var(--muted)">'+esc(i.note)+'</small>':'')+'</td><td><span class="pill '+cls(i.status)+'">'+esc(i.status)+'</span></td></tr>'; }).join('')+'</tbody></table>';
  }).catch(function(){});
})();

/* Where the money goes */
(function(){
  if(!CONFIG.budgetSheetId) return;
  sheetRows(CONFIG.budgetSheetId,'Summary').then(function(rows){
    var items=rows.map(function(r){ var c=r.c||[]; var g=function(i){ return c[i]?c[i].v:null; }; return {cat:g(0),budget:Number(g(1))||0,spent:Number(g(2))||0}; }).filter(function(i){ return i.cat; });
    if(!items.length) return;
    var fmt=function(n){ return '$'+Math.round(n).toLocaleString(); };
    $el('budget').innerHTML='<div class="bars">'+items.map(function(i){ var pct=i.budget?Math.min(100,Math.round(i.spent/i.budget*100)):0, over=i.budget&&i.spent>i.budget, total=String(i.cat).toLowerCase()==='total'; return '<div class="bar'+(total?' total':'')+'"><b>'+esc(i.cat)+'</b><span class="trk"><span class="fil'+(over?' over':'')+'" style="width:'+pct+'%"></span></span><span class="amt">'+fmt(i.spent)+' of '+fmt(i.budget)+'</span></div>'; }).join('')+'</div>';
  }).catch(function(){});
})();

/* ---------- Jump to a passage: #/page?to=id (routers) or #id (one page) ---------- */
HOA.flash=function(id){ var el=id&&document.getElementById(id); if(!el) return; el.scrollIntoView({behavior:'smooth',block:'start'}); el.classList.remove('kb-hit'); void el.offsetWidth; el.classList.add('kb-hit'); };
window.addEventListener('hashchange',function(){ var m=/[?&]to=([^&]+)/.exec(location.hash); if(m) setTimeout(function(){ HOA.flash(decodeURIComponent(m[1])); },140); else if(/^#[\w-]+$/.test(location.hash)&&document.getElementById(location.hash.slice(1))&&location.hash.indexOf('/')<0){ var el=document.getElementById(location.hash.slice(1)); el.classList.remove('kb-hit'); void el.offsetWidth; el.classList.add('kb-hit'); } });

/* ---------- ASK THE RULES: plain search, no AI, no server (MiniSearch, MIT) ---------- */
(function(){
  var input=document.getElementById('ask-q'), out=document.getElementById('ask-results'); if(!input||!out) return;
  if(!window.MiniSearch){ input.placeholder='Search is unavailable right now'; input.disabled=true; return; }
  var SYN={
    boat:'vehicle parked stored', rv:'vehicle parked stored', camper:'vehicle parked stored', trailer:'vehicle parked stored', motorhome:'vehicle rv parked', jetski:'vehicle trailer stored',
    park:'vehicle parking', parking:'vehicle parking', driveway:'vehicle parking', street:'vehicle parking', car:'vehicle', truck:'vehicle', van:'vehicle', motorcycle:'vehicle',
    junk:'inoperable unlicensed towed', broken:'inoperable', dead:'inoperable', tags:'unlicensed', tow:'towed', towing:'towed', repair:'repair vehicle', fix:'repair',
    rent:'lease rental renting tenant', renting:'lease rental tenant', rental:'lease renting tenant', airbnb:'lease short-term rental renting', vrbo:'lease short-term rental', tenant:'lease rental', sublet:'lease rental room', roommate:'room rental lease', lease:'rental renting', landlord:'lease rental license',
    fence:'exterior modification architectural', deck:'exterior modification architectural', paint:'exterior modification architectural', color:'exterior modification architectural', roof:'exterior modification architectural', shed:'exterior modification architectural', solar:'exterior modification architectural', window:'exterior modification architectural', windows:'exterior modification', door:'exterior modification', siding:'exterior modification', patio:'exterior modification', addition:'exterior modification', build:'exterior modification architectural', permission:'approval consent architectural', approve:'approval review', approval:'review architectural',
    dues:'assessment pay invoice', fee:'assessment late fee', bill:'invoice assessment', invoice:'assessment', pay:'assessment dues', payment:'pay assessment', owe:'balance assessment delinquent', balance:'assessment', cost:'assessment amount', much:'amount assessment',
    late:'late fee delinquent interest', penalty:'late fee', interest:'late fee delinquent', lien:'delinquent unpaid', overdue:'delinquent late',
    check:'mail pay', mail:'check address pay', online:'pay online', stripe:'pay online', venmo:'pay online', zelle:'pay online',
    meeting:'board meeting annual', meetings:'board meeting annual', vote:'election annual meeting', voting:'election vote', election:'board annual meeting', president:'board officers', treasurer:'board officers', secretary:'board officers', who:'president treasurer secretary director role', run:'board election serve',
    budget:'money spent', money:'budget spent', spend:'budget spent', spending:'budget spent', audit:'financial statement',
    bylaws:'documents', declaration:'documents covenants', covenant:'documents declaration', covenants:'documents declaration', ccr:'documents declaration', minutes:'documents', forms:'documents form', proxy:'documents form annual meeting',
    moved:'new neighborhood', moving:'new neighborhood', welcome:'new neighborhood', newcomer:'new',
    problem:'contact report', complaint:'contact report', complain:'contact report', report:'contact', email:'contact', phone:'contact', question:'contact'
  };
  var STOP=/^(can|could|may|i|we|my|our|me|you|your|the|a|an|is|it|its|are|be|do|does|did|to|of|in|on|for|at|by|with|from|and|or|if|this|that|there|here|what|how|where|when|which|am|have|has|get|got|allowed|allow|ok|okay|want|need|please|able|let|out|up|into|about|any|some|one|way|thing|things)$/;
  function clean(t){ return t.toLowerCase().replace(/[’']s$/,''); }
  var ms, chunks;
  function textOf(el){ var c=el.cloneNode(true); c.querySelectorAll('.num,.sr,.chip').forEach(function(x){ x.remove(); }); c.querySelectorAll('li,p,h2,h3,b,div,span.d,time').forEach(function(x){ x.insertAdjacentText('afterend',' '); }); return (c.textContent||'').replace(/\s+/g,' ').trim(); }
  function build(){
    chunks=[]; var n=0, CHUNK='.rule,.notice,.event,.fact,.step,.person,.folder,.panel,.check,.fine,.flow>div';
    document.querySelectorAll('[data-page][data-title]').forEach(function(v){
      var page=v.getAttribute('data-page'), ptitle=v.getAttribute('data-title'), seen=[];
      v.querySelectorAll(CHUNK).forEach(function(el){
        if(el.closest('#ask')||seen.some(function(s){return s.contains(el);})) return; seen.push(el);
        var h=el.querySelector('h2,h3,b'), tx=textOf(el), hd=h?textOf(h):(tx.indexOf(':')>0&&tx.indexOf(':')<60?tx.slice(0,tx.indexOf(':')):ptitle);
        if(h&&tx.indexOf(hd)===0) tx=tx.slice(hd.length).trim(); if(!el.id) el.id='kb-'+page+'-'+(n++);
        chunks.push({id:el.id,page:page,ptitle:ptitle,heading:hd,text:tx});
      });
      v.querySelectorAll('h2,h3').forEach(function(el){
        if(el.closest(CHUNK)||el.closest('#ask')) return;
        var t=[], s=el.nextElementSibling; while(s&&!/^H[123]$/.test(s.tagName)&&!s.matches(CHUNK)){ if(!s.querySelector(CHUNK)&&!s.matches('#ask')) t.push(textOf(s)); s=s.nextElementSibling; }
        if(!t.join('').trim()) return; if(!el.id) el.id='kb-'+page+'-'+(n++);
        chunks.push({id:el.id,page:page,ptitle:ptitle,heading:textOf(el),text:t.join(' ')});
      });
      var lead=v.querySelector('.lead'); if(lead){ if(!lead.id) lead.id='kb-'+page+'-'+(n++); chunks.push({id:lead.id,page:page,ptitle:ptitle,heading:ptitle,text:textOf(lead)}); }
    });
    document.querySelectorAll('#kb article').forEach(function(a){ chunks.push({id:'',page:a.getAttribute('data-page')||'documents',ptitle:'Governing documents',heading:a.getAttribute('data-title')||'Passage',text:textOf(a)}); });
    chunks.forEach(function(c,i){ c.key=i; });
    ms=new MiniSearch({fields:['heading','text'],storeFields:['id','page','ptitle','heading','text'],idField:'key',
      processTerm:function(t){ t=clean(t); return t.length<2||STOP.test(t)?null:t; },
      searchOptions:{prefix:true,fuzzy:0.2,boost:{heading:2.5},combineWith:'OR'}});
    ms.addAll(chunks);
  }
  function expand(q){
    var words=q.toLowerCase().replace(/[^a-z0-9'’\s-]/g,' ').split(/\s+/).filter(Boolean), extra=[];
    words.forEach(function(w){ w=clean(w); if(SYN[w]) extra.push(SYN[w]); else if(w.length>3&&SYN[w.replace(/s$/,'')]) extra.push(SYN[w.replace(/s$/,'')]); });
    return {terms:words.map(clean).filter(function(w){return !STOP.test(w);}), q:words.concat(extra).join(' ')};
  }
  function esc(s){ return s.replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function snippet(text,terms){
    var lo=text.toLowerCase(), at=-1; terms.some(function(t){ at=lo.indexOf(t); return at>-1; });
    var start=Math.max(0,at-70), s=(start?'…':'')+text.slice(start,start+190)+(start+190<text.length?'…':'');
    var h=esc(s); terms.forEach(function(t){ if(t.length>2) h=h.replace(new RegExp('(^|[^\\w])('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\w*)','ig'),'$1<mark>$2</mark>'); }); return h;
  }
  function search(){
    var raw=input.value.trim(); if(!raw){ out.innerHTML=''; return; }
    build();
    var e=expand(raw), hits=ms.search(e.q).slice(0,3);
    if(!hits.length){
      var mail='mailto:'+CONFIG.boardEmail+'?subject='+encodeURIComponent('Question: '+raw)+'&body='+encodeURIComponent(raw+'\n\n(Sent from the Ask box on the association website.)');
      out.innerHTML='<p class="ask-none">Nothing on this site mentions that, and we would rather say so than guess. <a href="'+mail+'">Email the board this question</a> and a neighbor will answer.</p>'; return;
    }
    out.innerHTML=hits.map(function(h){ return '<a href="'+esc(HOA.linkTo(h.page,h.id))+'" data-to="'+esc(h.id)+'"><div class="where">'+esc(h.ptitle)+'</div><div class="what">'+esc(h.heading)+'</div><div class="snip">'+snippet(h.text,e.terms)+'</div></a>'; }).join('');
  }
  var timer; input.addEventListener('input',function(){ clearTimeout(timer); timer=setTimeout(search,120); });
  input.addEventListener('keydown',function(ev){ if(ev.key==='Enter'){ ev.preventDefault(); search(); } });
  document.querySelectorAll('#ask [data-q]').forEach(function(b){ b.addEventListener('click',function(){ input.value=b.getAttribute('data-q'); search(); input.focus(); }); });
  out.addEventListener('click',function(ev){ var a=ev.target.closest('a[data-to]'); if(!a) return; var href=a.getAttribute('href'); if(href.split('?')[0]===location.hash.split('?')[0]||href===location.hash){ ev.preventDefault(); HOA.flash(a.getAttribute('data-to')); } });
})();

/* ---------- SKINS: the look is a switch. Stored on this phone only. ---------- */
(function(){
  var html=document.documentElement, slot=document.getElementById('skin-slot');
  var SK=[['sunset','Daybreak','#F6D3B4','#1E4E7A'],['linen','White','#FFFFFF','#1F7A4D'],['evening','Nightfall','#0F1F33','#F2A65A']];
  var saved=null; try{ saved=localStorage.getItem('hoa-look-'+(html.getAttribute('data-design')||'x')); }catch(e){}
  if(saved&&SK.some(function(s){return s[0]===saved;})) html.setAttribute('data-skin',saved);
  if(!slot) return;
  var cur=function(){ return html.getAttribute('data-skin')||'evening'; };
  slot.innerHTML='<div class="skin"><button class="skin-btn" type="button" aria-label="Change the look of the site" title="Change the look" aria-expanded="false" aria-haspopup="true"><i></i>Look</button><div class="skin-pop" hidden><b>Choose a look</b><div class="sw">'+SK.map(function(s){ return '<button type="button" data-skin="'+s[0]+'" aria-pressed="'+(cur()===s[0])+'"><i style="background:'+s[2]+';border-color:'+s[3]+'"></i>'+s[1]+'</button>'; }).join('')+'</div><label class="mo"><input type="checkbox" id="motion-sw"><span>Motion<small>Gentle movement as pages open</small></span></label></div></div>';
  var box=slot.querySelector('.skin'), btn=box.querySelector('.skin-btn'), pop=box.querySelector('.skin-pop'), mo=box.querySelector('#motion-sw');
  btn.addEventListener('click',function(){ var open=pop.hidden; pop.hidden=!open; btn.setAttribute('aria-expanded',String(open)); });
  document.addEventListener('click',function(e){ if(!box.contains(e.target)){ pop.hidden=true; btn.setAttribute('aria-expanded','false'); } });
  box.querySelectorAll('[data-skin]').forEach(function(b){ b.addEventListener('click',function(){ html.setAttribute('data-skin',b.getAttribute('data-skin')); try{ localStorage.setItem('hoa-look-'+(html.getAttribute('data-design')||'x'),b.getAttribute('data-skin')); }catch(e){} box.querySelectorAll('[data-skin]').forEach(function(x){ x.setAttribute('aria-pressed',String(x===b)); }); pop.hidden=true; btn.setAttribute('aria-expanded','false'); }); });
  mo.checked=HOA.motionWanted(); mo.addEventListener('change',function(){ try{ localStorage.setItem('hoa-motion',mo.checked?'on':'off'); }catch(e){} location.reload(); });
})();

/* ---------- MY HOME: resident accounts on Supabase Auth (Google or email) ---------- */
(function(){
  var S=window.SUPA; if(!S||!document.getElementById('me-out')) return;
  var T=S.prefix||'';
  var KEY='hoa-session', sess=null; try{ sess=JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){}
  function headers(auth){ var h={'apikey':S.key,'Content-Type':'application/json'}; if(auth&&sess) h['Authorization']='Bearer '+sess.access_token; return h; }
  function save(s){ sess=s; try{ s?localStorage.setItem(KEY,JSON.stringify(s)):localStorage.removeItem(KEY); }catch(e){} }
  async function auth(path,body){ var r=await fetch(S.url+'/auth/v1/'+path,{method:'POST',headers:headers(false),body:JSON.stringify(body)}); var j=await r.json().catch(function(){return {};}); if(!r.ok) throw new Error(j.msg||j.error_description||j.message||j.error||('HTTP '+r.status)); return j; }
  async function rest(method,table,q,body,prefer){ if(sess&&sess.demo) return demoRest(method,table,q); var r=await fetch(S.url+'/rest/v1/'+T+table+(q||''),{method:method,headers:Object.assign(headers(true),{'Prefer':prefer||(method==='GET'?'':'return=representation')}),body:body?JSON.stringify(body):undefined});
    if(r.status===401&&sess&&sess.refresh_token){ try{ var j=await auth('token?grant_type=refresh_token',{refresh_token:sess.refresh_token}); save(j); return rest(method,table,q,body,prefer); }catch(e){ save(null); render(); throw e; } }
    var txt=await r.text(); if(!r.ok) throw new Error(txt.slice(0,160)); return txt?JSON.parse(txt):null; }
  var $=function(id){ return document.getElementById(id); }, esc=function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
  var money=function(c){ return '$'+(Math.round(c)/100).toLocaleString(undefined,{minimumFractionDigits:0}); };
  var fmt=function(d){ if(!d) return ''; var x=new Date(d+'T12:00:00'); return x.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); };

  /* OAuth / email-link return: Supabase puts the session in the URL hash */
  (function(){ var m=/access_token=([^&]+)/.exec(location.hash); if(!m) return; var p={}; location.hash.replace(/^#\/?/,'').replace(/^.*?(?=access_token)/,'').split('&').forEach(function(kv){ var a=kv.split('='); p[a[0]]=decodeURIComponent(a[1]||''); }); if(p.access_token){ save({access_token:p.access_token,refresh_token:p.refresh_token,expires_at:Date.now()/1000+(+p.expires_in||3600)}); history.replaceState(null,'',location.pathname+location.search); location.hash=window.HOA_ME_ROUTE||'#/me'; } })();

  function msg(id,t,ok){ var el=$(id); if(!el) return; if(/failed to fetch|networkerror|load failed/i.test(t||'')) t='This preview is not connected to the sign-in service. Use the sample buttons above.'; el.textContent=t||''; el.style.color=ok?'var(--ok,#2E7D5B)':'var(--accent-deep)'; }
  $('me-google').addEventListener('click',function(){ var back=location.href.split('#')[0]; location.href=S.url+'/auth/v1/authorize?provider=google&redirect_to='+encodeURIComponent(back); });
  $('me-form').addEventListener('submit',async function(e){ e.preventDefault(); msg('me-msg','Signing in…'); try{ var j=await auth('token?grant_type=password',{email:$('me-email').value.trim(),password:$('me-pass').value}); save(j); msg('me-msg',''); render(); }catch(err){ msg('me-msg',/invalid/i.test(err.message)?'That email and password don’t match.':err.message); } });
  $('me-signup').addEventListener('click',async function(){ var em=$('me-email').value.trim(), pw=$('me-pass').value; if(!em||pw.length<8){ msg('me-msg','Enter your email and a password of at least 8 characters.'); return; } msg('me-msg','Creating your account…');
    try{ var j=await auth('signup',{email:em,password:pw,data:{full_name:''},options:{email_redirect_to:location.href.split('#')[0]}}); if(j.access_token){ save(j); render(); } else { msg('me-msg','Almost there. Check your email for a confirmation link, then come back and sign in.',true); } }catch(err){ msg('me-msg',err.message); } });
  $('me-forgot').addEventListener('click',async function(e){ e.preventDefault(); var em=$('me-email').value.trim(); if(!em){ msg('me-msg','Type your email first, then tap “Forgot”.'); return; } try{ await auth('recover',{email:em}); msg('me-msg','If that address has an account, a reset link is on its way.',true); }catch(err){ msg('me-msg',err.message); } });
  /* Sample accounts. They try the real sign-in service first; where the page cannot reach it (this preview), they open the same screens on built-in sample data. */
  var DEMO_H=[{id:1,address:'123 Orange Grove Lane (sample)',dues_amount_cents:35000,invoice_date:'2026-11-01',due_date:'2026-12-01',paid_on:null,balance_cents:35000},{id:2,address:'125 Orange Grove Lane (sample)',dues_amount_cents:35000,invoice_date:'2026-11-01',due_date:'2026-12-01',paid_on:'2026-11-06',balance_cents:0}];
  var DEMO_P={neighbor:{id:'demo-neighbor',email:'neighbor@example.org',full_name:'Sam Neighbor',role:'resident',household_id:1},board:{id:'demo-board',email:'board@example.org',full_name:'Alex Boardmember',role:'board',household_id:2}};
  var DEMO_R=[{id:1,household_id:1,type:'Fence',description:'Replace the back fence with a 6 foot cedar fence, same footprint.',status:'Approved',board_note:'Approved at the October meeting. Matches the old fence line.',created_at:'2026-09-20'},{id:2,household_id:1,type:'Paint',description:'Repaint the front door a deep green.',status:'In review',board_note:null,created_at:'2026-10-12'}];
  function demoRest(method,table,q){ if(method!=='GET') return null; var me=DEMO_P[sess.demo]||DEMO_P.neighbor, m; q=q||'';
    if(table==='profiles') return /id=eq\./.test(q)?[me]:[DEMO_P.neighbor,DEMO_P.board];
    if(table==='households'){ m=/id=eq\.(\d+)/.exec(q); return m?DEMO_H.filter(function(h){ return h.id===+m[1]; }):DEMO_H; }
    if(table==='requests'){ m=/household_id=eq\.(\d+)/.exec(q); return m?DEMO_R.filter(function(r){ return r.household_id===+m[1]; }):DEMO_R; }
    if(table==='reminder_prefs') return [{user_id:me.id,email_on:true,sms_on:false,phone:''}];
    if(table==='directory_public') return [{display_name:'Alex B.',phone:'(301) 555-0125',email:null,address:'125 Orange Grove Lane (sample)'}];
    if(table==='account_requests') return [{id:1,email:'pat@example.com',name:'Pat Newcomer',address:'131 Orange Grove Lane (sample)',handled:false}];
    return []; }
  document.querySelectorAll('[data-demo]').forEach(function(b){ b.addEventListener('click',async function(){ var who=b.getAttribute('data-demo'), d=S.demo&&S.demo[who]; msg('me-demo-msg','Opening…',true);
    try{ if(!d) throw 0; var j=await Promise.race([auth('token?grant_type=password',{email:d.email,password:d.password}),new Promise(function(_,no){ setTimeout(no,4000); })]); save(j); }
    catch(e){ save({demo:who,user:{id:DEMO_P[who].id,email:DEMO_P[who].email}}); }
    msg('me-demo-msg',''); render(); window.scrollTo&&document.getElementById('me-in').scrollIntoView({block:'start'}); }); });
  $('me-signout').addEventListener('click',async function(){ try{ if(!(sess&&sess.demo)) await fetch(S.url+'/auth/v1/logout',{method:'POST',headers:headers(true)}); }catch(e){} save(null); render(); });

  async function render(){
    document.querySelectorAll('[data-signin]').forEach(function(a){ a.textContent=sess?'My home':'Sign in'; });
    var out=$('me-out'), inn=$('me-in'); if(!sess){ HOA.me=null; HOA.home=null; badge(); out.hidden=false; inn.hidden=true; return; }
    out.hidden=true; inn.hidden=false;
    var dn=$('me-demo-note'); if(!dn){ dn=document.createElement('p'); dn.id='me-demo-note'; dn.className='fine demo-note'; dn.textContent='This is a sample home. The names, the address and the amounts are made up.'; inn.insertBefore(dn,inn.firstChild); } dn.hidden=!sess.demo;
    try{
      var me=(await rest('GET','profiles','?select=*&id=eq.'+encodeURIComponent(sess.user?sess.user.id:'')+'&limit=1'))[0];
      if(!me){ /* first sign-in through Google or a fresh email account: make the profile row */
        var uid=sess.user&&sess.user.id, em=sess.user&&sess.user.email, nm=(sess.user&&sess.user.user_metadata&&(sess.user.user_metadata.full_name||sess.user.user_metadata.name))||'';
        try{ me=(await rest('POST','profiles','',{id:uid,email:em,full_name:nm}))[0]; }catch(e){ me={id:uid,email:em,full_name:nm}; }
      }
      HOA.me=me; $('me-name').textContent=me.full_name||me.email||'Neighbor';
      var home=null; if(me.household_id){ home=(await rest('GET','households','?select=*&id=eq.'+me.household_id))[0]; }
      HOA.home=home; $('me-addr').textContent=home?home.address:(me.email||''); badge();
      $('me-nohome').hidden=!!home;
      /* dues */
      var d=$('me-dues'); if(home){ var late=home.balance_cents>0&&home.due_date&&new Date(home.due_date)<new Date(); d.innerHTML=(home.balance_cents>0?'<div class="big">'+money(home.balance_cents)+'</div><p class="soft">'+(late?'<b style="color:var(--accent-deep)">Past due</b> since '+fmt(home.due_date):'Due by <b>'+fmt(home.due_date)+'</b>')+' &middot; invoiced '+fmt(home.invoice_date)+'</p><p style="margin-top:12px"><a class="btn" href="#/pay" style="min-height:42px">How to pay</a></p>':'<div class="big">Paid</div><p class="soft">'+money(home.dues_amount_cents)+' received '+fmt(home.paid_on)+'. Nothing owed. Thank you.</p>'); } else d.innerHTML='<p class="soft">Shows once your account is linked to your home.</p>';
      /* requests */
      var r=$('me-reqs'); if(home){ var reqs=await rest('GET','requests','?select=*&household_id=eq.'+home.id+'&order=created_at.desc'); r.innerHTML=reqs.length?reqs.map(function(q){ return '<div class="me-req"><div><b>'+esc(q.type)+'</b><small>'+esc(q.description||'').slice(0,90)+'</small>'+(q.board_note?'<small style="color:var(--ink-soft)">Board: '+esc(q.board_note)+'</small>':'')+'</div><span class="pill '+({Approved:'approved','In review':'review','Needs info':'info','Not approved':'denied'}[q.status]||'')+'">'+esc(q.status)+'</span></div>'; }).join(''):'<p class="soft">No requests yet.</p>'; } else r.innerHTML='<p class="soft">Linked to your home once the board connects it.</p>';
      /* reminders */
      var rp=(await rest('GET','reminder_prefs','?select=*&user_id=eq.'+me.id))[0]||{email_on:true,sms_on:false,phone:''}; $('rem-email').checked=!!rp.email_on; $('rem-sms').checked=!!rp.sms_on; $('rem-phone').value=rp.phone||'';
      /* directory */
      var dr=(await rest('GET','directory','?select=*&user_id=eq.'+me.id))[0]||{}; $('dir-opt').checked=!!dr.opt_in; $('dir-name').value=dr.display_name||''; $('dir-phone').value=dr.phone||''; $('dir-email').checked=!!dr.show_email;
      try{ var list=await rest('GET','directory_public','?select=*&order=display_name'); $('dir-list').innerHTML=list.length?'<p class="soft" style="margin-bottom:4px">Neighbors who opted in:</p>'+list.map(function(x){ return '<div class="dir-card"><b>'+esc(x.display_name||'Neighbor')+'</b><span>'+esc(x.address||'')+(x.phone?' &middot; '+esc(x.phone):'')+(x.email?' &middot; '+esc(x.email):'')+'</span></div>'; }).join(''):''; }catch(e){}
      /* board */
      $('me-board').hidden=me.role!=='board'; if(me.role==='board') board();
    }catch(err){ $('me-dues').innerHTML='<p class="soft">Could not load your home right now. '+esc(err.message)+'</p>'; }
  }
  $('me-link').addEventListener('submit',async function(e){ e.preventDefault(); try{ await rest('POST','account_requests','',{email:sess.user.email,name:$('me-link-name').value.trim(),address:$('me-link-addr').value.trim(),note:'From My home, signed in'},'return=minimal'); msg('me-link-msg','Sent. A board member will link your home.',true); }catch(err){ msg('me-link-msg',err.message); } });
  $('rem-save').addEventListener('click',async function(){ try{ await rest('POST','reminder_prefs','?on_conflict=user_id',{user_id:sess.user.id,email_on:$('rem-email').checked,sms_on:$('rem-sms').checked,phone:$('rem-phone').value.trim(),updated_at:new Date().toISOString()},'resolution=merge-duplicates,return=minimal'); msg('rem-msg','Saved.',true); }catch(err){ msg('rem-msg',err.message); } });
  $('dir-save').addEventListener('click',async function(){ try{ await rest('POST','directory','?on_conflict=user_id',{user_id:sess.user.id,opt_in:$('dir-opt').checked,display_name:$('dir-name').value.trim(),phone:$('dir-phone').value.trim(),show_email:$('dir-email').checked,updated_at:new Date().toISOString()},'resolution=merge-duplicates,return=minimal'); msg('dir-msg','Saved.',true); render(); }catch(err){ msg('dir-msg',err.message); } });

  async function board(){
    try{
      var homes=await rest('GET','households','?select=*&order=address'), acct=await rest('GET','account_requests','?select=*&handled=eq.false&order=created_at'), profs=await rest('GET','profiles','?select=id,email,full_name,household_id,role');
      var opts='<option value="">Pick the home…</option>'+homes.map(function(h){ return '<option value="'+h.id+'">'+esc(h.address)+'</option>'; }).join('');
      $('b-acct').innerHTML=acct.length?acct.map(function(a){ var p=profs.filter(function(x){ return x.email===a.email; })[0]; return '<div class="b-row" data-id="'+a.id+'"><div><b>'+esc(a.name||a.email)+'</b><br><small style="color:var(--muted)">'+esc(a.email)+' &middot; '+esc(a.address||'address not given')+(p?'':' &middot; <i>no account yet</i>')+'</small></div><div style="display:flex;gap:6px;align-items:center"><select'+(p?'':' disabled')+'>'+opts+'</select><button class="btn" type="button" data-link="'+(p?p.id:'')+'">Link</button></div></div>'; }).join(''):'<p class="soft">Nothing waiting.</p>';
      $('b-dues').innerHTML='<table style="width:100%;border-collapse:collapse;font-size:.95rem">'+homes.map(function(h){ var late=h.balance_cents>0&&h.due_date&&new Date(h.due_date)<new Date(); return '<tr><td style="padding:8px 8px 8px 0;border-bottom:1px solid var(--line)">'+esc(h.address)+'</td><td style="padding:8px 0;border-bottom:1px solid var(--line);text-align:right;white-space:nowrap">'+(h.balance_cents>0?'<span class="pill '+(late?'denied':'review')+'">'+(late?'Past due ':'Owes ')+money(h.balance_cents)+'</span>':'<span class="pill approved">Paid</span>')+'</td></tr>'; }).join('')+'</table>';
      var reqs=await rest('GET','requests','?select=*&order=created_at.desc'); var hb={}; homes.forEach(function(h){ hb[h.id]=h.address; });
      var ST=['Received','In review','Needs info','Approved','Not approved'];
      $('b-reqs').innerHTML=reqs.length?reqs.map(function(q){ return '<div class="b-row" data-req="'+q.id+'"><div><b>'+esc(q.type)+'</b> &middot; '+esc(hb[q.household_id]||'')+'<br><small style="color:var(--muted)">'+esc(q.description||'').slice(0,120)+'</small></div><div style="display:flex;gap:6px;align-items:center"><select>'+ST.map(function(s){ return '<option'+(s===q.status?' selected':'')+'>'+s+'</option>'; }).join('')+'</select><button class="btn" type="button" data-status>Save</button></div></div>'; }).join(''):'<p class="soft">No requests.</p>';
      $('me-board').onclick=async function(e){
        var b=e.target.closest('button'); if(!b) return; var row=b.closest('.b-row');
        if(b.hasAttribute('data-link')){ var hid=row.querySelector('select').value, uid=b.getAttribute('data-link'); if(!hid||!uid) return; b.textContent='…'; try{ await rest('PATCH','profiles','?id=eq.'+uid,{household_id:+hid},'return=minimal'); await rest('PATCH','account_requests','?id=eq.'+row.getAttribute('data-id'),{handled:true},'return=minimal'); board(); }catch(err){ b.textContent='Failed'; } }
        if(b.hasAttribute('data-status')){ b.textContent='…'; try{ await rest('PATCH','requests','?id=eq.'+row.getAttribute('data-req'),{status:row.querySelector('select').value,updated_at:new Date().toISOString()},'return=minimal'); b.textContent='Saved'; }catch(err){ b.textContent='Failed'; } }
      };
    }catch(err){ $('b-acct').innerHTML='<p class="soft">'+esc(err.message)+'</p>'; }
  }
  /* The exterior-request form: signed in with a linked home, it saves to the database and shows up in My home and the board tools; otherwise it stays the email form. */
  HOA.me=null; HOA.rest=rest;
  var _mail=window.submitACC;
  window.submitACC=function(e){
    if(!(sess&&HOA.me&&HOA.me.household_id)) return _mail?_mail(e):true;
    e.preventDefault(); var f=e.target, v=function(n){ return (f.elements[n]&&f.elements[n].value||'').trim(); }, btn=f.querySelector('[type=submit]');
    btn.disabled=true; btn.textContent='Sending…';
    rest('POST','requests','',{household_id:HOA.me.household_id,submitted_by:sess.user.id,type:v('type'),description:v('description')+(v('name')?'\n\nContact: '+v('name')+(v('email')?' <'+v('email')+'>':''):''),start_date:v('start')||null},'return=minimal')
      .then(function(){ btn.textContent='Sent'; var n=document.createElement('p'); n.className='fine'; n.style.color='var(--ok,#2E7D5B)'; n.innerHTML='<b>Received.</b> It is now in your <a href="'+(window.HOA_ME_ROUTE||'#/me')+'">My home</a> under My requests, and the board sees it in their queue.'; btn.parentNode.insertBefore(n,btn.nextSibling); f.reset(); })
      .catch(function(err){ btn.disabled=false; btn.textContent='Send my request'; alert('Could not save it: '+err.message+'. Sending by email instead.'); if(_mail) _mail(e); });
    return false;
  };
  function badge(){ var f=document.getElementById('accForm'); if(!f) return; var b=f.querySelector('.me-badge'); if(sess&&HOA.me&&HOA.me.household_id){ if(!b){ b=document.createElement('p'); b.className='fine me-badge'; f.insertBefore(b,f.firstElementChild.nextSibling); } b.innerHTML='Signed in as <b>'+esc(HOA.me.full_name||HOA.me.email)+'</b>. This request is saved to your home and tracked in <a href="'+(window.HOA_ME_ROUTE||'#/me')+'">My home</a>. Your name and address fill themselves in.'; var a=f.elements['address'], n=f.elements['name'], em=f.elements['email']; if(a&&!a.value&&HOA.home) a.value=HOA.home.address; if(n&&!n.value) n.value=HOA.me.full_name||''; if(em&&!em.value) em.value=HOA.me.email||''; } else if(b) b.remove(); }
  /* sessions from the password grant carry the user; refresh keeps it */
  var _save=save; save=function(s){ if(s&&!s.user&&sess&&sess.user) s.user=sess.user; _save(s); };
  render();
  window.addEventListener('hashchange',function(){ if(/\/me\b|#me\b|a\/me/.test(location.hash)) render(); else badge(); });
})();
