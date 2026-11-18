/* ============================================================
   The Orange's HOA: the living pictures and the text-size switch.
   1. Bigger text, remembered on this device.
   2. Seasons. Both pictures follow the real season (spring from
      March 20, summer from June 21, fall from September 22, winter
      from December 21). A button on the picture lets anyone try
      another one; the choice stays on their own device.
   3. Sunset: the sun sits where the clock says (morning, noon,
      evening, night). Touch the sky and it follows your finger,
      and the shadows of every house and tree swing with it.
   4. Front Porch: the street scene keeps the real time of day too.
   ============================================================ */
(function(){
  var NS='http://www.w3.org/2000/svg', root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(n,a,parent){ var e=document.createElementNS(NS,n); for(var k in a) e.setAttribute(k,a[k]); if(parent) parent.appendChild(e); return e; }
  function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
  function rnd(i){ var v=Math.sin(i*127.1+311.7)*43758.5453; return v-Math.floor(v); }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function put(k,v){ try{ if(v) localStorage.setItem(k,v); else localStorage.removeItem(k); }catch(e){} }

  /* ---------------- 1. bigger text ---------------- */
  (function(){
    var on=get('hoa-big')==='1';
    function paint(){ root.classList.toggle('big',on); document.querySelectorAll('[data-bigtext]').forEach(function(b){ b.textContent=on?'Normal text size':'Make the text bigger'; b.setAttribute('aria-pressed',String(on)); }); }
    document.addEventListener('click',function(e){ var b=e.target.closest('[data-bigtext]'); if(!b) return; on=!on; put('hoa-big',on?'1':''); paint(); });
    paint();
  })();

  /* ---------------- 2. seasons and the picture picker ---------------- */
  var SEASONS=['spring','summer','fall','winter'], TODS=['morning','noon','evening','night'];
  var NAME={spring:'Spring',summer:'Summer',fall:'Fall',winter:'Winter',morning:'Morning',noon:'Noon',evening:'Evening',night:'Night'};
  function seasonOf(d){ var n=(d.getMonth()+1)*100+d.getDate(); return n>=320&&n<621?'spring':n>=621&&n<922?'summer':n>=922&&n<1221?'fall':'winter'; }
  function todOf(h){ return h<5||h>=20?'night':h<9?'morning':h<16.5?'noon':'evening'; }
  function season(){ var p=get('hoa-season'); return SEASONS.indexOf(p)>-1?p:seasonOf(new Date()); }
  window.HOA_SEASON={of:seasonOf,now:season};
  function picker(host,withTime,redraw){
    var box=document.createElement('div'); box.className='picpick';
    function rowHtml(key,list,auto){ var cur=get(key)||''; if(list.indexOf(cur)<0) cur=''; return '<div class="picrow" data-k="'+key+'"><button type="button" data-v="" aria-pressed="'+(cur==='')+'">'+auto+'</button>'+list.map(function(v){ return '<button type="button" data-v="'+v+'" aria-pressed="'+(cur===v)+'">'+NAME[v]+'</button>'; }).join('')+'</div>'; }
    function label(){ var d=new Date(), t=get('hoa-tod'); return 'Picture: '+NAME[season()]+(withTime?', '+NAME[TODS.indexOf(t)>-1?t:todOf(d.getHours()+d.getMinutes()/60)].toLowerCase():''); }
    function paint(open){ box.innerHTML='<button type="button" class="picbtn" aria-expanded="'+(!!open)+'">'+label()+'</button><div class="picpop"'+(open?'':' hidden')+'><b>Season</b>'+rowHtml('hoa-season',SEASONS,'Follow the calendar')+(withTime?'<b>Time of day</b>'+rowHtml('hoa-tod',TODS,'Follow the clock'):'')+'<p>The picture changes by itself as the year goes on. What you pick here stays on this device only.</p><button type="button" class="picdone">Done</button></div>'; }
    /* on a phone the choices open as a sheet at the bottom, so bring the picture up where it can be seen */
    function reveal(){ var pic=document.querySelector('#grove,#porch-svg'); if(!pic||!window.matchMedia||!window.matchMedia('(max-width:560px)').matches) return; var y=pic.getBoundingClientRect().top+window.pageYOffset-136; try{ window.scrollTo({top:Math.max(0,y),behavior:reduce?'auto':'smooth'}); }catch(e){ window.scrollTo(0,Math.max(0,y)); } }
    function shut(){ var pop=box.querySelector('.picpop'); if(pop&&!pop.hidden){ pop.hidden=true; box.querySelector('.picbtn').setAttribute('aria-expanded','false'); } }
    box.addEventListener('click',function(e){
      e.stopPropagation(); var b=e.target.closest('button'); if(!b) return;
      if(b.classList.contains('picbtn')){ var pop=box.querySelector('.picpop'); pop.hidden=!pop.hidden; b.setAttribute('aria-expanded',String(!pop.hidden)); if(!pop.hidden) reveal(); return; }
      if(b.classList.contains('picdone')){ shut(); box.querySelector('.picbtn').focus(); return; }
      var row=b.closest('.picrow'); if(!row) return; put(row.getAttribute('data-k'),b.getAttribute('data-v')); redraw(); paint(true);
    });
    document.addEventListener('click',function(e){ if(!box.contains(e.target)&&!(e.target.closest&&e.target.closest('.picpick'))) shut(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
    paint(false); host.appendChild(box); return function(){ var pop=box.querySelector('.picpop'); paint(pop&&!pop.hidden); };
  }
  /* falling leaves, snow, petals and fireflies for the Sunset picture (plain page elements over the scene) */
  function weather(host,s){
    var old=host.querySelector('.wx'); if(old) old.remove(); if(reduce) return;
    var w=document.createElement('div'); w.className='wx '+s; w.setAttribute('aria-hidden','true');
    var n=s==='winter'?34:s==='summer'?16:20, h='';
    for(var i=0;i<n;i++) h+='<i style="left:'+(rnd(i+s.length)*100).toFixed(1)+'%;animation-delay:'+(-rnd(i+40)*12).toFixed(1)+'s;animation-duration:'+((s==='summer'?3:8)+rnd(i+80)*7).toFixed(1)+'s'+(s==='summer'?';bottom:'+(8+rnd(i+9)*22).toFixed(0)+'%':'')+'"></i>';
    w.innerHTML=h; host.appendChild(w);
  }

  /* ---------------- 3. Sunset ---------------- */
  (function(){
    var svg=document.getElementById('grove'); if(!svg) return;
    var sun=svg.querySelector('.sun'), hero=svg.closest('.hello'); if(!sun||!hero) return;
    var HOME={x:1120,y:236}, TOP=64, LOW=268;
    var wrap=el('g',{'class':'sunpos'}); sun.parentNode.insertBefore(wrap,sun); wrap.appendChild(sun);
    var defs=svg.querySelector('defs');
    var f=el('filter',{id:'shade',x:'-50%',y:'-50%',width:'200%',height:'200%'},defs); el('feColorMatrix',{type:'matrix',values:'0 0 0 0 0.03  0 0 0 0 0.07  0 0 0 0 0.14  0 0 0 0.42 0'},f);
    var dg=el('linearGradient',{id:'dayg',x1:0,y1:0,x2:0,y2:1},defs); el('stop',{offset:0,'stop-color':'#8FC3EE','stop-opacity':0},dg); el('stop',{offset:.55,'stop-color':'#A9D2F2','stop-opacity':.55},dg); el('stop',{offset:1,'stop-color':'#FFD8A8','stop-opacity':.9},dg);
    var ng=el('linearGradient',{id:'nightg',x1:0,y1:0,x2:0,y2:1},defs); el('stop',{offset:0,'stop-color':'#0B1A30','stop-opacity':0},ng); el('stop',{offset:.45,'stop-color':'#0B1A30','stop-opacity':.82},ng); el('stop',{offset:1,'stop-color':'#14294A','stop-opacity':.94},ng);
    var night=el('rect',{'class':'nightsky',width:1440,height:420,fill:'url(#nightg)',opacity:0}); wrap.parentNode.insertBefore(night,wrap);
    var stars=el('g',{'class':'stars',opacity:0}); wrap.parentNode.insertBefore(stars,wrap);
    for(var si=0;si<44;si++) el('circle',{cx:(rnd(si+2)*1440).toFixed(0),cy:(70+rnd(si+60)*150).toFixed(0),r:(0.9+rnd(si+120)*1.5).toFixed(1),fill:'#FFFFFF',opacity:(0.4+rnd(si+180)*0.6).toFixed(2)},stars);
    el('circle',{cx:300,cy:150,r:44,fill:'#F3EFE2',opacity:.14},stars); el('circle',{cx:300,cy:150,r:24,fill:'#F3EFE2'},stars);
    var day=el('rect',{'class':'daysky',width:1440,height:420,fill:'url(#dayg)',opacity:0}); wrap.parentNode.insertBefore(day,wrap);
    /* a second tree shape, so a row of trees is not all one color */
    var t1=svg.querySelector('#tree'), t2=null;
    if(t1){ t2=t1.cloneNode(true); t2.id='tree2'; defs.appendChild(t2); svg.querySelectorAll('g.trees use').forEach(function(u,i){ if(i%2) u.setAttribute('href','#tree2'); }); }
    /* one shadow per house and tree, drawn just behind its own row */
    var items=[];
    svg.querySelectorAll('g.homes').forEach(function(g){
      var layer=el('g',{'class':'shadows',filter:'url(#shade)'}); g.parentNode.insertBefore(layer,g);
      var uses=[].slice.call(g.querySelectorAll('use')), t=g.nextElementSibling; if(t&&t.classList&&t.classList.contains('trees')) uses=uses.concat([].slice.call(t.querySelectorAll('use')));
      uses.forEach(function(u){ var m=/translate\(([-\d.]+),([-\d.]+)\)\s*scale\(([-\d.]+)\)/.exec(u.getAttribute('transform')||''); if(!m) return;
        var href=u.getAttribute('href')||u.getAttribute('xlink:href'), tree=href.indexOf('tree')>-1, s=el('use',{href:tree?'#tree':href},layer);
        items.push({x:+m[1],y:+m[2],k:+m[3],base:tree?24:10,s:s}); });
    });
    /* the four seasons, painted onto the same drawing */
    var LOOK={
      summer:{a:'#2C4A6E',b:'#2C4A6E',fruit:'#F08A4B',fruit2:'#F08A4B',roof:null,hillA:['#2C4A6E','#1E4E7A'],hillB:['#1E4E7A','#12314F']},
      fall:{a:'#A45F33',b:'#C68A45',fruit:'#F6C36A',fruit2:'#8A3F1E',roof:null,hillA:['#2C4A6E','#1E4E7A'],hillB:['#1E4E7A','#12314F']},
      winter:{a:'#7C97B5',b:'#8FA8C4',fruit:null,fruit2:null,roof:'#EAF2FA',hillA:['#A9BFD8','#7F9CBE'],hillB:['#8CA8C8','#5E7FA6']},
      spring:{a:'#3B5F86',b:'#F3A9BF',fruit:'#F7B7C9',fruit2:'#FFFFFF',roof:null,hillA:['#2F5578','#1E4E7A'],hillB:['#1E4E7A','#12314F']}
    };
    function stops(id,c){ var st=svg.querySelectorAll('#'+id+' stop'); if(st.length>1){ st[0].setAttribute('stop-color',c[0]); st[1].setAttribute('stop-color',c[1]); } }
    function paintSeason(){
      var s=season(), L=LOOK[s];
      if(t1) [[t1,L.a,L.fruit],[t2,L.b,L.fruit2]].forEach(function(p){ p[0].querySelectorAll('circle').forEach(function(c){ if(c.classList.contains('fruit')){ c.style.display=p[2]?'':'none'; if(p[2]) c.setAttribute('fill',p[2]); } else c.setAttribute('fill',p[1]); }); });
      svg.querySelectorAll('#home path, #home2 path').forEach(function(r){ if(L.roof){ r.setAttribute('stroke',L.roof); r.setAttribute('stroke-width','1.7'); r.setAttribute('stroke-linejoin','round'); } else r.removeAttribute('stroke'); });
      stops('hillA',L.hillA); stops('hillB',L.hillB);
      weather(hero,s); hero.setAttribute('data-season',s);
    }
    var cur={x:HOME.x,y:HOME.y}, goal={x:HOME.x,y:HOME.y}, raf=0, dark=0, shown='';
    var SUNAT={morning:[345,204],noon:[1090,92],evening:[HOME.x,HOME.y],night:[1262,356]};
    /* the highest the sun may go and still be in view (wide screens crop the top of the sky) */
    function roof(){ var ctm=svg.getScreenCTM(); if(!ctm) return TOP; var r=svg.getBoundingClientRect(), pt=svg.createSVGPoint(); pt.x=r.left; pt.y=r.top; return Math.max(TOP,pt.matrixTransform(ctm.inverse()).y+100); }
    function hourName(){ var t=get('hoa-tod'), d=new Date(); return TODS.indexOf(t)>-1?t:todOf(d.getHours()+d.getMinutes()/60); }
    function setTime(glide){
      var t=hourName(); shown=t; dark=t==='night'?1:0; goal.x=SUNAT[t][0]; goal.y=Math.max(SUNAT[t][1],t==='night'?0:Math.min(roof(),LOW)); svg.setAttribute('data-tod',t); hero.setAttribute('data-tod',t);
      if(glide&&!reduce){ if(!raf) raf=requestAnimationFrame(step); } else { cur.x=goal.x; cur.y=goal.y; paint(); }
    }
    function paint(){
      wrap.setAttribute('transform','translate('+(cur.x-HOME.x).toFixed(1)+','+(cur.y-HOME.y).toFixed(1)+')');
      var high=clamp((LOW-cur.y)/(LOW-TOP),0,1), len=0.86-high*0.5;
      day.setAttribute('opacity',(high*0.75).toFixed(2));
      var dk=(dark*(1-high)).toFixed(2); night.setAttribute('opacity',dk); stars.setAttribute('opacity',dk);
      var glows=svg.querySelector('.glows'); if(glows) glows.style.opacity=(1-high*0.85).toFixed(2);
      for(var i=0;i<items.length;i++){ var it=items[i], a=clamp((cur.x-it.x)/380,-1,1)*62;
        it.s.setAttribute('transform','translate('+it.x+','+(it.y+it.base*it.k)+') skewX('+a.toFixed(1)+') scale('+it.k+','+(it.k*len).toFixed(3)+') translate(0,'+(-it.base)+')'); }
    }
    function step(){ cur.x+=(goal.x-cur.x)*0.14; cur.y+=(goal.y-cur.y)*0.14; paint(); if(Math.abs(goal.x-cur.x)+Math.abs(goal.y-cur.y)>0.4) raf=requestAnimationFrame(step); else raf=0; }
    function aim(e){
      if(e.target.closest&&e.target.closest('.picpick')) return;
      var ctm=svg.getScreenCTM(); if(!ctm) return; var pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; var p=pt.matrixTransform(ctm.inverse());
      goal.x=clamp(p.x,70,1370); goal.y=clamp(p.y,Math.min(roof(),LOW),LOW);
      if(reduce){ cur.x=goal.x; cur.y=goal.y; paint(); } else if(!raf) raf=requestAnimationFrame(step);
      var h=hero.querySelector('.sunhint'); if(h) h.classList.add('gone');
    }
    hero.addEventListener('pointermove',aim); hero.addEventListener('pointerdown',aim);
    var text=hero.querySelector('.wrap');
    var hint=document.createElement('p'); hint.className='sunhint'; hint.textContent='Touch the sky to move the sun.'; text.appendChild(hint);
    var slot=document.createElement('div'); slot.className='picslot'; text.appendChild(slot);
    var relabel=picker(slot,true,function(){ paintSeason(); setTime(true); });
    paintSeason(); setTime(false);
    setInterval(function(){ if(hourName()!==shown){ setTime(true); relabel(); } },10*60*1000);
  })();

  /* ---------------- 4. Front Porch: a scene that keeps the real time and season ---------------- */
  (function(){
    var svg=document.getElementById('porch-svg'); if(!svg) return;
    var W=1200, H=360, HOURS={morning:7.4,noon:12.5,evening:17.9,night:22};
    var PAL={
      morning:{sky:['#C6E4F7','#FDEBD0'],back:'#93B4D4',front:'#6E97C0',wall:'#FBF8F1',roof:'#1E3A5F',win:'#CFE3F2',door:'#E8703A',tree:'#2F6690',sun:'#FFD27A',lit:false},
      noon:{sky:['#86C3EE','#E3F2FC'],back:'#86B0D6',front:'#5F90C0',wall:'#FFFFFF',roof:'#1E3A5F',win:'#BFD9EC',door:'#E8703A',tree:'#2F6690',sun:'#FFE08A',lit:false},
      evening:{sky:['#34457A','#F3A66B'],back:'#55679A',front:'#33466F',wall:'#E6D5CB',roof:'#16263F',win:'#FFD27A',door:'#C9602F',tree:'#223E63',sun:'#F6A45A',lit:true},
      night:{sky:['#081428','#1E3557'],back:'#172B49',front:'#0F2038',wall:'#2A3F63',roof:'#0B1830',win:'#FFD27A',door:'#8E4A2A',tree:'#14304F',sun:'#F3EFE2',lit:true}
    };
    function yBack(x){ return 232-26*Math.sin(x/W*Math.PI*1.25+0.5); }
    function yFront(x){ return 292-22*Math.sin(x/W*Math.PI*1.4+2.2); }
    function hill(fn){ var d='M0 '+H+' L0 '+fn(0).toFixed(1); for(var x=30;x<=W;x+=30) d+=' L'+x+' '+fn(x).toFixed(1); return d+' L'+W+' '+H+' Z'; }
    function house(g,x,y,k,p,i,snow){
      var h=el('g',{transform:'translate('+x.toFixed(1)+','+y.toFixed(1)+') scale('+k+')'},g);
      el('rect',{x:-15,y:-22,width:30,height:23,fill:p.wall},h);
      el('path',{d:'M-19 -22 L0 -39 L19 -22 Z',fill:p.roof},h);
      if(snow) el('path',{d:'M-19 -22 L0 -39 L19 -22',fill:'none',stroke:'#FFFFFF','stroke-width':4,'stroke-linejoin':'round','stroke-linecap':'round'},h);
      if(i%2){ el('rect',{x:-4,y:-12,width:8,height:13,fill:p.door},h); el('rect',{x:6,y:-17,width:6,height:6,fill:p.win},h); if(p.lit) el('circle',{cx:9,cy:-14,r:9,fill:'#FFD27A',opacity:.22},h); }
      else { el('rect',{x:-11,y:-16,width:7,height:7,fill:p.win},h); el('rect',{x:4,y:-16,width:7,height:7,fill:p.win},h); if(p.lit){ el('circle',{cx:-7.5,cy:-12.5,r:9,fill:'#FFD27A',opacity:.2},h); el('circle',{cx:7.5,cy:-12.5,r:9,fill:'#FFD27A',opacity:.2},h); } }
    }
    function tree(g,x,y,p,i,s){
      var t=el('g',{transform:'translate('+x.toFixed(1)+','+y.toFixed(1)+')'},g), c=p.tree, dots='#F08A4B';
      if(s==='fall') c=p.lit?(i%2?'#7A4A2C':'#8C5A30'):(i%2?'#C9773A':'#D99A4E');
      if(s==='winter') c=p.lit?'#3A4E72':'#9FB3C8';
      if(s==='spring'){ c=p.lit?(i%2?'#7B6388':'#4B5F86'):(i%2?'#F2A9BD':'#6FA8C4'); dots=i%2?'#FFFFFF':'#F7B7C9'; }
      el('rect',{x:-3,y:-22,width:6,height:24,rx:2,fill:p.roof},t);
      el('circle',{cx:0,cy:-36,r:19,fill:c},t); el('circle',{cx:-12,cy:-27,r:12,fill:c},t); el('circle',{cx:12,cy:-28,r:12,fill:c},t);
      if(s==='winter') el('path',{d:'M-15 -44 Q0 -62 15 -44 Q0 -50 -15 -44Z',fill:'#FFFFFF',opacity:.9},t);
      else [[-8,-40],[6,-33],[1,-46],[-3,-28],[11,-42]].forEach(function(q){ el('circle',{cx:q[0],cy:q[1],r:3,fill:dots},t); });
    }
    function draw(){
      var d=new Date(), pick=get('hoa-tod'), hour=HOURS[pick]||d.getHours()+d.getMinutes()/60, name=todOf(hour), p=PAL[name], s=season();
      while(svg.firstChild) svg.removeChild(svg.firstChild);
      var defs=el('defs',{},svg), g=el('linearGradient',{id:'psky',x1:0,y1:0,x2:0,y2:1},defs); el('stop',{offset:0,'stop-color':p.sky[0]},g); el('stop',{offset:1,'stop-color':p.sky[1]},g);
      el('rect',{width:W,height:H,fill:'url(#psky)'},svg);
      if(name==='night'){ for(var i=0;i<46;i++) el('circle',{cx:(rnd(i)*W).toFixed(0),cy:(rnd(i+90)*190).toFixed(0),r:(0.8+rnd(i+200)*1.4).toFixed(1),fill:'#FFFFFF',opacity:(0.35+rnd(i+300)*0.6).toFixed(2),'class':i%5?'':'twinkle'},svg);
        el('circle',{cx:930,cy:86,r:30,fill:p.sun},svg); el('circle',{cx:943,cy:78,r:27,fill:p.sky[0]},svg); }
      else { var t=clamp((hour-6)/12,0,1), sx=120+t*960, sy=312-Math.sin(t*Math.PI)*250; el('circle',{cx:sx.toFixed(0),cy:sy.toFixed(0),r:84,fill:p.sun,opacity:.22},svg); el('circle',{cx:sx.toFixed(0),cy:sy.toFixed(0),r:46,fill:p.sun},svg); }
      if(!p.lit){ [[180,70,1],[620,48,.8],[980,96,1.15]].forEach(function(c,i){ var cl=el('g',{'class':'cloud c'+i,transform:'translate('+c[0]+','+c[1]+') scale('+c[2]+')',opacity:.9},svg); el('ellipse',{cx:0,cy:0,rx:54,ry:17,fill:'#FFFFFF'},cl); el('ellipse',{cx:-22,cy:-12,rx:26,ry:17,fill:'#FFFFFF'},cl); el('ellipse',{cx:16,cy:-15,rx:30,ry:20,fill:'#FFFFFF'},cl); }); }
      el('path',{d:hill(yBack),fill:s==='winter'?(p.lit?'#3F5378':'#D5E3F0'):p.back},svg);
      var back=el('g',{opacity:.92},svg); for(var b=0;b<14;b++){ var bx=70+b*81.5; house(back,bx,yBack(bx)+3,0.72,p,b,s==='winter'); }
      el('path',{d:hill(yFront),fill:s==='winter'?(p.lit?'#33466B':'#E9F1F8'):p.front},svg);
      var front=el('g',{},svg);
      for(var k=0;k<24;k++){ var x=36+k*49, y=yFront(x)+4; if(k%5===4||k===23) tree(front,x,y,p,k,s); else house(front,x,y,1,p,k,s==='winter'); }
      if(!reduce){
        var n, a;
        if(s==='winter') for(n=0;n<26;n++) el('circle',{cx:(rnd(n+7)*W).toFixed(0),cy:-10,r:(1.6+rnd(n+40)*1.8).toFixed(1),fill:'#FFFFFF',opacity:.85,'class':'flake',style:'animation-delay:'+(-rnd(n+70)*9).toFixed(1)+'s;animation-duration:'+(7+rnd(n+11)*6).toFixed(1)+'s'},svg);
        if(s==='fall') for(n=0;n<20;n++) el('rect',{x:(rnd(n+3)*W).toFixed(0),y:-10,width:11,height:6,rx:3,fill:n%2?'#C9773A':'#E0A458','class':'leaf',style:'animation-delay:'+(-rnd(n+50)*11).toFixed(1)+'s;animation-duration:'+(9+rnd(n+21)*6).toFixed(1)+'s'},svg);
        if(s==='spring') for(n=0;n<18;n++) el('circle',{cx:(rnd(n+13)*W).toFixed(0),cy:-10,r:3.4,fill:n%2?'#F7B7C9':'#FFFFFF',opacity:.9,'class':'leaf',style:'animation-delay:'+(-rnd(n+60)*12).toFixed(1)+'s;animation-duration:'+(11+rnd(n+31)*7).toFixed(1)+'s'},svg);
        if(s==='summer'&&p.lit) for(n=0;n<18;n++){ a=rnd(n+5)*W; el('circle',{cx:a.toFixed(0),cy:(yFront(a)-20-rnd(n+17)*70).toFixed(0),r:2.2,fill:'#FFE08A','class':'firefly',style:'animation-delay:'+(-rnd(n+23)*4).toFixed(1)+'s;animation-duration:'+(2.5+rnd(n+29)*3).toFixed(1)+'s'},svg); }
      }
      svg.setAttribute('data-tod',name); svg.setAttribute('data-season',s);
    }
    var repaint=picker(document.getElementById('porch-scene'),true,draw);
    draw(); setInterval(function(){ draw(); repaint(); },10*60*1000);
  })();
})();
