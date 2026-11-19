
/* ==========================================
   DTSC ALUMNI ASSOCIATION
   MEMBERSHIP REGISTRATION SYSTEM
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const form = document.getElementById("registrationForm");
    if (!form) return;

    const steps = Array.from(
        form.querySelectorAll(".form-step")
    );

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const submitBtn = document.getElementById("submitBtn");
    const stepIndicator = document.getElementById("stepIndicator");

    let currentStep = 0;

    if (!steps.length || !nextBtn || !prevBtn || !submitBtn) {
        console.error("Registration form elements missing.");
        return;
    }

    // ==========================================
    // STEP DISPLAY
    // ==========================================

    function showStep(index) {
        if (index < 0 || index >= steps.length) return;

        currentStep = index;

        steps.forEach((step, i) => {
            step.style.display = i === currentStep ? "block" : "none";
            step.classList.toggle("active", i === currentStep);
        });

        prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";
        nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
        submitBtn.style.display = currentStep === steps.length - 1 ? "inline-flex" : "none";

        if (stepIndicator) {
            stepIndicator.textContent =
                `Step ${currentStep + 1} of ${steps.length}`;
        }

        window.scrollTo({
            top: form.getBoundingClientRect().top + window.scrollY - 30,
            behavior: "smooth"
        });
    }

    // ==========================================
    // VALIDATION
    // ==========================================

    function validateStep(index) {
        const step = steps[index];
        if (!step) return true;

        const fields = step.querySelectorAll(
            "input, select, textarea"
        );

        for (const field of fields) {
            if (
                field.disabled ||
                field.type === "hidden" ||
                field.type === "button" ||
                field.type === "submit"
            ) continue;

            // Hidden conditional fields are ignored
            const conditional = field.closest(
                ".conditional-section, .conditional-section.active"
            );

            if (conditional && conditional.offsetParent === null) {
                continue;
            }

            if (field.type === "checkbox" || field.type === "radio") {
                if (field.required && !field.checked) {
                    alert("Required information পূরণ করুন।");
                    field.focus();
                    return false;
                }
                continue;
            }

            if (field.required && !field.value.trim()) {
                alert("সব Required তথ্য পূরণ করুন।");
                field.focus();
                return false;
            }

            if (!field.checkValidity()) {
                field.reportValidity();
                return false;
            }
        }

        return true;
    }

    // ==========================================
    // NEXT BUTTON
    // ==========================================

    nextBtn.addEventListener("click", function (event) {
        event.preventDefault();

        if (!validateStep(currentStep)) return;

        if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
        }
    });

    // ==========================================
    // PREVIOUS BUTTON
    // ==========================================

    prevBtn.addEventListener("click", function (event) {
        event.preventDefault();

        if (currentStep > 0) {
            showStep(currentStep - 1);
        }
    });

    // ==========================================
    // CONDITIONAL FIELDS
    // ==========================================

    form.querySelectorAll("[data-target]").forEach(function (checkbox) {
        const targetId = checkbox.dataset.target;
        const target = document.getElementById(targetId);

        if (!target) return;

        function updateConditional() {
            target.style.display = checkbox.checked ? "block" : "none";
            target.classList.toggle("active", checkbox.checked);

            target.querySelectorAll("input, select, textarea").forEach(function (field) {
                field.disabled = !checkbox.checked;

                if (!checkbox.checked) {
                    field.required = false;
                }
            });
        }

        checkbox.addEventListener("change", updateConditional);
        updateConditional();
    });

    // ==========================================
    // SAME ADDRESS
    // ==========================================

    const sameAddress = document.getElementById("sameAddress");
    const permanentSection = document.getElementById("permanentAddressSection");

    if (sameAddress && permanentSection) {
        sameAddress.addEventListener("change", function () {
            permanentSection.style.display =
                sameAddress.checked ? "none" : "block";

            if (sameAddress.checked) {
                const pairs = [
                    ["present_division", "permanent_division"],
                    ["present_district", "permanent_district"],
                    ["present_area_type", "permanent_area_type"],
                    ["present_local_area", "permanent_local_area"],
                    ["present_ward_union", "permanent_ward_union"],
                    ["present_post_office", "permanent_post_office"],
                    ["present_address", "permanent_address"]
                ];

                pairs.forEach(function (pair) {
                    const source = form.elements[pair[0]];
                    const destination = form.elements[pair[1]];

                    if (source && destination) {
                        destination.value = source.value;
                        destination.dispatchEvent(new Event("change", {
                            bubbles: true
                        }));
                    }
                });
            }
        });
    }

    // ==========================================
    // REVIEW
    // ==========================================

    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char];
        });
    }

    function generateReview() {
        const reviewContent = document.getElementById("reviewContent");
        if (!reviewContent) return;

        const data = new FormData(form);
        let html = "";

        for (const [key, value] of data.entries()) {
            if (!value || key === "photo") continue;

            const field = form.elements[key];
            let label = key.replace(/_/g, " ");

            if (field) {
                const labelElement = form.querySelector(
                    `label[for="${field.id}"]`
                );

                if (labelElement) {
                    label = labelElement.textContent.trim();
                }
            }

            html += `
                <div class="review-item">
                    <strong>${escapeHTML(label)}</strong>
                    <span>${escapeHTML(value)}</span>
                </div>
            `;
        }

        reviewContent.innerHTML = html || "কোনো তথ্য পাওয়া যায়নি।";
    }

    // Review step: regenerate when reached
    const reviewStep = steps[steps.length - 1];

    if (reviewStep) {
        const observer = new MutationObserver(function () {
            if (reviewStep.style.display !== "none") {
                generateReview();
            }
        });

        observer.observe(reviewStep, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });
    }

    // ==========================================
    // SUBMIT
    // ==========================================

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateStep(currentStep)) return;

        const confirmation = document.getElementById("confirmInformation");

        if (confirmation && !confirmation.checked) {
            alert("তথ্য সঠিক বলে নিশ্চিত করুন।");
            confirmation.focus();
            return;
        }

        alert(
            "ফরমটি প্রস্তুত হয়েছে। বর্তমানে ডাটাবেজ সংযুক্ত না থাকায় আবেদন জমা সংরক্ষণ করা হচ্ছে না।"
        );
    });

    // ==========================================
    // INITIALIZE
    // ==========================================

    showStep(0);

});
