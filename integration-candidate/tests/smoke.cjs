(async function smoke(){
 const {chromium}=require('playwright');
 const origin='http://127.0.0.1:8765/integration-candidate/index.html';
 const assert=(value,message)=>{if(!value)throw Error(message)};
 const browser=await chromium.launch({headless:true,executablePath:process.env.OKIKE_CHROMIUM||undefined,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 async function openSection(section){
  await page.locator('[data-nav="'+section+'"]').first().click();
  await page.waitForTimeout(450);
 }
 async function checkSingleScrollbar(section){
  const frame=page.frameLocator('#okikeDepartmentFrame');
  await frame.locator('.heading').first().waitFor({timeout:12000});
  await page.waitForTimeout(240);
  const dims=await page.locator('#okikeDepartmentFrame').evaluate(el=>{
   const inner=el.contentDocument;
   return {
    frameHeight:el.getBoundingClientRect().height,
    bodyScroll:inner.body.scrollHeight,
    docScroll:inner.documentElement.scrollHeight,
    overflow:getComputedStyle(inner.body).overflowY,
    parentScrollable:document.documentElement.scrollHeight>innerHeight+3
   };
  });
  assert(dims.overflow==='hidden',section+' still has an independent vertical scrollbar');
  assert(dims.frameHeight+5>=Math.max(dims.bodyScroll,dims.docScroll),section+' iframe is shorter than its content: '+JSON.stringify(dims));
 }
 async function checkSharedProjects(section){
  const frame=page.frameLocator('#okikeDepartmentFrame');
  const card=frame.locator('.department-metric-link');
  await card.waitFor({timeout:12000});
  const label=card.locator('.metric-label'),number=card.locator('strong');
  const l=await label.boundingBox(),n=await number.boundingBox();
  assert(l&&n&&n.y>=l.y+l.height-1,section+' Shared Projects count must appear below label');
  const assigned=frame.locator('.department-metric').first();
  const a=await assigned.locator('.metric-label').boundingBox();
  const b=await assigned.locator('strong').boundingBox();
  assert(a&&b&&b.y>=a.y+a.height-1,section+' Assigned Actions number must appear below label');
  assert(await card.getAttribute('data-page')==='Projects',section+' Shared Projects is not linked to project list');
  await card.click();
  await frame.locator('.heading').first().waitFor({timeout:12000});
  assert((await frame.locator('.heading').first().innerText()).includes('Project library'),section+' Shared Projects did not open project library');
 }
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(500);
  assert(await page.locator('#accessForm').isVisible(),'New browser must open the demo login screen');
  assert(await page.locator('#app').getAttribute('aria-hidden')==='true','Application must be hidden before login');
  await page.locator('#accessForm [name="employeeName"]').fill('OKIKE Test General');
  await page.locator('#accessForm [name="department"]').selectOption('General');
  await page.locator('#accessForm button[type="submit"]').click();
  await page.locator('#accessForm').waitFor({state:'detached',timeout:10000});
  assert((await page.evaluate(()=>window.OKIKE_DEMO_ACCESS.getSession())).department==='General','General demo login not established');
  assert(await page.locator('[data-nav="Administration"]').count()>0,'IOS sidebar missing');
  assert(await page.locator('#acRole').count()===0,'Old testing role selector is visible');
  await openSection('Administration');
  assert(await page.locator('#okikeDepartmentFrame').count()===1,'Administration workflow not mounted');
  let admin=page.frameLocator('#okikeDepartmentFrame');
  await admin.locator('.heading').first().waitFor({timeout:12000});
  assert(await admin.locator('#role').count()===0,'Embedded testing role selector still displayed');
  assert((await admin.locator('.heading').first().innerText()).includes('Your workspace'),'Administration workspace did not load');
  await checkSingleScrollbar('Administration');
  const homeAfterAdmin=await page.evaluate(()=>{
    const data=JSON.parse(localStorage.getItem('okike_admin_prototype_v1'));
    return {projects:data.projects.length,clients:data.clients.length};
  });
  await openSection('Home');
  const homeProjection=await page.evaluate(()=>({projects:state.projects.length,clients:state.clients.length,active:state.projects.filter(p=>p.status==='Active').length,seedProjects:state.projects.some(p=>p.name==='DUSL Doors')}));
  assert(homeProjection.projects===homeAfterAdmin.projects,'Home project list differs from Administration');
  assert(homeProjection.clients===homeAfterAdmin.clients,'Home clients differ from Administration');
  assert(!homeProjection.seedProjects,'Home retained unrelated legacy seed projects');
  assert(await page.locator('[data-create]').count()===0,'Home still exposes direct project creation');
  await openSection('Settings');
  await page.locator('[data-setting="theme"][data-value="dark"]').click();
  await openSection('Administration');
  await page.frameLocator('#okikeDepartmentFrame').locator('body.dark').waitFor({timeout:12000});
  const darkBackground=await page.frameLocator('#okikeDepartmentFrame').locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
  assert(darkBackground!=='rgb(245, 243, 237)'&&darkBackground!=='rgb(255, 255, 255)','Administration retained a light background under dark mode');
  await openSection('Design');
  await page.frameLocator('#okikeDepartmentFrame').locator('body.dark').waitFor({timeout:12000});
  await openSection('Settings');
  await page.locator('[data-setting="theme"][data-value="light"]').click();
  await openSection('Administration');
  await admin.locator('.heading').first().waitFor({timeout:12000});
  await page.locator('[data-page="Invoice Dispatch"][data-section="Administration"]').first().click();
  assert(await page.locator('.accounting').count()===1,'Administration invoice dispatch missing');
  assert(await page.locator('#okikeDepartmentFrame').count()===0,'Finance should not be embedded inside Administration');
  assert(await page.evaluate(()=>ac.role)==='Admin','Administration invoice dispatch cannot operate as Admin');
  await openSection('Design');
  let design=page.frameLocator('#okikeDepartmentFrame');
  await design.locator('.heading').first().waitFor({timeout:12000});
  assert((await design.locator('.heading').first().innerText()).includes('Design workspace'),'Design workspace is not scoped');
  await checkSingleScrollbar('Design');
  await checkSharedProjects('Design');
  assert(!(await design.locator('.heading').first().innerText()).includes('New enquiry'),'Design sees Administration enquiry prompt');
  await page.locator('[data-page="Design Projects"][data-section="Design"]').first().click();
  await design.locator('.heading').first().waitFor({timeout:12000});
  assert(await design.locator('#role').count()===0,'Design role selector should not exist');
  await openSection('Media');
  let media=page.frameLocator('#okikeDepartmentFrame');
  await media.locator('.heading').first().waitFor({timeout:12000});
  assert((await media.locator('.heading').first().innerText()).includes('Media workspace'),'Media workspace not scoped');
  await checkSingleScrollbar('Media');
  await checkSharedProjects('Media');
  await openSection('Project Management');
  await checkSingleScrollbar('Project Management');
  await checkSharedProjects('Project Management');
  await page.locator('[data-page="Quotations"][data-section="Project Management"]').first().click();
  assert(await page.locator('[data-service="New Build"]').count()===1,'New Build quote service missing');
  await page.locator('[data-service="New Build"]').first().click();
  assert((await page.locator('a[href*="project-info.html"]').count())===1,'Protected quotation entry not linked');
  await page.locator('[data-page="Purchase Requisitions"][data-section="Project Management"]').first().click();
  assert(await page.evaluate(()=>ac.role)==='Project Manager','Project Management requisition not assigned to Project Manager context');
  await openSection('Finance');
  assert(await page.evaluate(()=>ac.role)==='Accounting','Finance operative context incorrect');
  assert(await page.locator('.accounting').count()===1,'Finance working screens missing');
  assert(await page.locator('#acRole').count()===0,'Finance testing role selector present');
  assert(await page.locator('#okikeDepartmentFrame').count()===0,'Finance should not open Administration iframe');
  const snapshot=await page.evaluate(()=>{
    const admin={version:1,clients:[{id:'CL-TEST-01',name:'Test Client'}],enquiries:[],tasks:[],projects:[{id:'OK-TEST-001',name:'Test Project',clientId:'CL-TEST-01',brief:'Test scope',service:'New Build',briefRevision:2,mobilised:false,docs:[{type:'Estimate quotation',status:'Accepted',total:912345},{type:'SOW',status:'Client approved'}],milestones:[],events:[]}]};
    localStorage.setItem('okike_admin_prototype_v1',JSON.stringify(admin));
    return {id:'OK-TEST-001',meta:meta('OK-TEST-001')};
  });
  assert(snapshot.meta.quotation===912345,'Finance does not read authoritative accepted quotation');
  assert(snapshot.meta.sow==='Client approved','Finance does not read authoritative SOW state');
  assert(snapshot.meta.cycle===2,'Finance job cycle did not sync');
  await openSection('Home');
  assert(await page.evaluate(()=>state.projects.length===1&&state.projects[0].id==='OK-TEST-001'),'Home did not refresh canonical Administration project identity');
  await openSection('Finance');
  await openSection('Settings');
  await page.locator('[data-reset-demo]').click();
  assert(await page.locator('[data-confirm-reset]').count()===1,'Reset Demo confirmation missing');
  await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('[data-confirm-reset]').click()]);
  const empty=await page.evaluate(()=>{
    const a=JSON.parse(localStorage.getItem('okike_admin_prototype_v1'));
    const f=JSON.parse(localStorage.getItem('okike_accounting_v1'));
    return {a:a.projects.length,enquiries:a.enquiries.length,finance:f.requests.length,home:state.projects.length};
  });
  assert(empty.a===0&&empty.enquiries===0&&empty.finance===0&&empty.home===0,'Reset Demo did not clear all test records');
  await openSection('Administration');
  assert(await page.frameLocator('#okikeDepartmentFrame').locator('body').evaluate(()=>state.projects.length)===0,'Administration re-seeded old data after reset');
  await openSection('Home');
  assert(await page.evaluate(()=>state.projects.length)===0,'Home repopulated sample projects after reset');
  // Session survives refresh, without re-entering the login form.
  await page.reload({waitUntil:'domcontentloaded'});
  assert(!(await page.locator('#accessForm').isVisible()),'Demo login should persist on refresh');
  await page.locator('[data-access-profile]').click();
  assert(await page.locator('[data-access-logout]').isVisible(),'Log Out missing from profile menu');
  await page.locator('[data-access-logout]').click();
  assert(await page.locator('#accessForm').isVisible(),'Logout must return to login screen');
  assert(await page.evaluate(()=>localStorage.getItem('okike_admin_prototype_v1')!==null),'Logout erased business data');
  await page.locator('#accessForm [name="employeeName"]').fill('OKIKE Design Tester');
  await page.locator('#accessForm [name="department"]').selectOption('Design');
  await page.locator('#accessForm button[type="submit"]').click();
  assert((await page.evaluate(()=>window.OKIKE_DEMO_ACCESS.getSession())).department==='Design','Design login not stored');
  await openSection('Home');
  assert(!(await page.locator('.access-denied').count()),'Home must be shared by all departments');
  await openSection('Settings');
  assert(!(await page.locator('.access-denied').count()),'Settings must remain accessible');
  await openSection('Finance');
  assert(await page.locator('.access-denied').count()===1,'Finance must be restricted for Design');
  assert(await page.locator('#okikeDepartmentFrame').count()===0,'Restricted Finance must not mount a frame');
  assert(await page.locator('.accounting').count()===0,'Restricted Finance must not render accounting');
  await page.locator('[data-access-return]').click();
  assert(!(await page.locator('.access-denied').count()),'Return to Design should restore access');
  await openSection('Project Management');
  assert(await page.locator('.access-denied').count()===1,'Project Management must be restricted for Design');
  await page.evaluate(()=>{
    const data=JSON.parse(localStorage.getItem('okike_admin_prototype_v1'));
    data.clients.push({id:'CL-ACCESS',name:'Access Test Client'});
    data.projects.push({id:'OK-ACCESS-001',name:'Access Test Project',clientId:'CL-ACCESS',service:'New Build',brief:'',docs:[],milestones:[],events:[],mobilised:false});
    localStorage.setItem('okike_admin_prototype_v1',JSON.stringify(data));
    navigate('Home','Project','OK-ACCESS-001','Finance');
  });
  assert(await page.locator('.access-denied').count()===1,'Direct cross-department Home project tab must be restricted');
  await page.reload({waitUntil:'domcontentloaded'});
  assert((await page.evaluate(()=>window.OKIKE_DEMO_ACCESS.getSession())).department==='Design','Selected department did not persist across refresh');
  await openSection('Design');
  assert(!(await page.locator('.access-denied').count()),'Design workspace should be accessible');
  assert(errors.length===0,'Browser errors: '+errors.join('; '));
  console.log('PASS: Branded demo access, role-restricted navigation, General access, logout, persistence, departmental workflows, scrolling, Home and Reset Demo.');
 }finally{
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
