/* =====================================================
   DTSC ALUMNI ASSOCIATION
   REGISTRATION SYSTEM
   Academic Conditional Fields
   Current Status
   Address Dropdowns
   Photo Upload
   Supabase Submission
===================================================== */

(function () {
    "use strict";

    const form = document.getElementById("alumniRegistrationForm");

    if (!form) return;

    /* ==========================================
       SUPABASE CONFIGURATION
    ========================================== */

    const SUPABASE_URL = "https://nxekzyvfvtrwdpwvuklj.supabase.co";

    const SUPABASE_KEY = "sb_publishable_fnFoN8ecsee3fvi1FPYXRA_HiQj5qg8";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    const PHOTO_BUCKET = "alumni-photos";

    /* ==========================================
       ELEMENTS
    ========================================== */

    const academicSections = document.getElementById("academicSections");
    const statusDetails = document.getElementById("statusDetails");
    const reviewSummary = document.getElementById("reviewSummary");
    const submitMessage = document.getElementById("submitMessage");

    /* ==========================================
       HELPERS
    ========================================== */

    function el(id) {
        return document.getElementById(id);
    }

    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function field(label, name, type = "text", options = {}) {
        const required = options.required ? "required" : "";
        const placeholder = options.placeholder || "";
        const extra = options.extra || "";

        if (type === "select") {
            const optionHTML = options.options.map(item =>
                `<option value="${escapeHTML(item.value)}">
                    ${escapeHTML(item.label)}
                </option>`
            ).join("");

            return `
                <div class="field">
                    <label>${label}${options.required ? ' <span class="required">*</span>' : ""}</label>
                    <select name="${name}" ${required} ${extra}>
                        <option value="">Select</option>
                        ${optionHTML}
                    </select>
                </div>
            `;
        }

        return `
            <div class="field">
                <label>${label}${options.required ? ' <span class="required">*</span>' : ""}</label>
                <input
                    type="${type}"
                    name="${name}"
                    placeholder="${placeholder}"
                    ${required}
                    ${extra}
                >
            </div>
        `;
    }

    function yearOptions(start, end) {
        const options = [];

        for (let y = end; y >= start; y--) {
            options.push({
                value: String(y),
                label: String(y)
            });
        }

        return options;
    }

    function sessionOptions(start, end) {
        const options = [];

        for (let y = end; y >= start; y--) {
            options.push({
                value: `${y}-${String(y + 1).slice(-2)}`,
                label: `${y}-${String(y + 1).slice(-2)}`
            });
        }

        return options;
    }

    const currentYear = new Date().getFullYear();

    /* ==========================================
       ACADEMIC CONDITIONAL FIELDS
    ========================================== */

    const academicConfig = {
        JSC: {
            title: "Junior School Certificate (JSC)",
            fields: [
                {
                    label: "Roll Number",
                    name: "jsc_roll",
                    required: true
                },
                {
                    label: "Registration Number",
                    name: "jsc_registration",
                    required: true
                },
                {
                    label: "GPA",
                    name: "jsc_gpa",
                    type: "number",
                    required: true,
                    extra: 'step="0.01" min="0" max="5"'
                },
                {
                    label: "Passing Year",
                    name: "jsc_passing_year",
                    type: "select",
                    required: true,
                    options: yearOptions(1966, currentYear)
                },
                {
                    label: "Session",
                    name: "jsc_session",
                    type: "select",
                    required: true,
                    options: sessionOptions(1966, currentYear)
                }
            ]
        },

        SSC: {
            title: "Secondary School Certificate (SSC)",
            fields: [
                {
                    label: "Trade",
                    name: "ssc_trade",
                    type: "select",
                    required: true,
                    options: [
                        "General Electrical Works",
                        "Refrigeration And Air Conditions",
                        "Machine Tools Operation",
                        "Firm Machinery"
                    ].map(x => ({ value: x, label: x }))
                },
                {
                    label: "Session",
                    name: "ssc_session",
                    type: "select",
                    required: true,
                    options: sessionOptions(1966, currentYear)
                },
                {
                    label: "Roll Number",
                    name: "ssc_roll",
                    required: true
                },
                {
                    label: "Registration Number",
                    name: "ssc_registration",
                    required: true
                },
                {
                    label: "GPA",
                    name: "ssc_gpa",
                    type: "number",
                    required: true,
                    extra: 'step="0.01" min="0" max="5"'
                },
                {
                    label: "Passing Year",
                    name: "ssc_passing_year",
                    type: "select",
                    required: true,
                    options: yearOptions(1966, currentYear)
                }
            ]
        },

        HSC: {
            title: "Higher Secondary Certificate (HSC)",
            fields: [
                {
                    label: "Trade",
                    name: "hsc_trade",
                    type: "select",
                    required: true,
                    options: [
                        "21 - Agro Machinery",
                        "27 - Electrical Works and Maintenance",
                        "30 - Machine Tools Operation and Maintenance",
                        "32 - Refrigeration and Air-conditioning"
                    ].map(x => ({ value: x, label: x }))
                },
                {
                    label: "Session",
                    name: "hsc_session",
                    type: "select",
                    required: true,
                    options: sessionOptions(1966, currentYear)
                },
                {
                    label: "Roll Number",
                    name: "hsc_roll",
                    required: true
                },
                {
                    label: "Registration Number",
                    name: "hsc_registration",
                    required: true
                },
                {
                    label: "GPA",
                    name: "hsc_gpa",
                    type: "number",
                    required: true,
                    extra: 'step="0.01" min="0" max="5"'
                },
                {
                    label: "Passing Year",
                    name: "hsc_passing_year",
                    type: "select",
                    required: true,
                    options: yearOptions(1966, currentYear)
                }
            ]
        },

        Diploma: {
            title: "Diploma in Engineering",
            fields: [
                {
                    label: "Technology",
                    name: "diploma_technology",
                    type: "select",
                    required: true,
                    options: [
                        "70 – Mechanical Technology"
                    ].map(x => ({ value: x, label: x }))
                },
                {
                    label: "Session",
                    name: "diploma_session",
                    type: "select",
                    required: true,
                    options: sessionOptions(2016, 2022)
                },
                {
                    label: "Roll Number",
                    name: "diploma_roll",
                    required: true
                },
                {
                    label: "Registration Number",
                    name: "diploma_registration",
                    required: true
                },
                {
                    label: "CGPA",
                    name: "diploma_cgpa",
                    type: "number",
                    required: true,
                    extra: 'step="0.01" min="0" max="4"'
                },
                {
                    label: "Passing Year",
                    name: "diploma_passing_year",
                    type: "select",
                    required: true,
                    options: yearOptions(2018, 2022)
                }
            ]
        }
    };

    function renderAcademicSections() {
        if (!academicSections) return;

        academicSections.innerHTML = "";

        const selected = [...form.querySelectorAll(
            'input[name="examinations"]:checked'
        )].map(input => input.value);

        selected.forEach(exam => {
            const config = academicConfig[exam];

            if (!config) return;

            const card = document.createElement("div");
            card.className = "academic-card conditional-section";
            card.dataset.exam = exam;

            card.innerHTML = `
                <div class="section-title">
                    ${escapeHTML(config.title)}
                </div>
                <div class="form-grid">
                    ${config.fields.map(item => {
                        if (item.type === "select") {
                            return field(
                                item.label,
                                item.name,
                                "select",
                                {
                                    required: item.required,
                                    options: item.options
                                }
                            );
                        }

                        return field(
                            item.label,
                            item.name,
                            item.type || "text",
                            {
                                required: item.required,
                                extra: item.extra || ""
                            }
                        );
                    }).join("")}
                </div>
            `;

            academicSections.appendChild(card);
        });
    }

    form.querySelectorAll('input[name="examinations"]').forEach(input => {
        input.addEventListener("change", renderAcademicSections);
    });

    renderAcademicSections();

    /* ==========================================
       CURRENT STATUS CONDITIONAL FIELDS
    ========================================== */

    function renderStatusFields() {
        if (!statusDetails) return;

        const selected = form.querySelector(
            'input[name="current_status"]:checked'
        );

        statusDetails.innerHTML = "";

        if (!selected) return;

        const status = selected.value;

        if (status === "Higher Studies") {
            statusDetails.innerHTML = `
                <div class="conditional-section">
                    <div class="section-title">Higher Studies Information</div>
                    <div class="form-grid">
                        ${field("Institute Name", "higher_institute", "text", {
                            required: true,
                            placeholder: "University / College"
                        })}
                        ${field("Department", "higher_department", "text", {
                            required: true
                        })}
                    </div>
                </div>
            `;
        }

        else if (status === "Job Holder") {
            statusDetails.innerHTML = `
                <div class="conditional-section">
                    <div class="section-title">Employment Information</div>

                    <div class="field">
                        <label>Service Type <span class="required">*</span></label>
                        <select name="job_type" id="job_type" required>
                            <option value="">Select Service Type</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>

                    <div id="jobFields"></div>
                </div>
            `;

            const jobType = document.getElementById("job_type");
            const jobFields = document.getElementById("jobFields");

            jobType.addEventListener("change", function () {
                if (this.value === "Government") {
                    jobFields.innerHTML = `
                        <div class="form-grid">
                            ${field("Organization", "job_organization", "text", { required: true })}
                            ${field("Designation", "job_designation", "text", { required: true })}
                            ${field("Department", "job_department", "text", { required: true })}
                        </div>
                    `;
                }

                else if (this.value === "Private") {
                    jobFields.innerHTML = `
                        <div class="form-grid">
                            ${field("Organization / Company", "job_organization", "text", { required: true })}
                            ${field("Designation", "job_designation", "text", { required: true })}
                            ${field("Department", "job_department", "text", { required: true })}
                            ${field("Location", "job_location", "text", { required: true })}
                        </div>
                    `;
                }

                else {
                    jobFields.innerHTML = "";
                }
            });
        }

        else if (status === "Entrepreneur / Business") {
            statusDetails.innerHTML = `
                <div class="conditional-section">
                    <div class="section-title">Business Information</div>
                    <div class="form-grid">
                        ${field("Business Name", "business_name", "text", { required: true })}
                        ${field("Business Type", "business_type", "text")}
                        ${field("Business Location", "business_location", "text", { required: true })}
                    </div>
                </div>
            `;
        }

        else if (status === "Others") {
            statusDetails.innerHTML = `
                <div class="conditional-section">
                    <div class="section-title">Additional Information</div>
                    ${field("Please Specify", "other_status_details", "text", { required: true })}
                </div>
            `;
        }
    }

    form.querySelectorAll('input[name="current_status"]').forEach(radio => {
        radio.addEventListener("change", renderStatusFields);
    });

    /* ==========================================
       ADDRESS DIVISION / DISTRICT DROPDOWNS
    ========================================== */

    function getAddressData() {
        return window.BD_ADDRESS_DATA || null;
    }

    function getDivisions() {
        const data = getAddressData();
        return data?.divisions || [];
    }

    function getDivisionName(division) {
        if (typeof division === "string") return division;
        return division?.en || division?.name || "";
    }

    function getDivisionDistricts(division) {
        if (typeof division === "string") return [];

        return division?.districts || [];
    }

    function getDistrictName(district) {
        if (typeof district === "string") return district;

        if (Array.isArray(district)) {
            return district[1] || district[0] || "";
        }

        return district?.en || district?.name || "";
    }

    function populateDivision(select) {
        if (!select) return;

        getDivisions().forEach(division => {
            const name = getDivisionName(division);

            select.add(new Option(name, name));
        });
    }

    function populateDistrict(divisionSelect, districtSelect) {
        if (!divisionSelect || !districtSelect) return;

        districtSelect.innerHTML =
            '<option value="">Select District</option>';

        const selectedDivision = divisionSelect.value;

        const division = getDivisions().find(item =>
            getDivisionName(item) === selectedDivision
        );

        if (!division) {
            districtSelect.disabled = true;
            return;
        }

        getDivisionDistricts(division).forEach(district => {
            const name = getDistrictName(district);

            districtSelect.add(new Option(name, name));
        });

        districtSelect.disabled = false;
    }

    function setupAddress(prefix) {
        const division = el(prefix + "_division");
        const district = el(prefix + "_district");
        const areaType = el(prefix + "_area_type");
        const ward = el(prefix + "_ward");
        const unionField = el(prefix + "_union_field");

        populateDivision(division);

        division?.addEventListener("change", () => {
            populateDistrict(division, district);
        });

        areaType?.addEventListener("change", () => {
            if (!ward) return;

            ward.innerHTML = '<option value="">Select Ward</option>';

            if (areaType.value === "City Corporation") {
                for (let i = 1; i <= 99; i++) {
                    ward.add(new Option(i, i));
                }
            }

            else if (areaType.value === "Municipality") {
                for (let i = 1; i <= 15; i++) {
                    const number = String(i).padStart(2, "0");
                    ward.add(new Option(number, number));
                }
            }

            if (unionField) {
                unionField.style.display =
                    areaType.value === "Upazila" ? "block" : "none";
            }
        });
    }

    setupAddress("present");
    setupAddress("permanent");

    /* ==========================================
       SAME ADDRESS CHECKBOX
    ========================================== */

    const sameAddress = el("same_address");

    const presentAddressFields = [
        "division", "district", "area_type", "area",
        "ward", "union", "post_office", "post_code", "address"
    ];

    function copyPresentToPermanent() {
        presentAddressFields.forEach(key => {
            const present = el("present_" + key);
            const permanent = el("permanent_" + key);

            if (present && permanent) {
                permanent.value = present.value;

                if (key === "division") {
                    permanent.dispatchEvent(new Event("change"));
                }

                if (key === "area_type") {
                    permanent.dispatchEvent(new Event("change"));
                }
            }
        });
    }

    if (sameAddress) {
        sameAddress.addEventListener("change", function () {
            const permanentCard = el("permanentAddress");

            if (permanentCard) {
                permanentCard.style.display =
                    this.checked ? "none" : "block";
            }

            if (this.checked) {
                copyPresentToPermanent();
            }
        });
    }

    /* ==========================================
       REVIEW SUMMARY
    ========================================== */

    function getValue(name) {
        const input = form.querySelector(`[name="${name}"]`);
        return input ? input.value : "";
    }

    function renderReview() {
        if (!reviewSummary) return;

        const fullName = getValue("full_name");
        const phone = getValue("contact_number");
        const email = getValue("email");

        const selectedExams = [
            ...form.querySelectorAll('input[name="examinations"]:checked')
        ].map(input => input.value);

        const currentStatus = getValue("current_status");

        reviewSummary.innerHTML = `
            <div class="conditional-section">
                <div class="section-title">Application Summary</div>

                <div class="form-grid">
                    <div class="field">
                        <label>Full Name</label>
                        <div>${escapeHTML(fullName || "—")}</div>
                    </div>

                    <div class="field">
                        <label>Contact Number</label>
                        <div>${escapeHTML(phone || "—")}</div>
                    </div>

                    <div class="field">
                        <label>Email</label>
                        <div>${escapeHTML(email || "—")}</div>
                    </div>

                    <div class="field">
                        <label>Academic Qualifications</label>
                        <div>${escapeHTML(selectedExams.join(", ") || "—")}</div>
                    </div>

                    <div class="field">
                        <label>Current Status</label>
                        <div>${escapeHTML(currentStatus || "—")}</div>
                    </div>
                </div>
            </div>
        `;
    }

    /* ==========================================
       FORM SUBMISSION
    ========================================== */

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (submitMessage) {
            submitMessage.innerHTML = "";
        }

        // Validate every step before submitting
        for (let step = 1; step <= 4; step++) {
            if (typeof window.validateRegistrationStep === "function") {
                if (!window.validateRegistrationStep(step)) {
                    return;
                }
            }
        }

        const submitButton = el("submitBtn");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Submitting...";
        }

        try {
            const photoFile = el("photo")?.files?.[0];

            if (!photoFile) {
                throw new Error("Please upload your profile photo.");
            }

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/webp"
            ];

            if (!allowedTypes.includes(photoFile.type)) {
                throw new Error("Please upload a JPG, PNG or WEBP photo.");
            }

            if (photoFile.size > 5 * 1024 * 1024) {
                throw new Error("Photo size must be under 5 MB.");
            }

            /* Upload photo */
            const fileExtension = photoFile.name.split(".").pop();
            const photoPath =
                `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExtension}`;

            const { data: uploadedPhoto, error: uploadError } =
                await supabaseClient.storage
                    .from(PHOTO_BUCKET)
                    .upload(photoPath, photoFile, {
                        cacheControl: "3600",
                        upsert: false
                    });

            if (uploadError) throw uploadError;

            /* Academic Information */
            const academicInfo = {};

            Object.keys(academicConfig).forEach(exam => {
                const selected = form.querySelector(
                    `input[name="examinations"][value="${exam}"]`
                );

                if (!selected || !selected.checked) return;

                academicInfo[exam] = {};

                academicConfig[exam].fields.forEach(item => {
                    const input = form.querySelector(
                        `[name="${item.name}"]`
                    );

                    if (input) {
                        academicInfo[exam][item.name] = input.value;
                    }
                });
            });

            /* Address Information */
            function addressData(prefix) {
                const result = {};

                [
                    "division",
                    "district",
                    "area_type",
                    "area",
                    "ward",
                    "union",
                    "post_office",
                    "post_code",
                    "address"
                ].forEach(key => {
                    const input = el(prefix + "_" + key);

                    result[key] = input ? input.value : "";
                });

                return result;
            }

            const presentAddress = addressData("present");

            const permanentAddress = sameAddress?.checked
                ? { ...presentAddress }
                : addressData("permanent");

            /* Current Status Information */
            const currentStatus = getValue("current_status");

            const statusDetailsData = {};

            form.querySelectorAll(
                "#statusDetails input, #statusDetails select, #statusDetails textarea"
            ).forEach(input => {
                if (input.name) {
                    statusDetailsData[input.name] = input.value;
                }
            });

            /* DOB */
            const day = getValue("dob_day");
            const month = getValue("dob_month");
            const year = getValue("dob_year");

            let dateOfBirth = null;

            if (day && month && year) {
                dateOfBirth = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            }

            /* Database payload */
            const payload = {
                full_name: getValue("full_name"),
                father_name: getValue("father_name"),
                mother_name: getValue("mother_name"),

                photo_url: uploadedPhoto.path,

                date_of_birth: dateOfBirth,
                blood_group: getValue("blood_group"),
                contact_number: getValue("contact_number"),
                email: getValue("email") || null,

                present_address: presentAddress,
                permanent_address: permanentAddress,

                academic_info: academicInfo,

                current_status: currentStatus,
                status_details: statusDetailsData,

                association_suggestions:
                    getValue("association_suggestions") || null,

                membership_status: "pending"
            };

            /* Save to Supabase */
            const { error: insertError } = await supabaseClient
                .from("alumni_members")
                .insert(payload);

            if (insertError) throw insertError;

            if (submitMessage) {
                submitMessage.innerHTML = `
                    <div class="conditional-section">
                        <h3>Registration Submitted Successfully!</h3>
                        <p>Your membership application has been received.</p>
                        <p>Your application is currently pending review.</p>
                    </div>
                `;
            }

            form.reset();

            renderAcademicSections();

            if (statusDetails) {
                statusDetails.innerHTML = "";
            }

            if (reviewSummary) {
                reviewSummary.innerHTML = "";
            }

            if (typeof window.showRegistrationStep === "function") {
                window.showRegistrationStep(1);
            }

        } catch (error) {
            console.error("Registration error:", error);

            if (submitMessage) {
                submitMessage.innerHTML = `
                    <div class="conditional-section">
                        <p>
                            Registration failed.
                            Please try again.
                        </p>
                        <p>${escapeHTML(error.message || "")}</p>
                    </div>
                `;
            }

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Submit Registration";
            }
        }
    });

    /* ==========================================
       REVIEW WHEN STEP 4 IS OPEN
    ========================================== */

    const nextButton = el("nextBtn");

    nextButton?.addEventListener("click", function () {
        setTimeout(() => {
            const step4 = document.querySelector(
                '[data-form-step="4"]'
            );

            if (step4 && step4.style.display !== "none") {
                renderReview();
            }
        }, 100);
    });

})();
