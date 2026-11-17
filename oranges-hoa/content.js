/* ============================================================
   The Orange's HOA: the content of the website.
   Calendar · trash days and county help · seasonal guides ·
   monthly newsletter · neighbor news · optional reminders.

   Everything here is built from the few lists at the top of this
   file. Change a list and the calendar, the home screen and the
   newsletter all follow. County facts were checked against
   Montgomery County, WSSC Water and Pepco pages in November 2026.
   ============================================================ */
(function(){
  var root=document.documentElement, ONE=root.getAttribute('data-design')==='2';
  function href(p){ return ONE?'#'+p:'#/'+p; }
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MO3=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function D(s){ var p=s.split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
  function key(d){ return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
  function addDays(d,n){ var x=new Date(d); x.setDate(x.getDate()+n); return x; }
  function nice(d){ return DOW[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate(); }
  var TODAY=new Date(); TODAY.setHours(0,0,0,0);

  /* ---------------- the lists the board would edit ---------------- */
  var BOARD_EMAIL='orangeshoa@gmail.com';
  var TRASH_DOW=2;                       // Tuesday. Trash, recycling and yard trim share the day.
  var MEETINGS=[
    {date:'2026-12-16', time:'7:00 to 8:30 p.m.', title:'Annual Meeting of Members', where:'Online, on Google Meet',
     text:'Board elections, next year&rsquo;s budget, the financial statement, and your questions. Every household is welcome.',
     meet:'https://meet.google.com/aio-jfpu-ayn', start:'20261217T000000Z', end:'20261217T013000Z'}
  ];
  /* County holidays. slide:true means pickups on or after that day move one day later that week. */
  var HOLIDAYS=[
    {date:'2026-11-11',name:'Veterans Day',slide:true},{date:'2026-11-26',name:'Thanksgiving',slide:true},
    {date:'2026-12-25',name:'Christmas Day',slide:true},{date:'2027-01-01',name:'New Year&rsquo;s Day',slide:true},
    {date:'2027-01-18',name:'Martin Luther King Jr. Day',slide:true},{date:'2027-02-15',name:'Presidents Day',slide:true},
    {date:'2027-05-31',name:'Memorial Day',slide:true},{date:'2027-06-19',name:'Juneteenth',slide:false},
    {date:'2027-07-04',name:'Independence Day',slide:false},{date:'2027-09-06',name:'Labor Day',slide:true},
    {date:'2027-11-11',name:'Veterans Day',slide:true},{date:'2027-11-25',name:'Thanksgiving',slide:true}
  ];
  var NOTES=[
    {date:'2026-11-09',kind:'county',title:'County leaf vacuum collection begins',text:'Two passes per area, the second after Thanksgiving. Rake leaves to the edge of the street, not into it.',page:'county'},
    {date:'2027-03-14',kind:'tip',title:'Clocks spring forward',text:'A good day to test your smoke alarms.'},
    {date:'2027-11-07',kind:'tip',title:'Clocks fall back',text:'A good day to test your smoke alarms.'}
  ];

  /* ---------------- trash day math ---------------- */
  var HOL={}; HOLIDAYS.forEach(function(h){ HOL[h.date]=h; });
  function pickupFor(tuesday){               // the real pickup date for the week of this Tuesday
    var mon=HOL[key(addDays(tuesday,-1))], tue=HOL[key(tuesday)];
    var h=(mon&&mon.slide&&mon)||(tue&&tue.slide&&tue)||null;
    return {date:h?addDays(tuesday,1):tuesday, holiday:h};
  }
  function nextPickup(from){
    var d=new Date(from); while(d.getDay()!==TRASH_DOW) d=addDays(d,1);
    var p=pickupFor(d); if(p.date<from){ p=pickupFor(addDays(d,7)); } return p;
  }
  function tuesdayOf(d){ var x=new Date(d); while(x.getDay()!==TRASH_DOW) x=addDays(x,-1); return x; }

  /* ---------------- events for one month ---------------- */
  function monthEvents(y,m){
    var out=[];
    MEETINGS.forEach(function(e){ var d=D(e.date); if(d.getFullYear()===y&&d.getMonth()===m) out.push({date:d,kind:'hoa',title:e.title,text:e.time.replace(/\.$/,'')+'. '+e.where+'. '+e.text,meeting:e}); });
    HOLIDAYS.forEach(function(h){ var d=D(h.date); if(d.getFullYear()!==y||d.getMonth()!==m) return;
      var t=tuesdayOf(d), affects=h.slide&&d.getDay()>=1&&d.getDay()<=2;
      out.push({date:d,kind:'county',title:h.name+' (county holiday)',text:affects?'Our pickup moves from Tuesday to <b>'+nice(addDays(d.getDay()===1?addDays(d,1):d,d.getDay()===1?1:1))+'</b> this week.':'Our Tuesday pickup is not affected.',page:'county'}); });
    NOTES.forEach(function(n){ var d=D(n.date); if(d.getFullYear()===y&&d.getMonth()===m) out.push({date:d,kind:n.kind,title:n.title,text:n.text,page:n.page}); });
    inbox().forEach(function(n){ if(!n.when) return; var d=D(n.when); if(d.getFullYear()===y&&d.getMonth()===m) out.push({date:d,kind:'hoa',title:n.title,text:esc(n.text)}); });
    return out.sort(function(a,b){ return a.date-b.date; });
  }
  function pickupsIn(y,m){ var out={}, d=new Date(y,m,1); d=addDays(d,-7); while(d.getDay()!==TRASH_DOW) d=addDays(d,1);
    for(;d<new Date(y,m+1,7);d=addDays(d,7)){ var p=pickupFor(d); if(p.date.getMonth()===m&&p.date.getFullYear()===y) out[key(p.date)]=p; } return out; }
  function nextMeeting(){ var n=null; MEETINGS.forEach(function(e){ var d=D(e.date); if(d>=TODAY&&(!n||d<D(n.date))) n=e; }); return n; }
  function meetingActions(e){
    var cal='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Orange’s HOA '+e.title.replace(/&rsquo;/g,'’'))+'&dates='+e.start+'/'+e.end+'&details='+encodeURIComponent('Join on Google Meet: '+e.meet)+'&location='+encodeURIComponent(e.meet);
    return '<p class="btnrow"><a class="btn" href="'+e.meet+'" target="_blank" rel="noopener">Join on Google Meet</a><a class="btn ghost" href="'+cal+'" target="_blank" rel="noopener">Add to my calendar</a></p>';
  }

  /* ---------------- CALENDAR ---------------- */
  var calY=TODAY.getFullYear(), calM=TODAY.getMonth();
  function drawCal(){
    var box=$('cal'); if(!box) return;
    var ev=monthEvents(calY,calM), pk=pickupsIn(calY,calM), by={};
    ev.forEach(function(e){ (by[key(e.date)]=by[key(e.date)]||[]).push(e); });
    var first=new Date(calY,calM,1), days=new Date(calY,calM+1,0).getDate(), cells='';
    for(var i=0;i<first.getDay();i++) cells+='<span class="cal-x"></span>';
    for(var n=1;n<=days;n++){ var d=new Date(calY,calM,n), k=key(d), e=by[k]||[], dots='';
      if(pk[k]) dots+='<i class="dot trash" title="Trash and recycling"></i>';
      e.forEach(function(x){ dots+='<i class="dot '+x.kind+'"></i>'; });
      var label=nice(d)+(pk[k]?', trash and recycling':'')+e.map(function(x){ return ', '+x.title.replace(/<[^>]+>|&[a-z]+;/g,''); }).join('');
      cells+='<button type="button" class="cal-d'+(+d===+TODAY?' today':'')+(e.length?' has':'')+'" data-k="'+k+'" aria-label="'+esc(label)+'"><b>'+n+'</b><span>'+dots+'</span></button>'; }
    var slides=Object.keys(pk).filter(function(k){ return pk[k].holiday; });
    var list=ev.map(function(e){ return row(e); }).join('');
    var nm=nextMeeting(), up=nm?'<div class="event nextup"><div class="chip"><span class="m">'+MO3[D(nm.date).getMonth()].toUpperCase()+'</span><span class="d">'+D(nm.date).getDate()+'</span></div><div><span class="lbl">Next meeting</span><h3>'+nm.title+'</h3><p>'+nice(D(nm.date))+', '+nm.time.replace(/\.$/,'')+'. '+nm.where+'.</p>'+meetingActions(nm)+'</div></div>':'';
    box.innerHTML=up+'<div class="cal-head"><button type="button" class="cal-nav" data-go="-1" aria-label="Previous month">&#8249;</button><h2>'+MON[calM]+' '+calY+'</h2><button type="button" class="cal-nav" data-go="1" aria-label="Next month">&#8250;</button></div>'+
      '<div class="cal-grid"><em>Sun</em><em>Mon</em><em>Tue</em><em>Wed</em><em>Thu</em><em>Fri</em><em>Sat</em>'+cells+'</div>'+
      '<p class="cal-key"><span><i class="dot hoa"></i>HOA meeting</span><span><i class="dot trash"></i>Trash &amp; recycling</span><span><i class="dot county"></i>County</span></p>'+
      '<div class="cal-day" id="cal-day" aria-live="polite"></div>'+
      '<h3 class="cal-sub">In '+MON[calM]+'</h3>'+
      '<div class="event"><div class="chip"><span class="m">EVERY</span><span class="d">Tue</span></div><div><h3>Trash, recycling and yard trim</h3><p>At the curb by 7 a.m.'+(slides.length?' Holiday change this month: pickup on <b>'+slides.map(function(k){ return nice(pk[k].date); }).join(' and ')+'</b> instead.':'')+' <a href="'+href('county')+'">What goes where</a></p></div></div>'+
      (list||'')+
      '<div class="event"><div class="chip"><span class="m">EVERY</span><span class="d">Mo.</span></div><div><h3>Board meeting</h3><p>The board meets monthly. The date and place go out by email. All members are welcome.</p></div></div>';
  }
  function row(e){
    return '<div class="event" id="ev-'+key(e.date)+'-'+e.kind+'"><div class="chip '+e.kind+'"><span class="m">'+MO3[e.date.getMonth()].toUpperCase()+'</span><span class="d">'+e.date.getDate()+'</span></div><div><h3>'+e.title+'</h3><p>'+DOW[e.date.getDay()]+'. '+e.text+(e.page?' <a href="'+href(e.page)+'">More</a>':'')+'</p>'+(e.meeting?meetingActions(e.meeting):'')+'</div></div>';
  }
  document.addEventListener('click',function(ev){
    var nav=ev.target.closest('.cal-nav'); if(nav){ calM+=+nav.getAttribute('data-go'); if(calM<0){ calM=11; calY--; } if(calM>11){ calM=0; calY++; } drawCal(); return; }
    var day=ev.target.closest('.cal-d'); if(day){ var k=day.getAttribute('data-k'), d=D(k), e=monthEvents(d.getFullYear(),d.getMonth()).filter(function(x){ return key(x.date)===k; }), pk=pickupsIn(d.getFullYear(),d.getMonth())[k];
      document.querySelectorAll('.cal-d.sel').forEach(function(x){ x.classList.remove('sel'); }); day.classList.add('sel');
      $('cal-day').innerHTML='<b>'+nice(d)+'</b> '+((pk?['Trash, recycling and yard trim pickup.']:[]).concat(e.map(function(x){ return x.title+'.'; })).join(' ')||'Nothing on the calendar.'); }
  });

  /* ---------------- TRASH & COUNTY HELP ---------------- */
  function drawCounty(){
    var box=$('county-body'); if(!box) return;
    var np=nextPickup(TODAY), up=HOLIDAYS.filter(function(h){ return D(h.date)>=TODAY; }).slice(0,6);
    box.innerHTML=
    '<div class="panel bigfact"><span class="lbl">Our pickup day</span><h2>Tuesday morning</h2><p>Trash, recycling and yard trim all go out the same day. Have everything at the curb by <b>7 a.m.</b></p><p class="next">Next pickup: <b>'+nice(np.date)+'</b>'+(np.holiday?' (moved a day for '+np.holiday.name+')':'')+'</p><p class="fine">Tuesday is the day the board has on file for our streets. To confirm your own address, use the county&rsquo;s <a href="https://www2.montgomerycountymd.gov/depcollectionday/" target="_blank" rel="noopener">collection day lookup</a>.</p></div>'+
    '<div class="grid2">'+
    '<div class="panel"><h3>Holiday weeks</h3><p>When a county holiday lands on a weekday, every pickup on or after that day moves one day later that week. For us that means a Monday or Tuesday holiday pushes pickup to Wednesday.</p><ul class="plain">'+up.map(function(h){ var d=D(h.date), hit=h.slide&&(d.getDay()===1||d.getDay()===2); return '<li><b>'+h.name+'</b>, '+nice(d)+': '+(hit?'pickup moves to <b>Wednesday</b>':'no change for us')+'</li>'; }).join('')+'</ul><p class="fine">The county&rsquo;s <a href="https://www.montgomerycountymd.gov/department-environmental-protection/trash-recycling-yard-trim/holiday-slide-schedule-residential-recycling-trash-collections-shady-grove-transfer-station-recycling-center" target="_blank" rel="noopener">holiday schedule</a> is the final word.</p></div>'+
    '<div class="panel" id="rem-box"><h3>Want a reminder? (optional)</h3><p>Pick what you would like to hear about. You can stop any time.</p><form id="rem-signup"><label class="chk"><input type="checkbox" name="r" value="trash" checked><span>Trash day, the evening before</span></label><label class="chk"><input type="checkbox" name="r" value="holiday" checked><span>Holiday weeks, when pickup moves</span></label><label class="chk"><input type="checkbox" name="r" value="dues"><span>Dues, before they are due</span></label><label class="chk"><input type="checkbox" name="r" value="meetings"><span>Meetings and events</span></label><div class="field" style="margin:12px 0 10px"><label for="rem-to">Email or mobile number</label><input id="rem-to" autocomplete="email" placeholder="you@anywhere.com or (301) 555-0100"></div><button class="btn" type="submit">Remind me</button> <span class="fine" id="rem-signup-msg" aria-live="polite"></span></form><p class="fine">The county has its own, too: the <a href="https://www2.montgomerycountymd.gov/depcollectionday/" target="_blank" rel="noopener">collection day lookup</a> can add your pickup days to your phone&rsquo;s calendar, and <a href="https://alert.montgomerycountymd.gov/" target="_blank" rel="noopener">Alert Montgomery</a> sends county emergency and weather texts.</p></div>'+
    '</div>'+
    '<h2>What goes where</h2><div class="grid2">'+
    '<div class="panel"><h3>Recycling</h3><p>Bottles, cans, jars and containers go in the blue bin. Paper and flattened cardboard go in the paper cart. Picked up every week on trash day.</p></div>'+
    '<div class="panel"><h3>Yard trim</h3><p>Leaves, grass and small brush, every week, all year. Use paper yard bags or a reusable can marked for yard trim. No plastic bags. Keep each bag under 45 pounds and tie brush in bundles no more than 30 inches across.</p></div>'+
    '<div class="panel"><h3>Big items and scrap metal</h3><p>A couch, a mattress, an old grill: schedule a pickup with the county, up to five bulk pickups a year. Scrap metal pickups are unlimited. Book by 11:59 p.m. the night before and have it out by 7 a.m.</p><p style="margin-top:12px"><a class="btn ghost" href="https://www.montgomerycountymd.gov/bulk-trash-pick-request" target="_blank" rel="noopener">Schedule a pickup</a></p></div>'+
    '<div class="panel"><h3>Fall leaves</h3><p>The county&rsquo;s leaf vacuum trucks start in early November (November 9 this year) and make two passes, the second after Thanksgiving. Rake leaves to the edge of the street, not into the road. No plastic bags, no branches, and keep cars away from the piles.</p><p style="margin-top:12px"><a class="btn ghost" href="https://www.montgomerycountymd.gov/leafing" target="_blank" rel="noopener">Check our street&rsquo;s dates</a></p></div>'+
    '</div>'+
    '<h2>Snow</h2><div class="panel"><p>County law gives every owner 24 hours after the snow stops to clear the sidewalk in front of the home. If a plow pushes snow back, you get another 24 hours. Keep three feet clear around a fire hydrant if one is near you, and please check on a neighbor who cannot shovel. The county&rsquo;s <a href="https://www.montgomerycountymd.gov/snow/" target="_blank" rel="noopener">winter storm page</a> shows when our streets are plowed.</p></div>'+
    '<h2>Who to call</h2><div class="calls">'+
    [['Emergency','911','Fire, police, ambulance. A downed power line counts.'],['County help (MC311)','311','Potholes, missed pickups, street signs. From a cell outside the county: 240-777-0311.'],['Power out (Pepco)','877-737-2662','Or text OUT to 48710. Stay away from any downed wire.'],['Water or sewer (WSSC Water)','301-206-4002','Main breaks and sewer backups, any hour.'],['Gas smell (Washington Gas)','844-927-4427','Leave the house first, then call. Or call 911.'],['Police, not an emergency','301-279-8000','Something odd, but nobody is in danger.']].map(function(c){ return '<div class="call"><span>'+c[0]+'</span><b>'+c[1]+'</b><small>'+c[2]+'</small></div>'; }).join('')+
    '</div><p class="fine">Checked against Montgomery County, WSSC Water, Pepco and Washington Gas pages in November 2026. If a county page says something different, the county page is right.</p>';
    var f=$('rem-signup'); if(f) f.addEventListener('submit',function(e){ e.preventDefault(); var to=$('rem-to').value.trim(), m=$('rem-signup-msg'); if(!to){ m.textContent='Type an email or a mobile number first.'; return; }
      try{ localStorage.setItem('hoa-rem',JSON.stringify({to:to,what:[].slice.call(f.querySelectorAll('[name=r]:checked')).map(function(x){ return x.value; })})); }catch(x){}
      m.textContent='Saved on this device. This is a preview, so no messages are sent yet.'; });
  }

  /* ---------------- SEASONAL GUIDES ---------------- */
  var SEASONS=[
   {months:[10,11],name:'November and December',title:'It&rsquo;s getting cold',hello:'Hi everybody. The leaves are down and the first hard freezes are on the way. A few small things now save a big mess later.',tips:[
     ['Going away over the holidays?','Please feel free to let a neighbor you trust know, or tell someone on the board. You never have to. But if a pipe freezes or a package piles up, it helps to have someone who can call you.','Neighbor to neighbor'],
     ['Leave the heat on','Keep the house at 55 degrees or warmer while you are gone, especially where the water meter and pipes are. A frozen pipe costs far more than the heat.','WSSC Water'],
     ['Shut off the outdoor spigots','Turn off the valve inside the house that feeds each outdoor faucet, disconnect the hoses, and let the line drain.','WSSC Water'],
     ['Find your main water valve','If a pipe breaks, that valve stops the flood. Find it now, while nothing is wrong, and show everyone in the house.','WSSC Water'],
     ['Keep the bill down','Set the thermostat a few degrees lower if your health allows, and lower still when you are asleep or out. Close the fireplace damper when the fire is out.','Pepco'],
     ['Leaves to the curb','County leaf trucks come twice, starting in early November. Pile leaves at the edge of the street, not in it.','Montgomery County']]},
   {months:[0,1],name:'January and February',title:'The big freeze',hello:'Hi everybody. This is usually our coldest stretch, and the one with snow. Here is what the water and power companies ask us to do.',tips:[
     ['Let a faucet drip in a cold snap','When it is bitterly cold, leave one kitchen or bathroom faucet running at a slow trickle and open the cabinet doors under the sinks so warm air reaches the pipes.','WSSC Water'],
     ['If a pipe freezes','Open the cold tap nearest the frozen pipe all the way. Warm the pipe with a hair dryer, never a flame. If you are not sure, call a plumber.','WSSC Water'],
     ['Shovel within 24 hours','County law gives each of us 24 hours after the snow stops to clear our sidewalk. Take breaks. Shoveling is hard on the heart.','Montgomery County'],
     ['Check on each other','If you can shovel a neighbor&rsquo;s walk, or need a hand with yours, say so. That is what the neighbor news page is for.','Neighbor to neighbor'],
     ['Power out?','Call Pepco at 877-737-2662 or text OUT to 48710. Stay well away from any downed wire and assume it is live.','Pepco'],
     ['Holiday weeks','Martin Luther King Jr. Day and Presidents Day are Mondays, so our pickup moves to Wednesday those weeks.','Montgomery County']]},
   {months:[2,3],name:'March and April',title:'Spring cleanup',hello:'Hi everybody. Warmer days are here. A little spring cleaning, indoors and out.',tips:[
     ['Test your smoke alarms','The clocks change on March 14. Press the test button on every alarm while you are changing the clocks.','Fire safety'],
     ['Turn the outdoor water back on','Open the indoor valve, then watch the spigot and the pipe for a minute. A drip now means winter cracked something.','WSSC Water'],
     ['Yard trim goes out every week','Paper yard bags or a marked can, never plastic. Bundle branches no more than 30 inches across.','Montgomery County'],
     ['Clearing out the garage?','The county picks up big items by appointment, up to five times a year. Scrap metal is unlimited.','Montgomery County'],
     ['Planning a project?','A fence, paint, a deck or a new roof needs a quick review first. Send the request before you sign with a contractor.','Our rules']]},
   {months:[4,5],name:'May and June',title:'Summer is starting',hello:'Hi everybody. School is almost out and storm season is starting. A few things to set up before the heat.',tips:[
     ['Set the thermostat at 78','That is the setting Pepco suggests for hot days. Fans and closed blinds on the sunny side help more than you would think.','Pepco'],
     ['Get ready for storms','Charge phones and a flashlight when a storm is forecast. Save Pepco&rsquo;s outage number, 877-737-2662, in your phone now.','Pepco'],
     ['Heading out of town?','Feel free to let a neighbor know, and ask the post office to hold your mail.','Neighbor to neighbor'],
     ['Tip out standing water','Buckets, saucers and toys that hold water for a week breed mosquitoes.','Good practice'],
     ['Memorial Day week','The holiday is a Monday, so our pickup moves to Wednesday that week.','Montgomery County']]},
   {months:[6,7],name:'July and August',title:'Heat and thunderstorms',hello:'Hi everybody. The hottest weeks of the year. Take it easy and look out for each other.',tips:[
     ['Check on older neighbors in a heat wave','A knock on the door on a 95 degree day is a kindness.','Neighbor to neighbor'],
     ['Never go near a downed wire','After a storm, treat every wire on the ground as live. Call 911, then Pepco.','Pepco'],
     ['Water early','Water plants and new trees in the early morning, when less of it evaporates.','Good practice'],
     ['Independence Day','July 4 falls on a weekend in 2027, so our pickup does not change.','Montgomery County']]},
   {months:[8,9],name:'September and October',title:'Leaves are coming',hello:'Hi everybody. Cooler mornings, and the first leaves. A good time to get the house ready for winter.',tips:[
     ['Have the furnace looked at','Before the first cold night, not during it.','Good practice'],
     ['Clean the gutters after the leaves fall','Clogged gutters send water where you do not want it.','Good practice'],
     ['Bag early leaves','Until the county&rsquo;s leaf trucks start in November, leaves go out with yard trim in paper bags.','Montgomery County'],
     ['Labor Day week','The holiday is a Monday, so our pickup moves to Wednesday that week.','Montgomery County'],
     ['Annual meeting is in December','Watch the calendar for the date. Proxy forms are with the documents if you cannot come.','Our bylaws']]}
  ];
  function seasonFor(m){ for(var i=0;i<SEASONS.length;i++) if(SEASONS[i].months.indexOf(m)>-1) return SEASONS[i]; return SEASONS[0]; }
  function tipsHtml(s,limit){ return s.tips.slice(0,limit||99).map(function(t){ return '<div class="fact"><h3>'+t[0]+'</h3><p>'+t[1]+' <span class="src">'+t[2]+'</span></p></div>'; }).join(''); }

  /* ---------------- NEIGHBOR NEWS ---------------- */
  var KIND={good:'Good news',heads:'Heads up',found:'Lost or found',other:'Note'};
  var SAMPLE=[
    {kind:'good',text:'A baby girl arrived on our street last week. Mom, dad and big brother are all doing well. Welcome to the neighborhood, little one.',who:'A proud neighbor',date:'2026-11-05',sample:true},
    {kind:'heads',text:'A fox has been out near the common area around dusk the last few evenings. It keeps its distance, but keep small pets close.',who:'',date:'2026-11-03',sample:true},
    {kind:'heads',text:'Someone was trying car door handles around 10 p.m. on Thursday. Please lock your cars. It was reported to the police non-emergency line.',who:'',date:'2026-10-30',sample:true},
    {kind:'found',text:'Found a set of keys with a blue tag by the mailboxes. Tell the board what is on the tag and they are yours.',who:'',date:'2026-10-27',sample:true}
  ];
  function store(){ try{ return JSON.parse(localStorage.getItem('hoa-nb')||'{"pending":[],"approved":[]}'); }catch(e){ return {pending:[],approved:[]}; } }
  function keep(s){ try{ localStorage.setItem('hoa-nb',JSON.stringify(s)); }catch(e){} }
  function posts(){ return store().approved.concat(SAMPLE); }
  function postHtml(p,extra){ var d=D(p.date); return '<article class="notice post '+p.kind+'"><time>'+MON[d.getMonth()]+' '+d.getDate()+'</time><h3><span class="tag '+p.kind+'">'+KIND[p.kind]+'</span>'+(p.sample?'<span class="tag sample">Sample</span>':'')+'</h3><p>'+esc(p.text)+'</p>'+(p.who?'<p class="who">'+esc(p.who)+'</p>':'')+(extra||'')+'</article>'; }
  function drawNeighbors(){
    var box=$('nb-body'); if(!box) return; var s=store();
    box.innerHTML='<div class="grid2"><div><h2 style="margin-top:0">From your neighbors</h2><div id="nb-list">'+
      s.pending.map(function(p){ return postHtml(p,'<p class="fine">Waiting for a board member to read it. Only you can see this for now.</p>'); }).join('')+
      posts().map(function(p){ return postHtml(p); }).join('')+'</div></div>'+
      '<form class="panel" id="nb-form"><h2 style="margin-top:0;font-size:1.45rem">Share something</h2><p style="color:var(--muted);font-size:.98rem;margin-bottom:12px">A new baby, a graduation, a thank-you, a fox on the loose, a lost cat. The board would love to post it.</p>'+
      '<div class="kinds">'+Object.keys(KIND).map(function(k,i){ return '<input type="radio" name="kind" id="nb-k-'+k+'" value="'+k+'"'+(i?'':' checked')+'><label for="nb-k-'+k+'">'+KIND[k]+'</label>'; }).join('')+'</div>'+
      '<div class="field"><label for="nb-text">What would you like to share?</label><textarea id="nb-text" placeholder="A sentence or two is plenty."></textarea></div>'+
      '<div class="field"><label for="nb-who">Your name (optional)</label><input id="nb-who" autocomplete="name" placeholder="Leave empty to stay anonymous"></div>'+
      '<button class="btn accent" type="submit">Send to the board</button><p class="fine" id="nb-msg" aria-live="polite"></p>'+
      '<p class="fine">A board member reads every note before it appears, so nothing unkind gets posted. If someone is in danger, call <b>911</b>. For something odd that is not an emergency, the police line is <b>301-279-8000</b>.</p></form></div>';
    $('nb-form').addEventListener('submit',function(e){ e.preventDefault(); var t=$('nb-text').value.trim(), m=$('nb-msg'); if(!t){ m.textContent='Write a sentence first.'; return; }
      var s=store(); s.pending.unshift({kind:(e.target.querySelector('[name=kind]:checked')||{}).value||'other',text:t.slice(0,600),who:$('nb-who').value.trim().slice(0,60),date:key(TODAY),id:Date.now()}); keep(s); drawNeighbors(); drawBoardNews(); fill();
      $('nb-msg').innerHTML='Thank you. It is waiting for a board member. In this preview it stays on this device; to really send it, email it to <b class="sel">'+BOARD_EMAIL+'</b>.'; });
  }
  /* the board's side: approve or remove, inside the board tools on My home */
  function drawBoardNews(){
    var host=$('me-board'); if(!host) return; var box=$('b-news');
    if(!box){ box=document.createElement('div'); box.className='panel'; box.id='b-news'; box.style.marginTop='16px'; host.appendChild(box); }
    var s=store(), wait=s.pending.length?s.pending:[{kind:'good',text:'Our daughter made the honor roll this term. We are so proud of her.',who:'A sample note',date:key(TODAY),id:'demo',sample:true}];
    box.innerHTML='<h3>Neighbor notes waiting</h3>'+wait.map(function(p){ return '<div class="b-row" data-nb="'+p.id+'"><div><b>'+KIND[p.kind]+'</b>'+(p.who?' &middot; '+esc(p.who):'')+'<br><small style="color:var(--muted)">'+esc(p.text)+'</small></div><div style="display:flex;gap:6px"><button class="btn" type="button" data-nb-ok>Post it</button><button class="btn ghost" type="button" data-nb-no>Remove</button></div></div>'; }).join('')+'<p class="fine">Posting puts the note on the Neighbor news page and into the next newsletter.</p>';
  }
  document.addEventListener('click',function(e){ var b=e.target.closest('[data-nb-ok],[data-nb-no]'); if(!b) return; var id=b.closest('[data-nb]').getAttribute('data-nb'), s=store(), i=-1;
    s.pending.forEach(function(p,n){ if(String(p.id)===id) i=n; });
    if(i>-1){ var p=s.pending.splice(i,1)[0]; if(b.hasAttribute('data-nb-ok')) s.approved.unshift(p); keep(s); drawNeighbors(); drawBoardNews(); drawNewsletter(); fill(); }
    else { b.closest('[data-nb]').innerHTML='<small style="color:var(--muted)">'+(b.hasAttribute('data-nb-ok')?'Posted (sample).':'Removed (sample).')+'</small>'; } });

  /* ---------------- NEWSLETTER: builds itself for any month ---------------- */
  var nlY=TODAY.getFullYear(), nlM=TODAY.getMonth();
  function newsletter(y,m){
    var s=seasonFor(m), ev=monthEvents(y,m), pk=pickupsIn(y,m), moved=Object.keys(pk).filter(function(k){ return pk[k].holiday; });
    var mine=posts().filter(function(p){ var d=D(p.date); return y===TODAY.getFullYear()&&m===TODAY.getMonth()?d>=addDays(TODAY,-35):false; }).slice(0,3);
    return '<article class="nl"><header><span class="nl-name">The Orange Peel</span><span class="nl-date">'+MON[m]+' '+y+'</span></header>'+
      '<h2>'+s.title+'</h2><p class="nl-hi">'+s.hello+'</p>'+
      '<h3>Dates this month</h3>'+(ev.length?'<ul class="plain">'+ev.map(function(e){ return '<li><b>'+nice(e.date)+':</b> '+e.title+'. '+e.text.replace(/<a .*?<\/a>/g,'')+'</li>'; }).join('')+'</ul>':'<p>No special dates. The board meets this month; watch your email for the day.</p>')+
      '<h3>Trash and recycling</h3><p>Every Tuesday, at the curb by 7 a.m.'+(moved.length?' One change: pickup on <b>'+moved.map(function(k){ return nice(pk[k].date); }).join(' and ')+'</b> because of the holiday.':' No holiday changes this month.')+'</p>'+
      '<h3>Around the house</h3>'+tipsHtml(s,3)+
      (mine.length?'<h3>Neighbor news</h3>'+mine.map(function(p){ return '<p><b>'+KIND[p.kind]+':</b> '+esc(p.text)+(p.sample?' <span class="tag sample">Sample</span>':'')+'</p>'; }).join(''):'<h3>Neighbor news</h3><p>Have something to share? Send it in on the Neighbor news page and it will run here.</p>')+
      '<footer>The Orange&rsquo;s Homeowners Association &middot; P.O. Box 613, Silver Spring, MD 20918-0613 &middot; '+BOARD_EMAIL+'</footer></article>';
  }
  function drawNewsletter(){
    var box=$('nl-body'); if(!box) return; var chips='', y=TODAY.getFullYear(), m=TODAY.getMonth();
    for(var i=0;i<12;i++){ var mm=(m+i)%12, yy=y+Math.floor((m+i)/12); chips+='<button type="button" class="nl-m'+(mm===nlM&&yy===nlY?' on':'')+'" data-y="'+yy+'" data-m="'+mm+'">'+MO3[mm]+'</button>'; }
    var s=seasonFor(nlM);
    box.innerHTML='<div class="nl-pick" role="group" aria-label="Pick a month">'+chips+'</div>'+newsletter(nlY,nlM)+
      '<div class="panel auto"><h3>How this writes itself</h3><ul class="plain"><li><b>Dates</b> come from the calendar.</li><li><b>Trash changes</b> are worked out from the county&rsquo;s holiday list.</li><li><b>Around the house</b> rotates through the seasonal guide below, year after year.</li><li><b>Neighbor news</b> is whatever the board approved that month.</li></ul><p>On the first of the month a board member reads it over and presses Send. Nobody has to write it.</p></div>'+
      '<h2 id="season-guides">Seasonal guides</h2><p class="lead" style="margin-bottom:20px">Six short guides, two months each. The one for right now is open.</p>'+
      SEASONS.map(function(g){ var now=g===seasonFor(TODAY.getMonth()); return '<details class="season"'+(now?' open':'')+'><summary><span>'+g.name+'</span><b>'+g.title+'</b></summary><p class="nl-hi">'+g.hello+'</p>'+tipsHtml(g)+'</details>'; }).join('');
  }
  document.addEventListener('click',function(e){ var b=e.target.closest('.nl-m'); if(!b) return; nlY=+b.getAttribute('data-y'); nlM=+b.getAttribute('data-m'); drawNewsletter(); });

  /* ---------------- home screens: small live facts ---------------- */
  function fill(){
    var np=nextPickup(TODAY), mt=nextMeeting(), latest=posts()[0], s=seasonFor(TODAY.getMonth());
    var trash='<h3>'+nice(np.date)+'</h3><p>Trash, recycling and yard trim. At the curb by 7 a.m.'+(np.holiday?' Moved a day for '+np.holiday.name+'.':'')+'</p>';
    var meet=mt?'<h3>'+mt.title+'</h3><p>'+nice(D(mt.date))+', '+mt.time.replace(/\.$/,'')+'. '+mt.where+'.</p>':'<h3>Board meeting</h3><p>Monthly. The date goes out by email.</p>';
    document.querySelectorAll('[data-fill="trash"]').forEach(function(el){ el.innerHTML=trash; });
    document.querySelectorAll('#home-event,[data-fill="meeting"]').forEach(function(el){ el.innerHTML=meet; });
    document.querySelectorAll('[data-fill="when"]').forEach(function(el){ el.innerHTML=mt?'<h3>'+nice(D(mt.date))+'</h3><p>'+mt.title+', '+mt.time.replace(/\.$/,'')+'. '+mt.where+'.</p>':'<h3>Monthly</h3><p>Board meeting. The date goes out by email.</p>'; });
    document.querySelectorAll('[data-fill="neighbor"]').forEach(function(el){ el.innerHTML='<h3>'+KIND[latest.kind]+'</h3><p>'+esc(latest.text.slice(0,120))+(latest.text.length>120?'&hellip;':'')+'</p>'; });
    document.querySelectorAll('[data-fill="newsletter"]').forEach(function(el){ el.innerHTML='<h3>'+MON[TODAY.getMonth()]+': '+s.title+'</h3><p>'+s.tips[0][0].replace(/\?$/,'')+'. '+s.tips[1][0]+'. And more.</p>'; });
    document.querySelectorAll('[data-fill="week"]').forEach(function(el){ el.innerHTML='<b>Next trash day:</b> '+nice(np.date)+'.'+(mt?' <b>Next meeting:</b> '+nice(D(mt.date))+', 7 p.m.':''); });
  }

  /* ---------------- a pointer to the Look button, once ---------------- */
  function lookHint(){
    var skin=document.querySelector('.hubbar .skin'), tip=document.querySelector('.hubtip'); if(!skin) return;
    var seen=false; try{ seen=localStorage.getItem('hoa-look')==='1'; }catch(e){} if(seen) return;
    var h=document.createElement('div'); h.className='lookhint'; h.innerHTML='Try a different look';
    function show(){ if(!h.parentNode) skin.appendChild(h); }
    function done(){ h.remove(); try{ localStorage.setItem('hoa-look','1'); }catch(e){} }
    if(tip&&!tip.hidden){ tip.querySelector('button').addEventListener('click',show); } else show();
    skin.querySelector('.skin-btn').addEventListener('click',done); h.addEventListener('click',function(e){ e.stopPropagation(); done(); });
  }

  /* ---------------- a little more motion ---------------- */
  function motion(){
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce||!(window.HOA&&HOA.motionWanted&&HOA.motionWanted())||!('IntersectionObserver' in window)) return;
    root.classList.add('mo');
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); },{rootMargin:'0px 0px -6% 0px'});
    function watch(){ document.querySelectorAll('.card,.tile,.jump-grid a,.page .panel,.page .event,.page .notice,.page .fact,.call,.season,.nl').forEach(function(el,i){ if(el.classList.contains('rv')) return; var r=el.getBoundingClientRect(); if(r.top<window.innerHeight*0.92&&r.height>0){ return; } el.classList.add('rv'); el.style.setProperty('--d',(i%4)*60+'ms'); io.observe(el); }); }
    watch(); window.addEventListener('hashchange',function(){ setTimeout(watch,60); });
    setTimeout(function(){ document.querySelectorAll('.rv:not(.in)').forEach(function(el){ var r=el.getBoundingClientRect(); if(r.top<window.innerHeight) el.classList.add('in'); }); },1200);
  }

  /* search results that land inside a closed seasonal guide open it first */
  if(window.HOA&&HOA.flash){ var _flash=HOA.flash; HOA.flash=function(id){ var el=id&&$(id), d=el&&el.closest&&el.closest('details'); if(d) d.open=true; _flash(id); }; }

  /* email buttons do not open in every browser, so the address is always written out next to them */
  function mailNotes(){ document.querySelectorAll('a.btn[href^="mailto:"]').forEach(function(a){ if(a.nextElementSibling&&a.nextElementSibling.classList.contains('mailnote')) return; var n=document.createElement('span'); n.className='mailnote'; n.innerHTML='If nothing opens, write to <b class="sel">'+BOARD_EMAIL+'</b>'; a.insertAdjacentElement('afterend',n); }); }
  mailNotes();
  /* ---------------- EMAIL TO WEBSITE ----------------
     On the live site the board forwards an email (or drags it onto the "Website" label in Gmail) and a
     small script adds it to the News sheet, which this site reads. Here the same thing can be tried by
     hand: paste or drop an email, check the post, and put it on the site. In this preview it is kept on
     this device only. */
  var MONRE='(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec)';
  function inbox(){ try{ return JSON.parse(localStorage.getItem('hoa-inbox')||'[]'); }catch(e){ return []; } }
  function keepInbox(a){ try{ localStorage.setItem('hoa-inbox',JSON.stringify(a)); }catch(e){} }
  function readEmail(raw){
    var t=String(raw||'').replace(/\r\n?/g,'\n');
    t=t.replace(/=\?[^?\s]+\?([QqBb])\?([^?\s]*)\?=/g,function(m,k,v){ try{ return /q/i.test(k)?decodeURIComponent(v.replace(/_/g,' ').replace(/%/g,'%25').replace(/=([0-9A-F]{2})/gi,'%$1')):decodeURIComponent(escape(atob(v))); }catch(e){ return ''; } });
    var sub=(/^Subject:[ \t]*(.+)$/mi.exec(t)||[])[1]||'';
    var bd=/boundary="?([^"\n;]+)"?/i.exec(t);
    if(bd&&/^Content-Type:/mi.test(t)){                      // a saved .eml file: keep the plain-text part
      var plain=''; t.split('--'+bd[1]).forEach(function(p){ var i=p.indexOf('\n\n'); if(plain||i<0||!/Content-Type:\s*text\/plain/i.test(p.slice(0,i))) return; plain=p.slice(i+2);
        if(/quoted-printable/i.test(p.slice(0,i))){ var q=plain.replace(/=\n/g,'').replace(/%/g,'%25').replace(/=([0-9A-F]{2})/gi,'%$1'); try{ plain=decodeURIComponent(q); }catch(e){ plain=plain.replace(/=\n/g,''); } } });
      if(plain) t=(sub?'Subject: '+sub+'\n\n':'')+plain;
    } else if(/^(Received|MIME-Version|Message-ID):/mi.test(t)){ var cut0=t.indexOf('\n\n'); if(cut0>-1) t=(sub?'Subject: '+sub+'\n\n':'')+t.slice(cut0+2); }
    var lines=t.split('\n').map(function(l){ return l.replace(/^>+\s?/,'').trim(); }), title='';
    lines=lines.filter(function(l){ var m=/^Subject:\s*(.+)$/i.exec(l); if(m){ if(!title) title=m[1]; return false; }
      return !/^(-{3,}.*(forwarded|original) message.*-{3,}|begin forwarded message:|(from|to|cc|bcc|date|sent|reply-to):.*)$/i.test(l); });
    while(lines.length&&!lines[0]) lines.shift();
    if(!title&&lines.length&&lines[0].length<=90) title=lines.shift();
    title=(title||'A note from the board').replace(/^((fwd?|fw|re)\s*:\s*)+/i,'').trim();
    var end=-1; lines.forEach(function(l,i){ if(end<0&&i>0&&/^(--|sent from my .*|thanks[,!.]?|thank you[,!.]?|best[,.]?|regards[,.]?|sincerely[,.]?)$/i.test(l)) end=i; }); if(end>0) lines=lines.slice(0,end);
    var text=lines.join('\n').replace(/\n{3,}/g,'\n\n').replace(/^(hi|hello|dear)\b[^\n]{0,40}\n+/i,'').trim().replace(/\s*\n\s*/g,' ').slice(0,700);
    var when='', m=new RegExp('\\b'+MONRE+'\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?','i').exec(title);   // a date in the subject line makes it a calendar event
    if(m){ var mi=MO3.map(function(x){ return x.toLowerCase(); }).indexOf(m[1].slice(0,3).toLowerCase()), d=new Date(m[3]?+m[3]:TODAY.getFullYear(),mi,+m[2]);
      if(!m[3]&&d<TODAY) d.setFullYear(d.getFullYear()+1); if(mi>-1&&d>=TODAY&&d.getDate()===+m[2]) when=key(d); }
    return {title:title.slice(0,110),text:text,when:when};
  }
  var homeNews0=null;
  function drawPosted(){
    var list=inbox(), host=$('news-list'), hn=$('home-news');
    if(host){ host.querySelectorAll('.from-email').forEach(function(a){ a.remove(); });
      host.insertAdjacentHTML('afterbegin',list.map(function(p){ var d=D(p.date); return '<article class="notice from-email"><time datetime="'+p.date+'">'+MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+'</time><h3>'+esc(p.title)+'</h3><p>'+esc(p.text)+(p.when?' <b>'+nice(D(p.when))+'.</b>':'')+'</p></article>'; }).join('')); }
    if(hn){ if(homeNews0===null) homeNews0=hn.innerHTML; hn.innerHTML=list.length?'<h3>'+esc(list[0].title)+'</h3><p>'+esc(list[0].text.slice(0,160))+(list[0].text.length>160?'&hellip;':'')+'</p>':homeNews0; }
    if(list.length){ var d0=D(list[0].date); document.querySelectorAll('.updated').forEach(function(u){ u.textContent='Site last updated: '+MON[d0.getMonth()]+' '+d0.getDate()+', '+d0.getFullYear(); }); }
  }
  var SAMPLE_MAIL='Subject: Fwd: Winter reminder about parking on snow days\n\n---------- Forwarded message ---------\nFrom: The board\nDate: Mon, Nov 16, 2026\n\nHi neighbors,\n\nThis is a made-up email, to show how this works. When snow is in the forecast, please move cars off the street so the plow can get through. The board will talk about it at the meeting on December 16.\n\nThanks,\nThe board';
  function drawInbox(){
    var host=$('me-board'); if(!host) return; var box=$('b-inbox');
    if(!box){ box=document.createElement('div'); box.className='panel inb'; box.id='b-inbox'; box.style.marginBottom='16px'; var g=host.querySelector('.grid2'); host.insertBefore(box,g||null);
      box.innerHTML='<h3>Put an email on the website</h3><p>On the live site there is nothing to open. Forward the email to the website address, or drag it onto the <b>Website</b> label in the board&rsquo;s Gmail, and it appears on the home page and under Announcements within ten minutes. Try it here: paste an email below, or drop one into the box.</p>'+
        '<label for="inb-text">The email</label><textarea id="inb-text" rows="6" placeholder="Paste the email here, subject line first. Or drag an email into this box."></textarea>'+
        '<p class="btnrow"><button class="btn accent" type="button" id="inb-go">Turn it into a post</button><button class="btn ghost" type="button" id="inb-sample">Use a sample email</button></p><div id="inb-out" aria-live="polite"></div><div id="inb-list"></div>';
      var ta=$('inb-text');
      ta.addEventListener('dragover',function(e){ e.preventDefault(); ta.classList.add('over'); });
      ta.addEventListener('dragleave',function(){ ta.classList.remove('over'); });
      ta.addEventListener('drop',function(e){ e.preventDefault(); ta.classList.remove('over'); var dt=e.dataTransfer, f=dt.files&&dt.files[0];
        if(f){ var r=new FileReader(); r.onload=function(){ ta.value=String(r.result); preview(); }; r.readAsText(f); } else { ta.value=dt.getData('text/plain')||''; preview(); } });
      box.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b) return;
        if(b.id==='inb-sample'){ ta.value=SAMPLE_MAIL; preview(); }
        if(b.id==='inb-go') preview();
        if(b.id==='inb-no'){ $('inb-out').innerHTML=''; }
        if(b.id==='inb-post'){ var t=$('inb-title').value.trim(), x=$('inb-body').value.trim(); if(!t){ $('inb-title').focus(); return; }
          var a=inbox(); a.unshift({id:Date.now(),date:key(TODAY),title:t.slice(0,110),text:x.slice(0,700),when:$('inb-when').value||''}); keepInbox(a); ta.value='';
          $('inb-out').innerHTML='<p class="fine"><b>Posted.</b> It is on the home page and under Announcements'+(a[0].when?', and on the calendar on '+nice(D(a[0].when)):'')+'. In this preview it is saved on this device only.</p>'; refresh(); }
        if(b.hasAttribute('data-inb-del')){ var id=b.getAttribute('data-inb-del'); keepInbox(inbox().filter(function(p){ return String(p.id)!==id; })); refresh(); } });
    }
    var list=inbox();
    $('inb-list').innerHTML=list.length?'<h3 style="margin-top:18px">On the website from email</h3>'+list.map(function(p){ return '<div class="b-row"><div><b>'+esc(p.title)+'</b><br><small style="color:var(--muted)">'+esc(p.text.slice(0,120))+(p.text.length>120?'&hellip;':'')+'</small></div><div><button class="btn ghost" type="button" data-inb-del="'+p.id+'">Take it down</button></div></div>'; }).join(''):'';
    function refresh(){ drawPosted(); drawCal(); drawInbox(); }
    function preview(){ var raw=$('inb-text').value; if(!raw.trim()){ $('inb-out').innerHTML='<p class="fine">Paste or drop an email first.</p>'; return; } var p=readEmail(raw);
      $('inb-out').innerHTML='<div class="inb-card"><p class="fine" style="margin:0 0 6px">This is what neighbors would see. Change anything, then post it.</p><label for="inb-title">Headline</label><input id="inb-title" type="text" maxlength="110" value="'+esc(p.title)+'">'+
        '<label for="inb-body">What it says</label><textarea id="inb-body" rows="5" maxlength="700">'+esc(p.text)+'</textarea>'+
        '<label for="inb-when">Is it an event? Pick the day and it goes on the calendar too. Leave empty if not. A date in the subject line fills this in.</label><input id="inb-when" type="date" value="'+p.when+'">'+
        '<p class="btnrow"><button class="btn accent" type="button" id="inb-post">Post it to the website</button><button class="btn ghost" type="button" id="inb-no">Throw it away</button></p></div>'; }
  }
  window.HOA_READ_EMAIL=readEmail;

  drawCal(); drawCounty(); drawNeighbors(); drawNewsletter(); drawInbox(); drawBoardNews(); drawPosted(); fill(); motion();
})();
