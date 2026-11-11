(async function smoke(){
 const {chromium}=require('playwright');
 const origin='http://127.0.0.1:8765/integration-candidate/index.html';
 const assert=(value,message)=>{if(!value)throw Error(message)};
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 async function openSection(section){
  await page.locator('[data-nav="'+section+'"]').first().click();
  await page.waitForTimeout(450);
 }
 try{
  await page.goto(origin,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(500);
  assert(await page.locator('[data-nav="Administration"]').count()>0,'IOS sidebar missing');
  assert(await page.locator('#acRole').count()===0,'Old testing role selector is visible');
  await openSection('Administration');
  assert(await page.locator('#okikeDepartmentFrame').count()===1,'Administration workflow not mounted');
  let admin=page.frameLocator('#okikeDepartmentFrame');
  await admin.locator('.heading').first().waitFor({timeout:12000});
  assert(await admin.locator('#role').count()===0,'Embedded testing role selector still displayed');
  assert((await admin.locator('.heading').first().innerText()).includes('Your workspace'),'Administration workspace did not load');
  await page.locator('[data-page="Invoice Dispatch"][data-section="Administration"]').first().click();
  assert(await page.locator('.accounting').count()===1,'Administration invoice dispatch missing');
  assert(await page.locator('#okikeDepartmentFrame').count()===0,'Finance should not be embedded inside Administration');
  assert(await page.evaluate(()=>ac.role)==='Admin','Administration invoice dispatch cannot operate as Admin');
  await openSection('Design');
  let design=page.frameLocator('#okikeDepartmentFrame');
  await design.locator('.heading').first().waitFor({timeout:12000});
  assert((await design.locator('.heading').first().innerText()).includes('Design workspace'),'Design workspace is not scoped');
  assert(!(await design.locator('.heading').first().innerText()).includes('New enquiry'),'Design sees Administration enquiry prompt');
  await page.locator('[data-page="Design Projects"][data-section="Design"]').first().click();
  await design.locator('.heading').first().waitFor({timeout:12000});
  assert(await design.locator('#role').count()===0,'Design role selector should not exist');
  await openSection('Media');
  let media=page.frameLocator('#okikeDepartmentFrame');
  await media.locator('.heading').first().waitFor({timeout:12000});
  assert((await media.locator('.heading').first().innerText()).includes('Media workspace'),'Media workspace not scoped');
  await openSection('Project Management');
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
    const home=state.projects[0];
    const admin={version:1,projects:[{id:home.id,briefRevision:2,mobilised:false,docs:[{type:'Estimate quotation',status:'Accepted',total:912345},{type:'SOW',status:'Client approved'}]}]};
    localStorage.setItem('okike_admin_prototype_v1',JSON.stringify(admin));
    return {id:home.id,meta:meta(home.id)};
  });
  assert(snapshot.meta.quotation===912345,'Finance does not read authoritative accepted quotation');
  assert(snapshot.meta.sow==='Client approved','Finance does not read authoritative SOW state');
  assert(snapshot.meta.cycle===2,'Finance job cycle did not sync');
  assert(errors.length===0,'Browser errors: '+errors.join('; '));
  console.log('PASS: Department routing, quotation preservation, role-selector removal, finance ownership, cross-department read models.');
 }finally{
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exit(1)});
