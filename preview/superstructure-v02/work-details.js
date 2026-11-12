
const STORAGE_KEY = "okike_superstructure_preview_v02_only";

// ==========================================
// PAGE ELEMENTS
// ==========================================

const stageView = document.getElementById("stageView");
const activityView = document.getElementById("activityView");
const wizardView = document.getElementById("wizardView");
const reviewView = document.getElementById("reviewView");

const stageList = document.getElementById("stageList");
const activityList = document.getElementById("activityList");
const stepContent = document.getElementById("stepContent");

const toast = document.getElementById("toast");
const saveStatus = document.getElementById("saveStatus");

const steps = [
  "Work Details",
  "Materials & Equipment",
  "Labour",
  "Logistics",
  "Other Cost"
];

// ==========================================
// CONSTRUCTION ACTIVITIES
// ==========================================

const preliminariesActivities = [
  "Site inspection and assessment",
  "Site survey and assessment",
  "Site clearing",
  "Site stripping",
  "Demolition and removal",
  "Site excavation preparation",
  "Site levelling and grading",
  "Earthwork disposal",
  "Temporary site facilities",
  "Temporary utilities",
  "Site security and protection",
  "Access preparation",
  "Mobilisation"
];

// OK-QNB-002 — Substructure stage catalogue and quantity-measurement rules.
// Foundation type is an applicability aid, not an engineering design decision.
const substructureActivities = [
  "Setting out of foundations",
  "Excavation for foundation works",
  "Excavation support and groundwater control",
  "Foundation bed preparation and blinding",
  "Foundation reinforcement works",
  "Foundation formwork",
  "Foundation concrete works",
  "Foundation blockwork / substructure walling",
  "Foundation column starters and starter bars",
  "Ground beam reinforcement works",
  "Ground beam formwork",
  "Ground beam concrete works",
  "Substructure waterproofing and damp-proofing",
  "Foundation backfilling and compaction",
  "Substructure inspections and testing"
];
const FOUNDATION_TYPES = ["Not specified", "Strip foundation", "Pad foundation", "Raft foundation", "Piled foundation", "Combined / other"];
const substructureFields = {
  "Setting out of foundations": [
    ["drawingRef", "Structural drawing and revision", "text", true], ["layoutRef", "Foundation layout / grid reference"],
    ["benchmark", "Benchmark and formation reference"], ["siteDimensions", "Site / building dimensions"],
    ["foundationPoints", "Number of setting-out points", "number"], ["method", "Surveying method / equipment"],
    ["boundaries", "Boundary and setback verification"], ["notes", "Obstructions / setting-out notes", "textarea"]],
  "Excavation for foundation works": [
    ["drawingRef", "Excavation drawing reference", "text", true], ["excavationType", "Excavation type", "select", false, ["Trench", "Pad pit", "Raft excavation", "Other"]],
    ["existingLevel", "Existing ground level / datum"], ["formationLevel", "Formation level / datum"],
    ["soil", "Ground / soil condition"], ["method", "Method", "select", false, ["Manual", "Mechanical", "Combined"]],
    ["workingSpace", "Working-space allowance (describe / verify)"], ["reuseDisposal", "Spoil reuse / disposal scope reference"],
    ["services", "Existing services and obstructions", "textarea"]],
  "Excavation support and groundwater control": [
    ["supportStatus", "Support requirement", "select", true, ["Required by design", "Not required as verified", "Requires assessment"]],
    ["temporaryWorksRef", "Temporary works design reference"], ["supportType", "Support / shoring type"],
    ["groundwater", "Groundwater status / assessment"], ["dewatering", "Dewatering method"],
    ["pumps", "Pumps and equipment description"], ["durationDays", "Anticipated operating duration (days)", "number"],
    ["discharge", "Discharge location and permissions"], ["safety", "Safety / temporary works notes", "textarea"]],
  "Foundation bed preparation and blinding": [
    ["bedCondition", "Formation condition", "text", true], ["preparation", "Preparation / improvement method"],
    ["blinding", "Blinding required?", "select", true, ["Yes", "No", "Not yet determined"]],
    ["material", "Blinding material / concrete grade"], ["inspection", "Formation inspection / approval status"],
    ["notes", "Subgrade improvement and notes", "textarea"]],
  "Foundation reinforcement works": [
    ["elementRef", "Footing / raft element reference", "text", true], ["drawingRef", "Rebar drawing / bar bending schedule"],
    ["steelGrade", "Reinforcement grade"], ["barShape", "Bar shape / arrangement"],
    ["cover", "Concrete cover (mm)", "number"], ["lap", "Lap / anchorage specification"],
    ["chairs", "Spacers / chairs requirements"], ["notes", "Reinforcement notes", "textarea"]],
  "Foundation formwork": [
    ["elementRef", "Foundation element reference", "text", true], ["faces", "Required formed faces / layout"],
    ["material", "Formwork material"], ["reuse", "Reuse arrangement"], ["bracing", "Support / bracing requirements"],
    ["finish", "Concrete face finish requirement"], ["removal", "Stripping / removal notes", "textarea"]],
  "Foundation concrete works": [
    ["elementRef", "Foundation element reference", "text", true], ["grade", "Specified concrete grade / mix"],
    ["supply", "Supply method", "select", false, ["Site-mixed", "Ready-mixed", "To be decided"]],
    ["placement", "Placement and compaction method"], ["joints", "Construction joints reference"],
    ["curing", "Curing requirements"], ["tests", "Testing requirements", "textarea"]],
  "Foundation blockwork / substructure walling": [
    ["wallRef", "Wall / foundation reference", "text", true], ["blockType", "Block material / type"],
    ["blockSize", "Block dimensions / thickness (mm)"], ["mortar", "Mortar specification"],
    ["reinforcement", "Wall reinforcement specification"], ["finishes", "Protective finishes / walling notes", "textarea"]],
  "Foundation column starters and starter bars": [
    ["columnRef", "Column identification / drawing reference", "text", true],
    ["starterType", "Scope included", "select", true, ["Starter bars only", "Cast concrete pedestal", "Other / verify"]],
    ["barCount", "Main bar number / arrangement"], ["barDia", "Main bar diameter (mm)", "number"],
    ["links", "Links / stirrup diameter and spacing"], ["anchor", "Anchorage / lap requirements"],
    ["cover", "Concrete cover (mm)", "number"], ["grade", "Concrete grade (if included)"],
    ["formwork", "Formwork requirement (if included)"], ["avoidDuplicate", "Overlap with footing or ground beam scope", "textarea"]],
  "Ground beam reinforcement works": [
    ["beamRef", "Beam marks / drawings reference", "text", true], ["steelGrade", "Reinforcement grade"],
    ["topBottom", "Top and bottom bar arrangement"], ["stirrups", "Stirrup spacing / arrangement"],
    ["cover", "Concrete cover (mm)", "number"], ["laps", "Laps / anchorage and schedule notes", "textarea"]],
  "Ground beam formwork": [
    ["beamRef", "Beam marks / drawing reference", "text", true], ["faces", "Side faces to be formed"],
    ["soffit", "Soffit formwork required?", "select", false, ["Yes", "No", "To verify"]],
    ["material", "Formwork material"], ["supports", "Props / bracing / reuse plan", "textarea"]],
  "Ground beam concrete works": [
    ["beamRef", "Beam marks / drawing reference", "text", true], ["grade", "Specified concrete grade"],
    ["supply", "Supply method", "select", false, ["Site-mixed", "Ready-mixed", "To be decided"]],
    ["placement", "Placement and compaction method"], ["joints", "Joint locations and intersection deduction notes"],
    ["curing", "Curing method"], ["tests", "Test requirements", "textarea"]],
  "Substructure waterproofing and damp-proofing": [
    ["locations", "Application location / drawing reference", "text", true], ["system", "Membrane / coating system"],
    ["layers", "Specified layers / coats", "number"], ["laps", "Lap / overlap specification"],
    ["preparation", "Surface preparation"], ["protection", "Protection layer"],
    ["inspection", "Application inspection and notes", "textarea"]],
  "Foundation backfilling and compaction": [
    ["location", "Backfill area / drawing reference", "text", true], ["material", "Reuse / imported fill material"],
    ["layer", "Specified compacted layer thickness (mm)", "number"], ["method", "Compaction method / plant"],
    ["target", "Specified density / testing requirement"], ["source", "Material source"],
    ["disposal", "Surplus spoil disposal scope reference"], ["notes", "Compaction notes", "textarea"]],
  "Substructure inspections and testing": [
    ["testType", "Inspection / test type", "text", true], ["location", "Location / structural element"],
    ["standard", "Approved inspection / test specification"], ["responsible", "Responsible inspector / laboratory"],
    ["holdPoints", "Approval / hold points"], ["reports", "Required reports / certification", "textarea"]]
};
// Measurement columns. All dimensions are explicit; formulas are estimates, not purchase quantities.
const subMeasurements = {
  "Setting out of foundations": {unit:"points", columns:[["points","Setting-out points","number"],["count","Repeats","number"]],calc:r=>num(r.points)*num(r.count)},
  "Excavation for foundation works": {unit:"m³", columns:[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Depth (m)","number"],["count","Identical excavations","number"]],calc:r=>num(r.length)*num(r.width)*num(r.depth)*num(r.count)},
  "Excavation support and groundwater control": {unit:"m²", columns:[["length","Supported face length (m)","number"],["height","Supported face height (m)","number"],["faces","Number of faces","number"]],calc:r=>num(r.length)*num(r.height)*num(r.faces)},
  "Foundation bed preparation and blinding": {unit:"m³", columns:[["length","Length (m)","number"],["width","Width (m)","number"],["thickness","Blinding thickness (mm)","number"],["count","Number of beds","number"]],calc:r=>num(r.length)*num(r.width)*num(r.thickness)/1000*num(r.count)},
  "Foundation reinforcement works": {unit:"kg", columns:[["diameter","Bar diameter (mm)","number"],["barLength","Cut length per bar (m)","number"],["bars","Bars per element","number"],["count","Identical elements","number"]],calc:r=>0.006165*num(r.diameter)**2*num(r.barLength)*num(r.bars)*num(r.count)},
  "Foundation formwork": {unit:"m²", columns:[["length","Contact length (m)","number"],["height","Contact height (m)","number"],["faces","Formed faces","number"],["count","Identical elements","number"]],calc:r=>num(r.length)*num(r.height)*num(r.faces)*num(r.count)},
  "Foundation concrete works": {unit:"m³", columns:[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Depth / thickness (m)","number"],["count","Identical elements","number"]],calc:r=>num(r.length)*num(r.width)*num(r.depth)*num(r.count)},
  "Foundation blockwork / substructure walling": {unit:"m²", columns:[["length","Wall length (m)","number"],["height","Wall height (m)","number"],["openings","Openings (m²)","number"],["count","Identical walls","number"]],calc:r=>Math.max(0,num(r.length)*num(r.height)-num(r.openings))*num(r.count)},
  "Foundation column starters and starter bars": {unit:"items", columns:[["columns","Column positions","number"],["count","Identical groups","number"]],calc:r=>num(r.columns)*num(r.count)},
  "Ground beam reinforcement works": {unit:"kg", columns:[["diameter","Bar diameter (mm)","number"],["barLength","Cut length per bar (m)","number"],["bars","Bars per beam","number"],["count","Identical beams","number"]],calc:r=>0.006165*num(r.diameter)**2*num(r.barLength)*num(r.bars)*num(r.count)},
  "Ground beam formwork": {unit:"m²", columns:[["length","Beam length (m)","number"],["depth","Beam depth (m)","number"],["sides","Number of formed sides","number"],["count","Identical beams","number"]],calc:r=>num(r.length)*num(r.depth)*num(r.sides)*num(r.count)},
  "Ground beam concrete works": {unit:"m³", columns:[["length","Beam length (m)","number"],["width","Beam width (m)","number"],["depth","Beam depth (m)","number"],["count","Identical beams","number"],["deduct","Intersection overlap deduction (m³)","number"]],calc:r=>Math.max(0,num(r.length)*num(r.width)*num(r.depth)*num(r.count)-num(r.deduct))},
  "Substructure waterproofing and damp-proofing": {unit:"m²", columns:[["length","Surface length (m)","number"],["height","Surface height / width (m)","number"],["count","Surfaces","number"]],calc:r=>num(r.length)*num(r.height)*num(r.count)},
  "Foundation backfilling and compaction": {unit:"m³", columns:[["excavation","Excavated void volume (m³)","number"],["occupied","Volume occupied (m³)","number"],["count","Identical zones","number"]],calc:r=>Math.max(0,num(r.excavation)-num(r.occupied))*num(r.count)},
  "Substructure inspections and testing": {unit:"tests", columns:[["tests","Tests / visits","number"],["count","Locations / groups","number"]],calc:r=>num(r.tests)*num(r.count)}
};
function num(value){const n=Number(value);return value===""||value==null||!Number.isFinite(n)||n<0?0:n;}

const groundFloorActivities=["Ground floor preparation and level verification","Filling and raising of floor levels","Filling compaction and testing","Hardcore / granular sub-base installation","Sand blinding and surface levelling","Damp-proof membrane installation","Floor insulation and specialised protective layers","Ground floor reinforcement","Ground floor concrete slab","Slab construction joints, edges and finishing","Concrete curing, inspection and testing"];
const groundFloorFields={"Ground floor preparation and level verification":[["drawing","Floor drawing reference"],["levels","Existing and formation levels"],["condition","Formation condition"]],"Filling and raising of floor levels":[["material","Fill material specification"],["source","Fill source"],["overlap","Foundation backfill exclusions"]],"Filling compaction and testing":[["method","Compaction method"],["criteria","Specified acceptance criteria"],["tests","Testing requirements"]],"Hardcore / granular sub-base installation":[["spec","Granular sub-base material","select",true,["Graded crushed stone","Crushed granite aggregate","Graded natural gravel","Lateritic granular fill","Other (specify in notes)"]],["method","Laying and compaction method"],["notes","Source and grading / approved material notes","textarea"]],"Sand blinding and surface levelling":[["spec","Sand / blinding material","select",true,["Sharp sand","Washed sand","Fine sand","Screened sand","Other (specify in notes)"]],["method","Levelling method","select",true,["Manual screeding","Straightedge and level","Laser-assisted levelling","Mechanical levelling","Other (specify in notes)"]],["notes","Material / levelling notes","textarea"]],"Damp-proof membrane installation":[["spec","Membrane specification","select",true,["Polyethylene DPM 250 micron (4 × 25 m roll)","Polyethylene DPM 300 micron (4 × 25 m roll)","Polyethylene DPM 500 micron (4 × 12.5 m roll)","Other membrane / roll size"]],["laps","Lap / upstand details"]],"Floor insulation and specialised protective layers":[["spec","Insulation / protective specification","select",true,["Expanded polystyrene (EPS) board","Extruded polystyrene (XPS) board","Polyisocyanurate (PIR) board","Rigid mineral wool board","Other / proprietary protection"]],["arrangement","Layer arrangement"]],"Ground floor reinforcement":[["spec","Mesh / bar specification","select",true,["A142 welded mesh (2.22 kg/m²)","A193 welded mesh (3.02 kg/m²)","A252 welded mesh (3.95 kg/m²)","A393 welded mesh (6.16 kg/m²)","Reinforcing bars — diameter and spacing","Other / engineered reinforcement"]],["laps","Lap / cover details"]],"Ground floor concrete slab":[["drawing","Structural drawing revision"],["grade","Approved concrete grade / specification"],["placement","Placement method"],["curing","Curing method"]],"Slab construction joints, edges and finishing":[["joints","Joint specification","select",true,["Construction joint","Saw-cut control joint","Expansion / isolation joint","Formed joint","Other — describe in notes"]],["finish","Required slab finish","select",true,["Power-floated","Steel-trowelled","Broom finish","Roughened / keyed","Other — describe in notes"]],["notes","Additional joint / finish specification","textarea"]],"Concrete curing, inspection and testing":[["curing","Curing method"],["tests","Tests and acceptance records"]]};
const groundFloorMeasures={"Ground floor preparation and level verification":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"},"Filling and raising of floor levels":{"unit":"m³","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Thickness / compacted depth (mm)","number"],["count","Zones / repeats","number"]],"formula":"volume"},"Filling compaction and testing":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"},"Hardcore / granular sub-base installation":{"unit":"m³","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Thickness / compacted depth (mm)","number"],["count","Zones / repeats","number"]],"formula":"volume"},"Sand blinding and surface levelling":{"unit":"m³","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Thickness / compacted depth (mm)","number"],["count","Zones / repeats","number"]],"formula":"volume"},"Damp-proof membrane installation":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"},"Floor insulation and specialised protective layers":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"},"Ground floor reinforcement":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"},"Ground floor concrete slab":{"unit":"m³","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["depth","Thickness / compacted depth (mm)","number"],["count","Zones / repeats","number"]],"formula":"volume"},"Slab construction joints, edges and finishing":{"unit":"m","columns":[["length","Total length (m)","number"],["count","Repeats","number"]],"formula":"length"},"Concrete curing, inspection and testing":{"unit":"m²","columns":[["length","Length (m)","number"],["width","Width (m)","number"],["count","Zones / repeats","number"]],"formula":"area"}};
for(const [n,f] of Object.entries(groundFloorFields))substructureFields[n]=f;
for(const [n,spec] of Object.entries(groundFloorMeasures)){
 subMeasurements[n]={unit:spec.unit,columns:spec.columns,calc:r=>{
  const length=Number(r.length)||0,width=Number(r.width)||0,depth=Number(r.depth)||0,count=Number(r.count)||0;
  return spec.formula==="volume"?length*width*depth/1000*count:spec.formula==="length"?length*count:length*width*count;
 }};
}
const FLOOR_SYSTEMS=["Ground-bearing concrete slab","Raft foundation forming floor","Suspended ground floor","Other / custom"];
function isGroundFloor(){return currentStage==="Ground Floor Construction";}
function getFloorConfig(){const c=getProjectData().workDetails?.groundFloor||{};return {system:c.system||FLOOR_SYSTEMS[0],enabled:Array.isArray(c.enabled)?c.enabled:null};}
function suggestedFloorActivities(system){
 const exclude=system===FLOOR_SYSTEMS[1]?["Ground floor concrete slab","Ground floor reinforcement"]:
 system===FLOOR_SYSTEMS[2]?["Filling and raising of floor levels","Filling compaction and testing","Hardcore / granular sub-base installation","Sand blinding and surface levelling"]:[];
 return groundFloorActivities.filter(n=>!exclude.includes(n));
}
function activeFloorActivities(){const c=getFloorConfig();return groundFloorActivities.filter(n=>(c.enabled||suggestedFloorActivities(c.system)).includes(n));}
function saveFloorConfig(c){const d=getProjectData();d.workDetails ||= {activities:{}};d.workDetails.groundFloor={...c};localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}
function renderFloorSelector(){
 const box=document.getElementById("foundationSelector"),config=getFloorConfig(),active=activeFloorActivities();
 box.hidden=false;box.innerHTML='<div class="sub-config"><div class="sub-config-header"><div><h3>Ground floor system</h3><p>Select the floor system, then review applicable activities. Drawings control actual requirements.</p></div><label>Floor type<select id="floorType">'+FLOOR_SYSTEMS.map(v=>option(v,config.system)).join("")+'</select></label></div><div class="sub-config-checks">'+groundFloorActivities.map(n=>'<label><input type="checkbox" class="floor-toggle" value="'+safe(n)+'" '+(active.includes(n)?"checked":"")+'> '+safe(n)+'</label>').join("")+'</div><p class="sub-notice">Do not duplicate work already measured under Substructure. Suspended floor quantities require structural review.</p></div>';
 box.querySelector("#floorType").onchange=e=>{saveFloorConfig({system:e.target.value,enabled:null});renderActivities();};
 box.querySelectorAll(".floor-toggle").forEach(el=>el.onchange=()=>{saveFloorConfig({system:box.querySelector("#floorType").value,enabled:[...box.querySelectorAll(".floor-toggle:checked")].map(e=>e.value)});renderActivities();});
}

function isSubstructure(){return currentStage==="Substructure";}
function activityCatalog(){return isSuperstructure()?superstructureActivities:isSubstructure()?substructureActivities:isGroundFloor()?groundFloorActivities:preliminariesActivities;}
function getSubConfig(){const d=getProjectData().workDetails?.substructure||{};return {foundationType:d.foundationType||"Not specified",enabled:d.enabled||null};}
function saveSubConfig(config){const d=getProjectData();d.workDetails ||= {activities:{}};d.workDetails.substructure={...config,updatedAt:new Date().toISOString()};try{localStorage.setItem(STORAGE_KEY,JSON.stringify(d));projectData=d;}catch(e){showToast("Could not save foundation settings.");}}
// These are suggested activity selections, not design-approved exclusions.
function foundationRecommendations(type){const all=substructureActivities.slice();if(type==="Not specified"||type==="Combined / other"||type==="Piled foundation")return all;
 const exclude={"Strip foundation":["Excavation support and groundwater control"],"Pad foundation":["Excavation support and groundwater control","Foundation blockwork / substructure walling"],"Raft foundation":["Foundation blockwork / substructure walling","Ground beam reinforcement works","Ground beam formwork","Ground beam concrete works","Foundation column starters and starter bars"]};
 return all.filter(name=>!(exclude[type]||[]).includes(name));}
function selectedSubActivities(){const config=getSubConfig();const enabled=config.enabled||foundationRecommendations(config.foundationType);return substructureActivities.filter(name=>enabled.includes(name));}
function renderFoundationSelector(){const c=getSubConfig();const enabled=selectedSubActivities();const box=document.getElementById("foundationSelector");if(!box)return;
box.hidden=false;box.innerHTML=`<div class="sub-config"><div class="sub-config-header"><div><h3>Foundation system</h3><p>Choose the design type, then review which activities apply. Suggestions do not replace the structural drawings.</p></div><label>Foundation type<select id="foundationType">${FOUNDATION_TYPES.map(t=>option(t,c.foundationType)).join("")}</select></label></div><div class="sub-config-checks">${substructureActivities.map(name=>`<label><input type="checkbox" class="sub-activity-check" value="${safe(name)}" ${enabled.includes(name)?"checked":""}> ${safe(name)}</label>`).join("")}</div><p class="sub-notice">Unselected activities remain visible in saved records but are excluded from this stage's active workflow. Verify all exclusions against the structural drawings.</p></div>`;
box.querySelector('#foundationType').addEventListener('change',e=>{const type=e.target.value;saveSubConfig({foundationType:type,enabled:foundationRecommendations(type)});renderActivities();});
box.querySelectorAll('.sub-activity-check').forEach(ch=>ch.addEventListener('change',()=>{const enabled=[...box.querySelectorAll('.sub-activity-check:checked')].map(x=>x.value);saveSubConfig({foundationType:box.querySelector('#foundationType').value,enabled});renderActivities();}));}
function renderSubstructureDetails(){const defs=substructureFields[currentActivity]||[];const d=activityData.details;
 if(currentActivity==="Ground floor reinforcement"&&d.spec==="Reinforcing bars — bar schedule required")d.spec="Reinforcing bars — diameter and spacing";
 const fields=defs.map(([key,label,type='text',required=false,options])=>{let control=type==='select'?`<select data-detail="${safe(key)}" ${required?'required':''}><option value="">Select (optional unless marked *)</option>${options.map(x=>option(x,d[key]||'')).join('')}</select>`:type==='textarea'?`<textarea data-detail="${safe(key)}" ${required?'required':''} placeholder="Optional">${safe(d[key]||'')}</textarea>`:`<input data-detail="${safe(key)}" type="${type}" value="${safe(d[key]||'')}" ${required?'required':''} ${type==='number'?'min="0" step="any"':''} placeholder="${required?'Required':'Optional'}">`;
 return `<div class="field-group ${type==='textarea'?'full':''}"><label>${safe(label)}${required?' *':''}</label>${control}</div>`;}).join('');
 const spec=subMeasurements[currentActivity];const rows=Array.isArray(d.measurements)?d.measurements:[];
 stepContent.innerHTML=`<div class="step-intro"><h3>${safe(currentActivity)} Details</h3><p>Enter project-specific requirements and measurement groups. Quantities are in-place estimates, not automatic procurement or selling prices.</p></div><div class="field-grid">${fields}</div><div class="measurement-panel"><div class="measure-head"><div><h3>Measurement groups</h3><p>One row per distinct size, bar schedule or location. ${safe(spec.unit)} is the calculated unit.</p></div><button type="button" id="addMeasurement" class="secondary-button">+ Add measurement row</button></div><div id="measurementRows"></div><div class="measure-total"><span>Calculated total</span><strong id="measureTotal">—</strong></div><p class="sub-notice">${safe(measurementNotice(currentActivity))}</p></div>`;
if(isMixActivity()){stepContent.insertAdjacentHTML('beforeend','<div id="mixPanel"></div>');}if(hasDemoResource())stepContent.insertAdjacentHTML('beforeend','<div id="derivedResourcePanel"></div>');attachDetailListeners();renderMeasurementRows();if(isMixActivity())renderMixPanel();if(hasDemoResource())renderDemoResource();document.getElementById('addMeasurement').addEventListener('click',()=>{d.measurements ||= [];d.measurements.push({ref:'',...Object.fromEntries(spec.columns.map(([key])=>[key,'']))});activityData.confirmed=false;saveProjectData();renderMeasurementRows();});}
function measurementNotice(activity){
 if(activity==="Ground floor reinforcement")return "Measured area only. For mesh, nominal mass uses published kg/m². For bars, select diameter, bar arrangement and spacing to calculate theoretical lengths and mass. Laps, hooks, cover, openings and wastage are excluded.";if(activity.includes('reinforcement'))return 'Theoretical mass: 0.006165 × diameter² (mm) × cut length (m) × bar count × element count. Specify laps, hooks and cutting lengths in the schedule; no waste factor is applied.';
if(activity==='Foundation backfilling and compaction')return 'Calculated compacted in-place volume only. Bulking, shrinkage and imported material quantities require separately verified factors.';
if(activity==='Ground beam concrete works')return 'Deduct beam intersections only where necessary to avoid double counting. Check overlaps with foundations and column starters.';
if(activity==='Foundation bed preparation and blinding')return 'Blinding thickness is entered in mm and converted to metres. Enter zero rows if blinding is not specified.';
if(activity==='Foundation blockwork / substructure walling')return 'Net wall area only; block count and mortar require approved block dimensions, joint assumptions and allowances.';
return 'Confirm dimensions, deductions, temporary works and drawing revisions. Do not price an activity twice in Preliminaries, Substructure or Ground Floor Construction.';}
function calcMeasured(spec,row){if(!spec.columns.every(([key])=>row[key]!==''&&row[key]!==null&&row[key]!==undefined))return null;const result=spec.calc(row);return Number.isFinite(result)?result:null;}
function renderMeasurementRows(){const wrap=document.getElementById('measurementRows');if(!wrap)return;const spec=subMeasurements[currentActivity];const rows=activityData.details.measurements||[];
wrap.innerHTML=rows.length?rows.map((row,i)=>`<div class="measure-row"><div class="measure-row-top"><strong>Group ${i+1}</strong><button type="button" data-remove-measure="${i}" class="secondary-button">Remove</button></div><div class="measure-grid"><label>Reference / location<input data-measure-index="${i}" data-measure-key="ref" type="text" value="${safe(row.ref||'')}" placeholder="e.g. F1 / Grid A"></label>${spec.columns.map(([key,label])=>`<label>${safe(label)}<input data-measure-index="${i}" data-measure-key="${key}" type="number" min="0" step="any" value="${safe(row[key]??'')}" placeholder="Enter value"></label>`).join('')}</div><div class="measure-result">Group quantity: <strong data-measure-result="${i}">${calcMeasured(spec,row)===null?'Incomplete':`${formatMeasure(calcMeasured(spec,row))} ${safe(spec.unit)}`}</strong></div></div>`).join(''):'<p class="sub-notice">No measurement groups yet. Add one when drawings or site dimensions are available.</p>';
wrap.querySelectorAll('[data-measure-key]').forEach(input=>input.addEventListener('input',()=>{const i=Number(input.dataset.measureIndex);const key=input.dataset.measureKey;const v=input.value;if(input.type==='number'&&v!==''&&(!Number.isFinite(Number(v))||Number(v)<0)){input.classList.add('field-invalid');return;}input.classList.remove('field-invalid');activityData.details.measurements[i][key]=v;activityData.confirmed=false;saveProjectData();updateMeasureTotals();}));
wrap.querySelectorAll('[data-remove-measure]').forEach(btn=>btn.addEventListener('click',()=>{activityData.details.measurements.splice(Number(btn.dataset.removeMeasure),1);activityData.confirmed=false;saveProjectData();renderMeasurementRows();}));updateMeasureTotals();}
function formatMeasure(n){return Number(n).toLocaleString('en-NG',{maximumFractionDigits:3});}
function updateMeasureTotals(){const spec=subMeasurements[currentActivity];const rows=activityData.details.measurements||[];let total=0;let complete=0;rows.forEach((row,i)=>{const result=calcMeasured(spec,row);const el=document.querySelector(`[data-measure-result="${i}"]`);if(el)el.textContent=result===null?'Incomplete':`${formatMeasure(result)} ${spec.unit}`;if(result!==null){total+=result;complete++;}});
 const el=document.getElementById('measureTotal');if(el)el.textContent=rows.length&&complete?`${formatMeasure(total)} ${spec.unit}${complete<rows.length?' (partial)':''}`:'—';if(isMixActivity()){updateMixPreview();saveProjectData();}if(hasDemoResource()){updateDemoResource();saveProjectData();}}
function substructureReview(){const d=activityData.details;const fields=(substructureFields[currentActivity]||[]).map(([key,label])=>reviewLine(label,d[key]||'')).join('');const spec=subMeasurements[currentActivity];const rows=d.measurements||[];let total=0;let complete=0;const measurements=rows.map((row,i)=>{const result=calcMeasured(spec,row);if(result!==null){total+=result;complete++;}return reviewLine(`Measurement ${i+1}: ${row.ref||'Unlabelled'}`,result===null?'Incomplete':`${formatMeasure(result)} ${spec.unit}`)}).join('');return `<div class="review-section"><h3>1. ${safe(currentActivity)} details</h3>${fields}<h3>Measurement groups</h3>${measurements||'<p>No measurements entered</p>'}${reviewLine('Calculated quantity',complete?`${formatMeasure(total)} ${spec.unit}${complete<rows.length?' (partial)':''}`:'Not calculated')}${reviewLine('Measurement caution',measurementNotice(currentActivity))}</div>`;}

const stageDescriptions = {
  "Preliminaries & Site Preparation":
    "Site assessment, mobilisation, clearing and preparation.",

  "Substructure":
    "Excavation, foundation and ground beam works.",

  "Ground Floor Construction":
    "Filling, compaction, hardcore, blinding and floor slab.",

  "Superstructure":
    "Walls, columns, beams and structural elements.",

  "Upper Floor Construction":
    "Suspended slabs and upper floor structure.",

  "Roofing":
    "Roof structure, covering and waterproofing.",

  "Doors & Windows":
    "Frames, shutters, glazing and fittings.",

  "Electrical Installation":
    "Wiring, conduits, fittings and lighting.",

  "Plumbing & Drainage":
    "Water supply, pipework and drainage systems.",

  "Plastering & Rendering":
    "Internal plastering and external rendering.",

  "Floor Finishes":
    "Tiling, screeding and floor finishing.",

  "Wall Finishes":
    "Wall tiles, cladding and decorative finishes.",

  "Ceiling Works":
    "Ceiling framework, boards and accessories.",

  "Painting & Decoration":
    "Priming, painting and decorative treatments.",

  "External Works":
    "Drainage, paving, fencing and landscaping.",

  "Final Fittings & Installations":
    "Fixtures, sanitary fittings and final installations."
};

const activityFieldDefinitions = {
  "Site clearing": [
    { key: "clearingArea", label: "Clearing area", type: "number", unit: "m²", required: true },
    { key: "vegetationType", label: "Vegetation type", type: "select", options: ["Grass", "Shrubs and bushes", "Small trees", "Mature trees", "Mixed vegetation", "Other"] },
    { key: "vegetationDensity", label: "Vegetation density", type: "select", options: ["Light", "Moderate", "Heavy", "Very dense"] },
    { key: "treeRemoval", label: "Tree removal required?", type: "select", options: ["Yes", "No"] },
    { key: "treeQuantity", label: "Number of trees to remove", type: "number" },
    { key: "rootRemoval", label: "Root / stump removal required?", type: "select", options: ["Yes", "No"] },
    { key: "clearingMethod", label: "Clearing method", type: "select", options: ["Manual", "Mechanical", "Combination", "Other"] },
    { key: "siteCondition", label: "Current site condition", type: "textarea", full: true }
  ],

  "Site stripping": [
    { key: "strippingArea", label: "Stripping area", type: "number", unit: "m²", required: true },
    { key: "strippingDepth", label: "Average stripping depth", type: "number", unit: "mm", required: true },
    { key: "strippedMaterial", label: "Material to be stripped", type: "select", options: ["Topsoil", "Organic matter", "Loose surface material", "Mixed material", "Other"] },
    { key: "soilCondition", label: "Soil condition", type: "select", options: ["Dry", "Damp", "Wet", "Waterlogged", "Mixed"] },
    { key: "strippingMethod", label: "Stripping method", type: "select", options: ["Manual", "Mechanical", "Combination"] },
    { key: "stockpiling", label: "Stockpiling required?", type: "select", options: ["Yes", "No"] },
    { key: "topsoilReuse", label: "Topsoil to be reused?", type: "select", options: ["Yes", "No", "Undecided"] },
    { key: "strippingNotes", label: "Additional notes", type: "textarea", full: true }
  ],

  "Demolition and removal": [
    { key: "structureType", label: "Structure / item to demolish", type: "text", required: true },
    { key: "demolitionDescription", label: "Description of demolition work", type: "textarea", full: true },
    { key: "demolitionQuantity", label: "Estimated quantity", type: "number", required: true },
    { key: "demolitionUnit", label: "Measurement unit", type: "select", options: ["m²", "m³", "m", "No.", "Item", "Lump sum"] },
    { key: "structureMaterial", label: "Structural type / material", type: "select", options: ["Concrete", "Blockwork", "Brickwork", "Timber", "Steel", "Mixed", "Other"] },
    { key: "demolitionMethod", label: "Demolition method", type: "select", options: ["Manual", "Mechanical", "Controlled demolition", "Combination"] },
    { key: "salvageableMaterials", label: "Salvageable materials", type: "textarea", full: true },
    { key: "debrisRemoval", label: "Debris removal required?", type: "select", options: ["Yes", "No"] }
  ],

  "Site excavation preparation": [
    { key: "excavationLocation", label: "Excavation location / area", type: "text", required: true },
    { key: "excavationType", label: "Excavation type", type: "select", options: ["Foundation trenches", "Foundation pits", "Bulk excavation", "Drainage trenches", "Service trenches", "Other"], required: true },
    { key: "excavationLength", label: "Approximate length", type: "number", unit: "m" },
    { key: "excavationWidth", label: "Approximate width", type: "number", unit: "m" },
    { key: "proposedDepth", label: "Proposed depth", type: "number", unit: "m" },
    { key: "groundCondition", label: "Ground condition", type: "select", options: ["Firm soil", "Loose soil", "Clay", "Sand", "Rock", "Waterlogged", "Unknown"] },
    { key: "undergroundServices", label: "Underground services present?", type: "select", options: ["Yes", "No", "Unknown"] },
    { key: "serviceProtection", label: "Protection / diversion required", type: "textarea", full: true },
    { key: "settingOut", label: "Setting-out completed?", type: "select", options: ["Yes", "No", "Not applicable"] },
    { key: "workingSpace", label: "Working space / clearance requirements", type: "textarea", full: true }
  ],

  "Site levelling and grading": [
    { key: "gradingArea", label: "Area to be levelled / graded", type: "number", unit: "m²", required: true },
    { key: "existingGroundLevel", label: "Existing ground level / reference", type: "text" },
    { key: "formationLevel", label: "Proposed formation level", type: "text" },
    { key: "averageCutDepth", label: "Average cut depth", type: "number", unit: "m" },
    { key: "averageFillDepth", label: "Average fill depth", type: "number", unit: "m" },
    { key: "gradingType", label: "Nature of work", type: "select", options: ["Cut", "Fill", "Combined cut and fill"], required: true },
    { key: "gradient", label: "Required gradient / slope", type: "text" },
    { key: "gradingMethod", label: "Method", type: "select", options: ["Manual", "Mechanical", "Combination"] },
    { key: "compactionRequired", label: "Compaction required?", type: "select", options: ["Yes", "No"] },
    { key: "compactionLevel", label: "Required compaction level", type: "text" },
    { key: "gradingNotes", label: "Additional notes", type: "textarea", full: true }
  ],

  "Earthwork disposal": [
    { key: "disposalMaterial", label: "Material for disposal", type: "select", options: ["Excavated soil", "Topsoil", "Rock", "Demolition debris", "Mixed spoil", "Other"], required: true },
    { key: "disposalVolume", label: "Estimated disposal volume", type: "number", unit: "m³", required: true },
    { key: "materialCondition", label: "Material condition", type: "select", options: ["Dry", "Damp", "Wet", "Contaminated / special handling", "Mixed"] },
    { key: "loadingMethod", label: "Loading method", type: "select", options: ["Manual", "Mechanical", "Already loaded", "Other"] },
    { key: "disposalDestination", label: "Disposal destination", type: "text" },
    { key: "disposalDistance", label: "Approximate distance to destination", type: "number", unit: "km" },
    { key: "estimatedTrips", label: "Estimated number of trips", type: "number" },
    { key: "approvedDisposal", label: "Approved disposal location?", type: "select", options: ["Yes", "No", "To be confirmed"] },
    { key: "disposalNotes", label: "Additional notes", type: "textarea", full: true }
  ],

  "Temporary site facilities": [
    { key: "facilityType", label: "Facility type", type: "select", options: ["Site office", "Rest area", "Storage", "Toilets", "Changing facilities", "First-aid station", "Security post", "Other"], required: true },
    { key: "facilityDescription", label: "Facility description", type: "textarea", full: true },
    { key: "facilityQuantity", label: "Quantity required", type: "number", required: true },
    { key: "provisionType", label: "Provision type", type: "select", options: ["Rental", "Purchase", "Temporary construction"] },
    { key: "facilityDimensions", label: "Dimensions / capacity", type: "text" },
    { key: "installationRequired", label: "Installation required?", type: "select", options: ["Yes", "No"] },
    { key: "facilityDuration", label: "Required duration", type: "number", unit: "days" },
    { key: "facilityRemoval", label: "Removal after completion required?", type: "select", options: ["Yes", "No"] }
  ],

  "Temporary utilities": [
    { key: "utilityType", label: "Utility type", type: "select", options: ["Electricity", "Water", "Drainage", "Communication", "Other"], required: true },
    { key: "utilitySource", label: "Proposed source", type: "text", required: true },
    { key: "installationRequirements", label: "Installation / connection requirements", type: "textarea", full: true },
    { key: "estimatedConsumption", label: "Estimated consumption / capacity", type: "text" },
    { key: "utilityDuration", label: "Required duration", type: "number", unit: "days" },
    { key: "meteringRequired", label: "Metering required?", type: "select", options: ["Yes", "No"] },
    { key: "disconnectionRequired", label: "Disconnection / removal required?", type: "select", options: ["Yes", "No"] },
    { key: "utilityNotes", label: "Additional notes", type: "textarea", full: true }
  ],

  "Site security and protection": [
    { key: "protectionType", label: "Protection / security type", type: "select", options: ["Perimeter fencing", "Hoarding", "Barricades", "Warning signs", "Security lighting", "Access control", "Property protection", "Safety barriers", "Other"], required: true },
    { key: "protectionCoverage", label: "Area / perimeter to be covered", type: "number", unit: "m or m²", required: true },
    { key: "protectionMethod", label: "Proposed method", type: "text" },
    { key: "protectionHeight", label: "Required height", type: "number", unit: "m" },
    { key: "protectionDuration", label: "Required duration", type: "number", unit: "days" },
    { key: "securityPersonnel", label: "Security personnel required?", type: "select", options: ["Yes", "No"] },
    { key: "existingSecurity", label: "Existing security / protection provisions", type: "textarea", full: true },
    { key: "additionalSafety", label: "Additional safety measures", type: "textarea", full: true }
  ],

  "Access preparation": [
    { key: "accessType", label: "Access type", type: "select", options: ["Temporary access road", "Site entrance", "Internal access route", "Pedestrian access", "Other"], required: true },
    { key: "accessLength", label: "Access length", type: "number", unit: "m", required: true },
    { key: "accessWidth", label: "Access width", type: "number", unit: "m", required: true },
    { key: "existingAccessCondition", label: "Existing ground condition", type: "select", options: ["Firm", "Soft", "Uneven", "Waterlogged", "Rocky", "Other"] },
    { key: "accessSurface", label: "Proposed surface material", type: "text" },
    { key: "surfaceTreatment", label: "Surface treatment", type: "text" },
    { key: "accessDrainage", label: "Drainage required?", type: "select", options: ["Yes", "No"] },
    { key: "accessCompaction", label: "Compaction required?", type: "select", options: ["Yes", "No"] },
    { key: "accessTraffic", label: "Expected traffic type", type: "select", options: ["Pedestrian", "Light vehicles", "Heavy vehicles", "Mixed"] },
    { key: "accessDuration", label: "Required duration", type: "number", unit: "days" }
  ],

  "Mobilisation": [
    { key: "mobilisationCategory", label: "Mobilisation category", type: "select", options: ["Personnel", "Equipment", "Plant and machinery", "Materials", "Combined resources", "Other"], required: true },
    { key: "mobilisationDescription", label: "Resources to be mobilised", type: "textarea", full: true },
    { key: "deploymentLocation", label: "Deployment location", type: "text", required: true },
    { key: "mobilisationDate", label: "Expected mobilisation date", type: "date", required: true },
    { key: "mobilisationDuration", label: "Expected mobilisation period", type: "number", unit: "days" },
    { key: "personnelCount", label: "Number of personnel", type: "number" },
    { key: "equipmentUnits", label: "Number of equipment units", type: "number" },
    { key: "specialTransport", label: "Special transport requirements", type: "textarea", full: true },
    { key: "siteReadiness", label: "Site readiness / access notes", type: "textarea", full: true }
  ]
};

function renderGenericActivityDetails() {
  const fields = activityFieldDefinitions[currentActivity] || [];
  const d = activityData.details;

  const controls = fields.map(field => {
    const value = d[field.key] ?? "";
    const required = field.required ? "required" : "";
    const label = `${safe(field.label)}${field.required ? " *" : ""}`;

    const placeholder = field.placeholder ||
      `Enter ${field.label.toLowerCase()}${field.required ? "" : " (Optional)"}`;

    let control = "";

    if (field.type === "select") {
      control = `
        <select data-detail="${safe(field.key)}" ${required}>
          <option value="">
            Select ${safe(field.label.toLowerCase())}${field.required ? "" : " (Optional)"}
          </option>
          ${(field.options || []).map(item => option(item, value)).join("")}
        </select>`;
    } else if (field.type === "textarea") {
      control = `
        <textarea
          data-detail="${safe(field.key)}"
          placeholder="${safe(placeholder)}"
          ${required}
        >${safe(value)}</textarea>`;
    } else {
      control = `
        <input
          type="${safe(field.type || "text")}"
          data-detail="${safe(field.key)}"
          value="${safe(value)}"
          placeholder="${safe(placeholder)}"
          ${field.type === "number" ? 'min="0" step="any"' : ""}
          ${required}
        >`;
    }

    return `
      <div class="field-group ${field.full ? "full" : ""}">
        <label>
          ${label}
          ${field.unit ? `<small>(${safe(field.unit)})</small>` : ""}
        </label>
        ${control}
      </div>`;
  }).join("");

  stepContent.innerHTML = `
    <div class="step-intro">
      <h3>${safe(currentActivity)} Details</h3>
      <p>
        Record the scope, measurements and site requirements
        for this activity. Add only the information relevant
        to the work being priced.
      </p>
    </div>

    <div class="field-grid">${controls}</div>
  `;

  attachDetailListeners();
}

// ==========================================
// DEFAULT ACTIVITY DATA
// ==========================================

const defaultActivityData = {
  details: {

    // SITE INSPECTION
    inspectionDate: "",
    conductedBy: "",
    visitCount: "1",
    siteAddress: "",
    siteAccess: "",
    existingStructures: "",
    terrain: "",
    soilCondition: "",
    drainageCondition: "",
    vegetation: "",
    existingUtilities: "",
    neighbouringConstraints: "",
    siteRisks: "",
    findings: "",
    surveyAvailable: "",
    surveyReference: "",
    surveyFileName: "",

    // SITE SURVEY AND ASSESSMENT
    surveyDate: "",
    surveyConductedBy: "",
    surveyType: "",
    surveyEquipment: "",
    surveyDrawingFiles: [],
    groundLevels: "",
    topography: "",
    boundaryMarkers: "",
    existingObstructions: "",
    benchmark: "",
    surveyObservations: "",
    surveyFindings: ""
  },

  materials: [],
  labour: [],
  logistics: [],
  otherCosts: [],
  confirmed: false
};

// ==========================================
// CURRENT WORKING STATE
// ==========================================

let projectData = getProjectData();

let currentStage = "";
let currentActivity = "";
let currentStep = 0;

let activityData = cloneDefaultActivityData();

function cloneDefaultActivityData() {
  return JSON.parse(JSON.stringify(defaultActivityData));
}

// ==========================================
// STORAGE
// ==========================================

function getProjectData() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) || {};
  } catch (error) {
    console.error("Could not read project data:", error);
    return {};
  }
}

function saveProjectData() {
  if (!currentActivity) return;

  projectData = getProjectData();

  if (!projectData.workDetails) {
    projectData.workDetails = {
      activities: {}
    };
  }

  if (!projectData.workDetails.activities) {
    projectData.workDetails.activities = {};
  }

  projectData.workDetails.activities[currentActivity] =
    activityData;

  projectData.workDetails.lastUpdated =
    new Date().toISOString();

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(projectData)
    );

    if (saveStatus) {
      saveStatus.textContent = "Saved locally";
    }

  } catch (error) {
    console.error("Could not save project data:", error);
    showToast("Unable to save. Please check browser storage.");
  }
}

// ==========================================
// GENERAL HELPERS
// ==========================================

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function money(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function option(value, selected) {
  return `
    <option value="${safe(value)}"
      ${value === selected ? "selected" : ""}>
      ${safe(value)}
    </option>
  `;
}

function showView(view) {
  [
    stageView,
    activityView,
    wizardView,
    reviewView
  ].forEach(panel => {
    if (panel) {
      panel.hidden = panel !== view;
    }
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// ==========================================
// 1. SELECTED CONSTRUCTION STAGES
// ==========================================

function renderStages() {
  projectData = getProjectData();

  const selectedStages =
    projectData.constructionScope?.stages || [];

  if (!selectedStages.length) {
    stageList.innerHTML = `
      <div class="empty-state">
        No construction stages have been selected yet.<br>
        Return to Construction Scope to select the work.
      </div>
    `;

    return;
  }

  stageList.innerHTML = selectedStages.map((stage, index) => {

    const completed = ["Preliminaries & Site Preparation", "Substructure", "Ground Floor Construction", "Superstructure"].includes(stage) && getCompletedActivityCount(stage) > 0;

    return `
      <div class="stage-row" data-stage="${safe(stage)}" role="button" tabindex="0" aria-label="Open ${safe(stage)}">

        <span class="stage-index">
          ${String(index + 1).padStart(2, "0")}
        </span>

        <div class="stage-row-content">
          <h3>${safe(stage)}</h3>

          <p>
            ${safe(
              stageDescriptions[stage] ||
              "Selected construction stage."
            )}
          </p>
        </div>

        <span class="stage-meta">
          ${
            ["Preliminaries & Site Preparation", "Substructure", "Ground Floor Construction", "Superstructure"].includes(stage)
              ? `${getCompletedActivityCount(stage)} activities completed`
              : "Activities to be defined"
          }
        </span>

        ${
          completed
            ? '<span class="status-label">In progress</span>'
            : '<span class="status-label status-pending">Pending</span>'
        }


      </div>
    `;
  }).join("");

  stageList.querySelectorAll('.stage-row[data-stage]').forEach(row=>{
    row.addEventListener('click',()=>openStage(row.dataset.stage));
    row.addEventListener('keydown',e=>{
      if(e.target!==row)return;
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openStage(row.dataset.stage)}
    });
  });
}

// ==========================================
// 2. OPEN A CONSTRUCTION STAGE
// ==========================================

function openStage(stage) {
  currentStage = stage;

  document.getElementById("activityStageTitle").textContent =
    stage;

  document.getElementById("activityEyebrow").textContent =
    "SELECTED CONSTRUCTION STAGE";

  if (!["Preliminaries & Site Preparation", "Substructure", "Ground Floor Construction", "Superstructure"].includes(stage)) {

    activityList.innerHTML = `
      <div class="empty-state">
        The activities and costing workflow for this stage
        will be configured next.<br><br>

        We're building the reusable activity system
        with Site Clearing first.
      </div>
    `;

  } else {
    renderActivities();
  }

  showView(activityView);
}

// ==========================================
// 3. ACTIVITY RECORDS
// ==========================================

function getActivityRecord(name) {
  return getProjectData()
    .workDetails?.activities?.[name] || null;
}

function getCompletedActivityCount(stage = currentStage) {
  const list = stage === "Superstructure" ? superstructureActivities : stage === "Substructure" ? selectedSubActivities() : stage === "Ground Floor Construction" ? activeFloorActivities() : preliminariesActivities;
  return list.filter(name => {
    return getActivityRecord(name)?.confirmed;
  }).length;
}

// ==========================================
// 4. DISPLAY ACTIVITIES
// ==========================================

function renderActivities() {
  const names=isSuperstructure()?superstructureActivities:isSubstructure()?selectedSubActivities():isGroundFloor()?activeFloorActivities():preliminariesActivities;
  const completed=getCompletedActivityCount();
  const selector=document.getElementById('foundationSelector');
  if(selector){selector.hidden=!(isSubstructure()||isGroundFloor()||isSuperstructure());if(isSubstructure())renderFoundationSelector();else if(isGroundFloor())renderFloorSelector();else if(isSuperstructure())renderSuperstructureSelector();}
  document.getElementById('activityProgress').textContent=`${completed} / ${names.length}`;
  activityList.innerHTML=names.length?names.map((name,index)=>{
    const record=getActivityRecord(name),confirmed=!!record?.confirmed;
    return `<div class="activity-row" data-activity="${safe(name)}" role="button" tabindex="0" aria-label="Open ${safe(name)}"><span class="stage-index">${String(index+1).padStart(2,'0')}</span><div class="activity-row-content"><h3>${safe(name)}</h3><p>${confirmed?`Confirmed · ${money(record.totalCost||0)}`:record?'Draft saved — not confirmed':'Work details and costing not yet completed.'}</p></div><span class="status-label ${confirmed?'':'status-pending'}">${confirmed?'Completed':'Not confirmed'}</span></div>`;
  }).join(''):'<div class="empty-state">No activities selected. Check the activities applicable to this foundation system above.</div>';
  // Activity handlers are delegated once below, so freshly rendered rows remain interactive.
}

// ==========================================
// 5. OPEN AN ACTIVITY
// ==========================================

function navigateSiblingActivity(direction) {
  const names=activityCatalog().filter(name=>isSubstructure()?selectedSubActivities().includes(name):isGroundFloor()?activeFloorActivities().includes(name):true);
  const index=names.indexOf(currentActivity);
  const next=names[index+direction];
  if(!next)return;
  saveProjectData(); // Saves draft, does not confirm the activity.
  openActivity(next);
}
function updateSiblingNavigation(){
  const names=activityCatalog().filter(name=>isSubstructure()?selectedSubActivities().includes(name):isGroundFloor()?activeFloorActivities().includes(name):true);
  const index=names.indexOf(currentActivity);
  const supported=index>=0;
  document.querySelectorAll('[data-sibling]').forEach(btn=>{
    const direction=Number(btn.dataset.sibling);
    btn.disabled=!supported||index+direction<0||index+direction>=names.length;
  });
  document.querySelectorAll('.activity-place').forEach(el=>{el.textContent=supported?`Activity ${index+1} of ${names.length}`:''});
}
document.querySelectorAll('[data-sibling]').forEach(btn=>btn.addEventListener('click',()=>navigateSiblingActivity(Number(btn.dataset.sibling))));

function openActivity(name) {
  currentActivity = name;

  const saved =
    getProjectData().workDetails?.activities?.[name];

  const defaults = cloneDefaultActivityData();

  if (saved) {
    activityData = {
      ...defaults,
      ...JSON.parse(JSON.stringify(saved)),

      details: {
        ...defaults.details,
        ...(saved.details || {})
      },

      materials: saved.materials || [],
      labour: saved.labour || [],
      logistics: saved.logistics || [],
      otherCosts: saved.otherCosts || []
    };
  } else {
    activityData = defaults;
  }

  if (!Array.isArray(activityData.details.surveyDrawingFiles)) {
    activityData.details.surveyDrawingFiles = [];
  }

  currentStep = 0;

  document.getElementById("wizardStageName").textContent =
    currentStage.toUpperCase();

  document.getElementById("wizardTitle").textContent = name;

  document.getElementById("activityStatus").textContent =
    activityData.confirmed ? "Confirmed" : "In progress";

  renderStep();
  updateSiblingNavigation();
  showView(wizardView);
}

// ==========================================
// 6. STEP PROGRESS
// ==========================================

function syncWizardStepLabels() {
  const labelContainer =
    document.querySelector(".wizard-step-labels");

  if (!labelContainer) return;

  labelContainer.innerHTML = steps.map((step, index) => `
    <span class="${index === currentStep ? "active" : ""}">
      ${safe(step)}
    </span>
  `).join("");
}


function updateStepProgress() {
  document.getElementById("stepName").textContent =
    steps[currentStep];

  document.getElementById("stepCount").textContent =
    `${String(currentStep + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;

  document.getElementById("stepProgress").style.width =
    `${((currentStep + 1) / steps.length) * 100}%`;

  syncWizardStepLabels();

  document.getElementById("previousStep").disabled =
    currentStep === 0;
}

// ==========================================
// 7. RENDER CURRENT STEP
// ==========================================

function renderStep() {
  updateStepProgress();

  if (currentStep === 0) renderWorkDetails();
  if (currentStep === 1) renderMaterials();
  if (currentStep === 2) renderLabour();
  if (currentStep === 3) renderLogistics();
  if (currentStep === 4) renderOtherCosts();
}

// ==========================================
// SHARED DETAIL FIELD LISTENERS
// ==========================================

function attachDetailListeners() {
  stepContent.querySelectorAll("[data-detail]")
    .forEach(field => {

      const update = () => {
        activityData.details[field.dataset.detail] =
          field.value;
        activityData.confirmed=false;
        if(hasDemoResource()){if(field.dataset.detail==="spec")renderDemoResource();else updateDemoResource();}

        clearInvalidState(field);
        saveProjectData();
      };

      field.addEventListener("input", update);
      field.addEventListener("change", update);
    });
}

// ==========================================
// SURVEY PDF UPLOAD AND FILE LIST
// ==========================================

function renderSurveyPdfFileList() {

  const fileList =
    document.getElementById("surveyDrawingFileList");

  if (!fileList) return;

  const files =
    activityData.details.surveyDrawingFiles || [];

  if (!files.length) {
    fileList.innerHTML =
      "<small>No PDF documents added yet.</small>";

    return;
  }

  fileList.innerHTML = files.map((name, index) => `
    <div class="uploaded-file">

      <span>${safe(name)}</span>

      <button
        type="button"
        class="remove-uploaded-file"
        data-file-index="${index}"
        aria-label="Remove ${safe(name)}"
      >
        ×
      </button>

    </div>
  `).join("");

  fileList.querySelectorAll("[data-file-index]")
    .forEach(button => {

      button.addEventListener("click", () => {

        const index = Number(button.dataset.fileIndex);

        activityData.details.surveyDrawingFiles.splice(
          index,
          1
        );

        renderSurveyPdfFileList();
        saveProjectData();
      });
    });
}

function attachSurveyPdfUpload() {

  const input =
    document.getElementById("surveyDrawingFiles");

  if (!input) return;

  input.addEventListener("change", event => {

    const selectedFiles =
      Array.from(event.target.files || []);

    const invalidFiles = selectedFiles.filter(file =>
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    );

    if (invalidFiles.length) {
      showToast("Please select PDF documents only.");
      input.value = "";
      return;
    }

    if (!Array.isArray(activityData.details.surveyDrawingFiles)) {
      activityData.details.surveyDrawingFiles = [];
    }

    selectedFiles.forEach(file => {

      if (!activityData.details.surveyDrawingFiles.includes(file.name)) {
        activityData.details.surveyDrawingFiles.push(file.name);
      }
    });

    renderSurveyPdfFileList();
    saveProjectData();

    // Clear the input so the same file can be selected again if needed.
    input.value = "";
  });

  renderSurveyPdfFileList();
}

// ==========================================
// STEP 1: WORK DETAILS
// ==========================================

function renderWorkDetails() {

  const d = activityData.details;

  // ----------------------------------------
  // SITE INSPECTION AND ASSESSMENT
  // ----------------------------------------

  if (currentActivity === "Site inspection and assessment") {

    stepContent.innerHTML = `
      <div class="step-intro">
        <h3>Inspection Details & Site Assessment</h3>
        <p>
          Record the existing site conditions, inspection findings
          and any issues that may affect the construction work.
        </p>
      </div>

      <div class="field-grid">

        <div class="field-group">
          <label>Inspection date *</label>
          <input type="date"
            data-detail="inspectionDate"
            value="${safe(d.inspectionDate)}">
        </div>

        <div class="field-group">
          <label>Inspection conducted by *</label>
          <input type="text"
            data-detail="conductedBy"
            value="${safe(d.conductedBy)}"
            placeholder="Enter name">
        </div>

        <div class="field-group">
          <label>Number of site visits</label>
          <input type="number" min="1" step="1"
            data-detail="visitCount"
            value="${safe(d.visitCount)}">
        </div>

        <div class="field-group">
          <label>Site address</label>
          <input type="text"
            data-detail="siteAddress"
            value="${safe(d.siteAddress)}"
            placeholder="Enter site location">
        </div>

        <div class="field-group">
          <label>Site access condition</label>
          <select data-detail="siteAccess">
            <option value="">Select condition</option>
            ${option("Good access", d.siteAccess)}
            ${option("Restricted access", d.siteAccess)}
            ${option("Difficult access", d.siteAccess)}
            ${option("No vehicle access", d.siteAccess)}
          </select>
        </div>

        <div class="field-group">
          <label>Terrain / topography</label>
          <select data-detail="terrain">
            <option value="">Select terrain</option>
            ${option("Flat", d.terrain)}
            ${option("Sloping", d.terrain)}
            ${option("Uneven", d.terrain)}
            ${option("Rocky", d.terrain)}
            ${option("Low-lying", d.terrain)}
            ${option("Mixed conditions", d.terrain)}
          </select>
        </div>

        <div class="field-group">
          <label>Visible soil condition</label>
          <select data-detail="soilCondition">
            <option value="">Select condition</option>
            ${option("Firm / stable", d.soilCondition)}
            ${option("Loose", d.soilCondition)}
            ${option("Sandy", d.soilCondition)}
            ${option("Clayey", d.soilCondition)}
            ${option("Rocky", d.soilCondition)}
            ${option("Waterlogged", d.soilCondition)}
            ${option("Unknown / requires investigation", d.soilCondition)}
          </select>
        </div>

        <div class="field-group">
          <label>Drainage condition</label>
          <select data-detail="drainageCondition">
            <option value="">Select condition</option>
            ${option("Good drainage", d.drainageCondition)}
            ${option("Poor drainage", d.drainageCondition)}
            ${option("Standing water observed", d.drainageCondition)}
            ${option("No drainage system", d.drainageCondition)}
            ${option("Requires further assessment", d.drainageCondition)}
          </select>
        </div>

        <div class="field-group">
          <label>Existing structures on site</label>
          <select data-detail="existingStructures">
            <option value="">Select option</option>
            ${option("None", d.existingStructures)}
            ${option("Buildings", d.existingStructures)}
            ${option("Fences / walls", d.existingStructures)}
            ${option("Multiple structures", d.existingStructures)}
            ${option("Other", d.existingStructures)}
          </select>
        </div>

        <div class="field-group">
          <label>Vegetation / site obstruction</label>
          <select data-detail="vegetation">
            <option value="">Select condition</option>
            ${option("None", d.vegetation)}
            ${option("Grass", d.vegetation)}
            ${option("Shrubs and bushes", d.vegetation)}
            ${option("Trees", d.vegetation)}
            ${option("Mixed vegetation", d.vegetation)}
            ${option("Debris / waste", d.vegetation)}
            ${option("Other", d.vegetation)}
          </select>
        </div>

        <div class="field-group full">
          <label>Existing utilities</label>
          <textarea data-detail="existingUtilities"
            placeholder="Note visible electricity lines, water pipes, drainage, manholes or other existing utilities...">${safe(d.existingUtilities)}</textarea>
        </div>

        <div class="field-group full">
          <label>Neighbouring property constraints</label>
          <textarea data-detail="neighbouringConstraints"
            placeholder="Note adjoining buildings, boundary restrictions, shared access or other neighbouring property concerns...">${safe(d.neighbouringConstraints)}</textarea>
        </div>

        <div class="field-group full">
          <label>Existing survey plan available?</label>
          <select data-detail="surveyAvailable">
            <option value="">Select option</option>
            ${option("Yes", d.surveyAvailable)}
            ${option("No", d.surveyAvailable)}
          </select>
        </div>

        <div class="field-group">
          <label>Survey plan reference</label>
          <input type="text"
            data-detail="surveyReference"
            value="${safe(d.surveyReference)}"
            placeholder="Enter drawing reference">
        </div>

        <div class="field-group">
          <label>Upload existing survey plan</label>
          <input type="file" id="surveyFile"
            accept=".pdf,.jpg,.jpeg,.png">

          <small id="surveyFileName">
            ${safe(d.surveyFileName || "No file selected")}
          </small>
        </div>

        <div class="field-group full">
          <label>Identified site risks or challenges</label>
          <textarea data-detail="siteRisks"
            placeholder="Describe any issues that could affect construction, access, safety, cost or programme...">${safe(d.siteRisks)}</textarea>
        </div>

        <div class="field-group full">
          <label>Inspection findings & recommendations *</label>
          <textarea data-detail="findings"
            placeholder="Summarise the inspection findings and any recommended action...">${safe(d.findings)}</textarea>
        </div>

      </div>
    `;

    attachDetailListeners();

    document.getElementById("surveyFile")
      .addEventListener("change", event => {

        const file = event.target.files[0];

        if (file) {
          activityData.details.surveyFileName = file.name;

          document.getElementById("surveyFileName").textContent =
            file.name;

          saveProjectData();
        }
      });

    return;
  }

  // ----------------------------------------
  // SITE SURVEY AND ASSESSMENT
  // ----------------------------------------

  if (currentActivity === "Site survey and assessment") {

    stepContent.innerHTML = `

      <div class="step-intro">
        <h3>Site Survey Details</h3>

        <p>
          Record the survey information available for the site.
          Upload survey drawings where available, and note relevant
          ground conditions, observations and recommendations.
        </p>
      </div>

      <!-- SURVEY INFORMATION -->

      <section class="detail-section">

        <div class="detail-section-heading">
          <h3>Survey Information</h3>
          <p>Basic information about the survey carried out.</p>
        </div>

        <div class="field-grid">

          <div class="field-group">
            <label>Survey date *</label>
            <input type="date"
              data-detail="surveyDate"
              value="${safe(d.surveyDate)}">
          </div>

          <div class="field-group">
            <label>Survey conducted by *</label>
            <input type="text"
              data-detail="surveyConductedBy"
              value="${safe(d.surveyConductedBy)}"
              placeholder="Enter name">
          </div>

          <div class="field-group">
            <label>Type of survey</label>
            <select data-detail="surveyType">
              <option value="">Select survey type</option>
              ${option("Land / boundary survey", d.surveyType)}
              ${option("Topographical survey", d.surveyType)}
              ${option("Contour survey", d.surveyType)}
              ${option("As-built survey", d.surveyType)}
              ${option("Other", d.surveyType)}
            </select>
          </div>

          <div class="field-group">
            <label>Survey equipment</label>
            <input type="text"
              data-detail="surveyEquipment"
              value="${safe(d.surveyEquipment)}"
              placeholder="e.g. Total station, GPS, level">
          </div>

          <div class="field-group full">
            <label>Survey drawings (PDF)</label>

            <input type="file"
              id="surveyDrawingFiles"
              accept=".pdf,application/pdf"
              multiple>

            <small>You can select more than one PDF document.</small>

            <div id="surveyDrawingFileList"
              class="uploaded-file-list"></div>
          </div>

        </div>
      </section>

      <!-- SITE CONDITIONS AND OBSERVATIONS -->

      <section class="detail-section">

        <div class="detail-section-heading">
          <h3>Site Conditions & Observations</h3>

          <p>
            Add notes where the drawings alone do not communicate
            the relevant site conditions.
          </p>
        </div>

        <div class="field-grid">

          <div class="field-group full">
            <label>Ground levels</label>
            <textarea data-detail="groundLevels"
              placeholder="Note relevant ground levels or changes in elevation...">${safe(d.groundLevels)}</textarea>
          </div>

          <div class="field-group full">
            <label>Topography / slopes</label>
            <textarea data-detail="topography"
              placeholder="Describe slopes, changes in elevation and general site topography...">${safe(d.topography)}</textarea>
          </div>

          <div class="field-group full">
            <label>Boundary markers / beacons</label>
            <textarea data-detail="boundaryMarkers"
              placeholder="Note the condition of existing boundary markers or beacons, if relevant...">${safe(d.boundaryMarkers)}</textarea>
          </div>

          <div class="field-group full">
            <label>Existing structures / obstructions</label>
            <textarea data-detail="existingObstructions"
              placeholder="Record structures, obstacles or features identified during the survey...">${safe(d.existingObstructions)}</textarea>
          </div>

          <div class="field-group full">
            <label>Reference benchmark / datum</label>
            <textarea data-detail="benchmark"
              placeholder="Record the benchmark or datum used for survey measurements, if applicable...">${safe(d.benchmark)}</textarea>
          </div>

          <div class="field-group full">
            <label>Survey observations</label>
            <textarea data-detail="surveyObservations"
              placeholder="Record any additional observations relevant to the quotation...">${safe(d.surveyObservations)}</textarea>
          </div>

        </div>
      </section>

      <!-- SURVEY FINDINGS -->

      <section class="detail-section">

        <div class="detail-section-heading">
          <h3>Survey Findings & Recommendations</h3>

          <p>
            Summarise what the survey reveals and whether
            any further action is required.
          </p>
        </div>

        <div class="field-grid">

          <div class="field-group full">
            <label>Survey findings & recommendations *</label>

            <textarea data-detail="surveyFindings"
              placeholder="Summarise the survey findings, issues that may affect the project, and any recommended further investigation or action...">${safe(d.surveyFindings)}</textarea>
          </div>

        </div>
      </section>
    `;

    attachDetailListeners();
    attachSurveyPdfUpload();
    return;
  }

  if (isSuperstructure()) { renderSuperstructureDetails(); return; }

  if ((isSubstructure() || isGroundFloor()) && substructureFields[currentActivity]) {
    renderSubstructureDetails();
    return;
  }

  // All other Preliminaries activities use their previously defined
  // stage-specific fields, preserving the common five-step workflow.
  if (Object.prototype.hasOwnProperty.call(activityFieldDefinitions, currentActivity)) {
    renderGenericActivityDetails();
    return;
  }

  stepContent.innerHTML = `<div class="step-intro"><h3>Activity not configured</h3><p>Work Details for this activity are not configured yet.</p></div>`;
}

// ==========================================
// RESOURCE ROW CALCULATION
// ==========================================

function rowTotal(row, type) {

  const quantity = Number(row.quantity) || 0;
  const rate = Number(row.rate) || 0;

  if (type === "labour") {
    const duration = Number(row.duration) || 0;

    return quantity * duration * rate;
  }

  return quantity * rate;
}

function updateResourceRowTotal(element, row, type) {
  element.querySelector(".row-total").textContent =
    money(rowTotal(row, type));
}

// ==========================================
// RESOURCE ROW DISPLAY
// ==========================================

function renderResourceRows(containerId, rows, type) {

  const container = document.getElementById(containerId);

  if (!rows.length) {
    container.innerHTML = `
      <div class="empty-state">
        No items added yet. Select Add Item to begin.
      </div>
    `;

    return;
  }

  container.innerHTML = rows.map((row, index) => {

    const total = rowTotal(row, type);

    let fields = "";

    // LABOUR FIELDS

    if (type === "labour") {

      fields = `

        <input
          data-field="name"
          value="${safe(row.name)}"
          placeholder="Labour role"
        >

        <input
          type="number"
          min="0"
          step="0.01"
          data-field="quantity"
          value="${safe(row.quantity)}"
          placeholder="Workers"
        >

        <input
          type="number"
          min="0"
          step="0.01"
          data-field="duration"
          value="${safe(row.duration)}"
          placeholder="Duration"
        >

        <select data-field="durationUnit">
          ${option("Days", row.durationUnit || "Days")}
          ${option("Hours", row.durationUnit)}
          ${option("Weeks", row.durationUnit)}
        </select>

        <input
          type="number"
          min="0"
          step="0.01"
          data-field="rate"
          value="${safe(row.rate)}"
          placeholder="Rate"
        >

        <span class="row-total">
          ${money(total)}
        </span>
      `;

    } else {

      // MATERIALS AND OTHER COST FIELDS

      fields = `

        <input
          data-field="name"
          value="${safe(row.name)}"
          placeholder="${
            type === "other"
              ? "Expense name"
              : "Item name"
          }"
        >

        <input
          type="number"
          min="0"
          step="0.01"
          data-field="quantity"
          value="${safe(row.quantity)}"
          placeholder="Quantity"
        >

        <input
          data-field="unit"
          value="${safe(row.unit)}"
          placeholder="Unit"
        >

        ${
          type === "materials"
            ? `
              <select data-field="arrangement">
                <option value="">Arrangement</option>
                ${option("Company-owned", row.arrangement)}
                ${option("Hired", row.arrangement)}
                ${option("Purchased", row.arrangement)}
              </select>
            `
            : ""
        }

        <input
          type="number"
          min="0"
          step="0.01"
          data-field="rate"
          value="${safe(row.rate)}"
          placeholder="Unit rate"
        >

        <span class="row-total">
          ${money(total)}
        </span>
      `;
    }

    return `
      <div class="resource-row" data-index="${index}">

        ${fields}

        <button
          type="button"
          class="remove-row"
          aria-label="Remove item"
        >
          ×
        </button>

      </div>
    `;

  }).join("");

  // FIELD UPDATES

  container.querySelectorAll(".resource-row")
    .forEach(rowElement => {

      const index = Number(rowElement.dataset.index);

      rowElement.querySelectorAll("[data-field]")
        .forEach(field => {

          const update = () => {

            rows[index][field.dataset.field] =
              field.value;

            updateResourceRowTotal(
              rowElement,
              rows[index],
              type
            );

            saveProjectData();
          };

          field.addEventListener("input", update);
          field.addEventListener("change", update);
        });

      // REMOVE ROW

      rowElement.querySelector(".remove-row")
        .addEventListener("click", () => {

          rows.splice(index, 1);

          renderCurrentResourceStep();
          saveProjectData();
        });
    });
}

// ==========================================
// STEP 2: MATERIALS AND EQUIPMENT
// ==========================================

function renderMaterials() {
  if(isMixActivity())syncMixMaterials();if(hasDemoResource())syncDemoResource();if(isSuperstructure())syncSuperstructureResources();
  stepContent.innerHTML = `

    <div class="step-intro">
      <h3>Materials & Equipment</h3>

      <p>
        Enter the tools, equipment and resources required
        to complete ${safe(currentActivity.toLowerCase())}.
      </p>
    </div>

    <div class="resource-section">

      <h3>Hand tools, power tools and equipment</h3>

      <p>
        Enter each required item, its quantity,
        arrangement and rate.
      </p>

      <p class="sub-notice">Automatically generated placeholder material rows are unverified; validate before pricing. Additional manual materials and equipment remain editable.</p><div id="materialsRows"></div>

      <button
        type="button"
        class="add-row"
        id="addMaterial"
      >
        + Add material or equipment
      </button>

    </div>
  `;

  renderResourceRows(
    "materialsRows",
    activityData.materials,
    "materials"
  );

  document.getElementById("addMaterial")
    .addEventListener("click", () => {

      activityData.materials.push({
        name: "",
        quantity: "",
        unit: "",
        arrangement: "",
        rate: ""
      });

      renderMaterials();
      saveProjectData();
    });
}

// ==========================================
// STEP 3: LABOUR
// ==========================================

function renderLabour() {

  stepContent.innerHTML = `

    <div class="step-intro">
      <h3>Labour Requirements</h3>

      <p>
        Add the labour roles required to complete the work.
        Calculate cost using the number of workers,
        duration and applicable rate.
      </p>
    </div>

    <div class="resource-section">

      <h3>Labour schedule</h3>

      <p>
        For each role, enter the number of workers,
        duration and rate per worker.
      </p>

      <div id="labourRows"></div>

      <button
        type="button"
        class="add-row"
        id="addLabour"
      >
        + Add labour role
      </button>

    </div>
  `;

  renderResourceRows(
    "labourRows",
    activityData.labour,
    "labour"
  );

  document.getElementById("addLabour")
    .addEventListener("click", () => {

      activityData.labour.push({
        name: "",
        quantity: "",
        duration: "",
        durationUnit: "Days",
        rate: ""
      });

      renderLabour();
      saveProjectData();
    });
}

function logisticsRowTotal(row) {
  const basis = row.pricingBasis || "per-trip";
  const quantity = Number(row.quantity) || 0;
  const distance = Number(row.distance) || 0;
  const rate = Number(row.rate) || 0;

  if (basis === "per-trip") return quantity * rate;

  if (basis === "per-km") {
    const multiplier = row.tripType === "return" ? 2 : 1;
    return quantity * distance * multiplier * rate;
  }

  if (basis === "per-day") return quantity * rate;

  if (basis === "lump-sum") return rate;

  return 0;
}


function logisticsFormula(row) {
  const basis = row.pricingBasis || "per-trip";
  const quantity = Number(row.quantity) || 0;
  const distance = Number(row.distance) || 0;
  const rate = Number(row.rate) || 0;

  if (basis === "per-trip") {
    return `${quantity} trip(s) × ${money(rate)}`;
  }

  if (basis === "per-km") {
    const multiplier = row.tripType === "return" ? 2 : 1;

    return `${quantity} trip(s) × ${distance} km × ${multiplier} × ${money(rate)}`;
  }

  if (basis === "per-day") {
    return `${quantity} day(s) × ${money(rate)}`;
  }

  return `Agreed lump sum: ${money(rate)}`;
}


function renderLogistics() {
  stepContent.innerHTML = `
    <div class="step-intro">
      <h3>Logistics Requirements</h3>
      <p>
        Record transportation, haulage, delivery and movement
        costs needed for this activity. Disposal transport
        belongs here rather than under Other Cost.
      </p>
    </div>

    <div class="resource-section">
      <h3>Logistics schedule</h3>
      <p>
        Choose how each logistics item is priced.
        The total updates automatically.
      </p>

      <div id="logisticsRows" class="logistics-rows"></div>

      <button type="button" class="add-row" id="addLogistics">
        + Add logistics item
      </button>
    </div>
  `;

  const container = document.getElementById("logisticsRows");

  if (!activityData.logistics.length) {
    container.innerHTML = `
      <div class="empty-state">
        No logistics items added yet.
        Select Add logistics item to begin.
      </div>
    `;
  } else {
    container.innerHTML = activityData.logistics.map((row, index) => {
      const basis = row.pricingBasis || "per-trip";

      const quantityLabel =
        basis === "per-day" ? "Number of days" : "Number of trips";

      const rateLabel =
        basis === "lump-sum" ? "Agreed amount (₦)" :
        basis === "per-km" ? "Rate (₦/km)" :
        basis === "per-day" ? "Rate (₦/day)" :
        "Rate (₦/trip)";

      return `
        <div class="logistics-card" data-index="${index}">

          <div class="logistics-card-heading">
            <strong>Logistics item ${index + 1}</strong>

            <button
              type="button"
              class="remove-row"
              data-remove-logistics="${index}"
              aria-label="Remove logistics item"
            >×</button>
          </div>

          <div class="field-grid">

            <div class="field-group">
              <label>Category</label>
              <select data-logistics-field="category">
                <option value="">Select category (Optional)</option>
                ${[
                  "Haulage",
                  "Material delivery",
                  "Equipment transport",
                  "Personnel transport",
                  "Waste disposal transport",
                  "Loading / offloading",
                  "Other"
                ].map(value => option(value, row.category)).join("")}
              </select>
            </div>

            <div class="field-group">
              <label>Description</label>
              <input
                type="text"
                data-logistics-field="name"
                value="${safe(row.name)}"
                placeholder="Describe the logistics item (Optional)"
              >
            </div>

            <div class="field-group">
              <label>Origin</label>
              <input
                type="text"
                data-logistics-field="origin"
                value="${safe(row.origin)}"
                placeholder="Starting point (Optional)"
              >
            </div>

            <div class="field-group">
              <label>Destination</label>
              <input
                type="text"
                data-logistics-field="destination"
                value="${safe(row.destination)}"
                placeholder="Destination (Optional)"
              >
            </div>

            <div class="field-group">
              <label>Pricing basis</label>
              <select data-logistics-field="pricingBasis">
                ${option("per-trip", basis, "Per trip")}
                ${option("per-km", basis, "Per kilometre")}
                ${option("per-day", basis, "Per day")}
                ${option("lump-sum", basis, "Lump sum")}
              </select>
            </div>

            <div class="field-group">
              <label>${quantityLabel}</label>
              <input
                type="number"
                min="0"
                step="any"
                data-logistics-field="quantity"
                value="${safe(row.quantity)}"
                placeholder="${quantityLabel} (Optional)"
              >
            </div>

            <div class="field-group">
              <label>Distance (km)</label>
              <input
                type="number"
                min="0"
                step="any"
                data-logistics-field="distance"
                value="${safe(row.distance)}"
                placeholder="Distance (Optional)"
                ${basis === "per-km" ? "" : "disabled"}
              >
            </div>

            <div class="field-group">
              <label>Trip direction</label>
              <select
                data-logistics-field="tripType"
                ${basis === "per-km" ? "" : "disabled"}
              >
                ${option("one-way", row.tripType || "one-way", "One-way")}
                ${option("return", row.tripType, "Return trip")}
              </select>
            </div>

            <div class="field-group">
              <label>Vehicle / equipment</label>
              <input
                type="text"
                data-logistics-field="vehicle"
                value="${safe(row.vehicle)}"
                placeholder="Vehicle or equipment (Optional)"
              >
            </div>

            <div class="field-group">
              <label>${rateLabel}</label>
              <input
                type="number"
                min="0"
                step="any"
                data-logistics-field="rate"
                value="${safe(row.rate)}"
                placeholder="Enter rate / amount (Optional)"
              >
            </div>

          </div>

          <div class="logistics-calculation">
            <small>${safe(logisticsFormula(row))}</small>
            <strong>${money(logisticsRowTotal(row))}</strong>
          </div>

        </div>
      `;
    }).join("");
  }

  container.querySelectorAll(".logistics-card").forEach(card => {
    const index = Number(card.dataset.index);

    card.querySelectorAll("[data-logistics-field]").forEach(field => {
      const update = () => {
        const key = field.dataset.logisticsField;

        activityData.logistics[index][key] = field.value;

        if (key === "pricingBasis") {
          renderLogistics();
        } else {
          renderLogisticsCardCalculation(
            card,
            activityData.logistics[index]
          );
        }

        saveProjectData();
      };

      field.addEventListener("input", update);
      field.addEventListener("change", update);
    });
  });

  container.querySelectorAll("[data-remove-logistics]").forEach(button => {
    button.addEventListener("click", () => {
      activityData.logistics.splice(
        Number(button.dataset.removeLogistics),
        1
      );

      playFeedback("remove");
      renderLogistics();
      saveProjectData();
    });
  });

  document.getElementById("addLogistics").addEventListener("click", () => {
    activityData.logistics.push({
      category: "",
      name: "",
      origin: "",
      destination: "",
      pricingBasis: "per-trip",
      quantity: "",
      distance: "",
      tripType: "one-way",
      vehicle: "",
      rate: ""
    });

    playFeedback("add");
    renderLogistics();
    saveProjectData();
  });
}


function renderLogisticsCardCalculation(card, row) {
  const formula =
    card.querySelector(".logistics-calculation small");

  const total =
    card.querySelector(".logistics-calculation strong");

  if (formula) {
    formula.textContent = logisticsFormula(row);
  }

  if (total) {
    total.textContent = money(logisticsRowTotal(row));
  }

  const basis = row.pricingBasis || "per-trip";

  const quantityLabel =
    card.querySelector('[data-logistics-field="quantity"]')
      ?.previousElementSibling;

  const quantityInput =
    card.querySelector('[data-logistics-field="quantity"]');

  const distanceInput =
    card.querySelector('[data-logistics-field="distance"]');

  const tripSelect =
    card.querySelector('[data-logistics-field="tripType"]');

  const rateLabel =
    card.querySelector('[data-logistics-field="rate"]')
      ?.previousElementSibling;

  if (quantityLabel) {
    quantityLabel.textContent =
      basis === "per-day" ? "Number of days" : "Number of trips";
  }

  if (quantityInput) {
    quantityInput.placeholder =
      basis === "per-day" ? "Days (Optional)" : "Trips (Optional)";
  }

  if (distanceInput) {
    distanceInput.disabled = basis !== "per-km";
  }

  if (tripSelect) {
    tripSelect.disabled = basis !== "per-km";
  }

  if (rateLabel) {
    rateLabel.textContent =
      basis === "lump-sum" ? "Agreed amount (₦)" :
      basis === "per-km" ? "Rate (₦/km)" :
      basis === "per-day" ? "Rate (₦/day)" :
      "Rate (₦/trip)";
  }
}

// ==========================================
// STEP 4: OTHER COSTS
// ==========================================

function renderOtherCosts() {

  stepContent.innerHTML = `

    <div class="step-intro">
      <h3>Other Costs</h3>

      <p>
        Capture additional expenses that are not already
        included under materials, equipment or labour.
      </p>
    </div>

    <div class="resource-section">

      <h3>Additional expenses</h3>

      <p>
        Examples include debris transportation,
        waste disposal and other site-specific expenses.
      </p>

      <div id="otherCostRows"></div>

      <button
        type="button"
        class="add-row"
        id="addOtherCost"
      >
        + Add other cost
      </button>

    </div>
  `;

  renderResourceRows(
    "otherCostRows",
    activityData.otherCosts,
    "other"
  );

  document.getElementById("addOtherCost")
    .addEventListener("click", () => {

      activityData.otherCosts.push({
        name: "",
        quantity: "",
        unit: "",
        rate: ""
      });

      renderOtherCosts();
      saveProjectData();
    });
}

// ==========================================
// RE-RENDER CURRENT RESOURCE STEP
// ==========================================

function renderCurrentResourceStep() {
  if (currentStep === 1) renderMaterials();
  if (currentStep === 2) renderLabour();
  if (currentStep === 3) renderLogistics();
  if (currentStep === 4) renderOtherCosts();
}

// ==========================================
// COST CALCULATIONS
// ==========================================

function calculateActivityTotal() {
  const materials = activityData.materials.reduce(
    (sum, row) => sum + rowTotal(row, "materials"),
    0
  );

  const labour = activityData.labour.reduce(
    (sum, row) => sum + rowTotal(row, "labour"),
    0
  );

  const logistics = activityData.logistics.reduce(
    (sum, row) => sum + logisticsRowTotal(row),
    0
  );

  const other = activityData.otherCosts.reduce(
    (sum, row) => sum + rowTotal(row, "other"),
    0
  );

  return {
    materials,
    labour,
    logistics,
    other,
    total: materials + labour + logistics + other
  };
}

// ==========================================
// REVIEW HELPERS
// ==========================================

function reviewLine(label, value) {

  return `
    <div class="review-line">
      <span>${safe(label)}</span>

      <strong>
        ${safe(value || "Not provided")}
      </strong>
    </div>
  `;
}

function reviewRows(title, rows, type) {

  if (!rows.length) {
    return `
      <div class="review-section">
        <h3>${title}</h3>
        <p>No items added.</p>
      </div>
    `;
  }

  return `
    <div class="review-section">

      <h3>${title}</h3>

      ${rows.map(row => `
        <div class="review-line">

          <span>
            ${safe(row.name || "Unnamed item")}
          </span>

          <strong>
            ${money(rowTotal(row, type))}
          </strong>

        </div>
      `).join("")}

    </div>
  `;
}

function reviewLogisticsRows(title, rows) {
  if (!rows.length) {
    return `
      <div class="review-section">
        <h3>${safe(title)}</h3>
        <p>No items added.</p>
      </div>
    `;
  }

  return `
    <div class="review-section">
      <h3>${safe(title)}</h3>

      ${rows.map(row => `
        <div class="review-line">
          <span>
            ${safe(row.name || row.category || "Logistics item")}
            <small>${safe(logisticsFormula(row))}</small>
          </span>

          <strong>${money(logisticsRowTotal(row))}</strong>
        </div>
      `).join("")}
    </div>
  `;
}

// ==========================================
// ACTIVITY REVIEW
// ==========================================

function renderReview() {
  document.getElementById("confirmActivity").textContent = activityData.confirmed ? "Confirm again" : "Confirm activity →";

  const d = activityData.details;
  const totals = calculateActivityTotal();

  let detailsReview = "";

  // ----------------------------------------
  // SITE INSPECTION REVIEW
  // ----------------------------------------

  if (currentActivity === "Site inspection and assessment") {

    detailsReview = `
      <div class="review-section">
        <h3>1. Inspection Details & Site Assessment</h3>

        ${reviewLine("Inspection date", d.inspectionDate)}
        ${reviewLine("Conducted by", d.conductedBy)}
        ${reviewLine("Number of site visits", d.visitCount)}
        ${reviewLine("Site address", d.siteAddress)}
        ${reviewLine("Site access", d.siteAccess)}
        ${reviewLine("Terrain", d.terrain)}
        ${reviewLine("Visible soil condition", d.soilCondition)}
        ${reviewLine("Drainage condition", d.drainageCondition)}
        ${reviewLine("Existing structures", d.existingStructures)}
        ${reviewLine("Vegetation / obstruction", d.vegetation)}
        ${reviewLine("Existing utilities", d.existingUtilities)}
        ${reviewLine("Neighbouring constraints", d.neighbouringConstraints)}
        ${reviewLine("Survey plan available", d.surveyAvailable)}
        ${reviewLine("Survey reference", d.surveyReference)}
        ${reviewLine("Survey file", d.surveyFileName)}
        ${reviewLine("Site risks", d.siteRisks)}
        ${reviewLine("Inspection findings", d.findings)}
      </div>
    `;
  }

  // ----------------------------------------
  // SITE SURVEY REVIEW
  // ----------------------------------------

  if (currentActivity === "Site survey and assessment") {

    detailsReview = `
      <div class="review-section">

        <h3>1. Site Survey Details</h3>

        ${reviewLine("Survey date", d.surveyDate)}
        ${reviewLine("Survey conducted by", d.surveyConductedBy)}
        ${reviewLine("Type of survey", d.surveyType)}
        ${reviewLine("Survey equipment", d.surveyEquipment)}

        ${reviewLine(
          "Survey drawing PDFs",
          (d.surveyDrawingFiles || []).join(", ")
        )}

        ${reviewLine("Ground levels", d.groundLevels)}
        ${reviewLine("Topography / slopes", d.topography)}
        ${reviewLine("Boundary markers / beacons", d.boundaryMarkers)}
        ${reviewLine("Existing structures / obstructions", d.existingObstructions)}
        ${reviewLine("Reference benchmark / datum", d.benchmark)}
        ${reviewLine("Survey observations", d.surveyObservations)}
        ${reviewLine("Survey findings & recommendations", d.surveyFindings)}

      </div>
    `;
  }

  if (isSuperstructure()) detailsReview=superstructureReview();

  if ((isSubstructure() || isGroundFloor()) && substructureFields[currentActivity]) { detailsReview=substructureReview(); if(hasDemoResource())detailsReview+='<p class="sub-notice"><strong>UNVERIFIED PLACEHOLDER:</strong> Automatically derived material quantities are not commercially approved.</p>'; if(isMixActivity())detailsReview+='<p class="sub-notice"><strong>UNVERIFIED PLACEHOLDER quantities:</strong> not approved for commercial use.</p>'; }

  // Generic review for the 11 stage-specific activity forms.
  if (Object.prototype.hasOwnProperty.call(activityFieldDefinitions, currentActivity)) {
    const fields = activityFieldDefinitions[currentActivity];
    detailsReview = `
      <div class="review-section">
        <h3>1. ${safe(currentActivity)} Details</h3>
        ${fields.map(field => reviewLine(
          field.label + (field.unit ? ` (${field.unit})` : ""),
          d[field.key] ?? ""
        )).join("")}
      </div>`;
  }

document.getElementById("reviewContent").innerHTML = `

  ${detailsReview}

  ${reviewRows(
    "2. Materials & Equipment",
    activityData.materials,
    "materials"
  )}

  ${reviewRows(
    "3. Labour",
    activityData.labour,
    "labour"
  )}

  ${reviewLogisticsRows(
    "4. Logistics",
    activityData.logistics
  )}

  ${reviewRows(
    "5. Other Cost",
    activityData.otherCosts,
    "other"
  )}

  <div class="review-total">
    <span>${safe(currentActivity)} Cost</span>
    <strong>${money(totals.total)}</strong>
  </div>

`;

showView(reviewView);
}

// ==========================================
// VALIDATION
// ==========================================

function validateCurrentStep() {
  if (currentStep !== 0) return true;

  const requiredFields =
    stepContent.querySelectorAll("[required]");

  const missing = [];

  requiredFields.forEach(field => {
    const invalid = !String(field.value || "").trim();

    field.classList.toggle("field-invalid", invalid);
    field.setAttribute(
      "aria-invalid",
      invalid ? "true" : "false"
    );

    if (invalid) missing.push(field);
  });

  if (isSuperstructure() && !validateSuperstructure()) return false;
  if ((isSubstructure() || isGroundFloor()) && currentStep===0) {
    const rows=activityData.details.measurements||[];
    const spec=subMeasurements[currentActivity];
    if (rows.some(row=>spec.columns.some(([key])=>row[key]===''||row[key]===null||row[key]===undefined||!Number.isFinite(Number(row[key]))||Number(row[key])<0))) {
      showToast('Complete every numeric entry in added measurement rows, or remove incomplete rows.');
      playFeedback('error');vibrateFeedback([90,45,90]);
      return false;
    }
    if (rows.some(row=>currentActivity==='Foundation backfilling and compaction'&&num(row.occupied)>num(row.excavation))) {
      showToast('Occupied volume cannot exceed excavated void volume.');return false;
    }
    if (rows.some(row=>currentActivity==='Foundation blockwork / substructure walling'&&num(row.openings)>num(row.length)*num(row.height))) {
      showToast('Opening area cannot exceed gross wall area.');return false;
    }
  }
  if (missing.length) {
    showToast("Please complete the required fields.");

    playFeedback("error");
    vibrateFeedback([90, 45, 90]);

    missing[0].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    missing[0].focus({ preventScroll: true });

    return false;
  }

  return true;
}


function clearInvalidState(field) {
  if (String(field.value || "").trim()) {
    field.classList.remove("field-invalid");
    field.removeAttribute("aria-invalid");
  }
}


// ==========================================
// NAVIGATION: NEXT STEP
// ==========================================

document.getElementById("nextStep")
  .addEventListener("click", () => {

    if (!validateCurrentStep()) return;

    saveProjectData();

    if (currentStep < steps.length - 1) {

      currentStep++;
      renderStep();

    } else {

      renderReview();
    }
  });

// ==========================================
// NAVIGATION: PREVIOUS STEP
// ==========================================

document.getElementById("previousStep")
  .addEventListener("click", () => {

    if (currentStep > 0) {

      currentStep--;
      renderStep();
    }
  });

// ==========================================
// NAVIGATION: BACK TO STAGES
// ==========================================

document.getElementById("backToStages")
  .addEventListener("click", () => {

    renderStages();
    showView(stageView);
  });

// ==========================================
// NAVIGATION: BACK TO ACTIVITIES
// ==========================================

document.getElementById("backToActivities")
  .addEventListener("click", () => {

    saveProjectData();
    renderActivities();
    showView(activityView);
  });

// ==========================================
// NAVIGATION: BACK TO WIZARD
// ==========================================

document.getElementById("backToWizard")
  .addEventListener("click", () => {

    currentStep = steps.length - 1;

    renderStep();
    showView(wizardView);
  });

// ==========================================
// EDIT ACTIVITY
// ==========================================

document.getElementById("editActivity")
  .addEventListener("click", () => {

    currentStep = 0;

    renderStep();
    showView(wizardView);
  });

// ==========================================
// CONFIRM ACTIVITY
// ==========================================

document.getElementById("confirmActivity")
  .addEventListener("click", () => {

    const totals = calculateActivityTotal();

    activityData.totalCost = totals.total;
    activityData.confirmed = true;

    activityData.confirmedAt =
      new Date().toISOString();

    saveProjectData();

    showToast(`${currentActivity} has been confirmed.`);

    renderActivities();
    renderStages();
    document.getElementById("activityStatus").textContent = "Confirmed";
    updateSiblingNavigation();
    // Stay on the review so the user can move straight to the next activity.
    document.getElementById("confirmActivity").textContent = "Confirmed ✓";
  });

// ==========================================
// OK-QNB-003: prototype calculator functions
function isMixActivity(){return currentActivity==="Ground floor concrete slab";}
function mixState(){
 const d=activityData.details;
 d.mixDemo ||= {method:"site",parts:{cement:"1",sand:"2",gravel:"4"},units:{cement:"kg",sand:"kg",gravel:"kg"},factor:"1"};
 return d.mixDemo;
}
function mixQuantities(){
 const mix=mixState(),rows=activityData.details.measurements||[];
 const spec=subMeasurements[currentActivity];
 if(!rows.length||rows.some(row=>calcMeasured(spec,row)===null))return null;
 const volume=rows.reduce((a,r)=>a+calcMeasured(spec,r),0);
 if(mix.method==="ready")return {volume,ready:volume};
 const parts=["cement","sand","gravel"].map(k=>Number(mix.parts[k]));
 const factor=Number(mix.factor);
 if(parts.some(n=>!Number.isFinite(n)||n<=0)||!Number.isFinite(factor)||factor<=0)return null;
 const sum=parts.reduce((a,b)=>a+b,0),densities=[1440,1600,1500];
 return {volume,cement:volume*factor*parts[0]/sum*densities[0],sand:volume*factor*parts[1]/sum*densities[1],gravel:volume*factor*parts[2]/sum*densities[2]};
}
function mixConvert(kg,unit){return unit==="t"?kg/1000:unit==="50kg-bags"?kg/50:kg;}
function syncMixMaterials(){
 if(!isMixActivity())return;
 const m=mixState(),q=mixQuantities(),previous=activityData.materials||[];
 const manual=previous.filter(x=>x.source!=="okike-placeholder-mix");
 const old=Object.fromEntries(previous.filter(x=>x.source==="okike-placeholder-mix").map(x=>[x.materialKey,x]));
 const generated=[];
 if(q){
  for(const key of(m.method==="ready"?["ready"]:["cement","sand","gravel"])){
   const quantity=key==="ready"?q.ready:mixConvert(q[key],m.units[key]);
   generated.push({name:({cement:"Cement",sand:"Sharp sand",gravel:"Gravel",ready:"Ready-mixed concrete"})[key],
    quantity:String(Number(quantity.toFixed(4))),unit:key==="ready"?"m³":m.units[key],arrangement:"Purchased",rate:old[key]?.rate||"",
    source:"okike-placeholder-mix",materialKey:key,formulaStatus:"UNVERIFIED_PLACEHOLDER"});
  }
 }
 activityData.materials=[...generated,...manual];
}
function updateMixPreview(){
 if(!isMixActivity())return;
 const q=mixQuantities(),m=mixState(),volume=document.getElementById("mixVolume");
 if(!volume)return;
 volume.textContent=q?formatMeasure(q.volume)+" m³":"—";
 for(const key of["cement","sand","gravel"]){
  const out=document.querySelector('[data-mix-output="'+key+'"]');
  if(out)out.textContent=q&&m.method==="site"?formatMeasure(mixConvert(q[key],m.units[key]))+" "+m.units[key]:"—";
 }
 const ready=document.getElementById("mixReady");
 if(ready)ready.textContent=q?formatMeasure(q.volume)+" m³":"—";
 syncMixMaterials();
}
function renderMixPanel(){
 const host=document.getElementById("mixPanel");if(!host)return;
 const m=mixState();
 host.innerHTML='<div class="measurement-panel"><h3>Concrete mix — demonstration calculator</h3><p class="sub-notice"><strong>UNVERIFIED PLACEHOLDER:</strong> These quantities are for testing the form, not procurement, structural design or final quotations. Placeholder dry conversion factor and densities are not OKIKE-approved rules.</p><div class="field-grid"><div class="field-group"><label>Concrete supply</label><select id="mixMethod">'+option("site",m.method)+option("ready",m.method)+'</select></div><div class="field-group"><label>Calculated slab concrete volume</label><strong id="mixVolume">—</strong></div></div><div id="siteMixDetails" '+(m.method==="ready"?'hidden':'')+'><div class="field-grid">'+["cement","sand","gravel"].map(key=>'<div class="field-group"><label>'+key[0].toUpperCase()+key.slice(1)+' mix part</label><input type="number" min="0.001" step="any" data-mix-ratio="'+key+'" value="'+safe(m.parts[key])+'"><label>Calculated quantity</label><strong data-mix-output="'+key+'">—</strong><select data-mix-unit="'+key+'">'+["kg","t",...(key==="cement"?["50kg-bags"]:[])].map(v=>option(v,m.units[key])).join("")+'</select></div>').join("")+'</div><div class="field-group"><label>Illustrative dry-volume factor (not approved)</label><input id="mixFactor" type="number" min="0.001" step="any" value="'+safe(m.factor)+'"></div></div><p id="readyMixDetails" '+(m.method==="site"?'hidden':'')+'>Ready-mixed concrete volume: <strong id="mixReady">—</strong></p><p class="sub-notice">Demo mass model: slab volume × factor × (material mix part ÷ total parts) × assumed density. Demonstration densities: cement 1440, sand 1600, gravel 1500 kg/m³. No procurement allowance or bag rounding. Arbitrary proportions do not establish structural concrete suitability.</p></div>';
 host.querySelector("#mixMethod").onchange=e=>{m.method=e.target.value;activityData.confirmed=false;renderMixPanel();syncMixMaterials();saveProjectData();};
 host.querySelectorAll("[data-mix-ratio]").forEach(el=>el.oninput=()=>{m.parts[el.dataset.mixRatio]=el.value;activityData.confirmed=false;updateMixPreview();saveProjectData();});
 host.querySelectorAll("[data-mix-unit]").forEach(el=>el.onchange=()=>{m.units[el.dataset.mixUnit]=el.value;activityData.confirmed=false;updateMixPreview();saveProjectData();});
 host.querySelector("#mixFactor").oninput=e=>{m.factor=e.target.value;activityData.confirmed=false;updateMixPreview();saveProjectData();};
 updateMixPreview();
}


/* OK-QNB-005 — Source-grounded quantity methods.
 * Sources: RICS NRM2, BS4483 mesh tables (Midland Rapid, Rainham);
 * Visqueen DPM product roll dimensions. Physical and theoretical
 * minimum packaging are not automatically supplier order quantities.
 */
const VERIFIED_RESOURCE_ACTIVITIES=[
 "Hardcore / granular sub-base installation",
 "Sand blinding and surface levelling",
 "Damp-proof membrane installation",
 "Floor insulation and specialised protective layers",
 "Ground floor reinforcement"
];
const MESH_KG_PER_SQM={
 "A142 welded mesh (2.22 kg/m²)":2.22,
 "A193 welded mesh (3.02 kg/m²)":3.02,
 "A252 welded mesh (3.95 kg/m²)":3.95,
 "A393 welded mesh (6.16 kg/m²)":6.16
};
const DPM_ROLLS={
 "Polyethylene DPM 250 micron (4 × 25 m roll)":{width:4,length:25},
 "Polyethylene DPM 300 micron (4 × 25 m roll)":{width:4,length:25},
 "Polyethylene DPM 500 micron (4 × 12.5 m roll)":{width:4,length:12.5}
};
function hasDemoResource(){return isGroundFloor()&&VERIFIED_RESOURCE_ACTIVITIES.includes(currentActivity);}
function isPositive(x){return String(x??"").trim()!==""&&Number.isFinite(Number(x))&&Number(x)>0;}
function demoResourceState(){
 const d=activityData.details;d.resourceDemo ||= {};
 const v=d.resourceDemo;
 // The previous editable demonstration factor is intentionally ignored.
 // Keep legacy data for non-destructive storage compatibility.
 if(!isPositive(v.panelLength))v.panelLength="";
 if(!isPositive(v.panelWidth))v.panelWidth="";
 if(!isPositive(v.rollLength))v.rollLength="";
 if(!isPositive(v.rollWidth))v.rollWidth="";
 if(!v.barDiameter)v.barDiameter="";
 if(!v.spacingAcrossWidth)v.spacingAcrossWidth="";
 if(!v.spacingAcrossLength)v.spacingAcrossLength="";
 if(!["two-way","lengthwise","widthwise"].includes(v.barArrangement))v.barArrangement="two-way";
 const isBars=currentActivity==="Ground floor reinforcement"&&["Reinforcing bars — diameter and spacing","Reinforcing bars — bar schedule required"].includes(activityData.details.spec);
 const allowed=currentActivity==="Ground floor reinforcement"?(isBars?["kg","t","m","bars"]:["kg","t","m²","sheets"]):
 currentActivity==="Damp-proof membrane installation"?["m²","yd²","rolls","m","yd","cm","mm"]:
 currentActivity==="Floor insulation and specialised protective layers"?["m²","yd²","panels"]:
 ["m³","yd³"];
 if(!allowed.includes(v.unit))v.unit=allowed[0];
 return v;
}
function baseMeasuredAmount(){
 const rows=activityData.details.measurements||[],spec=subMeasurements[currentActivity];
 if(!rows.length||rows.some(r=>calcMeasured(spec,r)===null))return null;
 return rows.reduce((sum,r)=>sum+calcMeasured(spec,r),0);
}
function standardMaterialQuantity(){
 if(!hasDemoResource())return {error:"Activity not supported"};
 const area=baseMeasuredAmount(),d=activityData.details,state=demoResourceState();
 if(area===null)return {error:"Enter complete measurement rows"};
 const spec=String(d.spec||"").trim();
 if(!spec)return {error:"Select material specification"};
 const name=currentActivity,unit=state.unit;
 if(name==="Hardcore / granular sub-base installation"||name==="Sand blinding and surface levelling"){
   return {quantity:unit==="yd³"?area/0.764554857984:area,unit,
     note:"Compacted/in-place layer volume only; loose supply and tonnes need verified density and compaction data.",base:area,
     material:name.startsWith("Hardcore")?spec:spec};
 }
 if(name==="Damp-proof membrane installation"){
   const product=DPM_ROLLS[spec];
   const rollWidth=product?.width||Number(state.rollWidth),rollLength=product?.length||Number(state.rollLength);
   const hasRoll=isPositive(rollWidth)&&isPositive(rollLength);
   if(["rolls","m","yd","cm","mm"].includes(unit)&&!hasRoll)
     return {error:"Enter the usable roll width and length for this specification"};
   const rollArea=rollWidth*rollLength;
   if(unit==="rolls")
     return {quantity:Math.ceil(area/rollArea),unit,base:area,
       note:"Theoretical minimum rolls by gross coverage only. Laps, upstands, cuts and layout require a separate plan.",material:spec};
   if(["m","yd","cm","mm"].includes(unit)){
     const length=area/rollWidth;
     return {quantity:unit==="yd"?length/0.9144:unit==="cm"?length*100:unit==="mm"?length*1000:length,
       unit,base:area,note:"Equivalent membrane length at selected usable roll width; gross area, no lap allowance.",material:spec};
   }
   return {quantity:unit==="yd²"?area/0.83612736:area,unit,base:area,
     note:"Net membrane coverage; lap, upstand, cut loss and roll layout are not yet measured.",material:spec};
 }
 if(name==="Floor insulation and specialised protective layers"){
   if(unit==="panels"){
     if(!isPositive(state.panelLength)||!isPositive(state.panelWidth))
       return {error:"Enter panel length and width in metres to calculate panel count"};
     return {quantity:Math.ceil(area/(Number(state.panelLength)*Number(state.panelWidth))),unit,base:area,
       note:"Theoretical minimum panels from gross board area; board layout and cuts require review.",material:spec};
   }
   return {quantity:unit==="yd²"?area/0.83612736:area,unit,base:area,
     note:"Coverage area only. Panel size, layers, cuts and product suitability require review.",material:spec};
 }
 if(name==="Ground floor reinforcement"){
   if(["Reinforcing bars — diameter and spacing","Reinforcing bars — bar schedule required"].includes(spec)){
     const diameter=Number(state.barDiameter),spanAcrossWidth=Number(state.spacingAcrossWidth),
       spanAcrossLength=Number(state.spacingAcrossLength),arrangement=state.barArrangement;
     const lengthwise=arrangement==="two-way"||arrangement==="lengthwise";
     const widthwise=arrangement==="two-way"||arrangement==="widthwise";
     if(!isPositive(state.barDiameter)||![8,10,12,16,20,25,32].includes(diameter))
       return {error:"Select bar diameter to calculate reinforcement quantity"};
     if(lengthwise&&!isPositive(state.spacingAcrossWidth))
       return {error:"Enter spacing across slab width (mm) for lengthwise bars"};
     if(widthwise&&!isPositive(state.spacingAcrossLength))
       return {error:"Enter spacing across slab length (mm) for widthwise bars"};
     const rows=activityData.details.measurements||[];
     let totalLength=0,totalBars=0;
     for(const row of rows){
       const L=Number(row.length),W=Number(row.width),zones=Number(row.count);
       if(![L,W,zones].every(n=>Number.isFinite(n)&&n>0))
         return {error:"Enter positive slab length, width and zone count"};
       if(lengthwise){
         const bars=Math.ceil(W/(spanAcrossWidth/1000))+1;
         totalBars+=bars*zones;totalLength+=bars*L*zones;
       }
       if(widthwise){
         const bars=Math.ceil(L/(spanAcrossLength/1000))+1;
         totalBars+=bars*zones;totalLength+=bars*W*zones;
       }
     }
     const mass=totalLength*0.006165*diameter*diameter;
     const quantity=unit==="t"?mass/1000:unit==="m"?totalLength:unit==="bars"?totalBars:mass;
     return {quantity,unit,base:area,barCount:totalBars,barLength:totalLength,massKg:mass,
       note:"Preliminary grid takeoff: bar count per run = ceil(perpendicular span ÷ spacing) + 1; total length × 0.006165 × diameter² (mm) gives theoretical kg. No laps, anchorage, bending, cover, cut waste or structural verification.",material:"Reinforcing bar "+diameter+" mm"};
   }
   const density=MESH_KG_PER_SQM[spec];
   if(!density)return {error:"Selected bar or custom reinforcement requires an engineered bar bending schedule; no mesh mass can be inferred"};
   const mass=area*density;
   if(unit==="sheets"){
     return {quantity:Math.ceil(area/(4.8*2.4)),unit,base:area,
       note:"Theoretical minimum 4.8 × 2.4 m mesh sheets, excluding laps, cuts and layout; verify supplier sheet size.",material:spec};
   }
   return {quantity:unit==="m²"?area:unit==="t"?mass/1000:mass,unit,base:area,
     note:"Nominal mass = coverage m² × published mesh kg/m². Laps, waste and procurement quantity not included.",material:spec};
 }
 return {error:"Unsupported material type"};
}
function syncDemoResource(){
 if(!hasDemoResource())return;
 const tag="okike-placeholder-floor-resource",existing=activityData.materials||[],old=existing.find(r=>r.source===tag);
 const keep=existing.filter(r=>r.source!==tag),r=standardMaterialQuantity();
 if(r.error){activityData.materials=keep;return;}
 activityData.materials=[{name:r.material,quantity:String(Number(r.quantity.toFixed(6))),unit:r.unit,
 arrangement:"Purchased",rate:(old?.name===r.material&&old?.unit===r.unit)?(old.rate||""):"",source:tag,formulaStatus:"MEASURED_REFERENCE_METHOD",
 materialKey:currentActivity},...keep];
}
function renderDemoResource(){
 const host=document.getElementById("derivedResourcePanel");if(!host||!hasDemoResource())return;
 const state=demoResourceState(),name=currentActivity,fields=[];
 const isMem=name==="Damp-proof membrane installation",isIns=name==="Floor insulation and specialised protective layers";
 const isBar=name==="Ground floor reinforcement"&&["Reinforcing bars — diameter and spacing","Reinforcing bars — bar schedule required"].includes(activityData.details.spec);
 const choices=name==="Ground floor reinforcement"?(isBar?["kg","t","m","bars"]:["kg","t","m²","sheets"]):
 isMem?["m²","yd²","rolls","m","yd","cm","mm"]:isIns?["m²","yd²","panels"]:["m³","yd³"];
 if(isBar)fields.push(
 '<div class="field-group"><label>Bar diameter *</label><select data-derived="barDiameter"><option value="">Select diameter</option>'+[8,10,12,16,20,25,32].map(d=>option(String(d)+" mm",(state.barDiameter?String(state.barDiameter)+" mm":""))).join("")+'</select></div>'+
 '<div class="field-group"><label>Bar arrangement *</label><select data-derived="barArrangement">'+[["two-way","Two-way bars"],["lengthwise","Lengthwise bars only"],["widthwise","Widthwise bars only"]].map(([v,l])=>'<option value="'+v+'" '+(v===state.barArrangement?'selected':'')+'>'+l+'</option>').join("")+'</select></div>'+
 '<div class="field-group"><label>Spacing across slab width (mm)'+(state.barArrangement==="widthwise"?" (not used)":" *")+'</label><input type="number" min="1" step="any" data-derived="spacingAcrossWidth" value="'+safe(state.spacingAcrossWidth)+'"></div>'+
 '<div class="field-group"><label>Spacing across slab length (mm)'+(state.barArrangement==="lengthwise"?" (not used)":" *")+'</label><input type="number" min="1" step="any" data-derived="spacingAcrossLength" value="'+safe(state.spacingAcrossLength)+'"></div>');
  if(isMem&&!DPM_ROLLS[activityData.details.spec])fields.push(
 '<div class="field-group"><label>Membrane roll width (m)</label><input data-derived="rollWidth" type="number" min="0.001" step="any" value="'+safe(state.rollWidth)+'"></div>'+
 '<div class="field-group"><label>Membrane roll length (m)</label><input data-derived="rollLength" type="number" min="0.001" step="any" value="'+safe(state.rollLength)+'"></div>');
 if(isIns)fields.push(
 '<div class="field-group"><label>Selected panel length (m)</label><input data-derived="panelLength" type="number" min="0.001" step="any" value="'+safe(state.panelLength)+'"></div>'+
 '<div class="field-group"><label>Selected panel width (m)</label><input data-derived="panelWidth" type="number" min="0.001" step="any" value="'+safe(state.panelWidth)+'"></div>');
 host.innerHTML='<div class="measurement-panel demo-resource-panel"><h3>Calculated material requirement</h3>'+
 '<p class="sub-notice">Measured quantity and published material data only. This is a preliminary quantity takeoff, not a validated supplier order or structural design.</p>'+
 '<p class="demo-spec-label">Specification: <strong id="demoSpec">'+safe(activityData.details.spec||"Not yet specified")+'</strong></p>'+
 '<div class="field-grid"><div class="field-group"><label>Output unit</label><select id="demoUnit">'+choices.map(u=>option(u,state.unit)).join("")+'</select></div>'+fields.join("")+'</div>'+
 '<div class="measure-total"><span>Calculated material quantity</span><strong id="demoTotal">—</strong></div>'+
 '<p class="sub-notice" id="demoMethodNote"></p></div>';
 host.querySelector("#demoUnit").addEventListener("change",e=>{state.unit=e.target.value;activityData.confirmed=false;renderDemoResource();saveProjectData();});
 host.querySelectorAll("[data-derived]").forEach(input=>input.addEventListener(input.tagName==="SELECT"?"change":"input",e=>{
   state[e.target.dataset.derived]=e.target.dataset.derived==="barDiameter"?e.target.value.replace(" mm",""):e.target.value;activityData.confirmed=false;if(e.target.dataset.derived==="barArrangement")renderDemoResource();else updateDemoResource();saveProjectData();
 }));
 updateDemoResource();
}
function updateDemoResource(){
 if(!hasDemoResource())return;
 const result=standardMaterialQuantity(),total=document.getElementById("demoTotal"),note=document.getElementById("demoMethodNote");
 if(total)total.textContent=result.error?"—":formatMeasure(result.quantity)+" "+result.unit;
 if(note)note.textContent=result.error?result.error:(result.barCount!==undefined?"Bars: "+formatMeasure(result.barCount)+" · Total bar length: "+formatMeasure(result.barLength)+" m · Theoretical mass: "+formatMeasure(result.massKg)+" kg. ":"")+result.note;
 const spec=document.getElementById("demoSpec");
 if(spec)spec.textContent=activityData.details.spec||"Not yet specified";
 syncDemoResource();
}


/* One delegated handler for the full activity list across all configured stages. */
function openSelectedActivity(name){
 try{
   if(!activityCatalog().includes(name))return;
   openActivity(name);
 }catch(error){
   console.error("OKIKE could not open activity:",error);
   showToast("Unable to open this activity. Review the console error.");
 }
}
activityList.addEventListener("click",event=>{
 const row=event.target.closest(".activity-row[data-activity]");
 if(row&&activityList.contains(row))openSelectedActivity(row.dataset.activity);
});
activityList.addEventListener("keydown",event=>{
 if(event.key!=="Enter"&&event.key!==" ")return;
 const row=event.target.closest(".activity-row[data-activity]");
 if(row&&activityList.contains(row)){event.preventDefault();openSelectedActivity(row.dataset.activity);}
});
// Start on the selected Construction Scope. Never preselect a demonstration activity.
/* OK-SS-001 — Superstructure prototype. All floor records are independent.
   Source-grounded geometric takeoff is NOT a purchasing allowance or structural design. */
const superstructureActivities=[
 "Structural layout and setting out",
 "Reinforced concrete columns",
 "Reinforced concrete beams",
 "Walls",
 "Door and window opening formation",
 "Reinforced concrete stiffeners and wall ties",
 "Wall reinforcement and anchoring",
 "Concrete and masonry curing",
 "Superstructure inspection and quality testing"
];
const SUPER_WALL_TYPES=[
 "Non-load-bearing blockwork","Load-bearing blockwork","Brick masonry",
 "Drywall partition","Precast wall panels","Cast-in-situ concrete wall","Other / custom"
];
const SUPER_BLOCK_SIZES=[
 ["450 × 225 × 150 mm",450,225,150],
 ["450 × 225 × 225 mm",450,225,225],
 ["400 × 200 × 150 mm",400,200,150],
 ["Custom block dimensions",0,0,0]
];
function isSuperstructure(){return currentStage==="Superstructure";}
function getSuperConfig(){
 const raw=getProjectData().workDetails?.superstructureConfig||{};
 const floors=Array.isArray(raw.floors)&&raw.floors.length?raw.floors:[{id:"gf",label:"Ground Floor"}];
 return {floors,active: floors.some(f=>f.id===raw.active)?raw.active:floors[0].id};
}
function setSuperActive(id){
 const data=getProjectData();data.workDetails ||= {activities:{}};
 const config=getSuperConfig();if(!config.floors.some(f=>f.id===id))return;
 data.workDetails.superstructureConfig={...config,active:id};
 localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
}
function newWall(){
 return {id:"wall-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,6),type:"Non-load-bearing blockwork",
  position:"Interior",supply:"Purchased blocks",lengthMethod:"segments",blockSize:SUPER_BLOCK_SIZES[0][0],
  blockLength:"450",blockHeight:"225",blockThickness:"150",joint:"10",faces:"2",layers:"1",
  boardLength:"",boardWidth:"",panelLength:"",panelWidth:"",wallThickness:"",
  notes:"",cementPerBatch:"",sandPerBatch:"",blocksPerBatch:"",mortarMethod:"Site-mixed mortar",mortarConsumption:"",mortarMix:"",
  segments:[{ref:"",length:"",height:"",openings:"0"}]};
}
function superFloorDetails(floorId){
 const data=activityData.details;data.superstructure ||= {};
 data.superstructure[floorId] ||= {notes:"",drawing:"",items:[],walls:[],generic:{length:"",width:"",height:"",count:"1",spec:""}};
 return data.superstructure[floorId];
}
function cloneFloorSpec(original,full){
 const clone=JSON.parse(JSON.stringify(original||{}));
 if(full)return clone;
 const result={notes:"",drawing:clone.drawing||"",generic:{length:"",width:"",height:"",count:"1",spec:clone.generic?.spec||""},items:[]};
 result.walls=(clone.walls||[]).map(w=>({...w,id:"wall-"+Math.random().toString(36).slice(2,10),
   segments:[],notes:w.notes||""}));
 return result;
}
function addSuperFloor(label,mode,source){
 const clean=String(label||"").trim();
 const config=getSuperConfig();
 if(!clean||clean.length>70||config.floors.some(f=>f.label.toLowerCase()===clean.toLowerCase())){
   showToast("Enter a unique floor name (up to 70 characters).");return false;
 }
 if(!["blank","specs","full"].includes(mode)){showToast("Choose how to create the floor.");return false;}
 if(mode!=="blank"&&!config.floors.some(f=>f.id===source)){showToast("Select a source floor.");return false;}
 if(currentActivity)saveProjectData();
 const data=getProjectData(),id="floor-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
 data.workDetails ||= {activities:{}};
 for(const name of superstructureActivities){
  const rec=data.workDetails.activities?.[name];if(!rec)continue;
  rec.details ||= {};rec.details.superstructure ||= {};
  rec.details.superstructure[id]=mode==="blank"?{notes:"",drawing:"",walls:[],items:[],generic:{}}:cloneFloorSpec(rec.details.superstructure[source],mode==="full");
  rec.confirmed=false;
  // Generated rows must be recalculated and old floor-specific rates must not be duplicated.
  rec.materials=(rec.materials||[]).filter(r=>r.source!=="okike-superstructure-measured");
 }
 config.floors.push({id,label:clean});
 data.workDetails.superstructureConfig={...config,active:id};
 localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
 if(currentActivity&&isSuperstructure()){
   const rec=data.workDetails.activities?.[currentActivity];
   if(rec){activityData=JSON.parse(JSON.stringify(rec));activityData.confirmed=false;}
 }
 return true;
}
function renderSuperstructureSelector(){
 const host=document.getElementById("foundationSelector");if(!host)return;
 const config=getSuperConfig();host.hidden=false;
 host.innerHTML='<div class="sub-config super-floor-config">'+
 '<div class="sub-config-header"><div><h3>Superstructure floors</h3><p>All vertical structural activities are captured here. Each floor has independent measurements and costing.</p></div>'+
 '<button type="button" class="secondary-button" id="superAddFloor">+ Add floor</button></div>'+
 '<div class="super-floor-chips">'+config.floors.map(f=>'<button type="button" data-floor-open="'+safe(f.id)+'" class="secondary-button '+(f.id===config.active?"super-active":"")+'">'+safe(f.label)+'</button>').join("")+'</div>'+
 '<div id="superFloorCreate" hidden class="super-new-floor"><label>New floor name<input id="superFloorName" placeholder="e.g. First Floor" maxlength="70"></label>'+
 '<label>How should this floor be created?<select id="superCopyMode"><option value="blank">Start from scratch</option><option value="specs">Copy specifications only</option><option value="full">Duplicate selected floor measurements</option></select></label>'+
 '<label id="superSourceGroup" hidden>Copy from floor<select id="superCopySource">'+config.floors.map(f=>'<option value="'+safe(f.id)+'" '+(f.id===config.active?'selected':'')+'>'+safe(f.label)+'</option>').join("")+'</select></label>'+
 '<div class="super-floor-actions"><button type="button" class="primary-button" id="superCreateFloor">Create floor</button>'+
 '<button type="button" class="secondary-button" id="superCancelFloor">Cancel</button></div>'+
 '<p class="sub-notice">Start from scratch / Copy specifications only / Duplicate all measurements. Every new floor remains an unconfirmed draft.</p></div>'+
 '<p class="sub-notice">The floor selection applies across all nine Superstructure activities.</p></div>';
 const box=host.querySelector("#superFloorCreate");
 host.querySelector("#superAddFloor").onclick=()=>{box.hidden=false;};
 host.querySelector("#superCancelFloor").onclick=()=>{box.hidden=true;};
 host.querySelector("#superCopyMode").onchange=e=>{host.querySelector("#superSourceGroup").hidden=e.target.value==="blank";};
 host.querySelector("#superCreateFloor").onclick=()=>{
  const mode=host.querySelector("#superCopyMode").value;
  if(addSuperFloor(host.querySelector("#superFloorName").value,mode,host.querySelector("#superCopySource").value)){
   renderSuperstructureSelector();renderActivities();
  }
 };
 host.querySelectorAll("[data-floor-open]").forEach(button=>button.onclick=()=>{
  setSuperActive(button.dataset.floorOpen);renderSuperstructureSelector();
 });
}
function superSelect(label,value,options,attr){
 return '<label>'+safe(label)+'<select '+attr+'>'+options.map(v=>option(v,value)).join("")+'</select></label>';
}
function superInput(label,value,attr,type){
 return '<label>'+safe(label)+'<input type="'+(type||"text")+'" '+attr+' value="'+safe(value??"")+'" '+(type==="number"?'min="0" step="any"':"")+'></label>';
}
function superWallQuantity(w){
 const segments=Array.isArray(w.segments)?w.segments:[];
 if(!segments.length)return {error:"Add a wall measurement segment."};
 let gross=0,openings=0;
 for(const seg of segments){
  const L=Number(seg.length),H=Number(seg.height),O=Number(seg.openings||0);
  if(![L,H,O].every(Number.isFinite)||L<=0||H<=0||O<0||O>L*H)
    return {error:"Complete each wall segment with valid length, height and opening area."};
  gross+=L*H;openings+=O;
 }
 const net=gross-openings; if(net<0)return {error:"Opening area cannot exceed wall area."};
 const result={gross,openings,net,unit:"m²",quantity:net,materials:[],method:"Net wall coverage."};
 const type=w.type;
 if(type.includes("blockwork")||type==="Brick masonry"){
  const L=Number(w.blockLength),H=Number(w.blockHeight),T=Number(w.blockThickness),J=Number(w.joint);
  if(![L,H,T,J].every(Number.isFinite)||L<=0||H<=0||T<=0||J<0)
   return {...result,error:"Select valid block dimensions and mortar joint thickness."};
  const module=((L+J)/1000)*((H+J)/1000);
  const blocks=Math.ceil(net/module);
  result.quantity=blocks;result.unit="blocks";result.method="ceil(net area ÷ ((block length + joint) × (block height + joint)))";
  result.materials.push({name:w.type+" — "+w.blockSize,quantity:blocks,unit:"blocks"});
  if(isPositive(w.mortarConsumption))result.materials.push({name:"Laying mortar — "+(w.mortarMethod||"Site-mixed mortar"),quantity:Number((net*Number(w.mortarConsumption)/1000).toFixed(6)),unit:"m³"});
  if(w.supply==="In-house block production"){
   const perBatch=Number(w.blocksPerBatch),cement=Number(w.cementPerBatch),sand=Number(w.sandPerBatch);
   if([perBatch,cement,sand].every(v=>Number.isFinite(v)&&v>0)){
    const batches=Math.ceil(blocks/perBatch);
    result.materials=[{name:"Cement for block production",quantity:batches*cement,unit:"bags"},
      {name:"Sand for block production",quantity:batches*sand,unit:"m³"},
      ...result.materials.filter(r=>r.name.startsWith("Laying mortar"))];
    result.method+="; batches = ceil(blocks ÷ verified batch yield).";
   }else{
    result.materials=[];
    result.warning="Block production quantities require verified yield per batch, cement bags and sand m³ per batch.";
   }
  }else{
   result.warning="Laying mortar requires validated consumption, mix and yield. No arbitrary mortar percentage is applied.";
  }
 }else if(type==="Drywall partition"){
  const a=Number(w.boardLength)*Number(w.boardWidth);
  if(!(a>0)&&net>0)return {...result,error:"Enter selected drywall board length and width in metres."};
  const faces=Number(w.faces),layers=Number(w.layers);
  if(!(faces>0&&layers>0))return {...result,error:"Specify number of board faces and layers."};
  result.quantity=net===0?0:Math.ceil(net*faces*layers/a);result.unit="boards";
  result.materials=[{name:"Drywall boards",quantity:result.quantity,unit:"boards"}];
  result.warning="Framing, fixings, joints and cutting losses require separate specifications.";
 }else if(type==="Precast wall panels"){
  const a=Number(w.panelLength)*Number(w.panelWidth);
  if(!(a>0)&&net>0)return {...result,error:"Enter precast panel length and height in metres."};
  result.quantity=net===0?0:Math.ceil(net/a);result.unit="panels";
  result.materials=[{name:"Precast wall panels",quantity:result.quantity,unit:"panels"}];
  result.warning="Panel layout, joints, lifting and anchorage require engineering review.";
 }else if(type==="Cast-in-situ concrete wall"){
  const thick=Number(w.wallThickness);
  if(!Number.isFinite(thick)||thick<=0)return {...result,error:"Enter cast-in-situ wall thickness in millimetres."};
  result.quantity=net*thick/1000;result.unit="m³";
  result.materials=[{name:"Cast-in-situ concrete wall",quantity:result.quantity,unit:"m³"}];
  result.warning="Reinforcement and formwork are independent resources; concrete specification remains subject to design.";
 }
 return result;
}
function syncSuperstructureResources(){
 if(!isSuperstructure())return;
 const source="okike-superstructure-measured",old=activityData.materials||[];
 const prices=new Map(old.filter(r=>r.source===source).map(r=>[r.materialKey,r]));
 const manual=old.filter(r=>r.source!==source),generated=[];
 const floors=activityData.details.superstructure||{};
 if(currentActivity!=="Walls"){
  for(const floor of getSuperConfig().floors){
   const d=floors[floor.id];if(!d)continue;
   const total=superActivityTotal(currentActivity,d.items||[]);
   if(!total)continue;
   const items=[];
   if(["Reinforced concrete columns","Reinforced concrete beams"].includes(currentActivity))
    items.push({name:"Concrete — "+currentActivity+" ("+(d.specs?.grade||"grade unspecified")+")",quantity:total.quantity,unit:"m³"});
   if(currentActivity==="Door and window opening formation"&&total.lintelVolume>0&&d.specs?.lintel==="In-situ reinforced concrete lintel")
    items.push({name:"In-situ lintel concrete",quantity:total.lintelVolume,unit:"m³"});
   for(const [i,item] of items.entries()){
    const key=floor.id+":"+currentActivity+":"+i,oldItem=prices.get(key),name=floor.label+" — "+item.name;
    generated.push({name,quantity:String(Number(item.quantity.toFixed(6))),unit:item.unit,
      arrangement:"Purchased",rate:oldItem?.name===name&&oldItem?.unit===item.unit?oldItem.rate||"":"",
      source,materialKey:key});
   }
  }
 }
  if(currentActivity==="Walls"){
  for(const floor of getSuperConfig().floors){
   const data=floors[floor.id];if(!data)continue;
   for(const wall of data.walls||[]){
    const result=superWallQuantity(wall);if(result.error)continue;
    for(const [i,item] of result.materials.entries()){
     const key=floor.id+":"+wall.id+":"+i,oldItem=prices.get(key);
     generated.push({name:floor.label+" — "+item.name,quantity:String(item.quantity),unit:item.unit,
      arrangement:"Purchased",rate:oldItem?.unit===item.unit&&oldItem?.name===floor.label+" — "+item.name?oldItem.rate||"":"",
      source,materialKey:key});
    }
   }
  }
 }
 activityData.materials=[...generated,...manual];
}
function renderSuperstructureDetails(){
 const config=getSuperConfig(),current=config.active,rec=superFloorDetails(current);
 const tabs=config.floors.map(f=>'<button type="button" class="secondary-button '+(f.id===current?"super-active":"")+'" data-wizard-floor="'+safe(f.id)+'">'+safe(f.label)+'</button>').join("");
 const header='<div class="step-intro"><h3>'+safe(currentActivity)+' — '+safe(config.floors.find(f=>f.id===current)?.label||"Floor")+'</h3>'+
 '<p>Floor-specific Work Details. Each floor is independently measured. No quantities are copied without review.</p></div>'+
 '<div class="super-floor-chips">'+tabs+'<button type="button" class="secondary-button" id="superWizardAdd">+ Add Floor</button></div>'+
 '<div id="superWizardCreate" class="super-new-floor" hidden></div>';
 if(currentActivity==="Walls"){
   stepContent.innerHTML=header+'<div class="super-wall-controls"><h3>Wall systems</h3><p class="sub-notice">Add one or more wall types. Measurements are recorded by grid reference or overall segments, with openings deducted explicitly.</p><button type="button" class="secondary-button" id="superAddWall">+ Add wall type</button></div><div id="superWalls"></div>';
   renderSuperWalls();
   stepContent.querySelector("#superAddWall").onclick=()=>{rec.walls ||= [];rec.walls.push(newWall());superDraftChanged();renderSuperWalls();};
 }else{
    renderSuperstructureActivityDetails(header,rec);
 }
 stepContent.querySelectorAll("[data-wizard-floor]").forEach(b=>b.onclick=()=>{saveProjectData();setSuperActive(b.dataset.wizardFloor);renderSuperstructureDetails();});
 stepContent.querySelector("#superWizardAdd").onclick=()=>showSuperWizardFloorDialog();
}
function updateSuperGeneric(){
 const out=document.getElementById("superGenericOutput");if(!out)return;
 const g=superFloorDetails(getSuperConfig().active).generic||{},l=Number(g.length),w=Number(g.width),h=Number(g.height),n=Number(g.count);
 const isConcrete=["Reinforced concrete columns","Reinforced concrete beams"].includes(currentActivity);
 const valid=[l,w,h,n].every(x=>Number.isFinite(x)&&x>0);
 out.textContent=isConcrete?(valid?formatMeasure(l*w*h*n)+" m³":"— (complete section, height/span and repeats)"):
  (Number.isFinite(l)&&l>0?formatMeasure(l)+" m measured; confirm specialist quantities":"— (enter applicable measurements)");
}
function showSuperWizardFloorDialog(){
 const host=stepContent.querySelector("#superWizardCreate"),cfg=getSuperConfig();host.hidden=false;
 host.innerHTML='<h3>Add Superstructure Floor</h3>'+
 superInput("New floor name","",'id="superWizardFloorName"')+
 '<label>Creation method<select id="superWizardMode"><option value="blank">Start from scratch</option><option value="specs">Copy specifications only</option><option value="full">Duplicate selected floor measurements</option></select></label>'+
 '<label>Copy from floor<select id="superWizardSource">'+cfg.floors.map(f=>'<option value="'+safe(f.id)+'">'+safe(f.label)+'</option>').join("")+'</select></label>'+
 '<div class="super-floor-actions"><button type="button" class="primary-button" id="superWizardCreateButton">Create floor</button><button type="button" class="secondary-button" id="superWizardCancel">Cancel</button></div>'+
 '<p class="sub-notice">blank = empty; specs = copy material specifications without dimensions; full = duplicate as editable draft.</p>';
 host.querySelector("#superWizardCancel").onclick=()=>host.hidden=true;
 host.querySelector("#superWizardCreateButton").onclick=()=>{
  const id=host.querySelector("#superWizardSource").value||cfg.active;
  if(addSuperFloor(host.querySelector("#superWizardFloorName").value,host.querySelector("#superWizardMode").value,id)){
    renderSuperstructureDetails();
  }
 };
}
function renderSuperWalls(){
 const container=stepContent.querySelector("#superWalls");if(!container)return;
 const rec=superFloorDetails(getSuperConfig().active),walls=rec.walls||[];
 container.innerHTML=walls.length?walls.map((w,i)=>{
  const result=superWallQuantity(w),blockLike=w.type.includes("blockwork")||w.type==="Brick masonry";
  const standard=SUPER_BLOCK_SIZES.find(x=>x[0]===w.blockSize);
  let specific="";
  if(blockLike){
   specific='<div class="super-wall-grid">'+
      superSelect("Block / brick dimensions",w.blockSize,SUPER_BLOCK_SIZES.map(x=>x[0]),'data-super-wall="'+i+'" data-key="blockSize"')+
      superInput("Block length (mm)",w.blockLength,'data-super-wall="'+i+'" data-key="blockLength"',"number")+
      superInput("Block face height (mm)",w.blockHeight,'data-super-wall="'+i+'" data-key="blockHeight"',"number")+
      superInput("Block thickness (mm)",w.blockThickness,'data-super-wall="'+i+'" data-key="blockThickness"',"number")+
      superInput("Mortar joint thickness (mm)",w.joint,'data-super-wall="'+i+'" data-key="joint"',"number")+
      superSelect("Block supply",w.supply,["Purchased blocks","In-house block production"],'data-super-wall="'+i+'" data-key="supply"')+
      superSelect("Laying mortar",w.mortarMethod||"Site-mixed mortar",["Site-mixed mortar","Premixed laying mortar"],'data-super-wall="'+i+'" data-key="mortarMethod"')+
      superInput("Verified mortar consumption (litres/m²)",w.mortarConsumption||"",'data-super-wall="'+i+'" data-key="mortarConsumption"',"number")+
      superInput("Mortar specification / mix ratio",w.mortarMix||"",'data-super-wall="'+i+'" data-key="mortarMix"')+'</div>'+
      '<p class="sub-notice">Mortar quantity is calculated only when a verified project-specific consumption rate is entered. Block production material and laying mortar are separate.</p>';
   if(w.supply==="In-house block production")specific+='<div class="super-wall-grid">'+
    superInput("Verified blocks produced per batch",w.blocksPerBatch,'data-super-wall="'+i+'" data-key="blocksPerBatch"',"number")+
    superInput("Cement bags per production batch",w.cementPerBatch,'data-super-wall="'+i+'" data-key="cementPerBatch"',"number")+
    superInput("Sand (m³) per production batch",w.sandPerBatch,'data-super-wall="'+i+'" data-key="sandPerBatch"',"number")+'</div>'+
    '<p class="sub-notice">Production yield and mix must be validated from OKIKE records. Laying mortar is separate from block manufacture.</p>';
  }else if(w.type==="Drywall partition")specific='<div class="super-wall-grid">'+
   superInput("Board length (m)",w.boardLength,'data-super-wall="'+i+'" data-key="boardLength"',"number")+
   superInput("Board width (m)",w.boardWidth,'data-super-wall="'+i+'" data-key="boardWidth"',"number")+
   superInput("Faces",w.faces,'data-super-wall="'+i+'" data-key="faces"',"number")+
   superInput("Layers per face",w.layers,'data-super-wall="'+i+'" data-key="layers"',"number")+'</div>';
  else if(w.type==="Precast wall panels")specific='<div class="super-wall-grid">'+
   superInput("Panel width (m)",w.panelLength,'data-super-wall="'+i+'" data-key="panelLength"',"number")+
   superInput("Panel height (m)",w.panelWidth,'data-super-wall="'+i+'" data-key="panelWidth"',"number")+'</div>';
  else if(w.type==="Cast-in-situ concrete wall")specific='<div class="super-wall-grid">'+
   superInput("Concrete thickness (mm)",w.wallThickness,'data-super-wall="'+i+'" data-key="wallThickness"',"number")+'</div>';
  const rows=(w.segments||[]).map((r,j)=>'<div class="super-segment"><strong>Segment '+(j+1)+'</strong><div class="super-wall-grid">'+
    superInput("Grid reference / location",r.ref,'data-super-segment="'+i+'" data-segment-index="'+j+'" data-segment-key="ref"')+
    superInput("Wall length (m)",r.length,'data-super-segment="'+i+'" data-segment-index="'+j+'" data-segment-key="length"',"number")+
    superInput("Wall height (m)",r.height,'data-super-segment="'+i+'" data-segment-index="'+j+'" data-segment-key="height"',"number")+
    superInput("Opening area (m²)",r.openings,'data-super-segment="'+i+'" data-segment-index="'+j+'" data-segment-key="openings"',"number")+
    '</div><button type="button" class="secondary-button" data-remove-segment="'+i+'" data-segment-number="'+j+'">Remove segment</button></div>').join("");
  return '<section class="super-wall-card"><div class="super-wall-heading"><h3>Wall type '+(i+1)+'</h3><button type="button" class="secondary-button" data-remove-wall="'+i+'">Remove wall type</button></div>'+
    '<div class="super-wall-grid">'+
    superSelect("Wall type",w.type,SUPER_WALL_TYPES,'data-super-wall="'+i+'" data-key="type"')+
    superSelect("Wall position",w.position,["Interior","Exterior"],'data-super-wall="'+i+'" data-key="position"')+
    superSelect("Measurement method",w.lengthMethod,["segments","total"],'data-super-wall="'+i+'" data-key="lengthMethod"')+
    '</div>'+specific+
    '<div class="super-segment-heading"><h4>'+ (w.lengthMethod==="total"?"Overall wall dimensions":"Segments / grid-line measurements") +'</h4>'+(w.lengthMethod==="total"?"":'<button type="button" class="secondary-button" data-add-segment="'+i+'">+ Add segment</button>')+'</div>'+
    rows+
    '<div class="super-wall-result"><strong>Measured wall: '+(result.error?"Incomplete":formatMeasure(result.net)+" m² net")+'</strong>'+
    '<p>Calculated material: '+(result.error?"—":formatMeasure(result.quantity)+" "+safe(result.unit))+'</p>'+
    '<p class="sub-notice">'+safe(result.error||result.warning||result.method)+'</p></div>'+
    superInput("Specification / notes",w.notes,'data-super-wall="'+i+'" data-key="notes"')+'</section>';
 }).join(""):'<p class="sub-notice">No wall types added on this floor. Select + Add wall type.</p>';
 container.querySelectorAll("[data-super-wall]").forEach(el=>{
  const handler=()=>{const w=walls[Number(el.dataset.superWall)],key=el.dataset.key;w[key]=el.value;
   if(key==="blockSize"){const b=SUPER_BLOCK_SIZES.find(x=>x[0]===el.value);if(b&&b[1]){w.blockLength=String(b[1]);w.blockHeight=String(b[2]);w.blockThickness=String(b[3]);}}
   superDraftChanged();if(key==="lengthMethod"&&el.value==="total")w.segments=(w.segments||[]).slice(0,1);
   if(["type","blockSize","supply","lengthMethod"].includes(key))renderSuperWalls();else refreshSuperWallResults();
  };
  el.addEventListener(el.tagName==="SELECT"?"change":"input",handler);
 });
 container.querySelectorAll("[data-super-segment]").forEach(el=>el.addEventListener("input",()=>{
  walls[Number(el.dataset.superSegment)].segments[Number(el.dataset.segmentIndex)][el.dataset.segmentKey]=el.value;
  superDraftChanged();refreshSuperWallResults();
 }));
 container.querySelectorAll("[data-add-segment]").forEach(btn=>btn.onclick=()=>{
  walls[Number(btn.dataset.addSegment)].segments.push({ref:"",length:"",height:"",openings:"0"});
  superDraftChanged();renderSuperWalls();
 });
 container.querySelectorAll("[data-remove-segment]").forEach(btn=>btn.onclick=()=>{
  walls[Number(btn.dataset.removeSegment)].segments.splice(Number(btn.dataset.segmentNumber),1);
  superDraftChanged();renderSuperWalls();
 });
 container.querySelectorAll("[data-remove-wall]").forEach(btn=>btn.onclick=()=>{
  walls.splice(Number(btn.dataset.removeWall),1);superDraftChanged();renderSuperWalls();
 });
}
function refreshSuperWallResults(){
 // Avoid recreating active input elements on each keystroke.
 const walls=superFloorDetails(getSuperConfig().active).walls||[];
 stepContent.querySelectorAll(".super-wall-card").forEach((card,i)=>{
  const result=superWallQuantity(walls[i]),out=card.querySelector(".super-wall-result");
  if(out)out.innerHTML='<strong>Measured wall: '+(result.error?"Incomplete":formatMeasure(result.net)+" m² net")+'</strong>'+
    '<p>Calculated material: '+(result.error?"—":formatMeasure(result.quantity)+" "+safe(result.unit))+'</p>'+
    '<p class="sub-notice">'+safe(result.error||result.warning||result.method)+'</p>';
 });
}
function superDraftChanged(){
 activityData.confirmed=false;saveProjectData();syncSuperstructureResources();saveProjectData();
}
function validateSuperstructure(){
 const data=activityData.details.superstructure||{},cfg=getSuperConfig();
 if(currentActivity!=="Walls"){
  const def=SUPER_ACTIVITY_FIELDS[currentActivity];
  if(def)for(const f of cfg.floors)for(const row of data[f.id]?.items||[]){
   const result=superActivityQuantity(currentActivity,row);
   if(result.error){showToast(f.label+": "+result.error);return false;}
  }
 }

 if(currentActivity==="Walls"){
  for(const f of cfg.floors)for(const w of data[f.id]?.walls||[]){
   const r=superWallQuantity(w);
   if(r.error){showToast(f.label+": "+r.error);return false;}
  }
 }
 return true;
}
function superstructureReview(){
 const data=activityData.details.superstructure||{},cfg=getSuperConfig();
 const lines=cfg.floors.map(f=>{
  const rec=data[f.id];
  if(!rec)return '<p>'+safe(f.label)+': No details entered.</p>';
  if(currentActivity==="Walls")return '<h4>'+safe(f.label)+'</h4>'+
    (rec.walls||[]).map(w=>{const r=superWallQuantity(w);
      return '<p>'+safe(w.type)+' ('+safe(w.position)+'): '+(r.error?safe(r.error):formatMeasure(r.net)+" m² net; "+formatMeasure(r.quantity)+" "+safe(r.unit))+'</p>';
    }).join("");
  const total=superActivityTotal(currentActivity,rec.items||[]);
  const spec=Object.values(rec.specs||{}).filter(Boolean).map(safe).join(" · ");
  return '<p><strong>'+safe(f.label)+'</strong>: '+(total?formatMeasure(total.quantity)+" "+safe(total.unit):"Measurements incomplete")+
   (spec?" — "+spec:"")+'</p>';
 }).join("");
 return '<div class="review-section"><h3>Superstructure Work Details (all floors)</h3>'+lines+
   '<p class="sub-notice">Preliminary measurements are subject to drawing review; quantities exclude unapproved allowances.</p></div>';
}


/* OK-SS-002 — Activity-specific Work Details. All rows carry a drawing reference,
 * selected floor, dimensions and construction specification. Quantities describe
 * measured work only, not an automatically generated structural design. */
const SUPER_ACTIVITY_FIELDS={
 "Structural layout and setting out":{
  intro:"Set out vertical structural grids, wall lines and control points; record the drawing revision, datum and grid references.",
  columns:[["ref","Grid line / location","text"],["length","Setting-out length (m)","number"],["count","Repeated runs","number"]],
  specs:[["drawing","Architectural / structural drawing reference","text"],["datum","Survey datum / benchmark","text"],["method","Setting-out method","select",["Total station","Theodolite","Laser level / tape","Manual / other"]],["verification","Control-point verification notes","text"]],
  calc:"length",unit:"m",note:"Measured set-out line length only; control points, equipment and survey labour are separately costed."
 },
 "Reinforced concrete columns":{
  intro:"Group columns by structural grid, cross-section, storey height and concrete specification.",
  columns:[["ref","Column mark / grid","text"],["width","Column width (mm)","number"],["depth","Column depth (mm)","number"],["height","Column height (m)","number"],["count","No. of columns","number"]],
  specs:[["drawing","Structural drawing / revision","text"],["section","Column section","select",["Square / rectangular","Circular — measure separately","Other engineered section"]],["grade","Concrete specification / grade","text"],["reinforcement","Reinforcement schedule / bar mark reference","text"],["formwork","Formwork type / finish","select",["Timber / plywood","Steel panel","Proprietary modular","Other"]],["method","Concrete placement method","select",["Site-mixed","Ready-mix","Specified other"]]],
  calc:"volume",unit:"m³",note:"Gross rectangular column volume = width (m) × depth (m) × height (m) × quantity. Circular and engineered shapes need approved geometry; reinforcement and formwork require independent schedules."
 },
 "Reinforced concrete beams":{
  intro:"Measure beams by span, section and level. Distinguish them from ground beams or upper-floor beams already measured elsewhere.",
  columns:[["ref","Beam mark / grid","text"],["width","Beam width (mm)","number"],["depth","Beam overall depth (mm)","number"],["length","Beam length (m)","number"],["count","No. of beams","number"]],
  specs:[["drawing","Structural drawing / revision","text"],["kind","Beam type","select",["In-situ reinforced concrete","Precast reinforced concrete","Other engineered beam"]],["grade","Concrete specification / grade","text"],["reinforcement","Beam bar bending schedule reference","text"],["formwork","Soffit and side formwork specification","text"],["overlap","Beam/column/slab intersection measurement note","text"]],
  calc:"volume",unit:"m³",note:"Gross beam volume = width (m) × depth (m) × length (m) × number. Deductions at beam-column/slab intersections require the measurement convention to be documented."
 },
 "Door and window opening formation":{
  intro:"Record all openings and their lintel requirements within one activity. Wall area deductions remain in Walls; do not deduct openings twice.",
  columns:[["ref","Opening mark / location","text"],["width","Opening width (m)","number"],["height","Opening height (m)","number"],["count","Number of openings","number"],["lintelLength","Lintel overall length (m, if required)","number"],["lintelWidth","Lintel width (mm, optional)","number"],["lintelDepth","Lintel depth (mm, optional)","number"]],
  specs:[["drawing","Openings / elevations drawing reference","text"],["openingType","Opening type","select",["Door","Window","Vent / service opening","Mixed / specify per row"]],["lintel","Lintel requirement","select",["Not required / engineer to confirm","Precast concrete lintel","In-situ reinforced concrete lintel","Steel lintel","Other"]],["lintelSection","Lintel section / reinforcement / bearing notes","text"],["finish","Reveal / jamb / sill formation notes","text"]],
  calc:"openings",unit:"openings",note:"Counts openings and optional total specified lintel run. Lintel concrete, steel, bearing and reinforcement are not inferred from opening width."
 },
 "Reinforced concrete stiffeners and wall ties":{
  intro:"Capture stiffener elements and wall ties in separately traceable schedules; do not duplicate measured columns.",
  columns:[["ref","Stiffener or tie reference","text"],["width","Stiffener width (mm)","number"],["depth","Stiffener depth (mm)","number"],["height","Vertical height / length (m)","number"],["count","Quantity","number"]],
  specs:[["drawing","Structural / wall restraint detail","text"],["element","Element type","select",["Concrete wall stiffener","Wall tie / anchor","Movement-joint restraint","Other"]],["grade","Concrete / metal material specification","text"],["reinforcement","Rebar / anchorage specification","text"]],
  calc:"volume",unit:"m³",note:"Rectangular stiffeners produce gross geometric volume; wall ties and other units require a product-specific quantity schedule."
 },
 "Wall reinforcement and anchoring":{
  intro:"Specify reinforcement accessories, anchorage and spacing; measured quantities come from structural details or product installation schedules.",
  columns:[["ref","Wall reference / grid","text"],["length","Reinforced wall run (m)","number"],["count","Number of equivalent runs","number"]],
  specs:[["drawing","Structural masonry / wall detail","text"],["system","Reinforcement system","select",["Bed-joint reinforcement","Vertical reinforcing bars","Cavity / wall ties","Post-installed anchors","Other specified system"]],["spacing","Course spacing / anchorage centres (mm)","number"],["material","Product / bar / fixings specification","text"],["connection","Overlap / termination / connection details","text"]],
  calc:"length",unit:"m",note:"Net wall-run length is a measurement reference. Product quantities need confirmed course spacing, tie spacing, anchorage lengths and manufacturer/engineer details."
 },
 "Concrete and masonry curing":{
  intro:"Record curing zones, material type, duration and exposure requirements separately for each floor.",
  columns:[["ref","Curing zone / element","text"],["length","Exposed surface length (m)","number"],["width","Exposed surface width (m)","number"],["count","Surfaces / repeats","number"]],
  specs:[["drawing","Drawing / curing-zone reference","text"],["method","Specified curing system","select",["Water curing","Wet hessian / coverings","Membrane curing compound","Protective sheeting","Other"]],["period","Specified curing period (days)","number"],["material","Curing product / coverage specification","text"],["conditions","Weather and protection requirements","text"]],
  calc:"area",unit:"m²",note:"Measured exposed curing area only. No assumed water volume, compound spread rate or sheet laps."
 },
 "Superstructure inspection and quality testing":{
  intro:"Document inspection and testing obligations per floor without inventing laboratory or certification quantities.",
  columns:[["ref","Inspection / test reference","text"],["count","Number of inspections / tests","number"]],
  specs:[["drawing","Drawing / inspection plan","text"],["test","Inspection / test type","select",["Concrete tests","Masonry tests","Alignment / dimensional checks","Reinforcement inspection","Formwork inspection","Other"]],["standard","Applicable standard / acceptance criteria","text"],["responsible","Responsible inspector / laboratory","text"],["evidence","Reports / evidence and hold points","text"]],
  calc:"count",unit:"tests",note:"Schedule count only. Lab tests, samples and rates must follow the approved quality plan."
 }
};
function newSuperWorkRow(){
 return {ref:"",length:"",width:"",depth:"",height:"",count:"1",lintelLength:"",lintelWidth:"",lintelDepth:""};
}
function superActivityQuantity(name,row){
 const def=SUPER_ACTIVITY_FIELDS[name];if(!def)return {error:"Activity not configured"};
 const keys=def.columns.filter(x=>x[2]==="number"&&x[0]!=="lintelLength").map(x=>x[0]);
 if(keys.some(k=>String(row[k]??"").trim()===""))return {error:"Complete required measurement dimensions."};
 if(keys.some(k=>!Number.isFinite(Number(row[k]))||Number(row[k])<=0))return {error:"Measurement dimensions must be positive numbers."};
 const v=k=>Number(row[k]);
 let quantity=0,secondary=null;
 if(def.calc==="volume"){
  quantity=(v("width")/1000)*(v("depth")/1000)*(v("height")||v("length"))*v("count");
 }else if(def.calc==="length"){
  quantity=v("length")*v("count");
 }else if(def.calc==="area"){
  quantity=v("length")*v("width")*v("count");
 }else if(def.calc==="openings"){
  quantity=v("count");
  const lintel=String(row.lintelLength??"").trim();
  if(lintel){
   if(!Number.isFinite(Number(lintel))||Number(lintel)<0)return {error:"Lintel length must be non-negative."};
   secondary=Number(lintel)*v("count");
  }
 }else quantity=v("count");
 const lintelWidth=String(row.lintelWidth??"").trim(),lintelDepth=String(row.lintelDepth??"").trim();
 let lintelVolume=null;
 if(def.calc==="openings"&&(lintelWidth||lintelDepth)){
  if(!secondary||!(Number(lintelWidth)>0)||!(Number(lintelDepth)>0))return {error:"Enter a lintel length, width and depth together for concrete volume."};
  lintelVolume=secondary*Number(lintelWidth)/1000*Number(lintelDepth)/1000;
 }
 return {quantity,unit:def.unit,secondary,lintelVolume};
}
function superActivityTotal(name,rows){
 const def=SUPER_ACTIVITY_FIELDS[name];if(!def)return null;
 const entries=rows.map(r=>superActivityQuantity(name,r));
 if(!entries.length||entries.some(e=>e.error))return null;
 return {quantity:entries.reduce((t,e)=>t+e.quantity,0),unit:def.unit,
  secondary:entries.reduce((t,e)=>t+(e.secondary||0),0),lintelVolume:entries.reduce((t,e)=>t+(e.lintelVolume||0),0)};
}
function renderSuperstructureActivityDetails(header,rec){
 const def=SUPER_ACTIVITY_FIELDS[currentActivity];
 if(!def){stepContent.innerHTML=header+'<p class="sub-notice">Detailed requirements are being configured for this activity.</p>';return;}
 rec.specs ||= {};rec.items ||= [];
 stepContent.innerHTML=header+
  '<section class="super-detail-card"><div class="super-detail-head"><div><h3>Construction specifications</h3><p>'+safe(def.intro)+'</p></div></div>'+
  '<div class="super-detail-grid">'+def.specs.map(([key,label,type,opts])=>{
   const attr='data-super-spec="'+safe(key)+'"';
   return type==="select"?superSelect(label,rec.specs[key]||"",["",...opts],attr):
     superInput(label,rec.specs[key]||"",attr,type==="number"?"number":"text");
  }).join("")+'</div></section>'+
  '<section class="super-detail-card"><div class="super-detail-head"><div><h3>Measurement groups</h3><p>Record separate grid references, sizes or locations. Each group has its own calculated quantity.</p></div>'+
  '<button type="button" class="secondary-button" id="superAddWorkRow">+ Add measurement row</button></div>'+
  '<div id="superWorkRows"></div><div class="super-total-line"><span>Total measured quantity</span><strong id="superDetailedTotal">—</strong></div>'+
  '<p class="sub-notice">'+safe(def.note)+'</p></section>';
 stepContent.querySelectorAll("[data-super-spec]").forEach(el=>el.addEventListener(el.tagName==="SELECT"?"change":"input",()=>{
  rec.specs[el.dataset.superSpec]=el.value;superDraftChanged();renderSuperWorkTotal();
 }));
 stepContent.querySelector("#superAddWorkRow").onclick=()=>{
  rec.items.push(newSuperWorkRow());superDraftChanged();renderSuperWorkRows();
 };
 renderSuperWorkRows();
}
function renderSuperWorkRows(){
 const def=SUPER_ACTIVITY_FIELDS[currentActivity],rec=superFloorDetails(getSuperConfig().active),host=stepContent.querySelector("#superWorkRows");
 if(!def||!host)return;
 rec.items ||= [];
 host.innerHTML=rec.items.length?rec.items.map((row,index)=>{
  const res=superActivityQuantity(currentActivity,row);
  return '<div class="super-measurement"><div class="super-row-head"><strong>Measurement '+(index+1)+'</strong>'+
   '<button type="button" class="secondary-button" data-super-delete-row="'+index+'">Remove</button></div>'+
   '<div class="super-detail-grid">'+def.columns.map(([key,label,type])=>
    superInput(label,row[key]??"", 'data-super-row="'+index+'" data-super-key="'+safe(key)+'"',type)
   ).join("")+'</div><div class="super-row-quantity" data-super-row-output="'+index+'">'+
   (res.error?safe(res.error):formatMeasure(res.quantity)+" "+safe(res.unit)+
    (res.secondary!==null?" · Lintel runs: "+formatMeasure(res.secondary)+" m":"")+
    (res.lintelVolume!==null?" · Gross lintel concrete: "+formatMeasure(res.lintelVolume)+" m³":""))+'</div></div>';
 }).join(""):'<p class="sub-notice">No measurement rows added yet. Add a row for each grid line, element type or distinct dimension.</p>';
 host.querySelectorAll("[data-super-row]").forEach(el=>el.addEventListener("input",()=>{
  rec.items[Number(el.dataset.superRow)][el.dataset.superKey]=el.value;
  superDraftChanged();renderSuperWorkTotal();
 }));
 host.querySelectorAll("[data-super-delete-row]").forEach(btn=>btn.onclick=()=>{
  rec.items.splice(Number(btn.dataset.superDeleteRow),1);superDraftChanged();renderSuperWorkRows();
 });
 renderSuperWorkTotal();
}
function renderSuperWorkTotal(){
 const rec=superFloorDetails(getSuperConfig().active),rows=rec.items||[],total=superActivityTotal(currentActivity,rows);
 rows.forEach((row,i)=>{
  const el=stepContent.querySelector('[data-super-row-output="'+i+'"]');if(!el)return;
  const res=superActivityQuantity(currentActivity,row);
  el.textContent=res.error?res.error:formatMeasure(res.quantity)+" "+res.unit+
   (res.secondary!==null?" · Lintel runs: "+formatMeasure(res.secondary)+" m":"")+
   (res.lintelVolume!==null?" · Gross lintel concrete: "+formatMeasure(res.lintelVolume)+" m³":"");
 });
 const out=stepContent.querySelector("#superDetailedTotal");
 if(out)out.textContent=total?formatMeasure(total.quantity)+" "+total.unit+
  (total.secondary?" · Specified lintel runs: "+formatMeasure(total.secondary)+" m":"")+
  (total.lintelVolume?" · Gross lintel concrete: "+formatMeasure(total.lintelVolume)+" m³":""):"—";
}

renderStages();
if((getProjectData().constructionScope?.stages||[]).includes("Superstructure"))openStage("Superstructure");else showView(stageView);
