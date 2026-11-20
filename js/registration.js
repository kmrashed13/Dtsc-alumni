/* ==================================================
   DTSC ALUMNI ASSOCIATION
   MEMBERSHIP REGISTRATION ENGINE
================================================== */

(function () {
    "use strict";

    const form = document.getElementById("alumniRegistrationForm");
    if (!form) return;

    const SUPABASE_URL = "https://nxekzyvfvtrwdpwvuklj.supabase.co";
    const SUPABASE_KEY = "sb_publishable_fnFoN8ecsee3fvi1FPYXRA_HiQj5qg8";
    const BUCKET = "alumni-photos";

    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const academicSections = document.getElementById("academicSections");
    const statusDetails = document.getElementById("statusDetails");
    const reviewSummary = document.getElementById("reviewSummary");
    const submitMessage = document.getElementById("submitMessage");

    const $ = id => document.getElementById(id);
    const val = name => form.querySelector(`[name="${name}"]`)?.value?.trim() || "";

    function esc(value) {
        return String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;",
            '"': "&quot;", "'": "&#39;"
        }[char]));
    }

    function makeField(label, name, options = {}) {
        const required = options.required ? "required" : "";
        const type = options.type || "text";

        if (options.options) {
            return `
                <div class="field">
                    <label>${label}${options.required ? ' <span class="required">*</span>' : ""}</label>
                    <select name="${name}" ${required}>
                        <option value="">Select</option>
                        ${options.options.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join("")}
                    </select>
                </div>`;
        }

        return `
            <div class="field">
                <label>${label}${options.required ? ' <span class="required">*</span>' : ""}</label>
                <input type="${type}" name="${name}" ${required}
                ${options.extra || ""}>
            </div>`;
    }

    function years(start, end) {
        const list = [];
        for (let y = end; y >= start; y--) list.push(String(y));
        return list;
    }

    function sessions(start, end) {
        const list = [];
        for (let y = end; y >= start; y--) list.push(`${y}-${String(y + 1).slice(-2)}`);
        return list;
    }

    const now = new Date().getFullYear();

    /* ==============================================
       ACADEMIC DATA
    ============================================== */

    const academics = {
        JSC: {
            title: "Junior School Certificate (JSC)",
            fields: [
                ["Roll Number", "jsc_roll", true],
                ["Registration Number", "jsc_registration", true],
                ["GPA", "jsc_gpa", true, "number", 'step="0.01" min="0" max="5"'],
                ["Passing Year", "jsc_passing_year", true, "select", years(1966, now)],
                ["Session", "jsc_session", true, "select", sessions(1966, now)]
            ]
        },
        SSC: {
            title: "Secondary School Certificate (SSC)",
            fields: [
                ["Trade", "ssc_trade", true, "select", [
                    "General Electrical Works",
                    "Refrigeration And Air Conditions",
                    "Machine Tools Operation",
                    "Firm Machinery"
                ]],
                ["Session", "ssc_session", true, "select", sessions(1966, now)],
                ["Roll Number", "ssc_roll", true],
                ["Registration Number", "ssc_registration", true],
                ["GPA", "ssc_gpa", true, "number", 'step="0.01" min="0" max="5"'],
                ["Passing Year", "ssc_passing_year", true, "select", years(1966, now)]
            ]
        },
        HSC: {
            title: "Higher Secondary Certificate (HSC)",
            fields: [
                ["Trade", "hsc_trade", true, "select", [
                    "21 - Agro Machinery",
                    "27 - Electrical Works and Maintenance",
                    "30 - Machine Tools Operation and Maintenance",
                    "32 - Refrigeration and Air-conditioning"
                ]],
                ["Session", "hsc_session", true, "select", sessions(1966, now)],
                ["Roll Number", "hsc_roll", true],
                ["Registration Number", "hsc_registration", true],
                ["GPA", "hsc_gpa", true, "number", 'step="0.01" min="0" max="5"'],
                ["Passing Year", "hsc_passing_year", true, "select", years(1966, now)]
            ]
        },
        Diploma: {
            title: "Diploma in Engineering",
            fields: [
                ["Technology", "diploma_technology", true, "select", [
                    "70 – Mechanical Technology"
                ]],
                ["Session", "diploma_session", true, "select", sessions(2016, 2022)],
                ["Roll Number", "diploma_roll", true],
                ["Registration Number", "diploma_registration", true],
                ["CGPA", "diploma_cgpa", true, "number", 'step="0.01" min="0" max="4"'],
                ["Passing Year", "diploma_passing_year", true, "select", years(2018, 2022)]
            ]
        }
    };

    function renderAcademics() {
        academicSections.innerHTML = "";

        const selected = [...form.querySelectorAll('[name="examinations"]:checked')]
            .map(x => x.value);

        selected.forEach(key => {
            const config = academics[key];
            if (!config) return;

            const card = document.createElement("div");
            card.className = "academic-card conditional-section";

            card.innerHTML = `
                <div class="section-title">${esc(config.title)}</div>
                <div class="form-grid">
                    ${config.fields.map(([label, name, required, type, data]) => {
                        if (type === "select") {
                            return makeField(label, name, { required, options: data });
                        }

                        return makeField(label, name, {
                            required,
                            type: type || "text",
                            extra: data || ""
                        });
                    }).join("")}
                </div>`;

            academicSections.appendChild(card);
        });
    }

    form.querySelectorAll('[name="examinations"]').forEach(input =>
        input.addEventListener("change", renderAcademics)
    );

    renderAcademics();

    /* ==============================================
       CURRENT STATUS
    ============================================== */

    function renderStatus() {
        statusDetails.innerHTML = "";

        const selected = form.querySelector('[name="current_status"]:checked');
        if (!selected) return;

        switch (selected.value) {
            case "Higher Studies":
                statusDetails.innerHTML = `
                    <div class="conditional-section">
                        <div class="section-title">Higher Studies</div>
                        <div class="form-grid">
                            ${makeField("Institute Name", "higher_institute", { required: true })}
                            ${makeField("Department", "higher_department", { required: true })}
                        </div>
                    </div>`;
                break;

            case "Job Holder":
                statusDetails.innerHTML = `
                    <div class="conditional-section">
                        <div class="section-title">Employment Details</div>
                        <div class="field">
                            <label>Service Type <span class="required">*</span></label>
                            <select name="job_type" id="job_type" required>
                                <option value="">Select</option>
                                <option value="Government">Government</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>
                        <div id="jobFields"></div>
                    </div>`;

                $("job_type").addEventListener("change", function () {
                    const target = $("jobFields");

                    const common = `
                        ${makeField("Organization / Company", "job_organization", { required: true })}
                        ${makeField("Designation", "job_designation", { required: true })}
                        ${makeField("Department", "job_department", { required: true })}`;

                    target.innerHTML = `
                        <div class="form-grid">
                            ${common}
                            ${this.value === "Private"
                                ? makeField("Location", "job_location", { required: true })
                                : ""}
                        </div>`;
                });
                break;

            case "Entrepreneur / Business":
                statusDetails.innerHTML = `
                    <div class="conditional-section">
                        <div class="section-title">Business Details</div>
                        <div class="form-grid">
                            ${makeField("Business Name", "business_name", { required: true })}
                            ${makeField("Business Type", "business_type")}
                            ${makeField("Business Location", "business_location", { required: true })}
                        </div>
                    </div>`;
                break;

            case "Others":
                statusDetails.innerHTML = `
                    <div class="conditional-section">
                        <div class="section-title">Other Information</div>
                        <div class="form-grid">
                            ${makeField("Please Specify", "other_status_details", { required: true })}
                        </div>
                    </div>`;
                break;
        }
    }

    form.querySelectorAll('[name="current_status"]').forEach(radio =>
        radio.addEventListener("change", renderStatus)
    );

    /* ==============================================
       BANGLADESH ADDRESS
    ============================================== */

    function divisions() {
        return window.BD_ADDRESS_DATA?.divisions || [];
    }

    function divisionName(d) {
        return typeof d === "string" ? d : d.en || d.name || "";
    }

    function districtList(d) {
        return typeof d === "string" ? [] : d.districts || [];
    }

    function districtName(d) {
        if (typeof d === "string") return d;
        if (Array.isArray(d)) return d[1] || d[0] || "";
        return d.en || d.name || "";
    }

    function setupAddress(prefix) {
        const div = $(prefix + "_division");
        const dist = $(prefix + "_district");
        const type = $(prefix + "_area_type");
        const ward = $(prefix + "_ward");
        const unionField = $(prefix + "_union_field");

        if (!div || !dist) return;

        divisions().forEach(d => div.add(new Option(divisionName(d), divisionName(d))));

        div.addEventListener("change", () => {
            dist.innerHTML = '<option value="">Select District</option>';

            const selected = divisions().find(d => divisionName(d) === div.value);

            if (selected) {
                districtList(selected).forEach(d =>
                    dist.add(new Option(districtName(d), districtName(d)))
                );
                dist.disabled = false;
            } else {
                dist.disabled = true;
            }
        });

        type?.addEventListener("change", () => {
            if (ward) {
                ward.innerHTML = '<option value="">Select Ward</option>';

                const max = type.value === "City Corporation" ? 99 :
                    type.value === "Municipality" ? 15 : 0;

                for (let i = 1; i <= max; i++) {
                    const number = type.value === "Municipality"
                        ? String(i).padStart(2, "0") : String(i);
                    ward.add(new Option(number, number));
                }
            }

            if (unionField) {
                unionField.style.display = type.value === "Upazila" ? "block" : "none";
            }
        });
    }

    setupAddress("present");
    setupAddress("permanent");

    /* SAME ADDRESS */

    const same = $("same_address");

    const addressKeys = [
        "division", "district", "area_type", "area", "ward",
        "union", "post_office", "post_code", "address"
    ];

    function copyAddress() {
        addressKeys.forEach(key => {
            const source = $("present_" + key);
            const target = $("permanent_" + key);
            if (!source || !target) return;

            target.value = source.value;

            if (key === "division") target.dispatchEvent(new Event("change"));
            if (key === "area_type") target.dispatchEvent(new Event("change"));
        });
    }

    same?.addEventListener("change", () => {
        $("permanentAddress").style.display = same.checked ? "none" : "block";
        if (same.checked) copyAddress();
    });

    /* ==============================================
       REVIEW SUMMARY
    ============================================== */

    function review() {
        if (!reviewSummary) return;

        const exams = [...form.querySelectorAll('[name="examinations"]:checked')]
            .map(x => x.value);

        const status = form.querySelector('[name="current_status"]:checked')?.value || "";

        reviewSummary.innerHTML = `
            <div class="conditional-section">
                <div class="section-title">Review Your Application</div>
                <div class="form-grid">
                    <div class="field"><label>Name</label><p>${esc(val("full_name"))}</p></div>
                    <div class="field"><label>Contact</label><p>${esc(val("contact_number"))}</p></div>
                    <div class="field"><label>Email</label><p>${esc(val("email"))}</p></div>
                    <div class="field"><label>Academic</label><p>${esc(exams.join(", "))}</p></div>
                    <div class="field"><label>Current Status</label><p>${esc(status)}</p></div>
                </div>
            </div>`;
    }

    $("nextBtn")?.addEventListener("click", () => {
        setTimeout(() => {
            const step = document.querySelector('[data-form-step="4"]');
            if (step && !step.hidden) review();
        }, 50);
    });

    /* ==============================================
       SUBMIT
    ============================================== */

    form.addEventListener("submit", async event => {
        event.preventDefault();

        for (let i = 1; i <= 4; i++) {
            if (!window.validateRegistrationStep(i)) {
                window.showRegistrationStep(i);
                return;
            }
        }

        const button = $("submitBtn");
        button.disabled = true;
        button.textContent = "Submitting...";

        try {
            const photo = $("photo").files[0];

            if (!photo) throw new Error("Profile photo is required.");
            if (photo.size > 5 * 1024 * 1024) throw new Error("Photo must be under 5 MB.");

            const extension = photo.name.split(".").pop().toLowerCase();
            const photoPath = `${crypto.randomUUID()}.${extension}`;

            const { data: upload, error: photoError } = await db.storage
                .from(BUCKET)
                .upload(photoPath, photo, { upsert: false });

            if (photoError) throw photoError;

            const academicInfo = {};

            Object.keys(academics).forEach(exam => {
                if (!form.querySelector(`[name="examinations"][value="${exam}"]:checked`)) return;

                academicInfo[exam] = {};

                academics[exam].fields.forEach(field => {
                    const input = form.querySelector(`[name="${field[1]}"]`);
                    if (input) academicInfo[exam][field[1]] = input.value;
                });
            });

            function address(prefix) {
                const result = {};
                addressKeys.forEach(key => {
                    result[key] = $(prefix + "_" + key)?.value || "";
                });
                return result;
            }

            const present = address("present");
            const permanent = same?.checked ? { ...present } : address("permanent");

            const status = form.querySelector('[name="current_status"]:checked')?.value;

            const statusData = {};
            statusDetails.querySelectorAll("[name]").forEach(input => {
                statusData[input.name] = input.value;
            });

            const day = val("dob_day");
            const month = val("dob_month");
            const year = val("dob_year");

            const dob = day && month && year
                ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                : null;

            const payload = {
                full_name: val("full_name"),
                father_name: val("father_name"),
                mother_name: val("mother_name"),
                photo_url: upload.path,
                date_of_birth: dob,
                blood_group: val("blood_group") || null,
                contact_number: val("contact_number"),
                email: val("email") || null,
                present_address: present,
                permanent_address: permanent,
                academic_info: academicInfo,
                current_status: status,
                status_details: statusData,
                association_suggestions: val("association_suggestions") || null,
                membership_status: "pending"
            };

            const { error } = await db.from("alumni_members").insert(payload);
            if (error) throw error;

            submitMessage.innerHTML = `
                <div class="conditional-section">
                    <h3>Application Submitted Successfully!</h3>
                    <p>Your application has been received and is pending review.</p>
                </div>`;

            form.reset();
            renderAcademics();
            statusDetails.innerHTML = "";
            reviewSummary.innerHTML = "";
            window.showRegistrationStep(1);

        } catch (error) {
            console.error(error);

            submitMessage.innerHTML = `
                <div class="conditional-section">
                    <h3>Submission Failed</h3>
                    <p>${esc(error.message)}</p>
            </div>`;
        } finally {
            button.disabled = false;
            button.textContent = "Submit Registration";
        }
    });

})();
