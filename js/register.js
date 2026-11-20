/* ============================================
   DTSC ALUMNI ASSOCIATION
   STEP CONTROLLER
   ============================================ */

(function () {
    "use strict";

    const form = document.getElementById("alumniRegistrationForm");
    if (!form) return;

    let currentStep = 1;
    const totalSteps = 4;
    let language = "en";

    const sections = [...document.querySelectorAll("[data-form-step]")];
    const stepItems = [...document.querySelectorAll(".step-item")];

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementElement
        ? null
        : document.getElementById("submitBtn");

    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progressPercent = document.getElementById("progressPercent");

    /* STEP NAVIGATION */

    function showStep(step) {
        currentStep = Math.max(1, Math.min(step, totalSteps));

        sections.forEach(section => {
            const active = Number(section.dataset.formStep) === currentStep;
            section.hidden = !active;
            section.style.display = active ? "block" : "none";
        });

        stepItems.forEach(item => {
            const number = Number(item.dataset.step);

            item.classList.toggle("active", number === currentStep);
            item.classList.toggle("completed", number < currentStep);
        });

        updateProgress();
        updateButtons();

        window.showRegistrationStep = showStep;

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    /* PROGRESS */

    function updateProgress() {
        const percent = Math.round(currentStep / totalSteps * 100);

        if (progressFill) progressFill.style.width = percent + "%";
        if (progressText) progressText.textContent =
            language === "bn"
                ? `ধাপ ${currentStep} / ${totalSteps}`
                : `Step ${currentStep} of ${totalSteps}`;

        if (progressPercent) progressPercent.textContent = percent + "%";
    }

    /* BUTTONS */

    function updateButtons() {
        if (prevBtn) prevBtn.hidden = currentStep === 1;
        if (nextBtn) nextBtn.hidden = currentStep === totalSteps;
        if (submitBtn) submitBtn.hidden = currentStep !== totalSteps;
    }

    /* VALIDATION */

    function validateStep(step) {
        const section = document.querySelector(
            `[data-form-step="${step}"]`
        );

        if (!section) return true;

        // Validate visible required fields
        const requiredFields = [...section.querySelectorAll("[required]")];

        for (const field of requiredFields) {
            if (field.disabled || field.offsetParent === null) continue;

            if (!field.checkValidity()) {
                field.reportValidity();
                field.focus();
                return false;
            }
        }

        if (step === 2) {
            const selected = section.querySelector(
                'input[name="examinations"]:checked'
            );

            if (!selected) {
                alert(language === "bn"
                    ? "কমপক্ষে একটি পরীক্ষা নির্বাচন করুন।"
                    : "Select at least one examination.");
                return false;
            }
        }

        if (step === 3) {
            const selected = section.querySelector(
                'input[name="current_status"]:checked'
            );

            if (!selected) {
                alert(language === "bn"
                    ? "বর্তমান অবস্থা নির্বাচন করুন।"
                    : "Select your current status.");
                return false;
            }
        }

        return true;
    }

    window.validateRegistrationStep = validateStep;
    window.showRegistrationStep = showStep;

    /* NEXT */

    nextBtn?.addEventListener("click", () => {
        if (!validateStep(currentStep)) return;

        showStep(currentStep + 1);
    });

    /* PREVIOUS */

    prevBtn?.addEventListener("click", () => {
        showStep(currentStep - 1);
    });

    /* SIDEBAR */

    stepItems.forEach(item => {
        item.addEventListener("click", () => {
            const target = Number(item.dataset.step);

            // Only allow moving to previous steps or current step
            if (target <= currentStep) showStep(target);
        });
    });

    /* DOB */

    function initializeDOB() {
        const day = document.getElementById("dob_day");
        const month = document.getElementById("dob_month");
        const year = document.getElementById("dob_year");

        if (!day || !month || !year) return;

        day.innerHTML = '<option value="">Day</option>';
        month.innerHTML = '<option value="">Month</option>';
        year.innerHTML = '<option value="">Year</option>';

        for (let d = 1; d <= 31; d++) {
            day.add(new Option(d, d));
        }

        const months = [
            "January", "February", "March", "April",
            "May", "June", "July", "August",
            "September", "October", "November", "December"
        ];

        months.forEach((m, i) => month.add(new Option(m, i + 1)));

        const currentYear = new Date().getFullYear();

        for (let y = currentYear; y >= 1940; y--) {
            year.add(new Option(y, y));
        }
    }

    /* LANGUAGE */

    const languageBtn = document.getElementById("languageToggle");

    function translatePage() {
        document.querySelectorAll("[data-en][data-bn]").forEach(node => {
            node.textContent = node.getAttribute(
                language === "bn" ? "data-bn" : "data-en"
            );
        });

        if (languageBtn) {
            languageBtn.textContent = language === "en" ? "বাংলা" : "English";
        }

        updateProgress();
    }

    languageBtn?.addEventListener("click", () => {
        language = language === "en" ? "bn" : "en";
        document.documentElement.lang = language;
        translatePage();
    });

    /* INIT */

    initializeDOB();
    showStep(1);

})();
