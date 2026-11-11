/* OKIKE demo login and department navigation boundary.
   This controls the prototype UI only. It is NOT authentication or data security. */
(function accessExperience(){
 'use strict';
 const STORAGE='okike_demo_session_v1';
 const departments=['Administration','Finance','Project Management','Design','Media','General'];
 const gate=document.getElementById('accessGate');
 const app=document.getElementById('app');
 let session=null;

 function readSession(){
  try{
   const value=JSON.parse(sessionStorage.getItem(STORAGE)||'null');
   return value&&typeof value.name==='string'&&value.name.trim()&&departments.includes(value.department)
    ?{name:value.name.trim().slice(0,80),department:value.department}:null;
  }catch(e){return null}
 }
 function permitted(section){
  return !!session&&(session.department==='General'||section==='Home'||section==='Settings'||section===session.department);
 }
 function requiredSection(){
  return route.section==='Home'&&route.projectId&&route.projectSection&&route.projectSection!=='Overview'
   ?route.projectSection:route.section;
 }
 function showGate(){
  document.body.classList.remove('access-pending');
  document.body.classList.add('access-locked');
  if(app)app.setAttribute('aria-hidden','true');
  gate.hidden=false;
  gate.innerHTML='<section class="access-login" aria-labelledby="accessTitle">'
   +'<div class="access-brand"><div class="access-logo">OKIKE</div><small>INTERNAL OS</small></div>'
   +'<h1 id="accessTitle">Welcome to OKIKE</h1>'
   +'<p class="hint">Enter your name and choose your department to access the demonstration workspace.</p>'
   +'<form id="accessForm" autocomplete="off">'
   +'<label class="access-field"><span>Full name</span><input name="employeeName" required minlength="2" maxlength="80" placeholder="Enter your name" autocomplete="name"></label>'
   +'<label class="access-field"><span>Department</span><select name="department" required>'
   +'<option value="" selected disabled>Select your department</option>'
   +departments.map(d=>'<option value="'+escapeHtml(d)+'">'+escapeHtml(d)+'</option>').join('')
   +'</select></label>'
   +'<button class="access-submit" type="submit">Enter OKIKE Internal OS</button>'
   +'</form><p class="access-disclaimer">Demonstration login only. No password or real user authentication is connected.</p>'
   +'</section>';
  gate.querySelector('input')?.focus();
 }
 function reveal(){
  gate.hidden=true;
  gate.innerHTML='';
  document.body.classList.remove('access-pending','access-locked');
  app?.removeAttribute('aria-hidden');
 }
 function denied(section){
  const target=session.department==='General'?'Home':session.department;
  renderNav();
  const title=document.getElementById('topTitle');
  if(title)title.textContent='Access Restricted';
  document.getElementById('content').innerHTML=
    '<section class="access-denied" role="status">'
    +'<span class="access-lock" aria-hidden="true">♙</span>'
    +'<h1>Department Access Restricted</h1>'
    +'<p>Your demo login is assigned to <strong>'+escapeHtml(session.department)
    +'</strong>. You cannot open the <strong>'+escapeHtml(section)
    +'</strong> workspace using this login.</p>'
    +'<button class="btn primary" data-access-return>Return to '+escapeHtml(target)+'</button>'
    +'</section>';
 }
 function setHeader(){
  const header=document.querySelector('.top-right');
  if(!header||!session)return;
  header.innerHTML='<div class="access-session">'
   +'<span class="demo-pill" title="Demo-only visibility, not actual authorization">DEMO SESSION</span>'
   +'<button class="btn" data-ac="theme" aria-label="Toggle light/dark mode">'+(prefs.theme==='dark'?'☀ Light':'☾ Dark')+'</button>'
   +'<div class="access-header">'
   +'<button type="button" class="access-user-button" data-access-profile aria-expanded="false">'
   +'<span class="access-person"><strong>'+escapeHtml(session.name)+'</strong><small>'+escapeHtml(session.department)+'</small></span>'
   +' <span aria-hidden="true">▾</span><span class="sr-only"> Profile</span></button>'
   +'<div class="access-profile-menu" id="accessProfileMenu" hidden><p>'+escapeHtml(session.name)
   +' · '+escapeHtml(session.department)+'</p><button type="button" data-access-logout>Log Out</button></div>'
   +'</div></div>';
 }
 const originalRender=render;
 render=function(){
  if(!session){showGate();return}
  reveal();
  const section=requiredSection();
  if(!permitted(section)){
   denied(section);
   setHeader();
   return;
  }
  originalRender();
  setHeader();
 };
 function logOut(){
  try{sessionStorage.removeItem(STORAGE)}catch(e){}
  session=null;
  const root=document.getElementById('modalRoot');
  if(root)root.innerHTML='';
  route={section:'Home',page:'Dashboard',projectId:null,projectSection:null};
  showGate();
 }
 gate.addEventListener('submit',event=>{
  if(event.target.id!=='accessForm')return;
  event.preventDefault();
  const data=new FormData(event.target);
  const name=String(data.get('employeeName')||'').trim().replace(/\s+/g,' ').slice(0,80);
  const department=String(data.get('department')||'');
  if(name.length<2||!departments.includes(department))return;
  session={name,department};
  try{sessionStorage.setItem(STORAGE,JSON.stringify(session))}catch(e){}
  route={section:'Home',page:'Dashboard',projectId:null,projectSection:null};
  expanded=null;
  render();
 });
 document.addEventListener('click',event=>{
  const t=event.target.closest('button,a');
  if(!t||!session)return;
  if(t.hasAttribute('data-access-profile')){
   event.preventDefault();event.stopImmediatePropagation();
   const menu=document.getElementById('accessProfileMenu');
   if(menu){menu.hidden=!menu.hidden;t.setAttribute('aria-expanded',String(!menu.hidden))}
   return;
  }
  if(t.hasAttribute('data-access-logout')){
   event.preventDefault();event.stopImmediatePropagation();logOut();return;
  }
  if(t.hasAttribute('data-access-return')){
   event.preventDefault();event.stopImmediatePropagation();
   navigate(session.department==='General'?'Home':session.department);
   return;
  }
  const menu=document.getElementById('accessProfileMenu');
  if(menu&&!t.closest('#accessProfileMenu'))menu.hidden=true;
 },true);
 session=readSession();
 if(session)render();else showGate();
 window.OKIKE_DEMO_ACCESS={isAllowed:permitted,getSession:()=>session?{...session}:null};
})();
