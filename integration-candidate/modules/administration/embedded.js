(function departmentAdapter(){
 'use strict';
 const HOME_KEY='okike_internal_os_demo_v1';
 const ADMIN_KEY='okike_admin_prototype_v1';
 const supported={Administration:'Admin','Project Management':'PM',Design:'Design',Media:'Media'};
 let currentDepartment='Administration';
 let currentRole='Admin';
 document.body.classList.add('embedded','department-contained');
 function warn(message){console.warn('[OKIKE integration]',message)}
 function communicate(){
  // Persist the same derived cross-department queue shown by the Administration workflow.
  try{localStorage.setItem('okike_admin_work_queue_v1',JSON.stringify(queue().map(t=>({id:t.id||'',title:t.title||'',sub:t.sub||'',dept:t.dept||'',status:t.status||'',pid:t.pid||'',enquiry:t.enquiry||''}))))}catch(e){warn(e.message)}
  try{parent.postMessage({type:'okike:administration-updated',department:currentDepartment},location.origin)}catch(e){}
 }
 function syncRecords(){ /* Administration owns project identity; Home is a read-only projection. */ }
 try{syncRecords()}catch(e){warn(e.message)}
 const nativeDashboard=dashboard;
 dashboard=function(){
  if(currentDepartment==='Administration')return nativeDashboard();
  const assigned=queue().filter(item=>item.dept===currentRole);
  const projects=state.projects||[];
  return heading(currentDepartment+' workspace','Department assignments and project handoffs.')
   +'<div class="metrics"><div class="metric"><strong>'+assigned.length+'</strong><small>Assigned actions</small></div><div class="metric"><strong>'+projects.length+'</strong><small>Shared projects</small></div></div>'
   +'<section class="card pad"><div class="row"><h2>Department work queue</h2><button class="btn" data-page="Projects">View projects</button></div>'
   +actionsTable(assigned)+'</section>';
 };
 const nativeProjectPage=projectPage;
 const nativeCancellationPanel=cancellationPanel;
 cancellationPanel=function(p){return ['Design','Media'].includes(currentDepartment)?'':nativeCancellationPanel(p)};
 projectPage=function(){
  const project=currentProject();
  if(!project)return '';
  if(currentDepartment==='Design'){
   return heading(project.name,project.id+' · Design brief and revisions','<button class="btn" data-page="Projects">← Design Projects</button>')
    +briefPanel(project)+designRequestPanel(project)+historyButtons(project);
  }
  if(currentDepartment==='Media'){
   const mediaTasks=queue().filter(t=>t.pid===project.id&&t.dept==='Media');
   const milestones=(project.milestones||[]).filter(m=>m.media);
   return heading(project.name,project.id+' · Media assignments','<button class="btn" data-page="Projects">← Media Projects</button>')
    +'<section class="card pad"><h2>Media assignments</h2>'+actionsTable(mediaTasks)+'</section>'
    +'<section class="card pad" style="margin-top:14px"><h2>Milestone documentation</h2>'
    +(milestones.length?milestones.map(m=>'<div class="activity"><strong>'+esc(m.name)+'</strong> · '+badge(m.status)+'</div>').join(''):'<p class="muted">No linked Media milestones yet.</p>')
    +'</section>';
  }
  if(!['Administration','Project Management'].includes(currentDepartment))return '';
  const allowed=currentDepartment==='Administration'
   ? ['Overview','Brief & Quotation','SOW & Mobilisation','Progress & Requests','Documents & Activity']
   : ['Overview','Brief & Quotation','SOW & Mobilisation','Progress & Requests','Documents & Activity'];
  if(!allowed.includes(tab))tab='Overview';
  const markup=nativeProjectPage();
  const wrapper=document.createElement('div');wrapper.innerHTML=markup;
  wrapper.querySelectorAll('[data-tab]').forEach(button=>{if(!allowed.includes(button.dataset.tab))button.remove()});
  if(currentDepartment==='Administration')wrapper.querySelectorAll('[data-action="quotation"],[data-action="sow"],[data-action="milestone"]').forEach(button=>button.remove());
  return wrapper.innerHTML;
 };
 // Store the initial Administration demo only once; Home must never generate projects.
 try{if(!localStorage.getItem(ADMIN_KEY))localStorage.setItem(ADMIN_KEY,JSON.stringify(state))}catch(e){warn(e.message)}
 const nativeRender=render;
 const nativeHeading=heading;
 heading=function(title,description,action){
   return nativeHeading(title,description,action).replace('Administration / ',currentDepartment+' / ');
 };
 render=function(){
  role=currentRole;
  nativeRender();
  document.body.classList.add('embedded','department-contained');
  const select=document.getElementById('role');
  if(select)select.remove();
 };
 const nativeMutate=mutate;
 mutate=function(fn){
  const ok=nativeMutate(fn);
  if(ok){try{syncRecords()}catch(e){warn(e.message)}communicate()}
  return ok;
 };
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  const message=event.data||{};
  if(message.type==='okike:department-context'){
   const assigned=supported[message.department];
   if(!assigned || message.role!==assigned){warn('Rejected invalid department context');return}
   currentDepartment=message.department;
   currentRole=assigned;
   prefs.theme=message.theme==='dark'?'dark':'light';
   role=assigned;
   taskFilter=assigned;
   const validPages=['My Workspace','My Tasks','Team Workspace','Enquiries & Assessment','Clients','Projects','Company Documents','Messages','Policies & SOPs','Reporting Structure','Staff Directory'];
   const destination=validPages.includes(message.page)?message.page:'My Tasks';
   const project=message.projectId&&state.projects.some(p=>p.id===message.projectId)?message.projectId:null;
   try{syncRecords()}catch(e){warn(e.message)}
   go(project?'Project':destination,project);
  }
  if(message.type==='okike:home-updated'){
   try{syncRecords();render()}catch(e){warn(e.message)}
  }
 });
 render();
 communicate();
})();
