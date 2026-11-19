
/* =========================================================
   DTSC ALUMNI ASSOCIATION
   REGISTRATION FORM SYSTEM
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

    /* =========================================
       1. STEP NAVIGATION
    ========================================= */

    function showStep(index) {
        currentStep = Math.max(0, Math.min(index, steps.length - 1));

        steps.forEach((step, i) => {
            step.classList.toggle("active", i === currentStep);
        });

        indicators.forEach((indicator, i) => {
            indicator.classList.toggle("active", i === currentStep);
            indicator.classList.toggle("completed", i < currentStep);
        });

        prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";

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

    /* =========================================
       2. CONDITIONAL FIELDS
    ========================================= */

    function setupConditionalFields() {
        document.querySelectorAll("[data-target]").forEach(input => {
            const target = document.getElementById(input.dataset.target);
            if (!target) return;

            function update() {
                target.classList.toggle("active", input.checked);

                // Hidden conditional fields must not block validation.
                target.querySelectorAll("input, select, textarea").forEach(field => {
                    field.disabled = !input.checked;
                });
            }

            input.addEventListener("change", update);
            update();
        });
    }

    /* =========================================
       3. JOB TYPE
    ========================================= */

    function setupJobType() {
        const jobType = document.getElementById("jobType");
        const jobFields = document.getElementById("jobFields");

        if (!jobType || !jobFields) return;

        jobType.addEventListener("change", function () {
            const locationField = form.querySelector('[name="job_location"]');

            if (locationField) {
                locationField.placeholder =
                    this.value === "government"
                        ? "Workplace Location"
                        : "Company / Workplace Location";
            }
        });
    }

    /* =========================================
       4. YEAR DROPDOWNS
    ========================================= */

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

        const diplomaYearSelect = document.querySelector(
            ".diploma-passing-year"
        );

        if (diplomaYearSelect) {
            diplomaYearSelect.innerHTML =
                '<option value="">Select Year</option>';

            for (let year = currentYear; year >= 2018; year--) {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                diplomaYearSelect.appendChild(option);
            }
        }
    }

    /* =========================================
       5. SESSION DROPDOWNS
    ========================================= */

    function populateSessions() {
        document.querySelectorAll(".session-select").forEach(select => {
            select.innerHTML = '<option value="">Select Session</option>';

            for (let year = 1966; year <= 2026; year++) {
                const option = document.createElement("option");
                option.value = `${year}-${year + 1}`;
                option.textContent = `${year}-${year + 1}`;
                select.appendChild(option);
            }
        });

        const diplomaSession = document.querySelector(".diploma-session");

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

    /* =========================================
       6. SAME ADDRESS COPY
    ========================================= */

    function copyAddress() {
        if (!sameAddress || !permanentSection) return;

        permanentSection.style.display =
            sameAddress.checked ? "none" : "block";

        const permanentFields = permanentSection.querySelectorAll(
            "input, select, textarea"
        );

        permanentFields.forEach(field => {
            field.disabled = sameAddress.checked;
        });

        if (!sameAddress.checked) return;

        const addressFields = [
            "division",
            "district",
            "area_type",
            "local_area",
            "ward_union",
            "post_office",
            "address"
        ];

        addressFields.forEach(key => {
            const present = form.querySelector(`[name="present_${key}"]`);
            const permanent = form.querySelector(`[name="permanent_${key}"]`);

            if (!present || !permanent) return;

            if (present.tagName === "SELECT") {
                permanent.value = present.value;
            } else {
                permanent.value = present.value;
            }
        });
    }

    if (sameAddress) {
        sameAddress.addEventListener("change", copyAddress);

        document.querySelectorAll(
            '[name^="present_"]'
        ).forEach(field => {
            field.addEventListener("change", function () {
                if (sameAddress.checked) copyAddress();
            });

            field.addEventListener("input", function () {
                if (sameAddress.checked) copyAddress();
            });
        });
    }

    /* =========================================
       7. VALIDATION
    ========================================= */

    function validateCurrentStep() {
        const activeStep = steps[currentStep];
        if (!activeStep) return true;

        const fields = activeStep.querySelectorAll(
            "input, select, textarea"
        );

        for (const field of fields) {
            if (field.disabled) continue;
            if (field.type === "hidden") continue;
            if (!field.required) continue;

            if (!field.checkValidity()) {
                field.reportValidity();
                field.focus();
                return false;
            }
        }

        // Academic step: at least one examination must be selected.
        if (currentStep === 1) {
            const exams = form.querySelectorAll(
                'input[name="examinations"]:checked'
            );

            if (exams.length === 0) {
                alert("কমপক্ষে একটি পরীক্ষা নির্বাচন করুন।");
                return false;
            }
        }

        // Status step: at least one current status must be selected.
        if (currentStep === 2) {
            const statuses = form.querySelectorAll(
                'input[name="current_status"]:checked'
            );

            if (statuses.length === 0) {
                alert("আপনার বর্তমান অবস্থা নির্বাচন করুন।");
                return false;
            }
        }

        return true;
    }

    /* =========================================
       8. REVIEW GENERATOR
    ========================================= */

    function getValue(name) {
        const field = form.querySelector(`[name="${name}"]`);

        if (!field || field.disabled) return "";

        if (field.type === "checkbox") {
            return field.checked ? "Yes" : "No";
        }

        return field.value.trim();
    }

    function getCheckedValues(name) {
        return Array.from(
            form.querySelectorAll(`[name="${name}"]:checked`)
        ).map(item => item.value);
    }

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
                getValue("permanent_local_area"),
                getValue("permanent_ward_union"),
                getValue("permanent_post_office"),
                getValue("permanent_address")
            ].filter(Boolean).join(", ");

        const academicDetails = [];

        exams.forEach(exam => {
            if (exam === "JSC") {
                academicDetails.push(`
                    <li>
                        <strong>JSC</strong> —
                        Roll: ${getValue("jsc_roll") || "-"},
                        Registration: ${getValue("jsc_registration") || "-"},
                        GPA: ${getValue("jsc_gpa") || "-"},
                        Passing Year: ${getValue("jsc_passing_year") || "-"}
                    </li>
                `);
            }

            if (exam === "SSC") {
                academicDetails.push(`
                    <li>
                        <strong>SSC</strong> —
                        Trade: ${getValue("ssc_trade") || "-"},
                        Session: ${getValue("ssc_session") || "-"},
                        Roll: ${getValue("ssc_roll") || "-"},
                        Registration: ${getValue("ssc_registration") || "-"},
                        GPA: ${getValue("ssc_gpa") || "-"},
                        Passing Year: ${getValue("ssc_passing_year") || "-"}
                    </li>
                `);
            }

            if (exam === "HSC") {
                academicDetails.push(`
                    <li>
                        <strong>HSC</strong> —
                        Trade: ${getValue("hsc_trade") || "-"},
                        Session: ${getValue("hsc_session") || "-"},
                        Roll: ${getValue("hsc_roll") || "-"},
                        Registration: ${getValue("hsc_registration") || "-"},
                        GPA: ${getValue("hsc_gpa") || "-"},
                        Passing Year: ${getValue("hsc_passing_year") || "-"}
                    </li>
                `);
            }

            if (exam === "Diploma") {
                academicDetails.push(`
                    <li>
                        <strong>Diploma</strong> —
                        Technology: ${getValue("diploma_technology") || "-"},
                        Session: ${getValue("diploma_session") || "-"},
                        Roll: ${getValue("diploma_roll") || "-"},
                        Registration: ${getValue("diploma_registration") || "-"},
                        CGPA: ${getValue("diploma_cgpa") || "-"},
                        Passing Year: ${getValue("diploma_passing_year") || "-"}
                    </li>
                `);
            }
        });

        const statusDetails = [];

        if (statuses.includes("higher_studies")) {
            statusDetails.push(`
                <li>
                    <strong>Higher Studies</strong> —
                    Institute: ${getValue("higher_institute") || "-"},
                    Department: ${getValue("higher_department") || "-"}
                </li>
            `);
        }

        if (statuses.includes("job_holder")) {
            statusDetails.push(`
                <li>
                    <strong>Job</strong> —
                    Type: ${getValue("job_type") || "-"},
                    Organization: ${getValue("job_organization") || "-"},
                    Designation: ${getValue("job_designation") || "-"},
                    Department: ${getValue("job_department") || "-"},
                    Location: ${getValue("job_location") || "-"}
                </li>
            `);
        }

        if (statuses.includes("entrepreneur")) {
            statusDetails.push(`
                <li>
                    <strong>Business</strong> —
                    Name: ${getValue("business_name") || "-"},
                    Type: ${getValue("business_type") || "-"},
                    Location: ${getValue("business_location") || "-"}
                </li>
            `);
        }

        if (statuses.includes("others")) {
            statusDetails.push(`
                <li>
                    <strong>Others</strong> —
                    ${getValue("other_status_details") || "-"}
                </li>
            `);
        }

        const suggestions = getValue("suggestions") || "Not provided";

        review.innerHTML = `
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date of Birth:</strong> ${dob}</p>
            <p><strong>Blood Group:</strong> ${blood}</p>

            <h3>Present Address</h3>
            <p>${presentAddress || "Not provided"}</p>

            <h3>Permanent Address</h3>
            <p>${permanentAddress || "Not provided"}</p>

            <h3>Academic Information</h3>
            <ul>${academicDetails.join("") || "<li>Not provided</li>"}</ul>

            <h3>Current Status</h3>
            <ul>${statusDetails.join("") || "<li>Not provided</li>"}</ul>

            <h3>Association Suggestions</h3>
            <p>${suggestions}</p>
        `;
    }

    /* =========================================
       9. NAVIGATION BUTTONS
    ========================================= */

    nextBtn.addEventListener("click", function () {
        if (!validateCurrentStep()) return;
        showStep(currentStep + 1);
    });

    prevBtn.addEventListener("click", function () {
        showStep(currentStep - 1);
    });

    /* =========================================
       10. FORM SUBMISSION
    ========================================= */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateCurrentStep()) return;

        const confirmation = document.getElementById("confirmInformation");

        if (!confirmation || !confirmation.checked) {
            alert("তথ্য সঠিক বলে নিশ্চিত করার checkbox-এ টিক দিন।");
            if (confirmation) confirmation.focus();
            return;
        }

        alert(
            "Registration form validation successful!\n\n" +
            "এই মুহূর্তে ডাটাবেজ সংযুক্ত নেই।\n" +
            "তাই কোনো তথ্য সার্ভারে জমা হয়নি।"
        );
    });

    /* =========================================
       11. INITIALIZATION
    ========================================= */

    setupConditionalFields();
    setupJobType();
    populateYears();
    populateSessions();

    showStep(0);

});
