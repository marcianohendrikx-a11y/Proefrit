/* ===== Koppeling met de backend (Supabase): inloggen, gegevens laden en opslaan =====
   Zonder extra bibliotheek: alles via fetch naar de REST-, Auth-, Storage- en Functions-API van Supabase.
   De publieke 'anon'-sleutel staat in de pagina; de beveiliging zit in de databaseregels (Row Level Security). */
const SB=window.PROEFRIT_CONFIG;
const SESS_KEY='proefrit-sessie',PENDING_KEY='proefrit-nieuw-account';
const appUrl=()=>location.origin+location.pathname;
let sbSession=null;
try{sbSession=JSON.parse(localStorage.getItem(SESS_KEY)||'null')}catch(e){}
function sessSave(s){sbSession=s;try{if(s)localStorage.setItem(SESS_KEY,JSON.stringify(s));else localStorage.removeItem(SESS_KEY)}catch(e){}}
const sbUid=()=>sbSession&&sbSession.user?sbSession.user.id:null;
const normSess=j=>({access_token:j.access_token,refresh_token:j.refresh_token,expires_at:+j.expires_at||Math.floor(Date.now()/1000)+(+j.expires_in||3600),user:j.user||null});
const NL_ERR=[
 [/invalid login credentials/i,'E-mailadres of wachtwoord klopt niet.'],
 [/email not confirmed/i,'Bevestig eerst je e-mailadres met de link in de mail die we je stuurden.'],
 [/user already registered|already been registered/i,'Met dit e-mailadres bestaat al een account. Log in of kies Wachtwoord vergeten.'],
 [/password should be at least|weak password/i,'Kies een sterker wachtwoord van minstens 8 tekens.'],
 [/rate limit|too many|over_email_send_rate_limit|email rate/i,'Er zijn net te veel pogingen gedaan. Probeer het over een paar minuten opnieuw.'],
 [/profiles_username_lower|profiles_username_key|duplicate key.*username/i,'Deze gebruikersnaam is al in gebruik. Kies een andere.'],
 [/conversations_pair|duplicate key.*conversations/i,'Er bestaat al een gesprek of verzoek met dit lid.'],
 [/likes_pkey/i,'Je gaf deze check-in al een Top!'],
 [/row-level security|permission denied|not allowed/i,'Dat mag niet met je account.'],
 [/jwt expired|invalid jwt|refresh token/i,'Je sessie is verlopen. Log opnieuw in.'],
 [/failed to fetch|networkerror|load failed/i,'Geen verbinding met Proefrit. Controleer je internet en probeer het opnieuw.'],
 [/username_check|profiles_username_check/i,'Kies een gebruikersnaam van 3 tot 20 tekens met letters, cijfers, punt, streepje of underscore.'],
 [/city_check|bio_check/i,'Een van de teksten is te lang.']
];
function nlMsg(m){m=String(m||'');for(const [re,t] of NL_ERR)if(re.test(m))return t;return m||'Er ging iets mis. Probeer het opnieuw.'}
function sbErr(j,status){const m=j&&(j.error_description||j.msg||j.message||(typeof j.error==='string'?j.error:''))||('Er ging iets mis (fout '+status+').');const e=new Error(nlMsg(m));e.status=status;e.data=j;return e}
let refreshing=null;
async function sbRefresh(){
  if(!sbSession||!sbSession.refresh_token)return;
  if(!refreshing)refreshing=(async()=>{
    const r=await fetch(SB.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SB.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:sbSession.refresh_token})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||!j.access_token){sessSave(null);sessionLost();return}
    sessSave(normSess(j));
  })().finally(()=>{refreshing=null});
  return refreshing;
}
async function sbToken(){
  if(sbSession&&sbSession.expires_at*1000<Date.now()+90e3)await sbRefresh();
  return sbSession?sbSession.access_token:null;
}
async function sbHeaders(extra){const t=await sbToken();return {apikey:SB.key,Authorization:'Bearer '+(t||SB.key),...(extra||{})}}
async function sbFetch(url,opt,retry){
  let r;
  try{r=await fetch(url,{...opt,headers:await sbHeaders(opt.headers)})}catch(e){throw new Error(nlMsg('failed to fetch'))}
  if(r.status===401&&sbSession&&!retry){await sbRefresh();if(sbSession)return sbFetch(url,opt,true)}
  return r;
}
async function rest(method,path,body,prefer){
  const h={'Content-Type':'application/json'};if(prefer)h.Prefer=prefer;
  const r=await sbFetch(SB.url+'/rest/v1/'+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});
  const txt=await r.text();let j=null;try{j=txt?JSON.parse(txt):null}catch(e){}
  if(!r.ok)throw sbErr(j,r.status);
  return j;
}
const restAll=async(path,page)=>{page=page||1000;const out=[];for(let from=0;;from+=page){const sep=path.includes('?')?'&':'?';const l=await rest('GET',`${path}${sep}limit=${page}&offset=${from}`);out.push(...(l||[]));if(!l||l.length<page)break}return out};
const inList=ids=>'('+[...new Set(ids)].map(x=>'"'+String(x).replace(/"/g,'')+'"').join(',')+')';
async function restIn(table,select,col,ids,extra){
  const u=[...new Set(ids)],out=[];
  for(let i=0;i<u.length;i+=80){const l=await rest('GET',`${table}?select=${select}&${col}=in.${encodeURIComponent(inList(u.slice(i,i+80)))}${extra||''}`);out.push(...(l||[]))}
  return out;
}
async function fn(name,body){
  const r=await sbFetch(SB.url+'/functions/v1/'+name,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})});
  const j=await r.json().catch(()=>null);
  if(!r.ok)throw sbErr(j,r.status);
  return j;
}
const rpc=(name,args)=>rest('POST','rpc/'+name,args);
async function authPost(path,body){
  let r;
  try{r=await fetch(SB.url+'/auth/v1/'+path,{method:'POST',headers:{apikey:SB.key,'Content-Type':'application/json'},body:JSON.stringify(body)})}catch(e){throw new Error(nlMsg('failed to fetch'))}
  const j=await r.json().catch(()=>({}));
  if(!r.ok)throw sbErr(j,r.status);
  return j;
}
async function authUser(){
  const r=await sbFetch(SB.url+'/auth/v1/user',{method:'GET',headers:{}});
  if(!r.ok)return null;
  return r.json();
}
const likeEsc=s=>String(s).replace(/[\\%_*]/g,m=>'\\'+m);
const pubUrl=(bucket,path)=>SB.url+'/storage/v1/object/public/'+bucket+'/'+String(path).split('/').map(encodeURIComponent).join('/');
async function upload(bucket,path,blob){
  const r=await sbFetch(SB.url+'/storage/v1/object/'+bucket+'/'+path,{method:'POST',headers:{'Content-Type':blob.type||'image/jpeg','x-upsert':'false'},body:blob});
  const j=await r.json().catch(()=>null);
  if(!r.ok)throw sbErr(j,r.status);
  return pubUrl(bucket,path);
}
const dataUrlB64=u=>String(u).split(',')[1]||'';
async function dataUrlBlob(u){return (await fetch(u)).blob()}
/* Foto verkleinen voor de controle op de server (max 1600 px, JPEG) */
async function photoPayload(file){
  if(!file)return null;
  const img=await fileToImg(file),cv=drawScaled(img,1600);
  return {data:dataUrlB64(cv.toDataURL('image/jpeg',.85)),type:'image/jpeg',taken_at:file.lastModified};
}

/* ---------- Gegevens uit de database omzetten naar de vorm van de app ---------- */
const LV={loaded:false,loadErr:'',ids:{},byName:{},email:'',myRow:null,hidden:new Set()};
const nameOf=id=>(LV.ids[id]||{}).username||'Oud lid';
const sinceText=ts=>ts?new Date(ts).toLocaleDateString('nl-NL',{month:'short',year:'numeric'}):'';
function mapReview(x){
  return {id:x.id,uid:x.user_id,car:x.car_id,user:nameOf(x.user_id),ts:Date.parse(x.created_at),rit:x.ride_date,fuel:x.fuel,ver:x.version||'',ride:x.ride_type,
    overall:x.overall,cats:{rij:x.score_drive,comfort:x.score_comfort,motor:x.score_engine,ruimte:x.score_space,prijs:x.score_value},
    text:x.body||'',tags:x.tags||[],vp:!!x.plate_verified,vh:!!x.photo_verified,likes:0,comments:[]};
}
const mapComment=c=>({id:c.id,uid:c.user_id,user:nameOf(c.user_id),text:c.body,ts:Date.parse(c.created_at)});
const mapGarage=g=>({id:g.id,car:g.car_id,status:g.status,fuel:g.fuel,ver:g.version||'',year:g.year?String(g.year):'',vp:!!g.plate_verified,tags:g.tags||[],pos:g.position||0});
const licOf=v=>v==='geen'?'geen':(v?+v:'');
function profileFromRow(p){
  return {birthYear:p.birth_year||0,city:p.city||'',licenseSince:licOf(p.license_since),kmYear:p.km_year||'',bio:p.bio||'',interests:p.interests||[],avatar:p.avatar_url||'',
    vis:{age:p.share_age?'band':'hidden',loc:p.share_city?'city':'hidden',exp:p.share_experience?'shown':'hidden'},
    profileVis:p.public_profile?'all':'members',chatFrom:p.chat_requests?'all':'none',onboarded:!!p.onboarded,garage:[],garageOrder:p.garage_order||[]};
}
function profileFromCard(c){
  return {ageBand:c.age_band||'',city:c.city||'',licenseSince:licOf(c.license_since),kmYear:c.km_year||'',bio:c.bio||'',interests:c.interests||[],avatar:c.avatar_url||'',
    vis:{age:c.age_band?'band':'hidden',loc:c.city?'city':'hidden',exp:c.license_since||c.km_year?'shown':'hidden'},
    profileVis:'all',chatFrom:c.chat_requests?'all':'none',onboarded:true,garage:[],garageOrder:c.garage_order||[]};
}

/* Modellen die alleen uit de RDW-import komen (nog niet in de ingebouwde catalogus) */
async function loadExtraCars(){
  const l=await restAll('cars?select=id,brand,model,year_from,year_to,body,fuels&source=eq.rdw&order=id');
  l.forEach(x=>{
    if(CARMAP.has(x.id))return;
    const fuels=x.fuels&&x.fuels.length?FUELS.filter(f=>x.fuels.includes(f)):FUELS.slice();
    const c={id:x.id,brand:x.brand,model:x.model,from:x.year_from,to:x.year_to,versions:[],body:x.body||'',fuels,rdw:true};
    c.search=' '+(c.brand+' '+c.model).toLowerCase().replace(/[()\/,]/g,' ');
    CARS.push(c);CARMAP.set(c.id,c);
    if(!BRANDS.includes(c.brand)){BRANDS.push(c.brand);BRANDS.sort((a,b)=>a.localeCompare(b,'nl'))}
  });
  try{const v=$('ci-brand').value;fillBrands('ci');$('ci-brand').value=v}catch(e){}
}

async function loadCommunity(){
  const uid=sbUid();
  const [names,cards,revs,garage]=await Promise.all([
    restAll('profile_names?select=id,username,avatar_url&order=id'),
    restAll('profile_cards?select=*&order=id'),
    rest('GET','reviews?select=*&order=created_at.desc&limit=400'),
    restAll('garage_items?select=*&order=created_at')
  ]);
  LV.ids={};LV.byName={};
  names.forEach(n=>{LV.ids[n.id]=n;LV.byName[n.username]=n});
  const cardOf={};cards.forEach(c=>cardOf[c.id]=c);
  store.accounts={};store.profiles={};
  names.forEach(n=>{
    store.accounts[n.username.toLowerCase()]={name:n.username,id:n.id,since:sinceText(cardOf[n.id]&&cardOf[n.id].created_at)};
    store.profiles[n.username]=cardOf[n.id]?profileFromCard(cardOf[n.id]):{avatar:n.avatar_url||'',profileVis:'members',onboarded:true,garage:[]};
  });
  if(uid&&LV.myRow){
    const p=profileFromRow(LV.myRow);store.profiles[LV.myRow.username]=p;
    const a=store.accounts[LV.myRow.username.toLowerCase()];if(a)a.since=sinceText(LV.myRow.created_at);
  }
  garage.forEach(g=>{const n=LV.ids[g.user_id];if(!n||!carById(g.car_id))return;const p=store.profiles[n.username];if(p)p.garage.push(mapGarage(g))});
  Object.values(store.profiles).forEach(p=>{if(p.garage)p.garage.sort((a,b)=>a.pos-b.pos)});
  const list=(revs||[]).filter(x=>carById(x.car_id)).map(mapReview);
  const ids=list.map(r=>r.id);
  const [likes,comments]=ids.length?await Promise.all([
    restIn('likes','review_id,user_id','review_id',ids),
    restIn('comments','id,review_id,user_id,body,created_at','review_id',ids,'&order=created_at')
  ]):[[],[]];
  const byId={};list.forEach(r=>byId[r.id]=r);
  store.liked={};
  likes.forEach(l=>{const r=byId[l.review_id];if(!r)return;if(uid&&l.user_id===uid)store.liked[me()+':'+r.id]=true;else r.likes++});
  comments.forEach(c=>{const r=byId[c.review_id];if(r)r.comments.push(mapComment(c))});
  SEED.length=0;SEED.push(...list);
  store.mine=[];store.comments={};
}

async function loadMine(){
  LV.myRow=null;OWNER=false;
  const uid=sbUid();if(!uid)return null;
  const [rows,adm]=await Promise.all([rest('GET','profiles?select=*&id=eq.'+uid),rest('GET','admins?select=user_id&user_id=eq.'+uid).catch(()=>[])]);
  LV.myRow=rows&&rows[0]||null;OWNER=!!(adm&&adm.length);
  return LV.myRow;
}

/* ---------- Chat ---------- */
let chatSig='';
async function loadChats(){
  const uid=sbUid(),m=me();
  if(!uid||!m){store.chats={};return false}
  const convs=await rest('GET','conversations?select=*&order=updated_at.desc');
  const msgs=convs.length?await restIn('messages','id,conversation_id,sender_id,body,created_at','conversation_id',convs.map(c=>c.id),'&order=created_at'):[];
  const c={};
  convs.forEach(cv=>{
    const other=cv.user_a===uid?cv.user_b:cv.user_a,name=nameOf(other);
    const ms=msgs.filter(x=>x.conversation_id===cv.id).map(x=>({me:x.sender_id===uid,text:x.body,ts:Date.parse(x.created_at)}));
    let state;
    if(cv.state==='active')state='active';
    else if(cv.state==='blocked')state=cv.blocked_by===uid?'blocked':'closed';
    else if(cv.state==='requested')state=cv.requested_by===uid?(ms.length?'out':'new'):'in';
    else state=cv.requested_by===uid?'out':null;   // geweigerd: de aanvrager ziet 'wacht op akkoord', de ontvanger niets meer
    if(state&&(ms.length||state==='new'||state==='blocked'))c[name]={state,msgs:ms,conv:cv.id,other};
  });
  store.chats={[m]:c};
  const sig=JSON.stringify(Object.entries(c).map(([k,v])=>[k,v.state,v.msgs.length]));
  const changed=sig!==chatSig;chatSig=sig;return changed;
}
async function chatSend(name,text){
  const cs=chatsOf(),r=cs[name],uid=sbUid(),other=LV.byName[name];
  if(!other)throw new Error('Dit lid bestaat niet (meer).');
  if(!r||r.state==='new'){
    let conv=r&&r.conv;
    if(!conv){const row=await rest('POST','conversations',{user_a:uid,user_b:other.id,requested_by:uid},'return=representation');conv=row[0].id}
    await rest('POST','messages',{conversation_id:conv,sender_id:uid,body:text});
    toast(`Verzoek verstuurd. ${name} moet eerst akkoord geven.`);
  }else if(r.state==='active')await rest('POST','messages',{conversation_id:r.conv,sender_id:uid,body:text});
  else return;
  await loadChats();
}
async function chatAction(name,action){
  const r=chatsOf()[name];if(!r||!r.conv)return;
  if(action==='unblock'||action==='withdraw')await rpc('chat_remove',{conv:r.conv,action});
  else await rpc('respond_chat',{conv:r.conv,action});
  await loadChats();
}
/* Nieuwe berichten ophalen zolang de pagina open is (elke 15 seconden) */
setInterval(async()=>{
  if(!me()||document.visibilityState!=='visible'||dlg.open||odlg.open)return;
  try{
    const changed=await loadChats();if(!changed)return;
    const rc=reqCount(),dot=$('chatdot');dot.hidden=rc===0;dot.textContent=rc;
    if(view.name==='chat'){
      const i=$('chat-in'),val=i?i.value:'',had=document.activeElement===i;
      render();const j=$('chat-in');if(j){j.value=val;if(had)j.focus({preventScroll:true})}
      if(view.chat)window.scrollTo(0,document.body.scrollHeight);
    }
  }catch(e){}
},15000);

/* ---------- Opslaan ---------- */
async function saveProfileLive(d){
  const uid=sbUid();let avatar=d.avatar||null;
  if(avatar&&avatar.startsWith('data:')){
    avatar=await upload('avatars',`${uid}/avatar-${Date.now().toString(36)}.jpg`,await dataUrlBlob(avatar));
    d.avatar=avatar;
  }
  const patch={birth_year:d.birthYear||LV.myRow.birth_year,city:d.city||null,license_since:d.licenseSince===''||d.licenseSince==null?null:String(d.licenseSince),km_year:d.kmYear||null,
    bio:d.bio||null,interests:d.interests||[],avatar_url:avatar,share_age:d.vis.age==='band',share_city:d.vis.loc==='city',share_experience:d.vis.exp==='shown',
    public_profile:d.profileVis==='all',chat_requests:d.chatFrom!=='none'};
  const rows=await rest('PATCH','profiles?id=eq.'+uid,patch,'return=representation');
  LV.myRow=rows[0];
  const garage=profileOf(me()).garage;
  store.profiles[me()]={...profileFromRow(LV.myRow),garage};
  if(LV.ids[uid])LV.ids[uid].avatar_url=LV.myRow.avatar_url;
}
async function markOnboarded(){
  if(!LV.myRow||LV.myRow.onboarded)return;
  try{const rows=await rest('PATCH','profiles?id=eq.'+sbUid(),{onboarded:true},'return=representation');LV.myRow=rows[0]}catch(e){}
}

/* ---------- Opstarten en sessie ---------- */
function sessionLost(){
  if(!store.session)return;
  store.session='';store.chats={};OWNER=false;LV.myRow=null;renderAcct();render();
  toast('Je sessie is verlopen. Log opnieuw in.');
}
async function reloadAll(){
  try{await loadCommunity();LV.loaded=true;LV.loadErr=''}catch(e){LV.loadErr=e.message;LV.loaded=true}
  if(me())try{await loadChats()}catch(e){}
  if(OWNER){try{await loadInbox()}catch(e){}try{await loadModq()}catch(e){}}
  for(const k in carPhotos)delete carPhotos[k];myPhotoItems=null;
  renderAcct();render();
}
/* Na inloggen (e-mail, Google of bevestigingslink): profiel ophalen of aanmaken */
async function afterAuth(){
  const row=await loadMine();
  if(!row){
    let pend=null;try{pend=JSON.parse(localStorage.getItem(PENDING_KEY)||'null')}catch(e){}
    if(pend&&pend.username){
      try{await createProfile(pend.username,pend.birth_year);try{localStorage.removeItem(PENDING_KEY)}catch(e){}}
      catch(e){openNameDialog(e.message,pend);return}
    }else{openNameDialog('',null);return}
  }
  store.session=LV.myRow.username;
  try{LV.email=(sbSession.user&&sbSession.user.email)||''}catch(e){}
  await reloadAll();
  afterLogin();
}
async function createProfile(username,birth){
  const uid=sbUid();
  const free=await rest('GET','profile_names?select=id&username=ilike.'+encodeURIComponent(likeEsc(username)));
  if(free&&free.length&&free[0].id!==uid)throw new Error('Deze gebruikersnaam is al in gebruik. Kies een andere.');
  const rows=await rest('POST','profiles',{id:uid,username,birth_year:birth},'return=representation');
  LV.myRow=rows[0];
}
function validName(name){
  if(!/^[A-Za-z0-9_.-]{3,20}$/.test(name))return 'Kies een gebruikersnaam van 3 tot 20 tekens met letters, cijfers, punt, streepje of underscore.';
  if(WF.check(name)||WF.check(name.replace(/[_.-]+/g,' ')))return 'Kies een andere gebruikersnaam; deze bevat een woord dat niet is toegestaan.';
  if(RESERVED.has(name.toLowerCase()))return 'Deze gebruikersnaam is al in gebruik. Kies een andere.';
  return '';
}
/* Kleine dialoog: gebruikersnaam kiezen (na Google) of een nieuw wachtwoord instellen */
const udlg=$('udlg');let udlgMode='',udlgDone=false;
function openNameDialog(msg,pend){
  udlgMode='name';udlgDone=false;
  const yrs=Array.from({length:YEAR-8-1920+1},(_,i)=>YEAR-8-i).map(y=>`<option value="${y}"${pend&&pend.birth_year===y?' selected':''}>${y}</option>`).join('');
  $('ubox').innerHTML=`<div class="fh"><span class="lp"><i aria-hidden="true">NL</i><b>PROEFRIT</b></span></div>
    <div><h2 id="utitle">Kies je gebruikersnaam</h2><p class="sub" style="margin:0">Nog één stap. Je gebruikersnaam staat bij je check-ins; je e-mailadres laten we nooit zien.</p></div>
    <form id="uform" class="stack" novalidate>
      <div><label class="l" for="u-name">Gebruikersnaam</label><input id="u-name" class="field" maxlength="20" autocomplete="username" value="${esc(pend&&pend.username||'')}" placeholder="Bijvoorbeeld Max_V"><p class="hint">3 tot 20 tekens: letters, cijfers, punt, streepje of underscore.</p></div>
      <div><label class="l" for="u-birth">Geboortejaar</label><select id="u-birth" class="field"><option value="">Kies je geboortejaar…</option>${yrs}</select><p class="hint">Je moet 16 jaar of ouder zijn. Je kiest straks zelf of anderen je leeftijdsgroep zien.</p></div>
      <p class="err" id="u-err" role="alert">${esc(msg||'')}</p>
      <button class="cta" type="submit">Verder</button>
    </form>
    <button class="plain" type="button" data-act="ucancel" style="align-self:flex-start">Annuleren en uitloggen</button>`;
  if(!udlg.open)udlg.showModal();
}
function openPasswordDialog(){
  udlgMode='pw';udlgDone=false;
  $('ubox').innerHTML=`<div class="fh"><span class="lp"><i aria-hidden="true">NL</i><b>PROEFRIT</b></span><button type="button" class="x" data-act="ucancel" aria-label="Sluiten">×</button></div>
    <div><h2 id="utitle">Nieuw wachtwoord</h2><p class="sub" style="margin:0">Kies een nieuw wachtwoord voor je account.</p></div>
    <form id="uform" class="stack" novalidate>
      <div><label class="l" for="u-pw">Nieuw wachtwoord</label><input id="u-pw" class="field" type="password" autocomplete="new-password"><p class="hint">Minstens 8 tekens.</p></div>
      <p class="err" id="u-err" role="alert"></p>
      <button class="cta" type="submit">Opslaan</button>
    </form>`;
  if(!udlg.open)udlg.showModal();
}
udlg.addEventListener('submit',async e=>{
  e.preventDefault();const err=$('u-err'),btn=e.target.querySelector('button.cta');err.textContent='';
  try{
    btn.disabled=true;
    if(udlgMode==='del'){
      const v=$('u-confirm').value.trim();
      if(v.toLowerCase()!==me().toLowerCase()){err.textContent='Typ je gebruikersnaam precies over om te bevestigen.';return}
      await deleteAccount(v);udlgDone=true;udlg.close();return;
    }
    if(udlgMode==='pw'){
      const pw=$('u-pw').value;if(pw.length<8){err.textContent='Kies een wachtwoord van minstens 8 tekens.';return}
      const r=await sbFetch(SB.url+'/auth/v1/user',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
      if(!r.ok)throw sbErr(await r.json().catch(()=>null),r.status);
      udlgDone=true;udlg.close();toast('Je nieuwe wachtwoord is opgeslagen.');
      if(!me())await afterAuth();
      return;
    }
    const name=$('u-name').value.trim(),by=+$('u-birth').value,bad=validName(name);
    if(bad){err.textContent=bad;return}
    if(!by){err.textContent='Kies je geboortejaar.';return}
    if(YEAR-by<MIN_AGE){err.textContent=`Je moet minstens ${MIN_AGE} jaar zijn om een account te maken. Rondkijken kan wel zonder account.`;return}
    await createProfile(name,by);
    try{localStorage.removeItem(PENDING_KEY)}catch(e){}
    udlgDone=true;udlg.close();await afterAuth();
  }catch(ex){err.textContent=ex.message}
  finally{btn.disabled=false}
});
udlg.addEventListener('cancel',e=>{if(udlgMode==='name')e.preventDefault()});
async function signOut(silent){
  try{if(sbSession)await sbFetch(SB.url+'/auth/v1/logout',{method:'POST',headers:{}})}catch(e){}
  sessSave(null);store.session='';store.chats={};OWNER=false;LV.myRow=null;LV.email='';inbox=null;modq=null;
  await reloadAll();
  if(!silent)toast('Je bent uitgelogd.');
}
function googleLogin(){
  location.href=SB.url+'/auth/v1/authorize?provider=google&redirect_to='+encodeURIComponent(appUrl());
}
/* Terugkomst van Google, een bevestigingsmail of een wachtwoordlink: de sessie staat in het #-deel van de URL */
async function readAuthHash(){
  const h=location.hash.slice(1);
  if(!/access_token=|error_description=|error=/.test(h))return '';
  const p=new URLSearchParams(h);
  history.replaceState(null,'',appUrl()+location.search);
  if(p.get('error_description')||p.get('error')){toast(nlMsg(p.get('error_description')||p.get('error')).replace(/\+/g,' '));return ''}
  sessSave(normSess({access_token:p.get('access_token'),refresh_token:p.get('refresh_token'),expires_at:p.get('expires_at'),expires_in:p.get('expires_in')}));
  const u=await authUser();
  if(!u){sessSave(null);toast('Inloggen lukte niet. Probeer het opnieuw.');return ''}
  sbSession.user=u;sessSave(sbSession);
  return p.get('type')||'login';
}
async function boot(){
  renderAcct();render();
  let kind='';
  try{kind=await readAuthHash()}catch(e){}
  try{await loadExtraCars()}catch(e){}
  if(sbSession&&!kind){const u=await authUser().catch(()=>null);if(!u)sessSave(null);else{sbSession.user=u;sessSave(sbSession)}}
  if(sbSession){
    let row=null;try{row=await loadMine()}catch(e){}
    if(row){store.session=row.username;LV.email=(sbSession.user&&sbSession.user.email)||''}
  }
  await reloadAll();
  if(kind==='recovery'){openPasswordDialog();return}
  if(sbSession&&!LV.myRow){await afterAuth();return}
  if(kind&&me()){afterLogin();return}
  if(me()){
    if(!profileOf(me()).onboarded)openOnboarding('new',1,null);
    else{const n=reqCount();if(n)toast(`Je hebt ${n} chatverzoek${n>1?'en':''}. Open Chat om te reageren.`);setTimeout(checkTicketReplies,n?6000:0)}
  }
}

/* ---------- Je eigen gegevens (AVG): downloaden en account verwijderen ---------- */
async function exportMyData(btn){
  const uid=sbUid();if(!uid)return;
  if(btn)btn.disabled=true;
  try{
    const q=(t,f)=>rest('GET',`${t}?select=*&${f||'user_id'}=eq.${uid}`).catch(()=>[]);
    const [profiel,garage,checkins,reacties,tops,tickets,fotos,gesprekken]=await Promise.all([
      q('profiles','id'),q('garage_items'),q('reviews'),q('comments'),q('likes'),q('tickets'),q('photo_submissions'),rest('GET','conversations?select=*').catch(()=>[])]);
    const berichten=gesprekken.length?await restIn('messages','*','conversation_id',gesprekken.map(c=>c.id)).catch(()=>[]):[];
    const data={uitgifte:new Date().toISOString(),uitleg:'Alle gegevens die Proefrit over je account bewaart. Van gesprekken staan ook de berichten van de ander erbij, omdat die bij het gesprek horen.',
      account:{email:LV.email},profiel,garage,checkins,reacties,top:tops,gesprekken,berichten,tickets,fotos};
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`proefrit-gegevens-${me()}.json`;document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000);
    toast('Je gegevens zijn gedownload als bestand.');
  }catch(e){toast('Downloaden lukte niet: '+e.message)}
  finally{if(btn)btn.disabled=false}
}
function openDeleteDialog(){
  udlgMode='del';udlgDone=false;
  $('ubox').innerHTML=`<div class="fh"><span class="lp"><i aria-hidden="true">NL</i><b>PROEFRIT</b></span><button type="button" class="x" data-act="ucancel" aria-label="Sluiten">×</button></div>
    <div><h2 id="utitle">Account verwijderen</h2><p class="sub" style="margin:0">Dit kan niet ongedaan worden gemaakt. We verwijderen je profiel, garage, check-ins, reacties, Top!’s, chats, ingestuurde foto’s en meldingen. Wil je je gegevens eerst bewaren? Kies dan eerst Mijn gegevens downloaden.</p></div>
    <form id="uform" class="stack" novalidate>
      <div><label class="l" for="u-confirm">Typ je gebruikersnaam (${esc(me())}) om te bevestigen</label><input id="u-confirm" class="field" autocomplete="off"></div>
      <p class="err" id="u-err" role="alert"></p>
      <button class="cta danger" type="submit">Account definitief verwijderen</button>
    </form>`;
  if(!udlg.open)udlg.showModal();
}
async function deleteAccount(confirmName){
  await fn('delete-account',{confirm:confirmName});
  sessSave(null);store.session='';store.chats={};OWNER=false;LV.myRow=null;LV.email='';inbox=null;modq=null;
  view={...view,name:'feed',user:null,chat:null};
  await reloadAll();window.scrollTo(0,0);
  toast('Je account en je gegevens zijn verwijderd.');
}

/* Melding beantwoord? Eén keer laten weten na het inloggen. */
async function checkTicketReplies(){
  const l=await ownServerTickets();let seen=[];
  try{seen=JSON.parse(localStorage.getItem('proefrit-antwoorden-gezien')||'[]')}catch(e){}
  const fresh=l.filter(t=>t.reply&&!seen.includes(t.id+'@'+t.repliedAt));
  if(!fresh.length)return;
  try{localStorage.setItem('proefrit-antwoorden-gezien',JSON.stringify(seen.concat(fresh.map(t=>t.id+'@'+t.repliedAt)).slice(-100)))}catch(e){}
  toast(fresh.length>1?'Het team heeft je meldingen beantwoord. Bekijk ze via Opmerking over de website onderaan.':'Het team heeft je melding beantwoord. Bekijk het via Opmerking over de website onderaan.');
}

/* ---------- Auto zoeken in formulieren: typ merk en/of model in plaats van door lange lijsten te scrollen ---------- */
const FIND_ALIAS={vw:'volkswagen',merc:'mercedes',benz:'mercedes',chevy:'chevrolet',landrover:'land',alfa:'alfa'};
function findCars(q,limit){
  const toks=lc(q).split(' ').filter(Boolean).map(t=>FIND_ALIAS[t]||t);
  if(!toks.length)return [];
  const q2=toks.join('');
  const hits=CARS.filter(c=>carHit(c,toks)||(q2.length>=3&&lc(c.brand+' '+c.model).replace(/ /g,'').includes(q2)));
  const name=c=>lc(c.brand+' '+c.model);
  const score=c=>{const n=name(c),m=lc(c.model);let s=0;
    if(toks.every(t=>(' '+n).includes(' '+t)))s+=4;          // alle woorden in merk of model zelf, niet alleen in een versie
    const last=toks[toks.length-1];
    if(m.startsWith(last))s+=2;
    if(m.split(' ').includes(last))s+=3;
    if(!c.rdw)s+=1;
    return s};
  return hits.map(c=>({c,s:score(c)})).sort((a,b)=>b.s-a.s||a.c.model.length-b.c.model.length||carName(a.c).localeCompare(carName(b.c),'nl')).slice(0,limit||8).map(x=>x.c);
}
function addCarFinder(p,onChange){
  const brand=$(p+'-brand');if(!brand||$(p+'-find'))return;
  const row=brand.closest('.two')||brand.parentElement;
  const box=document.createElement('div');box.className='finder';
  box.innerHTML=`<label class="l" for="${p}-find">Zoek je auto</label><input id="${p}-find" class="field" type="search" autocomplete="off" placeholder="Typ merk en model, bijvoorbeeld Golf of Ram 1500" aria-controls="${p}-findres" aria-autocomplete="list"><div class="hres finres" id="${p}-findres" role="listbox" hidden></div><p class="hint">Of kies hieronder merk en model uit de lijst.</p>`;
  row.parentElement.insertBefore(box,row);
  const inp=$(p+'-find'),res=$(p+'-findres');let list=[],act=-1;
  const show=()=>{
    list=findCars(inp.value,8);act=list.length?0:-1;
    if(!inp.value.trim()){res.hidden=true;return}
    res.innerHTML=list.length?list.map((c,i)=>`<button type="button" class="sr${i===act?' on':''}" role="option" data-find="${esc(c.id)}">${emblem(c.brand,'sm')}<span><b>${esc(carName(c))}</b><small>${years(c)} · ${BODY_NAME[bodyOf(c)]}</small></span></button>`).join(''):'<div class="none">Geen auto gevonden. Probeer een andere schrijfwijze, of kies hieronder uit de lijst.</div>';
    res.hidden=false;
  };
  const pick=id=>{setPicker(p,id,'','');autoFilled[p]=null;inp.value='';res.hidden=true;onChange&&onChange();const f=$(p+'-fuel');if(f&&!f.value)f.focus()};
  inp.addEventListener('input',show);
  inp.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!list.length)return;e.preventDefault();act=(act+(e.key==='ArrowDown'?1:-1)+list.length)%list.length;res.querySelectorAll('.sr').forEach((b,i)=>b.classList.toggle('on',i===act))}
    else if(e.key==='Enter'){e.preventDefault();if(list[act])pick(list[act].id)}
    else if(e.key==='Escape'){res.hidden=true}
  });
  res.addEventListener('mousedown',e=>e.preventDefault());
  res.addEventListener('click',e=>{const b=e.target.closest('[data-find]');if(b)pick(b.dataset.find)});
  inp.addEventListener('blur',()=>setTimeout(()=>{res.hidden=true},150));
}


/* ---------- Garage: volgorde van de groepen en van de auto's ---------- */
const GGROUPS={nu:['Rijdt nu','Rijd ik nu'],gereden:['Gereden','Gereden'],gehad:['Heeft gehad','Heb ik gehad'],droom:['Droomauto’s','Droomauto’s']};
const GDEFAULT=['nu','gereden','gehad','droom'];
const gOrder=p=>{const o=(p.garageOrder||[]).filter(k=>GDEFAULT.includes(k));return o.concat(GDEFAULT.filter(k=>!o.includes(k)))};
let gOrderOpen=false;
function drivenCars(name){
  const by={};
  reviewsOf(name).forEach(r=>{const x=by[r.car]||(by[r.car]={car:r.car,n:0,sum:0,last:0,ver:false,rid:r.id});x.n++;x.sum+=r.overall;if(r.ts>x.last){x.last=r.ts;x.rid=r.id}if(isVer(r))x.ver=true});
  return Object.values(by).sort((a,b)=>b.last-a.last);
}
function drivenItem(x){
  const c=carById(x.car);if(!c)return '';
  return `<div class="gitem">${carSvg(c,'mini')}<div class="gi"><div class="gt">${emblem(c.brand,'sm')}<button class="carlink sm" data-act="car" data-car="${esc(c.id)}">${esc(carName(c))}</button></div>
    <small>${x.n} ${x.n===1?'check-in':'check-ins'} · laatst ${ago(x.last)}</small>${x.ver?'<span class="stamp ok">✓ Geverifieerd</span>':''}</div>${plate(Math.round(x.sum/x.n*10)/10)}</div>`;
}
function garageHtmlLive(p,own,name){
  const driven=drivenCars(name);
  const out=gOrder(p).map(k=>{
    const t=GGROUPS[k][own?1:0];
    if(k==='gereden')return driven.length?`<div class="ggroup"><h4>${t} (${driven.length})</h4><div class="gitems">${driven.map(drivenItem).join('')}</div></div>`:'';
    const l=p.garage.filter(g=>g.status===k);
    return l.length?`<div class="ggroup"><h4>${t}${k==='droom'?' (top '+l.length+')':''}</h4><div class="gitems">${l.map(g=>garageItem(g,own)).join('')}</div></div>`:'';
  }).join('');
  return out||`<div class="empty">${own?'Je garage is nog leeg. Voeg de auto’s toe die je rijdt, had of graag wilt hebben. Auto’s waarin je een check-in doet, komen er vanzelf bij.':'Nog geen auto’s in de garage.'}</div>`;
}
function garageOrderHtml(p){
  const o=gOrder(p);
  return `<details class="gorder"${gOrderOpen?' open':''}><summary>Volgorde aanpassen</summary><p class="hint" style="margin:6px 0 0">Sleep de groepen in de volgorde die jij wilt. Zo zien anderen je garage ook.</p><ol id="gorder-list">${o.map(k=>`<li data-key="${k}">${gripBtn(GGROUPS[k][1])}<span>${GGROUPS[k][1]}</span></li>`).join('')}</ol>
    <button type="button" class="plain" data-act="gordreset">Terug naar de standaardvolgorde</button></details>`;
}
function bindGarageOrder(){makeSortable($('gorder-list'),order=>saveGarageOrder(order))}
async function saveGarageOrder(order){
  const p=profileOf(me());const prev=p.garageOrder;
  store.profiles[me()].garageOrder=order;gOrderOpen=true;render();bindGarageOrder();
  try{const rows=await rest('PATCH','profiles?id=eq.'+sbUid(),{garage_order:order},'return=representation');LV.myRow=rows[0]}
  catch(e){store.profiles[me()].garageOrder=prev;render();toast('Opslaan lukte niet: '+e.message)}
}
/* Garage beheren: per groep een lijst waarin je de auto's versleept */
function garageEditListLive(d){
  if(!d.garage.length)return '<p class="meta" style="margin:0">Nog geen auto’s in je garage.</p>';
  return ['nu','gehad','droom'].map(st=>{const l=d.garage.filter(g=>g.status===st);if(!l.length)return '';
    return `<div class="gedit"><h4>${GSTATUS[st]}${l.length>1?' <small>sleep om de volgorde te veranderen</small>':''}</h4><div class="stack gsort" data-status="${st}" style="gap:8px">${l.map(g=>{const c=carById(g.car);if(!c)return '';
      return `<div class="gitem" data-key="${esc(g.id)}">${l.length>1?gripBtn(carName(c)):''}${carSvg(c,'mini')}<div class="gi"><div class="gt">${emblem(c.brand,'sm')}<b>${esc(carName(c))}</b></div><small>${esc(fuelLabel(g.fuel||c.fuels[0]))}${g.year?' · '+esc(g.year):''}</small>${g.vp?'<span class="stamp ok">✓ Kenteken klopt</span>':''}</div><button type="button" class="x" data-act="gdel" data-gid="${esc(g.id)}" aria-label="${esc(carName(c))} verwijderen">×</button></div>`}).join('')}</div></div>`}).join('');
}
function bindGarageEdit(){
  document.querySelectorAll('#ob-glist .gsort').forEach(el=>makeSortable(el,async ids=>{
    const g=ob.draft.garage,st=el.dataset.status,same=ids.map(id=>g.find(x=>x.id===id)).filter(Boolean);
    const order=['nu','gehad','droom'].flatMap(s2=>s2===st?same:g.filter(x=>x.status===s2));
    order.forEach((x,n)=>x.pos=n);ob.draft.garage=order;saveProfile(me(),{garage:order});
    try{await Promise.all(same.map(x=>rest('PATCH','garage_items?id=eq.'+encodeURIComponent(x.id),{position:x.pos})))}
    catch(e){$('ga-err').textContent='Volgorde opslaan lukte niet: '+e.message}
  }));
}
document.addEventListener('toggle',e=>{if(e.target&&e.target.classList&&e.target.classList.contains('gorder'))gOrderOpen=e.target.open},true);

/* ---------- Slepen om de volgorde te veranderen (muis, touch en toetsenbord) ----------
   Pak een item aan het handvat (⠿) en sleep het. Met het toetsenbord: focus op het handvat en gebruik ↑ en ↓. */
const GRIP='<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="5.5" cy="3.5" r="1.4"/><circle cx="10.5" cy="3.5" r="1.4"/><circle cx="5.5" cy="8" r="1.4"/><circle cx="10.5" cy="8" r="1.4"/><circle cx="5.5" cy="12.5" r="1.4"/><circle cx="10.5" cy="12.5" r="1.4"/></svg>';
const gripBtn=label=>`<button type="button" class="grip" aria-label="${esc(label)} verplaatsen: sleep, of gebruik de pijltjestoetsen">${GRIP}</button>`;
function makeSortable(list,onDrop){
  if(!list||list.dataset.sortable)return;list.dataset.sortable='1';
  const items=()=>[...list.children].filter(el=>el.dataset.key);
  const done=()=>onDrop(items().map(el=>el.dataset.key));
  list.addEventListener('keydown',e=>{
    const g=e.target.closest('.grip');if(!g||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;
    e.preventDefault();const it=g.closest('[data-key]'),l=items(),i=l.indexOf(it),j=i+(e.key==='ArrowUp'?-1:1);
    if(j<0||j>=l.length)return;
    if(e.key==='ArrowUp')list.insertBefore(it,l[j]);else list.insertBefore(it,l[j].nextSibling);
    g.focus();done();
  });
  list.addEventListener('pointerdown',e=>{
    const g=e.target.closest('.grip');if(!g||e.button>0)return;
    const it=g.closest('[data-key]');if(!it)return;
    e.preventDefault();
    const r=it.getBoundingClientRect(),dy=e.clientY-r.top,start=items().map(x=>x.dataset.key).join();
    const ph=document.createElement(it.tagName);ph.className='sortph';ph.style.height=r.height+'px';
    it.after(ph);
    Object.assign(it.style,{position:'fixed',left:r.left+'px',top:r.top+'px',width:r.width+'px',zIndex:60,pointerEvents:'none'});
    it.classList.add('dragging');
    const move=ev=>{
      it.style.top=(ev.clientY-dy)+'px';
      if(ev.clientY>innerHeight-100)scrollBy(0,14);else if(ev.clientY<90)scrollBy(0,-14);   // meeschuiven bij de rand
      const others=items().filter(x=>x!==it);let before=null;
      for(const o of others){const b=o.getBoundingClientRect();if(ev.clientY<b.top+b.height/2){before=o;break}}
      if(before)list.insertBefore(ph,before);else list.appendChild(ph);
    };
    const up=()=>{
      document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);document.removeEventListener('pointercancel',up);
      ph.replaceWith(it);it.removeAttribute('style');it.classList.remove('dragging');
      if(items().map(x=>x.dataset.key).join()!==start)done();
    };
    document.addEventListener('pointermove',move);document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up);
  });
}

/* ---------- Aan de slag: vriendelijke checklist in plaats van een percentage ---------- */
function startList(name){
  const p=profileOf(name),n=reviewsOf(name).length;
  const steps=[
    ['Plaats je eerste check-in',n>0,'new','Ik heb gereden'],
    ['Zet een auto in je garage',p.garage.length>0,'editgarage','Auto toevoegen'],
    ['Kies een profielfoto',!!p.avatar,'editprofile','Foto kiezen'],
    ['Vertel iets over jezelf in je bio',!!p.bio,'editprofile2','Bio schrijven'],
    ['Kies waar je van houdt',p.interests.length>0,'editprofile2','Interesses kiezen']
  ];
  const done=steps.filter(s=>s[1]).length;
  if(done===steps.length)return '';
  return `<div class="startlist"><div class="row" style="justify-content:space-between;align-items:baseline"><b>Aan de slag</b><small class="meta">${done} van ${steps.length} gedaan</small></div>
    <ul>${steps.map(([t,ok,act,btn])=>`<li class="${ok?'ok':''}"><span class="ck" aria-hidden="true">${ok?'✓':''}</span><span class="st">${t}<span class="vh">${ok?' (gedaan)':''}</span></span>${ok?'':`<button type="button" class="plain" data-act="${act}">${btn}</button>`}</li>`).join('')}</ul></div>`;
}

/* ---------- Auto's zoeken: eerst ontdekken, de volledige lijst pas na een zoekterm of filter ---------- */
function discoverHtml(){
  const rv=all(),seen=new Set(),recent=[];
  rv.forEach(r=>{if(!seen.has(r.car)&&carById(r.car)){seen.add(r.car);recent.push(r.car)}});
  const cnt={};rv.forEach(r=>cnt[r.car]=(cnt[r.car]||0)+1);
  const most=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(id=>carById(id)).slice(0,6);
  const row=id=>{const c=carById(id),s=agg(rv.filter(r=>r.car===id));return `<button class="carrow" data-act="car" data-car="${esc(c.id)}">${emblem(c.brand)}
    <span class="ct"><span class="t">${esc(carName(c))}</span><span class="m">${years(c)} · ${BODY_NAME[bodyOf(c)]}</span></span>
    <span class="r"><span class="n">${s.n} ${s.n===1?'check-in':'check-ins'}</span>${plate(s.avg)}</span></button>`};
  let h='';
  if(recent.length)h+=`<h3 class="dh">Onlangs beoordeeld</h3>${recent.slice(0,6).map(row).join('')}`;
  if(most.length>2)h+=`<h3 class="dh">Meest beoordeeld</h3>${most.map(row).join('')}`;
  if(!recent.length)h+=`<div class="empty">Er zijn nog geen auto’s beoordeeld. Zoek de auto die jij onlangs reed en wees de eerste.</div>`;
  h+=`<div class="allcars"><p>Zoek hierboven op merk of model, kies een merk, of bekijk alle ${CARS.length.toLocaleString('nl-NL')} modellen.</p><button class="ghost sm" data-act="showall">Alle modellen tonen</button></div>`;
  return h;
}
