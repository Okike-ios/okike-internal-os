(function departmentRouter(){
 'use strict';
 const ADMIN_PAGES=['My Workspace','My Tasks','Team Workspace','Enquiries & Assessment','Clients','Projects','Company Documents','Messages','Policies & SOPs','Reporting Structure','Staff Directory'];
 const PM_PAGES=['PM Dashboard','Projects','Quotations','Project Tracker','SOW & Mobilisation','Schedules & Milestones','Purchase Requisitions','Work Orders','Site Inspections','Progress Reports','Client Records'];
 const DESIGN_PAGES=['Design Dashboard','Design Projects','Client Briefs','Design Revisions','Working Drawings','3D Visualizations','Mood Boards','Approved Designs'];
 const MEDIA_PAGES=['Media Dashboard','Media Assignments','Project Photography','Media Library','Content Calendar','Social Media','Brand Assets'];
 const FINANCE_PAGES=['Finance Dashboard','Finance Inbox','Purchase Requisitions','Project Finances','Income & Payments','Expenses','Invoices','Bank Statements','Review Queue','Reconciliation','Financial Reports','Opening Balances','Audit Log'];
 sections.Administration.items=ADMIN_PAGES;
 sections.Finance.items=FINANCE_PAGES;
 sections['Project Management'].items=PM_PAGES;
 sections.Design.items=DESIGN_PAGES;
 sections.Media.items=MEDIA_PAGES;
 const quotationURL='../OKIKE-IOS-Quotation-v04/Quotation-new%20build/project-info.html';
 const roleFor={Administration:'Admin',Finance:'Accounting','Project Management':'PM',Design:'Design',Media:'Media'};
 const ownerText={
  Administration:'Client intake, correspondence, quotation dispatch and administrative records',
  Finance:'Invoices, payments, purchase controls and financial reporting',
  'Project Management':'Quotations, project execution, SOW preparation and milestone evidence',
  Design:'Client briefs, scope revisions and design handoffs',
  Media:'Project documentation assignments and milestone evidence'
 };
 const financeOwned=new Set(['Finance Dashboard','Finance Inbox','Project Finances','Income & Payments','Expenses','Invoices','Bank Statements','Review Queue','Reconciliation','Financial Reports','Opening Balances','Audit Log']);
 function header(section,page,subtitle){
  return '<div class="page-content department-title">'+pageHeader(page,subtitle || ownerText[section] || '', '')+'</div>';
 }
 function moduleFrame(section,page,projectId){
  const role=roleFor[section];
  const target=(section==='Administration'
    ? ({'My Workspace':'My Workspace','My Tasks':'My Tasks','Team Workspace':'Team Workspace','Enquiries & Assessment':'Enquiries & Assessment','Clients':'Clients','Projects':'Projects','Company Documents':'Company Documents','Messages':'Messages','Policies & SOPs':'Policies & SOPs','Reporting Structure':'Reporting Structure','Staff Directory':'Staff Directory'}[page]||'My Workspace')
    : page.includes('Projects')||page==='Client Records'||page==='Client Briefs'||page==='Design Revisions'||page==='SOW & Mobilisation'||page==='Project Tracker'?'Projects':'My Tasks');
  return '<iframe class="department-module" id="okikeDepartmentFrame" title="'+escapeHtml(section)+' operational workspace" src="modules/administration/index.html" data-workspace="'+escapeHtml(section)+'" data-role="'+role+'" data-target="'+target+'" data-project="'+escapeHtml(projectId||'')+'"></iframe>';
 }
 function dispatchModule(){
   const f=document.getElementById('okikeDepartmentFrame');
   if(!f)return;
   const send=()=>{try{f.contentWindow.postMessage({type:'okike:department-context',department:f.dataset.workspace,role:f.dataset.role,page:f.dataset.target,projectId:f.dataset.project||null},location.origin)}catch(e){console.warn('Department context unavailable',e)}};
   f.addEventListener('load',send);
   if(f.contentDocument?.readyState==='complete')send();
 }
 function servicesView(){
  return '<section class="card card-pad"><h2>Quotation services</h2><p class="note">Only New Build has a connected quotation form. Other service workflows remain outside this integration.</p><div class="section-link-grid">'+services.map(s=>'<button data-service="'+escapeHtml(s)+'"><span>▤</span>'+escapeHtml(s)+'</button>').join('')+'</div><p class="note">Project Management owns scope and quotation calculations. Administration owns client dispatch and response records.</p></section>';
 }
 function landing(section,items){
  return '<section class="card card-pad"><h2>'+escapeHtml(section)+' activities</h2><p class="note">Choose an activity to open its departmental workflow.</p><div class="section-link-grid">'+items.map(p=>'<button data-page="'+escapeHtml(p)+'" data-section="'+escapeHtml(section)+'">'+escapeHtml(p)+' <span class="tile-arrow">↗</span></button>').join('')+'</div></section>';
 }
 function financePanel(page,section){
  ac.role=roleFor[section]||'Accounting';
  const financePage=page==='Finance Inbox'?'Accounting Inbox':page;
  return financeView(financePage);
 }
 function showDepartment(section,page,projectId){
  let s=section;
  if(section==='Finance'){
   if(projectId) return header(s,'Project finances',ownerText[s])+financePanel('Project Finances',s);
   return financePanel(page==='Dashboard'?'Finance Dashboard':page,s);
  }
  if(section==='Administration'&&(page==='Purchase Requisitions'||page==='Invoice Dispatch')){
   return financePanel(page,s);
  }
  if(section==='Project Management'&&(page==='Purchase Requisitions'||page==='Work Orders')){
   return financePanel(page,s);
  }
  const items=sections[s]?.items||[];
  if(page==='Dashboard') return header(s,s+' workspace')+landing(s,items)+moduleFrame(s,'My Tasks',projectId);
  if(s==='Project Management'&&page==='Quotations'){
   return header(s,'Quotations')+servicesView()+moduleFrame(s,'Projects',projectId);
  }
  if(s==='Project Management'&&services.includes(page)){
   const link=page==='New Build'?'<a class="btn primary" href="'+quotationURL+'">Open New Build quotation</a>':'<p class="note">This service quotation workflow is not connected yet.</p>';
   return header(s,page+' quotation')+'<section class="card card-pad">'+link+'</section>';
  }
  const pending=new Set(['Working Drawings','3D Visualizations','Mood Boards','Approved Designs','Project Photography','Media Library','Content Calendar','Social Media','Brand Assets','Site Inspections','Progress Reports']);
  if(pending.has(page))return header(s,page)+'<section class="card card-pad"><h2>'+escapeHtml(page)+'</h2><p class="note">No independently implemented workflow for this activity was present in the supplied departmental source. It has not been fabricated as a finished function.</p></section>';
  return header(s,page)+moduleFrame(s,page,projectId);
 }
 const defaultRender=baseRender;
 render=function(){
  defaultRender();
  const section=(route.projectId&&route.section==='Home')?(route.projectSection||'Home'):route.section;
  const page=route.page||'Dashboard';
  const content=document.getElementById('content');
  if(section!=='Home'&&section!=='Settings'){
    content.innerHTML=showDepartment(section,page,route.projectId);
  }
  const title=document.getElementById('topTitle');
  if(title)title.textContent=section==='Home'?title.textContent:section;
  const head=document.querySelector('.top-right');
  if(head){
   const identity='<span class="demo-pill" title="Browser-only prototype; identity and authorization are not connected">LOCAL PROTOTYPE</span>';
   head.innerHTML=identity+'<button class="btn" data-ac="theme" aria-label="Toggle light/dark mode">'+(prefs.theme==='dark'?'☀ Light':'☾ Dark')+'</button>';
  }
  dispatchModule();
 };
 window.addEventListener('message',event=>{
  if(event.origin!==location.origin)return;
  if(event.data?.type==='okike:administration-updated'){
    try{
      const saved=JSON.parse(localStorage.getItem('okike_internal_os_demo_v1'));
      if(saved?.version===1&&Array.isArray(saved.projects)&&Array.isArray(saved.clients))state=saved;
    }catch(e){}
    if(route.section==='Home')render();
  }
 });
 window.addEventListener('storage',event=>{
  if(event.key==='okike_admin_prototype_v1'||event.key==='okike_accounting_v1'||event.key==='okike_internal_os_demo_v1'){
   if(event.key==='okike_internal_os_demo_v1'){try{const updated=JSON.parse(event.newValue);if(updated?.projects&&updated?.clients)state=updated}catch(e){}}
   if(!document.querySelector('#acForm')&&!document.querySelector('#okikeDepartmentFrame form:focus'))render();
  }
 });
 render();
})();
