/* =====================================================
   DTSC ALUMNI ASSOCIATION
   REGISTRATION FORM CONTROLLER
   Step Navigation | Progress | Language | DOB
===================================================== */

(function () {
    "use strict";

    let currentStep = 1;
    const totalSteps = 4;
    let currentLanguage = "en";

    const steps = document.querySelectorAll("[data-form-step]");
    const stepItems = document.querySelectorAll(".step-item");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progressPercent = document.getElementById("progressPercent");

    /* ==============================
       STEP NAVIGATION
    ============================== */

    function showStep(step) {
        currentStep = step;

        steps.forEach(section => {
            const sectionStep = Number(section.dataset.formStep);
            section.style.display =
                sectionStep === step ? "block" : "none";
        });

        stepItems.forEach(item => {
            const itemStep = Number(item.dataset.step);

            item.classList.remove("active", "completed");

            if (itemStep === step) {
                item.classList.add("active");
            }

            if (itemStep < step) {
                item.classList.add("completed");
            }
        });

        updateProgress();
        updateButtons();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* ==============================
       PROGRESS BAR
    ============================== */

    function updateProgress() {
        const percent = Math.round((currentStep / totalSteps) * 100);

        if (progressFill) {
            progressFill.style.width = percent + "%";
        }

        if (progressText) {
            progressText.textContent =
                `Step ${currentStep} of ${totalSteps}`;
        }

        if (progressPercent) {
            progressPercent.textContent = percent + "%";
        }
    }

    /* ==============================
       BUTTON VISIBILITY
    ============================== */

    function updateButtons() {
        if (prevBtn) {
            prevBtn.style.display =
                currentStep === 1 ? "none" : "inline-flex";
        }

        if (nextBtn) {
            nextBtn.style.display =
                currentStep === totalSteps ? "none" : "inline-flex";
        }

        if (submitBtn) {
            submitBtn.style.display =
                currentStep === totalSteps ? "inline-flex" : "none";
        }
    }

    /* ==============================
       STEP VALIDATION
    ============================== */

    function validateStep(step) {
        const section = document.querySelector(
            `[data-form-step="${step}"]`
        );

        if (!section) return true;

        const fields = section.querySelectorAll(
            "input, select, textarea"
        );

        for (const field of fields) {

            if (field.disabled) continue;

            if (field.type === "checkbox" || field.type === "radio") {
                continue;
            }

            if (
                field.required &&
                field.offsetParent !== null &&
                !field.checkValidity()
            ) {
                field.reportValidity();
                field.focus();
                return false;
            }
        }

        // Step 2: At least one academic qualification
        if (step === 2) {
            const academicCheckboxes = section.querySelectorAll(
                'input[type="checkbox"]'
            );

            if (academicCheckboxes.length > 0) {
                const checked = [...academicCheckboxes].some(
                    checkbox => checkbox.checked
                );

                if (!checked) {
                    alert(
                        currentLanguage === "bn"
                            ? "কমপক্ষে একটি শিক্ষাগত যোগ্যতা নির্বাচন করুন।"
                            : "Please select at least one academic qualification."
                    );

                    return false;
                }
            }
        }

        // Step 3: Current status must be selected
        if (step === 3) {
            const statusRadio = section.querySelector(
                'input[name="currentStatus"]:checked'
            );

            if (!statusRadio) {
                alert(
                    currentLanguage === "bn"
                        ? "আপনার বর্তমান অবস্থা নির্বাচন করুন।"
                        : "Please select your current status."
                );

                return false;
            }
        }

        return true;
    }

    /* ==============================
       NEXT BUTTON
    ============================== */

    if (nextBtn) {
        nextBtn.addEventListener("click", function () {

            if (!validateStep(currentStep)) return;

            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            }
        });
    }

    /* ==============================
       PREVIOUS BUTTON
    ============================== */

    if (prevBtn) {
        prevBtn.addEventListener("click", function () {

            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }

    /* ==============================
       SIDEBAR STEP CLICK
    ============================== */

    stepItems.forEach(item => {
        item.addEventListener("click", function () {

            const targetStep = Number(item.dataset.step);

            if (targetStep < currentStep) {
                showStep(targetStep);
            }
        });
    });

    /* ==============================
       DATE OF BIRTH
    ============================== */

    function initializeDOB() {

        const daySelect = document.getElementById("dobDay");
        const monthSelect = document.getElementById("dobMonth");
        const yearSelect = document.getElementById("dobYear");

        if (!daySelect || !monthSelect || !yearSelect) return;

        // Days
        daySelect.innerHTML =
            '<option value="">Day</option>';

        for (let day = 1; day <= 31; day++) {
            daySelect.innerHTML +=
                `<option value="${day}">${day}</option>`;
        }

        // Months
        const months = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        monthSelect.innerHTML =
            '<option value="">Month</option>';

        months.forEach((month, index) => {
            monthSelect.innerHTML +=
                `<option value="${index + 1}">${month}</option>`;
        });

        // Years
        const currentYear = new Date().getFullYear();

        yearSelect.innerHTML =
            '<option value="">Year</option>';

        for (let year = currentYear; year >= 1940; year--) {
            yearSelect.innerHTML +=
                `<option value="${year}">${year}</option>`;
        }
    }

    /* ==============================
       LANGUAGE TOGGLE
    ============================== */

    const languageBtn = document.getElementById("languageToggle");

    if (languageBtn) {
        languageBtn.addEventListener("click", function () {

            currentLanguage =
                currentLanguage === "en" ? "bn" : "en";

            document.documentElement.lang = currentLanguage;

            translatePage(currentLanguage);

            languageBtn.textContent =
                currentLanguage === "en"
                    ? "বাংলা"
                    : "English";
        });
    }

    function translatePage(language) {

        const elements = document.querySelectorAll(
            "[data-en][data-bn]"
        );

        elements.forEach(element => {
            element.textContent =
                element.getAttribute(
                    language === "bn" ? "data-bn" : "data-en"
                );
        });
    }

    /* ==============================
       INITIALIZE
    ============================== */

    initializeDOB();
    showStep(1);

})();
