/* DTSC Alumni Association - Step Navigation */
(function () {
  "use strict";

  const form = document.getElementById("alumniRegistrationForm");
  if (!form) return;

  const steps = [...form.querySelectorAll("[data-form-step]")];
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const progressBar = document.getElementById("progressBar");
  const stepLabel = document.getElementById("stepLabel");
  const stepTitle = document.getElementById("stepTitle");
  const message = document.getElementById("formMessage");

  const titles = [
    "Personal Information",
    "Academic Information",
    "Address Information",
    "Review & Submit"
  ];

  let currentStep = 0;

  function showStep() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    prevBtn.disabled = currentStep === 0;

    nextBtn.classList.toggle(
      "hidden",
      currentStep === steps.length - 1
    );

    submitBtn.classList.toggle(
      "hidden",
      currentStep !== steps.length - 1
    );

    progressBar.style.width =
      ((currentStep + 1) / steps.length * 100) + "%";

    stepLabel.textContent =
      `Step ${currentStep + 1} of ${steps.length}`;

    stepTitle.textContent = titles[currentStep];

    if (currentStep === steps.length - 1) {
      window.DTSC_REGISTRATION?.renderReview();
    }

    message.textContent = "";
  }

  function validateCurrentStep() {
    const fields = [
      ...steps[currentStep].querySelectorAll(
        "input[required], select[required], textarea[required]"
      )
    ];

    for (const field of fields) {
      if (field.offsetParent === null) continue;

      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    return true;
  }

  nextBtn.addEventListener("click", function () {
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  prevBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      currentStep--;
      showStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  form.addEventListener("change", function () {
    if (currentStep === steps.length - 1) {
      window.DTSC_REGISTRATION?.renderReview();
    }
  });

  showStep();
})();
