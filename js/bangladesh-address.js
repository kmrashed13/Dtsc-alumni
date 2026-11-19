/* ==================================================
   DTSC ALUMNI ASSOCIATION
   BANGLADESH ADDRESS SYSTEM
   Division → District
   Bangla + English
================================================== */

(function () {
    "use strict";

    const divisions = [
        {
            bn: "ঢাকা",
            en: "Dhaka",
            districts: [
                ["ঢাকা", "Dhaka"],
                ["গাজীপুর", "Gazipur"],
                ["গোপালগঞ্জ", "Gopalganj"],
                ["কিশোরগঞ্জ", "Kishoreganj"],
                ["মাদারীপুর", "Madaripur"],
                ["মানিকগঞ্জ", "Manikganj"],
                ["মুন্সীগঞ্জ", "Munshiganj"],
                ["নারায়ণগঞ্জ", "Narayanganj"],
                ["নরসিংদী", "Narsingdi"],
                ["রাজবাড়ী", "Rajbari"],
                ["শরীয়তপুর", "Shariatpur"],
                ["টাঙ্গাইল", "Tangail"],
                ["ফরিদপুর", "Faridpur"]
            ]
        },
        {
            bn: "চট্টগ্রাম",
            en: "Chattogram",
            districts: [
                ["বান্দরবান", "Bandarban"],
                ["ব্রাহ্মণবাড়িয়া", "Brahmanbaria"],
                ["চাঁদপুর", "Chandpur"],
                ["চট্টগ্রাম", "Chattogram"],
                ["কক্সবাজার", "Cox's Bazar"],
                ["কুমিল্লা", "Cumilla"],
                ["ফেনী", "Feni"],
                ["খাগড়াছড়ি", "Khagrachhari"],
                ["লক্ষ্মীপুর", "Lakshmipur"],
                ["নোয়াখালী", "Noakhali"],
                ["রাঙ্গামাটি", "Rangamati"]
            ]
        },
        {
            bn: "রাজশাহী",
            en: "Rajshahi",
            districts: [
                ["বগুড়া", "Bogura"],
                ["জয়পুরহাট", "Joypurhat"],
                ["নওগাঁ", "Naogaon"],
                ["নাটোর", "Natore"],
                ["চাঁপাইনবাবগঞ্জ", "Chapainawabganj"],
                ["পাবনা", "Pabna"],
                ["রাজশাহী", "Rajshahi"],
                ["সিরাজগঞ্জ", "Sirajganj"]
            ]
        },
        {
            bn: "খুলনা",
            en: "Khulna",
            districts: [
                ["বাগেরহাট", "Bagerhat"],
                ["চুয়াডাঙ্গা", "Chuadanga"],
                ["যশোর", "Jashore"],
                ["ঝিনাইদহ", "Jhenaidah"],
                ["খুলনা", "Khulna"],
                ["কুষ্টিয়া", "Kushtia"],
                ["মাগুরা", "Magura"],
                ["মেহেরপুর", "Meherpur"],
                ["নড়াইল", "Narail"],
                ["সাতক্ষীরা", "Satkhira"]
            ]
        },
        {
            bn: "বরিশাল",
            en: "Barishal",
            districts: [
                ["বরগুনা", "Barguna"],
                ["বরিশাল", "Barishal"],
                ["ভোলা", "Bhola"],
                ["ঝালকাঠি", "Jhalokathi"],
                ["পটুয়াখালী", "Patuakhali"],
                ["পিরোজপুর", "Pirojpur"]
            ]
        },
        {
            bn: "সিলেট",
            en: "Sylhet",
            districts: [
                ["হবিগঞ্জ", "Habiganj"],
                ["মৌলভীবাজার", "Moulvibazar"],
                ["সুনামগঞ্জ", "Sunamganj"],
                ["সিলেট", "Sylhet"]
            ]
        },
        {
            bn: "রংপুর",
            en: "Rangpur",
            districts: [
                ["দিনাজপুর", "Dinajpur"],
                ["গাইবান্ধা", "Gaibandha"],
                ["কুড়িগ্রাম", "Kurigram"],
                ["লালমনিরহাট", "Lalmonirhat"],
                ["নীলফামারী", "Nilphamari"],
                ["পঞ্চগড়", "Panchagarh"],
                ["রংপুর", "Rangpur"],
                ["ঠাকুরগাঁও", "Thakurgaon"]
            ]
        },
        {
            bn: "ময়মনসিংহ",
            en: "Mymensingh",
            districts: [
                ["জামালপুর", "Jamalpur"],
                ["ময়মনসিংহ", "Mymensingh"],
                ["নেত্রকোণা", "Netrokona"],
                ["শেরপুর", "Sherpur"]
            ]
        }
    ];

    const areaTypes = [
        {
            value: "city",
            label: "সিটি কর্পোরেশন - City Corporation"
        },
        {
            value: "municipality",
            label: "পৌরসভা - Municipality"
        },
        {
            value: "upazila",
            label: "উপজেলা - Upazila"
        }
    ];

    function getField(name) {
        return document.querySelector(`[name="${name}"]`);
    }

    function fillSelect(select, options, placeholder) {
        if (!select) return;

        select.innerHTML = "";

        const first = document.createElement("option");
        first.value = "";
        first.textContent = placeholder;
        select.appendChild(first);

        options.forEach(item => {
            const option = document.createElement("option");
            option.value = item.value;
            option.textContent = item.label;
            select.appendChild(option);
        });
    }

    /* DIVISION & DISTRICT */

    function setupAddress(prefix) {
        const division = getField(prefix + "_division");
        const district = getField(prefix + "_district");

        if (!division || !district) return;

        fillSelect(
            division,
            divisions.map(item => ({
                value: item.bn,
                label: `${item.bn} - ${item.en}`
            })),
            "বিভাগ নির্বাচন করুন / Select Division"
        );

        fillSelect(
            district,
            [],
            "প্রথমে বিভাগ নির্বাচন করুন / Select Division First"
        );

        district.disabled = true;

        division.addEventListener("change", function () {
            const selected = divisions.find(
                item => item.bn === division.value
            );

            fillSelect(
                district,
                selected
                    ? selected.districts.map(item => ({
                        value: item[0],
                        label: `${item[0]} - ${item[1]}`
                    }))
                    : [],
                "জেলা নির্বাচন করুন / Select District"
            );

            district.disabled = !selected;

            district.dispatchEvent(new Event("change", {
                bubbles: true
            }));
        });
    }

    /* AREA TYPE */

    function setupAreaType(prefix) {
        const type = getField(prefix + "_area_type");
        const area = getField(prefix + "_local_area");
        const wardUnion = getField(prefix + "_ward_union");

        if (!type) return;

        fillSelect(type, areaTypes, "এলাকার ধরন নির্বাচন করুন");

        type.addEventListener("change", function () {
            if (area) {
                area.value = "";

                if (type.value === "city") {
                    area.placeholder = "সিটি কর্পোরেশনের নাম / City Corporation";
                } else if (type.value === "municipality") {
                    area.placeholder = "পৌরসভার নাম / Municipality";
                } else if (type.value === "upazila") {
                    area.placeholder = "উপজেলার নাম / Upazila";
                } else {
                    area.placeholder = "এলাকার নাম / Area Name";
                }
            }

            if (wardUnion) {
                wardUnion.value = "";

                if (type.value === "city") {
                    wardUnion.placeholder = "ওয়ার্ড নম্বর / Ward Number";
                } else if (type.value === "municipality") {
                    wardUnion.placeholder = "ওয়ার্ড নম্বর / Ward Number";
                } else if (type.value === "upazila") {
                    wardUnion.placeholder = "ইউনিয়নের নাম / Union Name";
                } else {
                    wardUnion.placeholder = "ওয়ার্ড / ইউনিয়ন";
                }
            }
        });
    }

    /* SAME ADDRESS COPY */

    function copyPresentToPermanent() {
        const mappings = [
            "division",
            "district",
            "area_type",
            "local_area",
            "ward_union",
            "post_office",
            "address"
        ];

        const presentDivision = getField("present_division");
        const permanentDivision = getField("permanent_division");
        const presentDistrict = getField("present_district");
        const permanentDistrict = getField("permanent_district");

        if (!presentDivision || !permanentDivision ||
            !presentDistrict || !permanentDistrict) return;

        permanentDivision.value = presentDivision.value;

        permanentDivision.dispatchEvent(
            new Event("change", { bubbles: true })
        );

        permanentDistrict.value = presentDistrict.value;

        mappings.forEach(key => {
            if (key === "division" || key === "district") return;

            const source = getField("present_" + key);
            const target = getField("permanent_" + key);

            if (source && target) {
                target.value = source.value;
                target.dispatchEvent(
                    new Event("change", { bubbles: true })
                );
            }
        });
    }

    function setupSameAddress() {
        const checkbox = document.getElementById("sameAddress");
        if (!checkbox) return;

        checkbox.addEventListener("change", function () {
            if (this.checked) copyPresentToPermanent();
        });

        [
            "present_division",
            "present_district",
            "present_area_type",
            "present_local_area",
            "present_ward_union",
            "present_post_office",
            "present_address"
        ].forEach(name => {
            const field = getField(name);
            if (!field) return;

            field.addEventListener("change", function () {
                if (checkbox.checked) copyPresentToPermanent();
            });

            field.addEventListener("input", function () {
                if (checkbox.checked) copyPresentToPermanent();
            });
        });
    }

    /* INITIALIZE */

    function initialize() {
        setupAddress("present");
        setupAddress("permanent");

        setupAreaType("present");
        setupAreaType("permanent");

        setupSameAddress();

        console.log("DTSC Bangladesh Address System Loaded");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }

})();
