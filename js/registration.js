
/* =========================================================
   DTSC ALUMNI ASSOCIATION
   COMPLETE REGISTRATION SYSTEM
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("registrationForm");
    if (!form) return;

    const steps = Array.from(document.querySelectorAll(".form-step"));
    const indicators = Array.from(
        document.querySelectorAll("#stepIndicator div")
    );

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    const sameAddress = document.getElementById("sameAddress");
    const permanentSection = document.getElementById("permanentAddressSection");

    let currentStep = 0;

    /* =====================================================
       1. STEP NAVIGATION
    ===================================================== */

    function showStep(index) {
        currentStep = Math.max(0, Math.min(index, steps.length - 1));

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === currentStep);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === currentStep);
            indicator.classList.toggle("completed", i < currentStep);
        });

        prevBtn.style.display =
            currentStep === 0 ? "none" : "inline-block";

        nextBtn.style.display =
            currentStep === steps.length - 1 ? "none" : "inline-block";

        submitBtn.style.display =
            currentStep === steps.length - 1 ? "inline-block" : "none";

        if (currentStep === steps.length - 1) {
            generateReview();
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    /* =====================================================
       2. CONDITIONAL FIELDS
    ===================================================== */

    function setupConditionalFields() {
        document.querySelectorAll("[data-target]").forEach(input => {
            const target = document.getElementById(input.dataset.target);
            if (!target) return;

            function update() {
                const active = input.checked;

                target.classList.toggle("active", active);

                target.querySelectorAll("input, select, textarea").forEach(field => {
                    field.disabled = !active;
                });
            }

            input.addEventListener("change", update);
            update();
        });
    }

    /* =====================================================
       3. JOB TYPE
    ===================================================== */

    function setupJobType() {
        const jobType = document.getElementById("jobType");
        if (!jobType) return;

        jobType.addEventListener("change", function () {
            const locationField = form.querySelector(
                '[name="job_location"]'
            );

            if (!locationField) return;

            if (this.value === "government") {
                locationField.placeholder = "Government Workplace Location";
            } else if (this.value === "private") {
                locationField.placeholder = "Company / Workplace Location";
            } else {
                locationField.placeholder = "Workplace Location";
            }
        });
    }

    /* =====================================================
       4. PASSING YEARS
    ===================================================== */

    function populateYears() {
        const currentYear = new Date().getFullYear();

        document.querySelectorAll(".passing-year").forEach(select => {
            select.innerHTML = '<option value="">Select Year</option>';

            for (let year = currentYear; year >= 1966; year--) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                select.appendChild(option);
            }
        });

        const diplomaYear = document.querySelector(
            ".diploma-passing-year"
        );

        if (diplomaYear) {
            diplomaYear.innerHTML =
                '<option value="">Select Year</option>';

            for (let year = currentYear; year >= 2018; year--) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                diplomaYear.appendChild(option);
            }
        }
    }

    /* =====================================================
       5. SESSION DROPDOWNS
    ===================================================== */

    function populateSessions() {
        document.querySelectorAll(".session-select").forEach(select => {
            select.innerHTML = '<option value="">Select Session</option>';

            for (let year = 1966; year <= new Date().getFullYear(); year++) {
                const option = document.createElement("option");
                option.value = `${year}-${year + 1}`;
                option.textContent = `${year}-${year + 1}`;
                select.appendChild(option);
            }
        });

        const diplomaSession = document.querySelector(
            ".diploma-session"
        );

        if (diplomaSession) {
            diplomaSession.innerHTML =
                '<option value="">Select Session</option>';

            for (let year = 2016; year <= 2022; year++) {
                const option = document.createElement("option");
                option.value = `${year}-${year + 1}`;
                option.textContent = `${year}-${year + 1}`;
                diplomaSession.appendChild(option);
            }
        }
    }

    /* =====================================================
       6. ADDRESS COPYING
    ===================================================== */

    function copySelectValue(source, destination) {
        if (!source || !destination) return;

        destination.value = source.value;

        if (destination.value !== source.value) {
            const option = document.createElement("option");
            option.value = source.value;
            option.textContent = source.value;
            destination.appendChild(option);
            destination.value = source.value;
        }
    }

    function copyAddress() {
        if (!sameAddress || !permanentSection) return;

        const isSame = sameAddress.checked;

        permanentSection.style.display = isSame ? "none" : "block";

        permanentSection.querySelectorAll(
            "input, select, textarea"
        ).forEach(field => {
            field.disabled = isSame;
        });

        if (!isSame) return;

        const keys = [
            "division",
            "district",
            "area_type",
            "local_area",
            "ward_union",
            "post_office",
            "address"
        ];

        keys.forEach(key => {
            const present = form.querySelector(
                `[name="present_${key}"]`
            );

            const permanent = form.querySelector(
                `[name="permanent_${key}"]`
            );

            if (!present || !permanent) return;

            if (present.tagName === "SELECT") {
                copySelectValue(present, permanent);
            } else {
                permanent.value = present.value;
            }
        });
    }

    if (sameAddress) {
        sameAddress.addEventListener("change", copyAddress);

        document.querySelectorAll('[name^="present_"]').forEach(field => {
            field.addEventListener("change", copyAddress);
            field.addEventListener("input", copyAddress);
        });
    }

    /* =====================================================
       7. VALIDATION
    ===================================================== */

    function validateCurrentStep() {
        const activeStep = steps[currentStep];
        if (!activeStep) return true;

        const fields = activeStep.querySelectorAll(
            "input, select, textarea"
        );

        for (const field of fields) {
            if (field.disabled) continue;
            if (!field.required) continue;

            if (!field.checkValidity()) {
                field.reportValidity();
                field.focus();
                return false;
            }
        }

        // Academic step
        if (currentStep === 1) {
            const exams = form.querySelectorAll(
                'input[name="examinations"]:checked'
            );

            if (!exams.length) {
                alert("কমপক্ষে একটি পরীক্ষা নির্বাচন করুন।");
                return false;
            }
        }

        // Current status step
        if (currentStep === 2) {
            const statuses = form.querySelectorAll(
                'input[name="current_status"]:checked'
            );

            if (!statuses.length) {
                alert("আপনার বর্তমান অবস্থা নির্বাচন করুন।");
                return false;
            }
        }

        return true;
    }

    /* =====================================================
       8. SAFE REVIEW TEXT
    ===================================================== */

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function getValue(name) {
        const field = form.querySelector(`[name="${name}"]`);

        if (!field || field.disabled) return "";

        return String(field.value || "").trim();
    }

    function getCheckedValues(name) {
        return Array.from(
            form.querySelectorAll(`[name="${name}"]:checked`)
        ).map(field => field.value);
    }

    /* =====================================================
       9. REVIEW GENERATOR
    ===================================================== */

    function generateReview() {
        const review = document.getElementById("reviewContent");
        if (!review) return;

        const name = getValue("name") || "Not provided";
        const phone = getValue("phone") || "Not provided";
        const email = getValue("email") || "Not provided";
        const dob = getValue("dob") || "Not provided";
        const blood = getValue("blood_group") || "Not provided";

        const exams = getCheckedValues("examinations");
        const statuses = getCheckedValues("current_status");

        const presentAddress = [
            getValue("present_division"),
            getValue("present_district"),
            getValue("present_area_type"),
            getValue("present_local_area"),
            getValue("present_ward_union"),
            getValue("present_post_office"),
            getValue("present_address")
        ].filter(Boolean).join(", ");

        const permanentAddress = sameAddress && sameAddress.checked
            ? presentAddress
            : [
                getValue("permanent_division"),
                getValue("permanent_district"),
                getValue("permanent_area_type"),
                getValue("permanent_local_area"),
                getValue("permanent_ward_union"),
                getValue("permanent_post_office"),
                getValue("permanent_address")
            ].filter(Boolean).join(", ");

        const academic = [];

        if (exams.includes("JSC")) {
            academic.push(`
                <li><strong>JSC</strong>:
                Roll ${escapeHTML(getValue("jsc_roll") || "-")},
                Registration ${escapeHTML(getValue("jsc_registration") || "-")},
                GPA ${escapeHTML(getValue("jsc_gpa") || "-")},
                Year ${escapeHTML(getValue("jsc_passing_year") || "-")}</li>
            `);
        }

        if (exams.includes("SSC")) {
            academic.push(`
                <li><strong>SSC</strong>:
                Trade ${escapeHTML(getValue("ssc_trade") || "-")},
                Session ${escapeHTML(getValue("ssc_session") || "-")},
                Roll ${escapeHTML(getValue("ssc_roll") || "-")},
                Registration ${escapeHTML(getValue("ssc_registration") || "-")},
                GPA ${escapeHTML(getValue("ssc_gpa") || "-")},
                Year ${escapeHTML(getValue("ssc_passing_year") || "-")}</li>
            `);
        }

        if (exams.includes("HSC")) {
            academic.push(`
                <li><strong>HSC</strong>:
                Trade ${escapeHTML(getValue("hsc_trade") || "-")},
                Session ${escapeHTML(getValue("hsc_session") || "-")},
                Roll ${escapeHTML(getValue("hsc_roll") || "-")},
                Registration ${escapeHTML(getValue("hsc_registration") || "-")},
                GPA ${escapeHTML(getValue("hsc_gpa") || "-")},
                Year ${escapeHTML(getValue("hsc_passing_year") || "-")}</li>
            `);
        }

        if (exams.includes("Diploma")) {
            academic.push(`
                <li><strong>Diploma</strong>:
                Technology ${escapeHTML(getValue("diploma_technology") || "-")},
                Session ${escapeHTML(getValue("diploma_session") || "-")},
                Roll ${escapeHTML(getValue("diploma_roll") || "-")},
                Registration ${escapeHTML(getValue("diploma_registration") || "-")},
                CGPA ${escapeHTML(getValue("diploma_cgpa") || "-")},
                Year ${escapeHTML(getValue("diploma_passing_year") || "-")}</li>
            `);
        }

        const statusDetails = [];

        if (statuses.includes("higher_studies")) {
            statusDetails.push(`
                <li><strong>Higher Studies</strong>:
                Institute ${escapeHTML(getValue("higher_institute") || "-")},
                Department ${escapeHTML(getValue("higher_department") || "-")}</li>
            `);
        }

        if (statuses.includes("job_holder")) {
            statusDetails.push(`
                <li><strong>Job</strong>:
                Type ${escapeHTML(getValue("job_type") || "-")},
                Organization ${escapeHTML(getValue("job_organization") || "-")},
                Designation ${escapeHTML(getValue("job_designation") || "-")},
                Department ${escapeHTML(getValue("job_department") || "-")},
                Location ${escapeHTML(getValue("job_location") || "-")}</li>
            `);
        }

        if (statuses.includes("entrepreneur")) {
            statusDetails.push(`
                <li><strong>Business</strong>:
                Name ${escapeHTML(getValue("business_name") || "-")},
                Type ${escapeHTML(getValue("business_type") || "-")},
                Location ${escapeHTML(getValue("business_location") || "-")}</li>
            `);
        }

        if (statuses.includes("others")) {
            statusDetails.push(`
                <li><strong>Others</strong>:
                ${escapeHTML(getValue("other_status_details") || "-")}</li>
            `);
        }

        const suggestions = getValue("suggestions") || "Not provided";

        review.innerHTML = `
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> ${escapeHTML(name)}</p>
            <p><strong>Phone:</strong> ${escapeHTML(phone)}</p>
            <p><strong>Email:</strong> ${escapeHTML(email)}</p>
            <p><strong>Date of Birth:</strong> ${escapeHTML(dob)}</p>
            <p><strong>Blood Group:</strong> ${escapeHTML(blood)}</p>

            <h3>Present Address</h3>
            <p>${escapeHTML(presentAddress || "Not provided")}</p>

            <h3>Permanent Address</h3>
            <p>${escapeHTML(permanentAddress || "Not provided")}</p>

            <h3>Academic Information</h3>
            <ul>${academic.join("") || "<li>Not provided</li>"}</ul>

            <h3>Current Status</h3>
            <ul>${statusDetails.join("") || "<li>Not provided</li>"}</ul>

            <h3>Association Suggestions</h3>
            <p>${escapeHTML(suggestions)}</p>
        `;
    }

    /* =====================================================
       10. BUTTON EVENTS
    ===================================================== */

    nextBtn.addEventListener("click", function () {
        if (!validateCurrentStep()) return;
        showStep(currentStep + 1);
    });

    prevBtn.addEventListener("click", function () {
        showStep(currentStep - 1);
    });

    /* =====================================================
       11. SUBMIT
    ===================================================== */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateCurrentStep()) return;

        const confirmation = document.getElementById(
            "confirmInformation"
        );

        if (!confirmation || !confirmation.checked) {
            alert("তথ্য সঠিক বলে নিশ্চিত করার checkbox-এ টিক দিন।");
            if (confirmation) confirmation.focus();
            return;
        }

        alert(
            "Form Validation Successful!\n\n" +
            "Registration form প্রস্তুত।\n" +
            "কিন্তু Database সংযুক্ত না থাকায় তথ্য সংরক্ষণ করা হয়নি।"
        );
    });

    /* =====================================================
       12. INIT
    ===================================================== */

    setupConditionalFields();
    setupJobType();
    populateYears();
    populateSessions();

    showStep(0);

});
