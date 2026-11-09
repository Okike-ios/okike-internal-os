
const form = document.getElementById("quotationForm");
const saveButton = document.getElementById("saveDraft");
const saveStatus = document.getElementById("saveStatus");
const toast = document.getElementById("toast");

const STORAGE_KEY = "okike_new_build_quotation";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Collect form information
function getFormData() {
  const data = {};

  form.querySelectorAll("input, select, textarea").forEach(field => {
    data[field.name] = field.value;
  });

  return data;
}

// Save information
function saveDraft() {
  const data = getFormData();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  saveStatus.textContent = "Saved locally";

  showToast("Quotation information saved.");
}

// Restore previously saved information
function loadDraft() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) return;

  const data = JSON.parse(savedData);

  Object.keys(data).forEach(name => {
    const field = form.elements[name];

    if (field) {
      field.value = data[name];
    }
  });

  saveStatus.textContent = "Draft restored";
}

// Auto-save when fields change
form.addEventListener("input", () => {
  saveStatus.textContent = "Unsaved changes";
});
// Save Draft button
saveButton.addEventListener("click", function() {
  saveDraft();
});

// Continue to Construction Scope
form.addEventListener("submit", function(event) {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  saveDraft();

  window.location.href = "construction-scope.html";
});

// Restore draft when page opens
loadDraft();
