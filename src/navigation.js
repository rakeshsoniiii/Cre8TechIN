const header=document.querySelector('.c8-navigation');
const bell=document.querySelector('#notifications-toggle'),panel=document.querySelector('#notifications-panel'),theme=document.querySelector('#theme-toggle');
const escapeText=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storage={get(key){try{return localStorage.getItem(key);}catch{return null;}},set(key,value){try{localStorage.setItem(key,value);}catch{}}};
function setTheme(value){document.documentElement.dataset.theme=value;theme.setAttribute('aria-pressed',String(value==='light'));theme.setAttribute('aria-label',`Switch to ${value==='light'?'dark':'light'} theme`);theme.textContent=value==='light'?'☾':'☼';storage.set('c8-theme',value);}
setTheme(storage.get('c8-theme')==='light'?'light':'dark');
theme.addEventListener('click',()=>setTheme(document.documentElement.dataset.theme==='light'?'dark':'light'));
function closeNotifications(){panel.hidden=true;bell.setAttribute('aria-expanded','false');}
bell.addEventListener('click',()=>{panel.hidden=!panel.hidden;bell.setAttribute('aria-expanded',String(!panel.hidden));});
document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target)&&!bell.contains(e.target))closeNotifications();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){closeNotifications();bell.focus();}});
if(!header.classList.contains('header')){
 const toggle=header.querySelector('.menu-toggle');
 function closeMenu(){header.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
 toggle.addEventListener('click',()=>{const open=header.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
 header.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&header.classList.contains('open')){closeMenu();toggle.focus();}});
}
// Load the auth client only after the navigation itself works.
import('./client.js').then(async({db})=>{
 const {data:{session}}=await db.auth.getSession();if(!session)return;
 const link=document.querySelector('#account-link');link.href='/dashboard.html';link.querySelector('.nav-copy').textContent='Dashboard';
 const {data,error}=await db.from('c8_applications').select('reference,status,review_note,updated_at').order('updated_at',{ascending:false}).limit(10);
 const items=document.querySelector('#notification-items');
 if(error){items.textContent='Updates could not be loaded. Open your workspace to retry.';return;}
 const lastSeen=storage.get(`c8-notifications-${session.user.id}`)||'';
 const unread=data.filter(a=>a.updated_at>lastSeen).length;
 const badge=document.querySelector('#notification-count');badge.hidden=!unread;badge.textContent=String(unread);
 items.innerHTML=data.length?`<button id="mark-read" class="c8-read">Mark all read</button>${data.map(a=>`<a class="c8-update" href="/dashboard.html"><strong>${escapeText(a.status.replaceAll('_',' '))}</strong><small>${escapeText(a.reference)}</small><p>${escapeText(a.review_note||'Your application is saved in your workspace.')}</p></a>`).join('')}`:'<p>You’re all caught up. Application updates will appear here.</p>';
 document.querySelector('#mark-read')?.addEventListener('click',()=>{storage.set(`c8-notifications-${session.user.id}`,new Date().toISOString());badge.hidden=true;document.querySelector('#mark-read').textContent='All read';});
}).catch(()=>{document.querySelector('#notification-items').textContent='Sign in to your workspace to view updates.';});
