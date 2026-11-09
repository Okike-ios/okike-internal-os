/* Shared navigation and interaction preferences for the quotation workflow. */
(()=>{'use strict';
const PREF='okike_internal_os_preferences_v1';
const sections=[['Home','⌂'],['Administration','♧'],['Finance','▤'],['Project Management','♙'],['Design','◩'],['Media','▧'],['Settings','⚙']];
const pages={'Administration':'My Workspace','Finance':'Finance Dashboard','Project Management':'PM Dashboard','Design':'Design Dashboard','Media':'Media Dashboard'};
const serviceNames=['Carpentry','Upholstery','New Build','Renovation','Interior Design','Landscape and Exterior Facade','Other Services'];
let prefs={theme:'light',sound:true,vibration:true,collapsed:false};
function read(){try{prefs={...prefs,...JSON.parse(localStorage.getItem(PREF)||'{}')}}catch(e){}document.body.dataset.theme=prefs.theme==='dark'?'dark':'light'}
function path(s,p){return '../OKIKE-HomeScreen-v01/home.html'+(s==='Home'?'':'?section='+encodeURIComponent(s)+(p?'&page='+encodeURIComponent(p):''))}
function render(){
  read();
  const side=document.getElementById('okikeSharedSidebar');
  if(!side)return;
  side.classList.toggle('minimized',!!prefs.collapsed);
  const subPages=['PM Dashboard','Projects','Quotations','Project Tracker','Schedules & Milestones','Site Inspections','Progress Reports','Client Records'];
  side.innerHTML=`<div class="brand-bar"><div class="brand-copy"><b>OKIKE</b><small>Internal OS</small></div><button type="button" class="sidebar-toggle" id="okikeCollapse" aria-label="${prefs.collapsed?'Expand':'Minimize'} sidebar" aria-expanded="${!prefs.collapsed}" title="${prefs.collapsed?'Expand':'Minimize'} sidebar">${prefs.collapsed?'☷':'☰'}</button></div><nav id="okikeSideNav" aria-label="Main navigation">${sections.filter(x=>x[0]!=='Settings').map(([name,icon])=>`<div class="nav-entry"><a class="nav-main ${name==='Project Management'?'active':''}" href="${path(name,pages[name])}" title="${name}"><span class="nav-icon">${icon}</span><span class="nav-label">${name}</span>${name!=='Home'?'<span class="nav-arrow">'+(name==='Project Management'?'⌄':'›')+'</span>':''}</a>${name==='Project Management'?`<div class="nav-sub">${subPages.map(p=>`<a ${p==='Quotations'?'class="selected" aria-current="page"':''} href="${path(name,p)}">${p}</a>`).join('')}</div>`:''}</div>`).join('')}</nav><div class="sidebar-footer"><a class="nav-main" href="${path('Settings')}" title="Settings"><span class="nav-icon">⚙</span><span class="nav-label">Settings</span></a></div>`;
  side.querySelector('#okikeCollapse').addEventListener('click',()=>{
    prefs.collapsed=!prefs.collapsed;
    try{localStorage.setItem(PREF,JSON.stringify(prefs))}catch(e){}
    render();
  });
}

window.OKIKEPreferences={get:()=>({...prefs}),refresh:render};
window.playFeedback=(type='success')=>{if(!prefs.sound)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type='sine';osc.frequency.value=type==='error'?230:type==='remove'?350:650;gain.gain.setValueAtTime(.0001,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.04,ctx.currentTime+.01);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.11);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.12);osc.onended=()=>ctx.close().catch(()=>{})}catch(e){}};
window.vibrateFeedback=(pattern=25)=>{if(!prefs.vibration)return;try{navigator.vibrate?.(pattern)}catch(e){}};
window.addEventListener('storage',e=>{if(e.key===PREF)render()});window.addEventListener('focus',render);render();
})();
