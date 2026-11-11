/* Administration adapter. The workflow engine in app.js is preserved. */
(function(){
 'use strict';
 const HOME_KEY='okike_internal_os_demo_v1',ADMIN_KEY='okike_admin_prototype_v1';
 document.body.classList.add('embedded');
 const roleNames={'Admin':'Administration','PM':'Project Manager','Head of PM':'Head of Project Management','Finance':'Finance','Head of Finance':'Head of Finance','MD':'Managing Director','Design':'Design','Media':'Media'};
 function notify(){try{window.parent.postMessage({type:'okike:administration-updated'},location.origin)}catch{}}
 function synchronize(){
   let home;try{home=JSON.parse(localStorage.getItem(HOME_KEY))}catch{return}
   if(!home||!Array.isArray(home.projects)||!Array.isArray(home.clients))return;
   // Match by project name before assigning canonical identity; never replace workflow documents.
   for(const p of state.projects){
     let h=home.projects.find(x=>x.name.toLowerCase()===p.name.toLowerCase());
     if(!h){h={id:p.id,name:p.name,description:p.brief||'',service:p.service,status:'Planning',progress:0,phase:'Project initiation',clientId:p.clientId,quotations:[],events:[]};
       if(home.projects.some(x=>x.id===h.id)){let n=Math.max(0,...home.projects.map(x=>Number(x.id.match(/\d+$/)?.[0])||0))+1;h.id='OK-2026-'+String(n).padStart(3,'0')}
       let client=state.clients.find(c=>c.id===p.clientId);let known=home.clients.find(c=>c.name.toLowerCase()===client?.name?.toLowerCase());
       if(!known&&client){let n=Math.max(0,...home.clients.map(x=>Number(x.id.match(/\d+$/)?.[0])||0))+1;known={...client,id:'CL-'+String(n).padStart(4,'0')};home.clients.push(known)}
       if(known)h.clientId=known.id;
       home.projects.push(h);
     }
     let old=p.id;p.id=h.id;p.clientId=h.clientId;
     for(const t of state.tasks)if(t.projectId===old)t.projectId=h.id;
   }
   // Add recently created Home projects to Administration; an existing workflow record always wins.
   for(const h of home.projects){if(state.projects.some(p=>p.id===h.id))continue;
     const c=home.clients.find(c=>c.id===h.clientId);if(c&&!state.clients.some(x=>x.id===c.id))state.clients.push({...c});
     state.projects.push({id:h.id,name:h.name,clientId:h.clientId,service:h.service||'Other Services',route:'Design first',brief:h.description||'',docs:[],milestones:[],mobilised:false,events:[]});
   }
   // Canonical clients resolve by the same Client ID in every department.
   state.clients=home.clients.map(c=>({...c}));
   localStorage.setItem(ADMIN_KEY,JSON.stringify(state));localStorage.setItem(HOME_KEY,JSON.stringify(home));
 }
 // Run after initial app.js state load; save original app render and mutate implementations.
 try{synchronize()}catch(e){console.warn('OKIKE demo sync skipped:',e)}
 const originalRender=render;
 render=function(){originalRender();const select=document.getElementById('role');if(select){for(const opt of select.options)opt.textContent=roleNames[opt.value]||opt.value}
   const target=document.getElementById('app');const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT);let textNode;while(textNode=walker.nextNode()){const parent=textNode.parentElement;if(parent&&['SCRIPT','STYLE','TEXTAREA','OPTION'].includes(parent.tagName))continue;const value=textNode.nodeValue;const clean=value.replace(/\bHead of PM\b/g,'Head of Project Management').replace(/\bPM\b/g,'Project Manager').replace(/\bMD\b/g,'Managing Director').replace(/\bAdmin\b/g,'Administration');if(clean!==value)textNode.nodeValue=clean}
   document.body.classList.add('embedded')};
 const originalMutate=mutate;
 mutate=function(fn){const success=originalMutate(fn);if(success){try{synchronize()}catch(e){console.warn('Project sync skipped',e)}notify()}return success};
 window.addEventListener('message',e=>{if(e.origin!==location.origin)return;if(e.data?.type==='okike:admin-nav'){go(e.data.page||'My Workspace',e.data.projectId||null)}if(e.data?.type==='okike:home-updated'){try{synchronize();render()}catch{}}});
 render();notify();
})();
