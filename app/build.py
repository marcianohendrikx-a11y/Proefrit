"""Bouwt de echte app (gebruik: python3 app/build.py) (web/index.html) uit de prototypebestanden plus de koppeling met de backend.
Elke vervanging controleert dat de oorspronkelijke tekst precies gevonden wordt."""
import re, json, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'app', 'src') + '/'
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'web', 'index.html')
cfg = open(os.path.join(ROOT, 'web', 'config.js')).read()
URL = re.search(r'SUPABASE_URL = "([^"]+)"', cfg).group(1)
KEY = re.search(r'SUPABASE_ANON_KEY = "([^"]+)"', cfg).group(1)

head = open(P + 'head8.html').read()
logic = open(P + 'logic8.js').read()
core = open(P + 'live_core.js').read()

def rep(src, old, new, n=1):
    c = src.count(old)
    assert c == n, (c, old[:120])
    return src.replace(old, new)

def span_fn(src, name):
    m = re.search(r'\n(async )?function ' + re.escape(name) + r'\(', src)
    assert m, name
    s = m.start() + 1
    e = src.index('\n}\n', s) + 2
    return s, e

def repfn(src, name, new):
    s, e = span_fn(src, name)
    return src[:s] + new.strip('\n') + src[e:]

def repblock(src, start, new):
    assert src.count(start) == 1, start
    s = src.index(start)
    e = src.index('\n});\n', s) + 4
    return src[:s] + new.strip('\n') + src[e:]

L = logic

# ---------- Geen voorbeeldleden en voorbeeldreviews; alles komt uit de database ----------
L = rep(L, "const NOW=Date.now();\nSEED.forEach(", "SEED.length=0;Object.keys(MEMBERS).forEach(k=>delete MEMBERS[k]);\nconst NOW=Date.now();\nSEED.forEach(")
# opslag alleen in het geheugen (de sessie staat apart)
s = L.index("try{\n  const raw=localStorage.getItem(KEY);")
e = L.index("function save(){")
L = L[:s] + L[e:]
L = rep(L, "function save(){try{localStorage.setItem(KEY,JSON.stringify(store))}catch(e){}}", "function save(){}")
L = rep(L, "const ageText=p=>p.vis.age==='band'&&p.birthYear?ageBand(p.birthYear)+' jaar':'';",
        "const ageText=p=>p.vis.age!=='band'?'':p.ageBand?p.ageBand.replace('-','–')+' jaar':p.birthYear?ageBand(p.birthYear)+' jaar':'';")
L = rep(L, "return a&&/^data:image\\//.test(a)?", "return a&&/^(data:image\\/|https:\\/\\/)/.test(a)?")
L = rep(L, "if(p.vis.exp!=='shown')return '';", "if(p.vis.exp!=='shown')return '';if(p.licenseSince===''&&!p.kmYear)return '';")

# ---------- Feed ----------
L = rep(L, '<div class="notice">Dit is een prototype met voorbeeldleden en voorbeeldreviews. Wat je zelf plaatst blijft bewaard in deze browser.</div>\n  <div class="list">${all().filter(r=>!view.feedVer||isVer(r)).map(reviewCard).join(\'\')}</div>`;',
        '<div class="list">${!LV.loaded?\'<div class="empty">Check-ins laden…</div>\':LV.loadErr?`<div class="empty">Laden lukte niet: ${esc(LV.loadErr)} <button class="plain" data-act="reload">Opnieuw proberen</button></div>`:(all().filter(r=>!view.feedVer||isVer(r)).map(reviewCard).join(\'\')||`<div class="empty">${view.feedVer?\'Nog geen geverifieerde check-ins.\':\'Nog geen check-ins. Reed je onlangs een auto? Plaats de eerste met de gele knop.\'}</div>`)}</div>`;')

# ---------- Kenteken: echte RDW via de serverfunctie ----------
L = rep(L, "function rdwAutofill(p){\n", "function rdwAutofill(p){return rdwAutofillLive(p);\n")
L = rep(L, "async function showProof(p){\n", "async function showProof(p){return showProofLive(p);\n")
L = rep(L, "\n  <details class=\"demoplates\">", "\n  <details class=\"demoplates\" hidden>")
L = rep(L, "<p class=\"hint\">Claude leest het kenteken op de foto en vergelijkt het met wat je invulde. We controleren ook of de foto al is gebruikt en van rond de ritdatum is. De foto zelf wordt niet opgeslagen, tenzij je kiest om hem bij de auto te delen. Staat het kenteken nog niet ingevuld, dan vullen we het in vanaf de foto.</p>",
        "<p class=\"hint\">Bij het plaatsen leest Claude het kenteken op de foto en vergelijkt het met wat je invulde. We controleren ook of de foto al is gebruikt en van rond de ritdatum is. De foto zelf wordt niet opgeslagen, tenzij je kiest om hem bij de auto te delen.</p>")

# ---------- Chat ----------
L = repfn(L, 'chatsOf', "function chatsOf(){const m=me();if(!store.chats[m])store.chats[m]={};return store.chats[m]}")
L = rep(L, "<div class=\"row\"><button class=\"ghost sm\" data-act=\"simaccept\" data-user=\"${n}\">Prototype: laat ${n} akkoord geven</button><button class=\"plain\" data-act=\"withdraw\" data-user=\"${n}\">Verzoek intrekken</button></div>",
        "<div class=\"row\"><button class=\"plain\" data-act=\"withdraw\" data-user=\"${n}\">Verzoek intrekken</button></div>")
L = rep(L, "  else if(r.state==='blocked')banner=",
        "  else if(r.state==='closed')banner=`<div class=\"banner\"><b>Dit gesprek is gesloten.</b> Je kunt ${n} geen berichten meer sturen.</div>`;\n  else if(r.state==='blocked')banner=")
L = rep(L, "${closed||r.state==='blocked'||r.state==='in'?'':", "${closed||r.state==='blocked'||r.state==='closed'||r.state==='in'?'':")

# ---------- Inloggen ----------
L = repfn(L, 'logout', "function logout(){view={...view,name:'feed',user:null,chat:null};window.scrollTo(0,0);signOut(false)}")
L = repblock(L, "$('authform').addEventListener('submit',async e=>{", r"""
$('authform').addEventListener('submit',async e=>{
  e.preventDefault();
  const err=$('a-err'),pw=$('a-pw').value,btn=$('authsubmit');err.textContent='';
  try{
    btn.disabled=true;
    if(authMode==='in'){
      const id=$('a-login').value.trim();
      if(!id||!pw){err.textContent='Vul je e-mailadres en je wachtwoord in.';return}
      if(!id.includes('@')){err.textContent='Log in met je e-mailadres.';return}
      const j=await authPost('token?grant_type=password',{email:id,password:pw});
      sessSave(normSess(j));
      if(adlg.open)adlg.close();
      await afterAuth();return;
    }
    const name=$('a-name').value.trim(),email=$('a-email').value.trim(),by=+$('a-birth').value;
    const bad=validName(name);if(bad){err.textContent=bad;return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='Vul een geldig e-mailadres in.';return}
    if(!by){err.textContent='Kies je geboortejaar.';return}
    if(YEAR-by<MIN_AGE){err.textContent=`Je moet minstens ${MIN_AGE} jaar zijn om een account te maken. Rondkijken kan wel zonder account.`;return}
    if(pw.length<8){err.textContent='Kies een wachtwoord van minstens 8 tekens.';return}
    const taken=await rest('GET','profile_names?select=id&username=ilike.'+encodeURIComponent(likeEsc(name)));
    if(taken&&taken.length){err.textContent='Deze gebruikersnaam is al in gebruik. Kies een andere.';return}
    try{localStorage.setItem(PENDING_KEY,JSON.stringify({username:name,birth_year:by}))}catch(x){}
    const j=await authPost('signup?redirect_to='+encodeURIComponent(appUrl()),{email,password:pw});
    if(j.access_token){sessSave(normSess(j));if(adlg.open)adlg.close();await afterAuth();return}
    err.innerHTML='';
    $('a-ok').hidden=false;$('a-ok').innerHTML=`<b>Bijna klaar.</b> We stuurden een mail naar ${esc(email)}. Klik op de link in die mail om je account te bevestigen; daarna ben je meteen ingelogd. Geen mail gezien? Kijk ook in je spam.`;
  }catch(ex){err.textContent=ex.message}
  finally{btn.disabled=false}
});
""")
L = rep(L, "  $('soc-note').hidden=true;$('authform').reset();setAuthMode(mode||'in');",
        "  $('soc-note').hidden=true;$('a-ok').hidden=true;$('authform').reset();setAuthMode(mode||'in');")
L = rep(L, "  $('a-err').textContent='';\n}", "  $('a-err').textContent='';$('a-ok').hidden=true;\n}")

# ---------- Profiel en garage ----------
L = repfn(L, 'commitDraft', """function commitDraft(){
  const d=ob.draft;
  return saveProfileLive(d);
}""")
L = repblock(L, "$('oform').addEventListener('submit',e=>{", r"""
$('oform').addEventListener('submit',async e=>{
  e.preventDefault();
  if(!collectStep())return;
  const btn=$('obnext');btn.disabled=true;
  try{await commitDraft()}catch(ex){$('ob-err').textContent=ex.message;return}
  finally{btn.disabled=false}
  if(ob.step<3){ob.step++;renderOb();odlg.scrollTop=0;return}
  ob.done=true;odlg.close();
});
""")
L = rep(L, "  saveProfile(m,{onboarded:true});\n  renderAcct();", "  saveProfile(m,{onboarded:true});markOnboarded();\n  renderAcct();")
L = rep(L, "<p class=\"hint\">Wordt verkleind en alleen in deze browser bewaard.</p>", "<p class=\"hint\">Wordt verkleind tot een klein vierkant. Iedereen die je naam ziet, ziet ook je foto.</p>")
s, e = span_fn(L, 'garageAdd')
old = L[s:e]
cut = old.index("  const item={id:'g'+Date.now()")
L = L[:s] + old[:cut] + r"""  const ver=$('ga-ver').value,year=status==='droom'?'':$('ga-year').value,tags=status==='droom'?[]:pickVal('ga-pick');
  const raw=status==='nu'?$('ga-plate').value.trim():'';
  if(raw&&!normPlate(raw)){err.textContent='Dit kenteken lijkt niet op een Nederlands kenteken. Controleer het of laat het leeg.';return}
  const btn=document.querySelector('[data-act="gadd"]');if(btn)btn.disabled=true;
  let item,note='';
  try{
    const row=(await rest('POST','garage_items',{user_id:sbUid(),car_id:car,status,fuel,version:ver||null,year:year?+year:null,tags},'return=representation'))[0];
    item=mapGarage(row);
    if(raw){
      try{const v=await fn('garage-plate',{garage_item_id:row.id,plate:raw});
        if(v.verified){item.vp=true;if(!item.year&&v.jaar)item.year=String(v.jaar);note=' Het kenteken klopt met de RDW.'}
        else note=' Kenteken niet gecontroleerd: '+(v.reason||'onbekende reden')}
      catch(x){note=' Kenteken niet gecontroleerd: '+x.message}
    }
  }catch(x){err.textContent=x.message;return}
  finally{if(btn)btn.disabled=false}
  d.garage.push(item);saveProfile(me(),{garage:d.garage});
  $('ob-glist').innerHTML=garageEditList(d);
  pickers['ga-pick'].sel=[];pickerMount('ga-pick');
  setPicker('ga','');fillGaYears();$('ga-plate').value='';$('ga-rdw').innerHTML='';autoFilled.ga=null;
  err.textContent='';toast(`${carName(carById(car))} staat in je garage.${note}`);
}
""" + L[e:]
L = rep(L, "  else if(a==='gdel'){ob.draft.garage=ob.draft.garage.filter(g=>g.id!==t.dataset.gid);saveProfile(me(),{garage:ob.draft.garage});$('ob-glist').innerHTML=garageEditList(ob.draft)}",
        "  else if(a==='gdel'){const gid=t.dataset.gid;t.disabled=true;rest('DELETE','garage_items?id=eq.'+encodeURIComponent(gid)).then(()=>{ob.draft.garage=ob.draft.garage.filter(g=>g.id!==gid);saveProfile(me(),{garage:ob.draft.garage});$('ob-glist').innerHTML=garageEditList(ob.draft)}).catch(x=>{t.disabled=false;$('ga-err').textContent=x.message})}")
L = rep(L, "  else if(a==='obback'){if(collectStep()){commitDraft();ob.step--;renderOb()}}",
        "  else if(a==='obback'){if(collectStep()){commitDraft().catch(x=>toast(x.message));ob.step--;renderOb()}}")

# ---------- Check-in, bewijs ----------
s = L.index("  btn.disabled=true;\n  const proof=await evalProof(proofCtx('ci'));")
e = L.index("  if(shareF)sharePhotoAfter(shareF,car);\n});") + len("  if(shareF)sharePhotoAfter(shareF,car);\n});")
L = L[:s] + r"""  const m=me(),before=levelsOf(reviewsOf(m));
  const cats={};CATS.forEach(([k])=>cats[k]=+$('r-'+k).value);
  const tags=pickVal('ci-pick').slice(0,5);
  const plateRaw=$('ci-plate').value.trim(),f=$('ci-photo').files[0];
  if(plateRaw&&!normPlate(plateRaw)){err.textContent='Dit kenteken lijkt niet op een Nederlands kenteken. Controleer het of laat het veld leeg.';return}
  if(f&&!/^image\//.test(f.type)){err.textContent='De foto moet een afbeelding zijn.';return}
  const shareF=$('ci-share').checked?f:null;
  btn.disabled=true;const label=btn.textContent;btn.textContent=plateRaw||f?'Controleren en plaatsen…':'Plaatsen…';
  let res;
  try{
    res=await fn('checkin',{car_id:car,fuel,version:$('ci-ver').value||null,ride_type:form.elements.ride.value,ride_date:date,overall:stars,
      scores:{drive:cats.rij,comfort:cats.comfort,engine:cats.motor,space:cats.ruimte,value:cats.prijs},body:$('ci-text').value.trim(),tags,plate:plateRaw||null,photo:f?await photoPayload(f):null});
  }catch(x){err.textContent=x.message;return}
  finally{btn.disabled=false;btn.textContent=label}
  const rev=mapReview(res.review);SEED.unshift(rev);
  dlg.close();
  const after=levelsOf(reviewsOf(m)),gained=BADGES.filter(b=>after[b.id]>before[b.id]).map(b=>b.id);
  go('auto',{car,ver:'',onlyVer:false});
  showCelebrate(rev,gained,'Check-in geplaatst');
  const soft=(res.proof&&res.proof.soft)||[];
  if((plateRaw||f)&&soft.length)sayLater(soft.join(' '));
  if(shareF)sharePhotoAfter(shareF,car,rev.id);
});""" + L[e:]
s = L.index("  const ctx=proofCtx('pf'),proof=await evalProof(ctx);")
e = L.index("  if(gained.length)showCelebrate(r,gained,'Bewijs bewaard');else toast('Bewijs bewaard: '+VF_LABEL[vfOf(r)].toLowerCase());\n});")
e = L.index("\n});", e) + 4
L = L[:s] + r"""  const plateRaw=$('pf-plate').value.trim(),f=$('pf-photo').files[0];
  if(!plateRaw&&!f){err.textContent='Vul het kenteken in en kies een foto.';return}
  if(plateRaw&&!normPlate(plateRaw)){err.textContent='Dit kenteken lijkt niet op een Nederlands kenteken.';return}
  const btn=pform.querySelector('button.cta');if(btn)btn.disabled=true;
  const m=me(),before=levelsOf(reviewsOf(m));let res;
  try{res=await fn('add-proof',{review_id:r.id,plate:plateRaw||null,photo:f?await photoPayload(f):null})}
  catch(x){err.textContent=x.message;return}
  finally{if(btn)btn.disabled=false}
  r.vp=!!res.plate_verified;r.vh=!!res.photo_verified;pdlg.close();
  const after=levelsOf(reviewsOf(m)),gained=BADGES.filter(b=>after[b.id]>before[b.id]).map(b=>b.id);
  render();
  const soft=(res.proof&&res.proof.soft)||[];
  if(gained.length)showCelebrate(r,gained,'Bewijs bewaard');else toast('Bewijs bewaard: '+VF_LABEL[vfOf(r)].toLowerCase()+'.'+(soft.length?' '+soft.join(' '):''));
});
""".rstrip('\n') + L[e-1:]

# ---------- Tickets ----------
s = L.index("(async()=>{\n  try{\n    if(!window.claude||!window.claude.use)return;")
e = L.index("})();\n", s) + 6
L = L[:s] + "dbReady=true;\n" + L[e:]
L = repfn(L, 'loadInbox', """async function loadInbox(){
  if(!OWNER){inbox=null;return}
  try{
    const l=await rest('GET','tickets?select=*&order=created_at.desc&limit=300');
    inbox=l.map(t=>({id:t.code,_doc:t.id,type:t.type,msg:t.message,email:t.reply_email||'',page:t.page||'',status:t.status,user:t.user_id?nameOf(t.user_id):'Gast',ts:Date.parse(t.created_at)}));
  }catch(e){inbox=null}
}""")
L = repfn(L, 'ownServerTickets', """async function ownServerTickets(){
  const uid=sbUid();if(!uid)return [];
  try{const l=await rest('GET','tickets?select=code,type,message,status,created_at&user_id=eq.'+uid+'&order=created_at.desc&limit=50');
    return l.map(t=>({id:t.code,type:t.type,msg:t.message,status:t.status,user:me(),ts:Date.parse(t.created_at)}))}catch(e){return []}
}""")
L = repfn(L, 'sendTicket', """async function sendTicket(t){
  const j=await fn('ticket',{type:t.type,message:t.msg,reply_email:t.email||null,page:t.page});
  t.id=j.code;return 'server';
}""")
L = repfn(L, 'setTicketStatus', """async function setTicketStatus(doc,id,status){
  if(!OWNER)return;
  try{await rest('PATCH','tickets?id=eq.'+encodeURIComponent(doc),{status})}catch(e){toast('Bijwerken lukte niet: '+e.message)}
  await loadInbox();renderTickets();render();
}""")
L = rep(L, "const a=me()?accountOf(me()):null;$('fb-mail').value=a?a.email:'';", "$('fb-mail').value=me()?LV.email:'';")
L = rep(L, "$('fb-where').textContent=DB?", "$('fb-where').textContent=true?")
L = rep(L, "'Je melding gaat als ticket naar een afgeschermde inbox die alleen het Proefrit-team kan lezen. In de echte app krijgt het team er ook direct een e-mail van.'",
        "'Je melding gaat als ticket naar het Proefrit-team, dat er direct een e-mail van krijgt. Vul je e-mailadres in als je antwoord wilt.'")
L = rep(L, "  const where=await sendTicket(t);\n  if(btn)btn.disabled=false;\n  fdlg.close();\n  toast(where==='server'?`Ticket ${id} is verstuurd naar het Proefrit-team.`:`Ticket ${id} is in deze browser bewaard. Er was geen verbinding met de inbox.`);",
        "  try{await sendTicket(t)}catch(x){err.textContent=x.message;return}\n  finally{if(btn)btn.disabled=false}\n  fdlg.close();\n  toast(`Ticket ${t.id} is verstuurd naar het Proefrit-team.`);")
L = rep(L, "<p class=\"explain\">Alleen jij als eigenaar van deze pagina ziet dit overzicht.</p>", "<p class=\"explain\">Alleen beheerders zien dit overzicht.</p>")

# ---------- Foto's van rijders ----------
L = repfn(L, 'ensureCarPhotos', """function ensureCarPhotos(id){
  if(!id||carPhotos[id])return;
  carPhotos[id]={state:'loading',list:[]};
  (async()=>{
    let list=[];
    try{const l=await rest('GET','car_photos?select=*&car_id=eq.'+encodeURIComponent(id)+'&order=approved_at.desc&limit=24');
      list=l.map(p=>({_id:p.id,img:pubUrl('photos',p.public_path),user:p.username,w:p.width,h:p.height}))}catch(e){}
    if(sbUid()&&!myPhotoItems){try{const l=await rest('GET','photo_submissions?select=id,car_id,status,reason,created_at&user_id=eq.'+sbUid()+'&order=created_at.desc&limit=50');
      const st={pending:'wacht',approved:'goedgekeurd',rejected:'afgekeurd',removed:'verwijderd'};
      myPhotoItems=l.map(p=>({id:p.id,car:p.car_id,user:me(),status:st[p.status]||'wacht',reason:p.reason||'',ts:Date.parse(p.created_at),img:''}))}catch(e){myPhotoItems=[]}}
    carPhotos[id]={state:'ok',list};
    if(view.name==='auto'&&view.car===id)refreshCarPhotos();
  })();
}""")
L = rep(L, "async function srcToCanvas(src){\n  const img=new Image();img.src=src;", "async function srcToCanvas(src){\n  const img=new Image();img.crossOrigin='anonymous';img.src=src;")
s, e = span_fn(L, 'preparePhoto')
L = L[:s] + r"""async function preparePhoto(file,c){
  if(!/^image\/(jpeg|png|webp)$/.test(file.type))return {reject:'Kies een foto als JPG, PNG of WebP.'};
  if(file.size>20e6)return {reject:'De foto is groter dan 20 MB. Kies een kleinere foto.'};
  let img;try{img=await fileToImg(file)}catch(e){return {reject:'Deze foto kunnen we niet openen. Kies een andere foto.'}}
  const cv=drawScaled(img,1280);
  if(cv.width<200||cv.height<200)return {reject:'De foto is te klein. Kies een foto van minstens 200 bij 200 pixels.'};
  let j;
  try{j=await fn('photo',{mode:'check',car_id:c.id,image:dataUrlB64(cv.toDataURL('image/jpeg',.85)),media_type:'image/jpeg',width:cv.width,height:cv.height})}
  catch(e){return {reject:e.message}}
  if(j.reject)return {reject:j.reject};
  (j.plates||[]).forEach(b=>mosaic(cv,b,true));
  return {img:cv.toDataURL('image/jpeg',.85),w:cv.width,h:cv.height,auto:j.auto,ok:j.ok||[],msgs:j.notes||[]};
}
""" + L[e:]
s, e = span_fn(L, 'queuePhoto')
L = L[:s] + r"""async function queuePhoto(prep,carId,reviewId){
  try{
    const j=await fn('photo',{mode:'submit',car_id:carId,image:dataUrlB64(prep.img),media_type:'image/jpeg',width:prep.w,height:prep.h,auto:prep.auto,review_id:reviewId||null});
    if(j.reject)return 'err:'+j.reject;
  }catch(e){return 'err:'+e.message}
  myPhotoItems=null;delete carPhotos[carId];ensureCarPhotos(carId);
  if(OWNER)loadModq().then(()=>{if(mdlg.open)renderModq();render()});
  return 'server';
}
""" + L[e:]
L = rep(L, "  if(where==='full'||where==='nolocal'){err.textContent='Er is op dit moment geen ruimte om foto’s te bewaren. Probeer het later opnieuw.';return}",
        "  if(where.startsWith('err:')){err.textContent=where.slice(4);return}")
L = rep(L, "async function sharePhotoAfter(f,carId){", "async function sharePhotoAfter(f,carId,reviewId){")
L = rep(L, "  const w=await queuePhoto(r,carId);\n  sayLater(w==='server'?'Je foto is ingestuurd voor de autopagina en wacht op keuring.':w==='local'?'Je foto wacht in deze browser op keuring.':'Je foto kon niet worden bewaard.');",
        "  const w=await queuePhoto(r,carId,reviewId);\n  sayLater(w==='server'?'Je foto is ingestuurd voor de autopagina en wacht op keuring.':'Je foto is niet gedeeld bij de auto. '+w.slice(4));")
L = repfn(L, 'loadModq', """async function loadModq(){
  if(!OWNER){modq=null;return}
  try{
    const items=(await fn('photo-moderate',{action:'list'})).items||[];
    modq=items.filter(x=>x.url).map(x=>({_uid:'s',_id:x.id,car:x.car_id,user:x.username,img:x.url,w:x.width,h:x.height,check:x.check||null,auto:x.auto,ts:Date.parse(x.created_at)}));
  }catch(e){modq=null}
}""")
L = repfn(L, 'moderate', """async function moderate(uid,id,ok){
  const it=findModq(uid,id);if(!it||!OWNER)return;
  const sel=$('mr-'+id),reason=ok?'':(sel?sel.value:'');
  try{
    if(ok)await fn('photo-moderate',{action:'approve',id,image:it._orig?dataUrlB64(it.img):null});
    else await fn('photo-moderate',{action:'reject',id,reason});
  }catch(e){toast('Opslaan lukte niet: '+e.message);return}
  delete carPhotos[it.car];myPhotoItems=null;
  modq=modq.filter(x=>x!==it);renderModq();render();
  toast(ok?'Foto goedgekeurd. Hij staat nu bij de auto.':'Foto afgekeurd. De inzender ziet de reden.');
}""")
L = repfn(L, 'removePhoto', """async function removePhoto(btn){
  if(!OWNER)return;
  if(btn.dataset.sure!=='1'){btn.dataset.sure='1';btn.textContent='Echt verwijderen?';return}
  try{await fn('photo-moderate',{action:'remove',id:btn.dataset.id})}catch(e){toast('Verwijderen lukte niet: '+e.message);return}
  delete carPhotos[btn.dataset.car];myPhotoItems=null;render();toast('Foto verwijderd.');
}""")
L = rep(L, "    const cv=await srcToCanvas(it.img);\n    mosaic(cv,{x:fx-.12,y:fy-.06,w:.24,h:.12},false);\n    const out=canvasJpeg(cv);if(!out)return;\n    if(!it._orig)it._orig=it.img;\n    it.img=out.img;renderModq();",
        "    const cv=await srcToCanvas(it.img);\n    mosaic(cv,{x:fx-.12,y:fy-.06,w:.24,h:.12},false);\n    if(!it._orig)it._orig=it.img;\n    it.img=cv.toDataURL('image/jpeg',.88);renderModq();")

# ---------- Klikken en formulieren ----------
L = rep(L, "  else if(a==='social'){const n=$('soc-note');n.hidden=false;",
        "  else if(a==='social'&&t.dataset.provider==='Google')googleLogin();\n  else if(a==='forgot')forgotPassword();\n  else if(a==='reload')reloadAll();\n  else if(a==='ucancel'){udlgDone=true;udlg.close();if(udlgMode==='name')signOut(true)}\n  else if(a==='social'){const n=$('soc-note');n.hidden=false;")
L = rep(L, "  else if(a==='demo'){store.session=DEMO;save();afterLogin()}\n", "")
L = rep(L, "requireAuth('Log in om een review een Top! te geven.',()=>{const k=me()+':'+id;store.liked[k]=!store.liked[k];save();refreshCard(id)});",
        "requireAuth('Log in om een review een Top! te geven.',async()=>{const k=me()+':'+id,on=!store.liked[k];store.liked[k]=on;refreshCard(id);\n      try{if(on)await rest('POST','likes',{review_id:id,user_id:sbUid()});else await rest('DELETE','likes?review_id=eq.'+id+'&user_id=eq.'+sbUid())}\n      catch(x){store.liked[k]=!on;refreshCard(id);toast(x.message)}});")
L = rep(L, "  else if(a==='accept'){const n=t.dataset.user,r=chatsOf()[n];if(r){r.state='active';save();toast(`Je hebt ${n} geaccepteerd. Jullie kunnen nu chatten.`);render()}}\n  else if(a==='decline'){const n=t.dataset.user;delete chatsOf()[n];save();toast(`Verzoek van ${n} geweigerd.`);go('chat',{chat:null})}\n  else if(a==='block'){const n=t.dataset.user,r=chatsOf()[n];if(r){r.state='blocked';save();toast(`${n} is geblokkeerd.`);go('chat',{chat:null})}}\n  else if(a==='unblock'){const n=t.dataset.user;delete chatsOf()[n];save();toast(`${n} is gedeblokkeerd.`);go('chat',{chat:null})}\n  else if(a==='withdraw'){const n=t.dataset.user;delete chatsOf()[n];save();toast('Verzoek ingetrokken.');go('chat',{chat:null})}\n",
        """  else if(['accept','decline','block','unblock','withdraw'].includes(a)){
    const n=t.dataset.user,msg={accept:`Je hebt ${n} geaccepteerd. Jullie kunnen nu chatten.`,decline:`Verzoek van ${n} geweigerd.`,block:`${n} is geblokkeerd.`,unblock:`${n} is gedeblokkeerd.`,withdraw:'Verzoek ingetrokken.'}[a];
    t.disabled=true;
    chatAction(n,a).then(()=>{toast(msg);if(a==='accept')render();else go('chat',{chat:null})}).catch(x=>{t.disabled=false;toast(x.message)});
  }
""")
L = rep(L, "  else if(a==='simaccept'){", "  else if(a==='simaccept-weg'){")
L = rep(L, "    (store.comments[id]=store.comments[id]||[]).push({id:'m'+Date.now(),user:me(),text,ts:Date.now()});\n    save();openThreads.add(id);refreshCard(id,true);",
        "    const btn=f.querySelector('button');btn.disabled=true;\n    rest('POST','comments',{review_id:id,user_id:sbUid(),body:text},'return=representation').then(rows=>{const r=reviewById(id);if(r)r.comments.push(mapComment(rows[0]));openThreads.add(id);refreshCard(id,true)})\n      .catch(x=>{btn.disabled=false;if(ce)ce.textContent=x.message});")
s = L.index("    const cs=chatsOf();let r=cs[name];\n    if(!r){if(profileOf(name).chatFrom==='none'&&name!==SUPPORT)return;")
e = L.index("    save();render();\n    const i=$('chat-in');", s)
e2 = L.index("\n", L.index("window.scrollTo(0,document.body.scrollHeight);", e)) + 1
L = L[:s] + r"""    const btn=f.querySelector('button');btn.disabled=true;inp.disabled=true;
    chatSend(name,text).then(()=>{render();const i=$('chat-in');if(i&&!i.disabled)i.focus({preventScroll:true});window.scrollTo(0,document.body.scrollHeight)})
      .catch(x=>{btn.disabled=false;inp.disabled=false;$('chat-err').textContent=x.message});
""" + L[e2:]
L = rep(L, "[dlg,fdlg,pdlg,adlg,cdlg,phdlg,mdlg].forEach(", "[dlg,fdlg,pdlg,adlg,cdlg,phdlg,mdlg].forEach(")

# ---------- Privacy: eigen gegevens downloaden, account verwijderen, privacyverklaring ----------
L = rep(L, "Nog geen check-ins.'}</div>`}</div></div>`;",
        "Nog geen check-ins.'}</div>`}</div></div>${self?`<div class=\"section\"><h3 style=\"margin:0\">Je account</h3><p class=\"explain\" style=\"margin:0\">Ingelogd als ${esc(LV.email||'')}. Je e-mailadres ziet niemand anders.</p><div class=\"row\"><button class=\"ghost sm\" data-act=\"export\">Mijn gegevens downloaden</button><button class=\"ghost sm\" data-act=\"delacct\">Account verwijderen</button></div><p class=\"explain\" style=\"margin:0\">Lees in de <a href=\"privacy.html\">privacyverklaring</a> wat we bewaren en waarom.</p></div>`:''}`;")
L = rep(L, 'Woordfilter deels op basis van <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words" target="_blank" rel="noopener">LDNOOBW</a> (CC BY 4.0).</span></div>`;',
        'Woordfilter deels op basis van <a href="https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words" target="_blank" rel="noopener">LDNOOBW</a> (CC BY 4.0). <a href="privacy.html">Privacyverklaring</a>.</span></div>`;')
L = rep(L, "  else if(a==='reload')reloadAll();", "  else if(a==='reload')reloadAll();\n  else if(a==='export')exportMyData(t);\n  else if(a==='delacct')openDeleteDialog();")

# ---------- Eigen check-ins en reacties verwijderen (beheerders mogen alles verwijderen) ----------
L = rep(L, '      ${own&&vfOf(r)<2?`<button class="pill add" data-act="addproof" data-id="${esc(r.id)}">Bewijs toevoegen</button>`:\'\'}',
        '      ${own&&vfOf(r)<2?`<button class="pill add" data-act="addproof" data-id="${esc(r.id)}">Bewijs toevoegen</button>`:\'\'}${own||OWNER?`<button class="plain delbtn" data-act="delrev" data-id="${esc(r.id)}">Verwijderen</button>`:\'\'}')
L = rep(L, '<div><div class="meta"><button class="ulink" data-act="user" data-user="${esc(c.user)}">${esc(c.user)}</button> · ${ago(c.ts)}</div>',
        '<div><div class="meta"><button class="ulink" data-act="user" data-user="${esc(c.user)}">${esc(c.user)}</button> · ${ago(c.ts)}${me()&&(c.user===me()||OWNER)?` · <button class="plain delbtn" data-act="delcm" data-id="${esc(c.id)}" data-rid="${esc(r.id)}">Verwijderen</button>`:\'\'}</div>')
L = rep(L, "  else if(a==='export')exportMyData(t);", """  else if(a==='export')exportMyData(t);
  else if(a==='delrev'||a==='delcm'){
    if(t.dataset.sure!=='1'){t.dataset.sure='1';t.textContent='Echt verwijderen?';return}
    t.disabled=true;const id=t.dataset.id;
    rest('DELETE',(a==='delrev'?'reviews':'comments')+'?id=eq.'+encodeURIComponent(id)+'&select=id',undefined,'return=representation').then(rows=>{
      if(!rows||!rows.length)throw new Error('Dat mag niet met je account.');
      if(a==='delrev'){const i=SEED.findIndex(x=>x.id===id);if(i>=0)SEED.splice(i,1);render();toast('Check-in verwijderd.')}
      else{const r=reviewById(t.dataset.rid);if(r)r.comments=r.comments.filter(c=>c.id!==id);refreshCard(t.dataset.rid);toast('Reactie verwijderd.')}
    }).catch(x=>{t.disabled=false;toast(x.message)});
  }""")

# ---------- Start ----------
s = L.index("/* ===== Start ===== */")
L = L[:s] + core + "\n" + r"""
/* Kenteken eerst: opzoeken bij de RDW via de server */
const rdwSeq={};
async function rdwAutofillLive(p){
  const el=$(p+'-rdw'),pn=normPlate($(p+'-plate').value);
  if(el)el.innerHTML='';
  if(!pn||!me())return;
  const cur=$(p+'-model').value;
  if(cur&&autoFilled[p]!==cur)return;
  const seq=(rdwSeq[p]=(rdwSeq[p]||0)+1);
  if(el)el.textContent='Kenteken opzoeken bij de RDW…';
  let j;try{j=await fn('rdw-lookup',{plate:pn.key})}catch(e){if(seq===rdwSeq[p]&&el)el.textContent=e.message;return}
  if(seq!==rdwSeq[p])return;
  if(!j.found){if(el)el.textContent='Dit kenteken staat niet bij de RDW. Controleer het, of kies merk en model hieronder zelf.';return}
  const desc=`${j.merk} ${j.handelsbenaming}, ${(j.brandstoffen||[]).join(' + ').toLowerCase()}${j.jaar?', '+j.jaar:''}`;
  const c=j.match&&carById(j.match.car_id);
  if(!c){if(el)el.textContent=`De RDW kent dit kenteken als ${desc}, maar dat model staat nog niet in de lijst. Kies het zelf of meld het via de link onderaan.`;return}
  let fuel=j.match.fuel;if(!fuel)fuel=(j.brandstoffen||[]).find(f=>c.fuels.includes(f))||'';
  setPicker(p,c.id,fuel,'');autoFilled[p]=c.id;
  if(p==='ga'){fillGaYears();if(j.jaar)$('ga-year').value=String(j.jaar)}
  if(el)el.innerHTML=`<span class="good">✓ Ingevuld vanuit de RDW: ${esc(carName(c))}, ${esc(desc)}.</span> Klopt het niet? Pas het aan.`;
}
function showProofLive(p){
  const el=$(p+'-state'),raw=$(p+'-plate').value.trim(),f=$(p+'-photo').files[0];
  if(!raw&&!f){el.innerHTML='Zonder bewijs is je check-in <b>niet geverifieerd</b>. Hij telt dan niet mee voor badges.';return}
  const out=[];
  if(raw){const pn=normPlate(raw);out.push(pn?`<span>Kenteken ${esc(pn.fmt)} wordt bij het plaatsen vergeleken met de RDW.</span>`:'<span class="warn">Dit kenteken lijkt niet op een Nederlands kenteken.</span>')}
  else out.push('<span>Vul ook het kenteken in, anders telt de foto niet mee.</span>');
  if(f)out.push(/^image\//.test(f.type)?'<span>De foto wordt bij het plaatsen gelezen door Claude.</span>':'<span class="warn">De foto moet een afbeelding zijn.</span>');
  else out.push('<span>Voeg een foto toe met het kenteken in beeld voor een volledig geverifieerde check-in.</span>');
  el.innerHTML=out.join('<br>');
}
async function forgotPassword(){
  const err=$('a-err'),email=$('a-login').value.trim();err.textContent='';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){err.textContent='Vul hierboven je e-mailadres in en kies daarna opnieuw Wachtwoord vergeten.';return}
  try{await authPost('recover?redirect_to='+encodeURIComponent(appUrl()),{email});$('a-ok').hidden=false;$('a-ok').innerHTML=`Als er een account is met ${esc(email)}, krijg je een mail met een link om een nieuw wachtwoord te kiezen.`}
  catch(e){err.textContent=e.message}
}

/* ===== Start ===== */
setAuthMode('in');
boot();
"""

# ---------- HTML ----------
H = head
H = rep(H, """      <button type="button" class="ghost" data-act="social" data-provider="Apple">Doorgaan met Apple</button>\n""", "")
H = rep(H, """<label class="l" for="a-login">Gebruikersnaam of e-mailadres</label><input id="a-login" class="field" autocomplete="username">""",
        """<label class="l" for="a-login">E-mailadres</label><input id="a-login" class="field" type="email" autocomplete="email">""")
H = rep(H, """      <p class="err" id="a-err" role="alert"></p>\n      <button class="cta" id="authsubmit" type="submit">Inloggen</button>\n    </form>""",
        """      <p class="err" id="a-err" role="alert"></p>\n      <p class="notice" id="a-ok" hidden></p>\n      <button class="cta" id="authsubmit" type="submit">Inloggen</button>\n    </form>""")
H = rep(H, """    <button class="plain" type="button" data-act="demo" style="align-self:flex-start">Of probeer het demo-account met voorbeeldritten</button>\n    <p class="explain">Dit is een prototype. Accounts, berichten en reacties blijven in deze browser en worden nergens heen gestuurd.</p>""",
        """    <button class="plain g-in" type="button" data-act="forgot" style="align-self:flex-start">Wachtwoord vergeten?</button>\n    <p class="explain">Je e-mailadres laten we nooit aan andere leden zien. Wat je deelt op je profiel, kies je zelf. Lees ook de <a href="privacy.html" target="_blank" rel="noopener">privacyverklaring</a>.</p>""")
H = rep(H, '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap">', '<link rel="stylesheet" href="fonts/fonts.css">')
H = rep(H, '</style>', '.cta.danger{background:#c62828;color:#fff;border-color:#7f1515}\n.plain.delbtn{color:var(--muted);font-size:13px}\n</style>')
H = rep(H, '<dialog id="cdlg"', '<dialog id="udlg" aria-labelledby="utitle"><div class="authbox" id="ubox"></div></dialog>\n<dialog id="cdlg"')
FAV = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='2' y='14' width='60' height='36' rx='6' fill='%23f9c800' stroke='%2315181d' stroke-width='3'/%3E%3Crect x='5' y='17' width='11' height='30' rx='2' fill='%230b3f93'/%3E%3Ctext x='39' y='42' font-family='Arial' font-weight='700' font-size='26' text-anchor='middle' fill='%2315181d'%3EP%3C/text%3E%3C/svg%3E"
H = ('<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
     '<meta name="description" content="Proefrit: reviews van auto\'s door mensen die er echt in reden.">\n<link rel="icon" href="' + FAV + '">\n'
     '<script>window.PROEFRIT_CONFIG=' + json.dumps({'url': URL, 'key': KEY}) + ';</script>\n') + H

js = ''.join(open(P + n).read() for n in ['catalog_head.js', 'catalog_add.js', 'catalog_classic.js', 'catalog_us.js', 'visual8.js', 'vocab8.js']) + L
open(OUT, 'w').write(H + '<script>\n' + js + '</script>\n')
print('ok', OUT, len(H) + len(js))
