/* OKIKE Home v0.3: Administration is project authority; Finance is financial authority.
   Home is a read-only live projection of those records. */
(function homeIntegration(){
 'use strict';
 const ADMIN='okike_admin_prototype_v1', FINANCE='okike_accounting_v1', HOME='okike_internal_os_demo_v1';
 const safeRead=(key,fallback)=>{try{const x=JSON.parse(localStorage.getItem(key));return x&&typeof x==='object'?x:fallback}catch{return fallback}};
 const dateOnly=s=>{const d=new Date(s);return Number.isFinite(d.getTime())?d:null};
 const todayStart=()=>{const d=new Date();d.setHours(0,0,0,0);return d};
 function canonical(){
  const admin=safeRead(ADMIN,{clients:[],projects:[],tasks:[],enquiries:[]});
  const finance=safeRead(FINANCE,{requests:[],invoices:[],payments:[],notifications:[]});
  return {admin,finance};
 }
 function statusFor(p){
  if(p.cancelled)return 'Cancelled';
  if(p.mobilised)return 'Active';
  if((p.milestones||[]).length&&p.milestones.every(m=>m.status==='Verified'))return 'Completed';
  return 'Planning';
 }
 function phaseFor(p){
  if(p.cancelled)return 'Cancelled';
  if(p.mobilised)return 'Mobilised';
  const latest=(p.docs||[]).filter(d=>d.type==='SOW').at(-1);
  if(latest?.status==='Client approved')return 'Awaiting deposit / mobilisation';
  const quote=(p.docs||[]).filter(d=>String(d.type||'').includes('quotation')).at(-1);
  if(quote?.status==='Accepted')return 'Pre-mobilisation';
  if(quote)return 'Quotation · '+quote.status;
  return p.brief?'Brief recorded':'Client brief pending';
 }
 function verifiedProgress(p){
  const milestones=p.milestones||[];
  if(!milestones.length)return null;
  const verified=milestones.filter(m=>['Verified','Completed'].includes(m.status)).length;
  return Math.round(100*verified/milestones.length);
 }
 function dueMilestones(p){
  return (p.milestones||[]).map(m=>{
   const due=dateOnly(m.dueDate||m.due||m.date);
   if(!due||['Verified','Completed','Cancelled'].includes(m.status))return null;
   const days=Math.ceil((due.getTime()-todayStart().getTime())/86400000);
   return {name:m.name||'Milestone',due,days,projectId:p.id,projectName:p.name,status:m.status||'Planned'};
  }).filter(m=>m&&m.days>=0).sort((a,b)=>a.days-b.days);
 }
 function tasksFrom(admin,finance){
  const out=[];
  function push(id,text,dept,projectId){
   if(!text)return;
   out.push({id:'workflow-'+id,text,department:dept,projectId,priority:'Pending',done:false});
  }
  for(const e of admin.enquiries||[])if(['New','Follow-up needed'].includes(e.status))push('enquiry-'+e.id,'Assess enquiry · '+e.name,'Administration',null);
  for(const p of admin.projects||[]){
   if(p.cancelled)continue;
   const q=(p.docs||[]).filter(d=>String(d.type||'').includes('quotation')).at(-1);
   if(!q)push(p.id+'-brief',p.brief?'Prepare quotation · '+p.name:'Record design brief · '+p.name,p.brief?'Project Management':'Design',p.id);
   if(q&&q.status==='Submitted')push(p.id+'-quote','Review submitted quotation · '+p.name,'Administration',p.id);
   if(q&&q.status==='Ready to send')push(p.id+'-send','Dispatch quotation · '+p.name,'Administration',p.id);
   const sow=(p.docs||[]).filter(d=>d.type==='SOW').at(-1);
   if(sow&&sow.status?.startsWith('Awaiting'))push(p.id+'-sow','SOW approval · '+p.name,'Project Management',p.id);
   for(const m of p.milestones||[])if(m.status==='Submitted')push(p.id+'-ms-'+m.id,'Verify milestone · '+m.name,'Project Management',p.id);
  }
  for(const t of admin.tasks||[])if(!['Completed','Cancelled','Rejected'].includes(t.status)&&!t.done)push('admin-'+t.id,t.title||t.text,t.dept||'Administration',t.projectId);
  for(const r of finance.requests||[])if(!['Paid','Rejected'].includes(r.status))push('finance-'+r.id,'Purchase request · '+r.title+' ('+r.status+')',r.status==='Admin review'?'Administration':'Finance',r.project);
  return [...new Map(out.map(t=>[t.id,t])).values()];
 }
 function projection(){
  const {admin,finance}=canonical();
  const projects=(admin.projects||[]).map(p=>{
   const pending=(p.docs||[]).filter(d=>String(d.type||'').includes('quotation')).at(-1);
   const milestones=dueMilestones(p);
   const progress=verifiedProgress(p);
   return {id:p.id,name:p.name,clientId:p.clientId,service:p.service||'Not specified',description:p.brief||'',
    status:statusFor(p),phase:phaseFor(p),health:'Not assessed',manager:p.manager||'',location:p.location||'',
    created:p.created||'',progress:progress===null?0:progress,verifiedProgress:progress,daysToMilestone:milestones[0]?.days||0,
    nextMilestone:milestones[0]?.name||'',milestones,pendingQuotation:pending&&['Submitted','Ready to send','Sent','Changes requested'].includes(pending.status)?pending:null,
    quotations:pending&&['Submitted','Ready to send','Sent','Changes requested'].includes(pending.status)?[{status:'Pending',id:pending.id}]:[],
    events:(p.events||[]).map(e=>({date:e.at||e.date,text:e.text||''})),jobCycle:p.briefRevision||1};
  });
  // Home records must be the actual client/project set, never the original Home seed.
  return {version:1,clients:(admin.clients||[]).map(c=>({...c})),projects,tasks:tasksFrom(admin,finance),announcements:[]};
 }
 function applyProjection(){state=projection();}
 const legacyRender=render;
 render=function(){
  applyProjection();
  if(route.section==='Home'&&route.page==='Create'){route.page='Library';route.projectId=null;}
  legacyRender();
 };
 const originalHome=renderHome;
 renderHome=function(){
  let html=originalHome();
  html=html.replace('<button class="btn primary" data-create="Home">＋ New Project</button>','');
  html=html.replace('Demo chart: not connected to operational activity logs.','Activity counts are based only on dated project events recorded in Administration.');
  html=html.replace('Key actions and follow-ups for you.','Open workflow actions across departments (team-wide until employee login is implemented).');
  html=html.replace('Illustrative data for visual review.','Recorded monthly project activity.');
  if(!state.tasks.length)html=html.replace('<button class="inline-link" data-page="My Tasks"','<p class="note">No outstanding workflow tasks are recorded.</p><button class="inline-link" data-page="My Tasks"');
  if(!state.announcements.length)html=html.replace('<p style="text-align:right"><button class="inline-link" data-route="Announcements"','<p class="note">No company announcements recorded.</p><p style="text-align:right"><button class="inline-link" data-route="Announcements"');
  // Home is a monitoring view: its tasks are owned and completed by departments.
  html=html.replace(/<input type="checkbox" data-task="[^"]+"[^>]*>/g,'<span class="task-indicator" aria-hidden="true">◌</span>');
  return html;
 };
 const originalLibrary=renderLibrary;
 renderLibrary=function(){return originalLibrary().replace('<button class="btn primary" data-create="Home">＋ New Project</button>','');};
 const originalProject=renderProject;
 renderProject=function(){return originalProject().replace(/null% progress/g,'Progress not yet recorded');};
 activeRows=function(){
  return state.projects.filter(p=>p.status==='Active').map(p=>
   '<tr><td>'+escapeHtml(p.id)+'</td><td><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(p.description)+'</small></td>'
   +'<td>'+escapeHtml(p.phase)+'</td><td>'+statusLabel(p.status)+'</td>'
   +'<td>'+(p.verifiedProgress===null?'Not recorded':p.verifiedProgress+'%<span class="progress"><span style="width:'+p.verifiedProgress+'%"></span></span>')+'</td>'
   +'<td>'+escapeHtml(p.manager||'Unassigned')+'</td>'
   +'<td><div class="dots-wrap"><button class="dots" data-dots="'+escapeHtml(p.id)+'" title="Project actions">⋮</button>'+(menuProject===p.id?dotsMenu(p.id):'')+'</div></td></tr>'
  ).join('');
 };
 chart=function(){
  const points=[];const now=new Date();
  for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);points.push({key:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'),label:d.toLocaleString('en',{month:'short'}),count:0})}
  for(const p of state.projects)for(const e of p.events||[]){
   const d=dateOnly(e.date);if(!d)continue;const key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
   const month=points.find(x=>x.key===key);if(month)month.count++;
  }
  if(points.every(p=>p.count===0))return '<p class="note">No dated project activity has been recorded yet.</p>';
  const max=Math.max(1,...points.map(p=>p.count));
  const coords=points.map((p,i)=>[35+i*65,110-(p.count/max)*86]);
  return '<svg class="chart" viewBox="0 0 380 140" role="img" aria-label="Recorded project activity by month"><g stroke="var(--line)" stroke-width="1"><line x1="30" y1="110" x2="366" y2="110"/><line x1="30" y1="24" x2="366" y2="24"/></g>'
    +'<polyline fill="none" stroke="var(--orange)" stroke-width="2.5" points="'+coords.map(c=>c.join(',')).join(' ')+'"/>'
    +coords.map((c,i)=>'<circle cx="'+c[0]+'" cy="'+c[1]+'" r="4" fill="var(--panel)" stroke="var(--orange)" stroke-width="2"><title>'+points[i].label+': '+points[i].count+' events</title></circle>').join('')
    +points.map((p,i)=>'<text x="'+(25+i*65)+'" y="134" font-size="11" fill="var(--sub)">'+p.label+'</text>').join('')+'</svg>';
 };
 const previousMilestones=renderMilestones;
 renderMilestones=function(){
  const entries=state.projects.filter(p=>p.status==='Active').flatMap(p=>p.milestones);
  return '<div class="page-content">'+pageHeader('Upcoming Milestones','Dates recorded against verified Administration project records.')
    +'<section class="card card-pad">'+(entries.length?entries.sort((a,b)=>a.days-b.days).map(m=>
      '<div class="list-item"><span class="date-tile">IN<b>'+m.days+'</b>DAYS</span><div class="grow"><strong>'+escapeHtml(m.name)+'</strong><small>'+escapeHtml(m.projectName)+' · '+escapeHtml(m.projectId)+'</small></div></div>').join(''):'<p class="note">No upcoming dated milestones recorded for active projects.</p>')+'</section></div>';
 };
 const previousSettings=renderSettings;
 renderSettings=function(){
  const html=previousSettings();
  const card='<section class="card card-pad" style="max-width:750px;margin-top:15px"><h3>Demo Data</h3><p class="note">Start a new local demonstration. This erases the browser\'s OKIKE demo projects, enquiries, requisitions, invoices, payments, bank imports and quotation drafts. It does not delete deployed source code or other users\' browsers. Appearance settings are retained.</p><button class="btn" data-reset-demo style="border:1px solid #C96A32;color:var(--orange)">Reset Demo</button></section>';
  const closing='</div></div>';const i=html.lastIndexOf(closing);return i>=0?html.slice(0,i)+card+html.slice(i):html+card;
 };
 function emptyAdmin(){return {version:1,clients:[],enquiries:[],projects:[],tasks:[]}}
 function emptyFinance(){return {version:1,role:'Accounting',requests:[],invoices:[],payments:[],bank:[],journal:[],audit:[],notifications:[],opening:null,projectMeta:{},workOrders:[]}}
 function resetDemo(){
  const keys=['okike_new_build_quotation','okike_new_build_quotation_v2'];
  // Set known app stores to explicit empty data: reloading must not re-seed demos.
  localStorage.setItem(ADMIN,JSON.stringify(emptyAdmin()));
  localStorage.setItem(FINANCE,JSON.stringify(emptyFinance()));
  localStorage.setItem(HOME,JSON.stringify({version:1,clients:[],projects:[],tasks:[],announcements:[]}));
  for(const key of keys)localStorage.removeItem(key);
  location.reload();
 }
 document.addEventListener('click',function(event){
  const el=event.target.closest('button,a');if(!el)return;
  // Capture before Home's legacy click handler; Home cannot create projects.
  if(el.matches('[data-create]')){event.preventDefault();event.stopImmediatePropagation();navigate('Administration','Enquiries & Assessment');return}
  if(el.matches('[data-reset-demo]')){
    event.preventDefault();event.stopImmediatePropagation();
    openModal('Reset all OKIKE demo data?',
     '<p>This permanently clears demo data in this browser, including project records, enquiries, Finance transactions and quotation drafts.</p><p><strong>It cannot be undone.</strong> The repository and published website are not affected.</p>',
     '<button class="btn" data-modalclose>Cancel</button><button class="btn primary" data-confirm-reset>Yes, reset demo</button>');
    return;
  }
  if(el.matches('[data-confirm-reset]')){
    event.preventDefault();event.stopImmediatePropagation();resetDemo();
  }
 },true);
 window.addEventListener('message',function(event){
  if(event.origin!==location.origin)return;
  if(event.data?.type==='okike:administration-updated'&&route.section==='Home')render();
 });
 window.addEventListener('storage',function(event){
  if([ADMIN,FINANCE].includes(event.key)&&route.section==='Home')render();
 });
 applyProjection();
 render();
})();
