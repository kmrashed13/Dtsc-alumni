/* ==========================================
   DTSC ALUMNI ASSOCIATION
   MEMBERSHIP REGISTRATION SYSTEM
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("membershipForm");

  if (!form) return;

  // ==========================================
  // 1. MULTI-STEP FORM
  // ==========================================

  const steps = [...document.querySelectorAll(".form-step")];
  const indicators = [...document.querySelectorAll(".step-indicator")];
  const progressFill = document.getElementById("progressFill");

  const prevBtn = document.getElementById("prevStep");
  const nextBtn = document.getElementById("nextStep");
  const submitBtn = document.getElementById("submitRegistration");

  let currentStep = 1;
  const totalSteps = steps.length;

  function showStep(step) {

    currentStep = step;

    steps.forEach(section => {
      section.classList.toggle(
        "active",
        Number(section.dataset.step) === step
      );
    });

    indicators.forEach(indicator => {

      const number = Number(indicator.dataset.step);

      indicator.classList.toggle("active", number === step);
      indicator.classList.toggle("completed", number < step);

    });

    if (progressFill) {
      progressFill.style.width =
        ((step / totalSteps) * 100) + "%";
    }

    prevBtn.hidden = step === 1;
    nextBtn.hidden = step === totalSteps;
    submitBtn.hidden = step !== totalSteps;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function validateStep(step) {

    const currentSection = steps.find(
      section => Number(section.dataset.step) === step
    );

    if (!currentSection) return true;

    const fields = currentSection.querySelectorAll(
      "input, select, textarea"
    );

    for (const field of fields) {

      if (
        field.disabled ||
        field.type === "checkbox" ||
        field.type === "file" ||
        field.type === "hidden"
      ) {
        continue;
      }

      if (!field.checkValidity()) {

        field.reportValidity();

        return false;
      }
    }

    return true;
  }

  nextBtn.addEventListener("click", function () {

    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {

      currentStep++;

      if (currentStep === totalSteps) {
        generateReview();
      }

      showStep(currentStep);
    }

  });

  prevBtn.addEventListener("click", function () {

    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
    }

  });

  // ==========================================
  // 2. YEAR & SESSION DROPDOWNS
  // ==========================================

  const currentYear = new Date().getFullYear();

  function populateYears(select, startYear, endYear) {

    if (!select) return;

    for (let year = startYear; year <= endYear; year++) {

      const option = document.createElement("option");

      option.value = year;
      option.textContent = year;

      select.appendChild(option);
    }
  }

  function populateSessions(select, startYear, endYear) {

    if (!select) return;

    for (let year = startYear; year <= endYear; year++) {

      const option = document.createElement("option");

      option.value = `${year}-${String(year + 1).slice(-2)}`;
      option.textContent = `${year}-${String(year + 1).slice(-2)}`;

      select.appendChild(option);
    }
  }

  // Passing years: 1966 to current year
  [
    "jsc_passing_year",
    "ssc_passing_year",
    "hsc_passing_year"
  ].forEach(name => {

    populateYears(
      form.elements[name],
      1966,
      currentYear
    );

  });

  // JSC / SSC / HSC sessions
  [
    "jsc_session",
    "ssc_session",
    "hsc_session"
  ].forEach(name => {

    populateSessions(
      form.elements[name],
      1966,
      currentYear
    );

  });

  // ==========================================
  // 3. CONDITIONAL EXAM FIELDS
  // ==========================================

  document.querySelectorAll(
    'input[name="examinations"]'
  ).forEach(checkbox => {

    checkbox.addEventListener("change", function () {

      const target = document.getElementById(
        this.dataset.target
      );

      if (target) {
        target.hidden = !this.checked;
      }

    });

  });

  // ==========================================
  // 4. CONDITIONAL CURRENT STATUS
  // ==========================================

  document.querySelectorAll(
    'input[name="current_status"]'
  ).forEach(checkbox => {

    checkbox.addEventListener("change", function () {

      const target = document.getElementById(
        this.dataset.target
      );

      if (target) {
        target.hidden = !this.checked;
      }

    });

  });

  // ==========================================
  // 5. GOVERNMENT / PRIVATE JOB
  // ==========================================

  const jobType = document.getElementById("jobType");

  const governmentFields = document.getElementById(
    "governmentFields"
  );

  const privateFields = document.getElementById(
    "privateFields"
  );

  if (jobType) {

    jobType.addEventListener("change", function () {

      governmentFields.hidden =
        this.value !== "government";

      privateFields.hidden =
        this.value !== "private";

    });

  }

  // ==========================================
  // 6. PRESENT & PERMANENT ADDRESS
  // ==========================================

  const sameAddressCheckbox = document.getElementById(
    "sameAddress"
  );

  const permanentSection = document.getElementById(
    "permanentAddressSection"
  );

  const addressFields = [
    "division",
    "district",
    "area_type",
    "local_area",
    "ward_union",
    "post_office",
    "address"
  ];

  function copyPresentToPermanent() {

    addressFields.forEach(key => {

      const present = form.elements[
        "present_" + key
      ];

      const permanent = form.elements[
        "permanent_" + key
      ];

      if (!present || !permanent) return;

      permanent.value = present.value;

      // Copy dropdown selections
      permanent.dispatchEvent(
        new Event("change", { bubbles: true })
      );

    });

  }

  function toggleSameAddress() {

    const same = sameAddressCheckbox.checked;

    permanentSection.hidden = same;

    addressFields.forEach(key => {

      const permanent = form.elements[
        "permanent_" + key
      ];

      if (!permanent) return;

      permanent.disabled = same;

      permanent.required = !same;

    });

    if (same) {
      copyPresentToPermanent();
    }

  }

  sameAddressCheckbox.addEventListener(
    "change",
    toggleSameAddress
  );

  // Keep permanent address updated when present address changes
  addressFields.forEach(key => {

    const present = form.elements[
      "present_" + key
    ];

    if (!present) return;

    present.addEventListener("change", function () {

      if (sameAddressCheckbox.checked) {
        copyPresentToPermanent();
      }

    });

    present.addEventListener("input", function () {

      if (sameAddressCheckbox.checked) {
        copyPresentToPermanent();
      }

    });

  });

  // ==========================================
  // 7. REVIEW INFORMATION
  // ==========================================

  const reviewContent = document.getElementById(
    "reviewContent"
  );

  function generateReview() {

    if (!reviewContent) return;

    const data = new FormData(form);

    const sections = [
      {
        title: "Personal Information",
        fields: [
          ["Name", "full_name"],
          ["Father's Name", "father_name"],
          ["Mother's Name", "mother_name"],
          ["Date of Birth", "dob_day"],
          ["Blood Group", "blood_group"],
          ["Contact Number", "phone"],
          ["Email", "email"]
        ]
      },
      {
        title: "Academic Information",
        fields: [
          ["JSC Roll", "jsc_roll"],
          ["JSC Registration", "jsc_reg"],
          ["JSC GPA", "jsc_gpa"],
          ["JSC Passing Year", "jsc_passing_year"],
          ["JSC Session", "jsc_session"],

          ["SSC Trade", "ssc_trade"],
          ["SSC Roll", "ssc_roll"],
          ["SSC Registration", "ssc_reg"],
          ["SSC GPA", "ssc_gpa"],
          ["SSC Passing Year", "ssc_passing_year"],
          ["SSC Session", "ssc_session"],

          ["HSC Trade", "hsc_trade"],
          ["HSC Roll", "hsc_roll"],
          ["HSC Registration", "hsc_reg"],
          ["HSC GPA", "hsc_gpa"],
          ["HSC Passing Year", "hsc_passing_year"],
          ["HSC Session", "hsc_session"],

          ["Diploma Technology", "diploma_technology"],
          ["Diploma Roll", "diploma_roll"],
          ["Diploma Registration", "diploma_reg"],
          ["Diploma CGPA", "diploma_cgpa"],
          ["Diploma Passing Year", "diploma_passing_year"],
          ["Diploma Session", "diploma_session"]
        ]
      },
      {
        title: "Current Status",
        fields: [
          ["Higher Studies Institute", "higher_institute"],
          ["Higher Studies Department", "higher_department"],

          ["Job Type", "job_type"],
          ["Government Organization", "gov_organization"],
          ["Government Designation", "gov_designation"],
          ["Government Department", "gov_department"],

          ["Private Company", "private_company"],
          ["Private Designation", "private_designation"],
          ["Private Department", "private_department"],
          ["Private Location", "private_location"],

          ["Business Name", "business_name"],
          ["Business Type", "business_type"],
          ["Business Location", "business_location"],

          ["Other Status", "other_status"]
        ]
      },
      {
        title: "Association Details",
        fields: [
          ["Suggestions", "association_suggestions"]
        ]
      }
    ];

    let html = "";

    sections.forEach(section => {

      html += `
        <div class="review-section">
          <h4>${section.title}</h4>
          <div class="review-grid">
      `;

      section.fields.forEach(([label, name]) => {

        const value = data.get(name);

        if (value && String(value).trim()) {

          html += `
            <div class="review-item">
              <span>${label}</span>
              <strong>${escapeHTML(value)}</strong>
            </div>
          `;

        }

      });

      html += `
          </div>
        </div>
      `;

    });

    // Selected exams
    const selectedExams = data.getAll("examinations");

    if (selectedExams.length) {

      html += `
        <div class="review-section">
          <h4>Selected Examinations</h4>
          <p>${selectedExams.map(escapeHTML).join(", ")}</p>
        </div>
      `;

    }

    // Selected statuses
    const selectedStatuses = data.getAll("current_status");

    if (selectedStatuses.length) {

      html += `
        <div class="review-section">
          <h4>Current Status</h4>
          <p>${selectedStatuses.map(escapeHTML).join(", ")}</p>
        </div>
      `;

    }

    reviewContent.innerHTML = html;

  }

  // ==========================================
  // 8. HTML SAFE TEXT
  // ==========================================

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }

  // ==========================================
  // 9. FORM SUBMISSION
  // ==========================================

  form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!validateStep(5)) return;

    const confirmation = document.getElementById(
      "confirmInformation"
    );

    if (!confirmation.checked) {

      confirmation.reportValidity();

      return;
    }

    alert(
      "Registration form is ready. Database connection will be added in the next phase."
    );

  });

  // ==========================================
  // 10. INITIALIZATION
  // ==========================================

  showStep(1);

  toggleSameAddress();

});
