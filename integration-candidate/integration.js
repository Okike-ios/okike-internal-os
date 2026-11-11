/* OKIKE unified prototype integration layer. No external services or real financial posting. */
(function(){
 'use strict';
 const H='okike_internal_os_demo_v1',A='okike_admin_prototype_v1';
 const adminLabels=['My Workspace','My Tasks','Team Workspace','Messages','Company Documents','Policies & SOPs','Reporting Structure','Staff Directory','Enquiries & Assessment','Clients','Projects'];
 const roleName={'Accounting':'Finance','Admin':'Administration','PM':'Project Manager','Head of PM':'Head of Project Management','MD':'Managing Director'};
 sections.Administration.items=[...adminLabels,'Purchase Requisitions','Invoice Dispatch'];
 sections.Finance.items=sections.Finance.items.map(x=>x==='Accounting Inbox'?'Finance Inbox':x);
 // Finance underlying handler uses the original page key, so map only the presentation label.
 const beforeFinanceView=financeView;
 financeView=function(page){return beforeFinanceView(page==='Finance Inbox'?'Accounting Inbox':page)};
 // Supplement placeholder areas with actual workflow handoff status, never fabricate completed work.
 function adminState(){try{return JSON.parse(localStorage.getItem(A))||{projects:[],tasks:[],enquiries:[]}}catch{return{projects:[],tasks:[],enquiries:[]}}}
 function stats(){const a=adminState();const docs=(a.projects||[]).flatMap(p=>(p.docs||[]).map(d=>({...d,projectId:p.id,projectName:p.name})));return{admin:a,docs,design:(a.projects||[]).flatMap(p=>(p.designRequests||[]).map(d=>({project:p,request:d}))),handoffs:(a.tasks||[]).filter(t=>t.status==='Open')}}
 function panel(title,rows,empty='No related handoffs have been recorded in the prototype yet.'){
    return `<section class="card card-pad"><div class="panel-title"><div><h2>${escapeHtml(title)}</h2></div></div><div class="integration-list">${rows.length?rows.slice(0,12).map(r=>`<div class="integration-item"><strong>${escapeHtml(r.title)}</strong><small>${escapeHtml(r.detail)}</small></div>`).join(''):`<p class="note">${escapeHtml(empty)}</p>`}</div></section>`
 }
 function summary(section,projectId){const x=stats();const scoped=x.admin.projects?.filter(p=>!projectId||p.id===projectId)||[];
 const tasks=x.handoffs.filter(t=>(!projectId||t.projectId===projectId));const docs=x.docs.filter(d=>!projectId||d.projectId===projectId);
 let rows=[];
 if(section==='Design')rows=[...x.design.filter(d=>!projectId||d.project.id===projectId).map(d=>({title:`${d.project.name} · ${d.request.kind||'Design revision'}`,detail:`${d.project.id} · ${d.request.status||'Pending'} · Administration handoff`})),...tasks.filter(t=>t.dept==='Design').map(t=>({title:t.title,detail:`${t.projectId} · ${t.status}`}))];
 if(section==='Media')rows=[...tasks.filter(t=>t.dept==='Media').map(t=>({title:t.title,detail:`${t.projectId} · ${t.status}`})),...scoped.flatMap(p=>(p.milestones||[]).filter(m=>m.media).map(m=>({title:m.name,detail:`${p.id} · ${m.status||'Planned'} · Media evidence ${m.evidence?.length||0}`})))];
 if(section==='Project Management')rows=[...docs.filter(d=>d.type?.includes('quotation')).map(d=>({title:`${d.projectName} · ${d.type} v${d.version}`,detail:`${d.projectId} · ${d.status}`})),...tasks.filter(t=>['PM','Head of PM','Project Management'].includes(t.dept)).map(t=>({title:t.title,detail:`${t.projectId} · ${t.status}`}))];
 if(section==='Home')rows=[...tasks.map(t=>({title:t.title,detail:`${t.projectId} · Assigned to ${roleName[t.dept]||t.dept}`})),...ac.notifications.map(n=>({title:n.text,detail:`Finance · ${n.date}`}))];
 return `<div class="integration-note"><strong>Connected workflow view</strong> · Read-only handoffs from Administration and Finance sample records. For approvals or edits, open the owning department. Demo records are browser-local; quotation cost calculations remain in the protected New Build forms.</div>`+panel('Department handoffs and records',rows,section==='Media'?'No Media request or milestone evidence yet.':'No current cross-department handoffs.')
 }
 function routeAdmin(page,projectId){const frame=`<iframe id="adminModule" class="department-module" title="OKIKE Administration" src="modules/administration/index.html" loading="eager"></iframe>`;
   return `<div class="integration-note"><strong>Administration</strong> · Full workflow prototype in the shared OKIKE workspace. Project records and identifiers are aligned with the Home project library.</div>`+frame;
 }
 const originalRender=render;
 render=function(){originalRender();const c=document.getElementById('content');const page=route.page;
   if(route.section==='Administration'&&!['Purchase Requisitions','Invoice Dispatch'].includes(page)){
     c.innerHTML=routeAdmin(page,route.projectId);const frame=c.querySelector('#adminModule');frame.addEventListener('load',()=>{try{frame.contentWindow.postMessage({type:'okike:admin-nav',page:adminLabels.includes(page)?page:'My Workspace',projectId:route.projectId},location.origin)}catch{}});
   }else if(['Home','Project Management','Design','Media'].includes(route.section)){
     if(route.section==='Home'&&page==='Create')return;
     if(route.section==='Project Management'&&services.includes(page)){
       const quotation=page==='New Build'?`<a class="btn primary" href="../OKIKE-IOS-Quotation-v04/Quotation-new%20build/project-info.html">Open protected New Build quotation form</a>`:'<span class="note">The service quotation form is not connected in this integration branch.</span>';
       c.insertAdjacentHTML('beforeend',`<section class="card card-pad"><h2>${escapeHtml(page)} quotation</h2><div class="integration-actions">${quotation}</div></section>`)
     }
     c.insertAdjacentHTML('beforeend',summary(route.section,route.projectId));
   }
   const sel=document.getElementById('acRole');if(sel)for(const option of sel.options)option.textContent=roleName[option.value]||option.value;
 };
 const originalNavigate=navigate;
 navigate=function(section,page='Dashboard',projectId=null,projectSection=null){if(section==='Finance'&&page==='Finance Dashboard')return originalNavigate(section,page,projectId,projectSection);return originalNavigate(section,page,projectId,projectSection)};
 // Refresh on external frame writes without overwriting the currently open form.
 window.addEventListener('storage',event=>{if(event.key===A){if(route.section!=='Administration')render();}if(event.key===H){try{const updated=JSON.parse(event.newValue);if(updated?.projects){state=updated;if(route.section!=='Administration')render()}}catch{}}});
 window.addEventListener('message',event=>{if(event.origin!==location.origin)return;if(event.data?.type==='okike:administration-updated'&&route.section!=='Administration')render()});
 // Original Finance function replaces the top-right header. Keep role and theme controls as demo-only.
 render();
})();
