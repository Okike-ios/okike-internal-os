/* New Build Quotation — Project Information (shared storage with later steps). */
const STORAGE_KEY='okike_new_build_quotation';
const form=document.getElementById('quotationForm');
const saveButton=document.getElementById('saveDraft');
const saveStatus=document.getElementById('saveStatus');
const toast=document.getElementById('toast');
function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}
function readData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{}}catch(e){return {}}}
function saveDraft(){
  const prior=readData();const fields={};
  form.querySelectorAll('input[name],select[name],textarea[name]').forEach(field=>{fields[field.name]=field.type==='checkbox'?field.checked:field.value});
  // Preserve prior constructionScope/workDetails and the original flat keys for compatibility.
  const next={...prior,...fields,projectInformation:{...(prior.projectInformation||{}),...fields},lastUpdated:new Date().toISOString()};
  try{localStorage.setItem(STORAGE_KEY,JSON.stringify(next));saveStatus.textContent='Saved locally';notify('Project information saved.');window.playFeedback?.('success');return true}
  catch(e){saveStatus.textContent='Save failed';notify('Unable to save — check browser storage.');window.playFeedback?.('error');return false}
}
function loadDraft(){const data=readData(),values=data.projectInformation||data;form.querySelectorAll('input[name],select[name],textarea[name]').forEach(field=>{if(Object.prototype.hasOwnProperty.call(values,field.name)){if(field.type==='checkbox')field.checked=!!values[field.name];else field.value=values[field.name]??''}});if(Object.keys(values).length)saveStatus.textContent='Draft restored'}
form.addEventListener('input',()=>saveStatus.textContent='Unsaved changes');
saveButton.addEventListener('click',saveDraft);
form.addEventListener('submit',e=>{e.preventDefault();if(!form.checkValidity()){form.reportValidity();return}if(saveDraft())window.location.href='construction-scope.html'});
loadDraft();
