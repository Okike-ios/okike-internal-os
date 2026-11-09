const STORAGE_KEY = "okike_new_build_quotation";

const scopeForm = document.getElementById("scopeForm");
const stageCheckboxes = document.querySelectorAll(
  'input[name="stages"]'
);

const selectedCount = document.getElementById("selectedCount");
const scopeNotes = document.getElementById("scopeNotes");
const saveStatus = document.getElementById("saveStatus");
const saveDraftButton = document.getElementById("saveDraft");
const toast = document.getElementById("toast");


// GET EXISTING PROJECT DATA
function getProjectData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}


// SAVE PROJECT DATA
function saveScope() {
  const projectData = getProjectData();

  const selectedStages = Array.from(stageCheckboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);

  projectData.constructionScope = {
    stages: selectedStages,
    additionalNotes: scopeNotes.value,
    lastUpdated: new Date().toISOString()
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projectData)
  );

  saveStatus.textContent = "Draft saved locally";

  return projectData;
}


// UPDATE SELECTION COUNT
function updateSelectionCount() {
  const count = Array.from(stageCheckboxes)
    .filter(checkbox => checkbox.checked).length;

  selectedCount.textContent = count;
}


// LOAD PREVIOUSLY SAVED SCOPE
function loadScope() {
  const projectData = getProjectData();
  const savedScope = projectData.constructionScope;

  if (!savedScope) {
    updateSelectionCount();
    return;
  }

  const savedStages = savedScope.stages || [];

  stageCheckboxes.forEach(checkbox => {
    checkbox.checked = savedStages.includes(checkbox.value);
  });

  scopeNotes.value = savedScope.additionalNotes || "";

  updateSelectionCount();
}


// SHOW MESSAGE
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}


// SAVE BUTTON
saveDraftButton.addEventListener("click", () => {
  saveScope();
  showToast("Your construction scope has been saved.");
  window.playFeedback?.("success");
});


// UPDATE WHEN A STAGE IS SELECTED
stageCheckboxes.forEach(checkbox => {
  checkbox.addEventListener("change", () => {
    updateSelectionCount();
    saveScope();
  });
});


// SAVE NOTES AS THEY ARE ENTERED
scopeNotes.addEventListener("change", saveScope);


// CONTINUE TO WORK DETAILS
scopeForm.addEventListener("submit", event => {
  event.preventDefault();

  const selectedStages = Array.from(stageCheckboxes)
    .filter(checkbox => checkbox.checked);

  if (selectedStages.length === 0) {
    showToast("Please select at least one construction stage.");
    return;
  }

  saveScope();

  window.location.href = "work-details.html";
});


// INITIALISE
loadScope();