
// ================================================
// DTSC ALUMNI ASSOCIATION
// BANGLADESH ADDRESS SYSTEM
// Division → District
// বাংলা + English
// ================================================

(function () {
    "use strict";

    const divisions = [
        {
            bn: "ঢাকা",
            en: "Dhaka",
            districts: [
                ["ঢাকা", "Dhaka"],
                ["গাজীপুর", "Gazipur"],
                ["নারায়ণগঞ্জ", "Narayanganj"],
                ["নরসিংদী", "Narsingdi"],
                ["মানিকগঞ্জ", "Manikganj"],
                ["মুন্সীগঞ্জ", "Munshiganj"],
                ["টাঙ্গাইল", "Tangail"],
                ["কিশোরগঞ্জ", "Kishoreganj"],
                ["ফরিদপুর", "Faridpur"],
                ["গোপালগঞ্জ", "Gopalganj"],
                ["মাদারীপুর", "Madaripur"],
                ["রাজবাড়ী", "Rajbari"],
                ["শরীয়তপুর", "Shariatpur"]
            ]
        },
        {
            bn: "চট্টগ্রাম",
            en: "Chattogram",
            districts: [
                ["চট্টগ্রাম", "Chattogram"],
                ["কক্সবাজার", "Cox's Bazar"],
                ["রাঙামাটি", "Rangamati"],
                ["খাগড়াছড়ি", "Khagrachhari"],
                ["বান্দরবান", "Bandarban"],
                ["ফেনী", "Feni"],
                ["নোয়াখালী", "Noakhali"],
                ["লক্ষ্মীপুর", "Lakshmipur"],
                ["কুমিল্লা", "Cumilla"],
                ["ব্রাহ্মণবাড়িয়া", "Brahmanbaria"],
                ["চাঁদপুর", "Chandpur"]
            ]
        },
        {
            bn: "রাজশাহী",
            en: "Rajshahi",
            districts: [
                ["রাজশাহী", "Rajshahi"],
                ["নাটোর", "Natore"],
                ["নওগাঁ", "Naogaon"],
                ["চাঁপাইনবাবগঞ্জ", "Chapainawabganj"],
                ["পাবনা", "Pabna"],
                ["সিরাজগঞ্জ", "Sirajganj"],
                ["বগুড়া", "Bogura"],
                ["জয়পুরহাট", "Joypurhat"]
            ]
        },
        {
            bn: "খুলনা",
            en: "Khulna",
            districts: [
                ["খুলনা", "Khulna"],
                ["যশোর", "Jashore"],
                ["সাতক্ষীরা", "Satkhira"],
                ["বাগেরহাট", "Bagerhat"],
                ["ঝিনাইদহ", "Jhenaidah"],
                ["মাগুরা", "Magura"],
                ["নড়াইল", "Narail"],
                ["কুষ্টিয়া", "Kushtia"],
                ["চুয়াডাঙ্গা", "Chuadanga"],
                ["মেহেরপুর", "Meherpur"]
            ]
        },
        {
            bn: "বরিশাল",
            en: "Barishal",
            districts: [
                ["বরিশাল", "Barishal"],
                ["ভোলা", "Bhola"],
                ["পটুয়াখালী", "Patuakhali"],
                ["পিরোজপুর", "Pirojpur"],
                ["বরগুনা", "Barguna"],
                ["ঝালকাঠি", "Jhalokathi"]
            ]
        },
        {
            bn: "সিলেট",
            en: "Sylhet",
            districts: [
                ["সিলেট", "Sylhet"],
                ["মৌলভীবাজার", "Moulvibazar"],
                ["হবিগঞ্জ", "Habiganj"],
                ["সুনামগঞ্জ", "Sunamganj"]
            ]
        },
        {
            bn: "রংপুর",
            en: "Rangpur",
            districts: [
                ["রংপুর", "Rangpur"],
                ["দিনাজপুর", "Dinajpur"],
                ["কুড়িগ্রাম", "Kurigram"],
                ["গাইবান্ধা", "Gaibandha"],
                ["লালমনিরহাট", "Lalmonirhat"],
                ["নীলফামারী", "Nilphamari"],
                ["পঞ্চগড়", "Panchagarh"],
                ["ঠাকুরগাঁও", "Thakurgaon"]
            ]
        },
        {
            bn: "ময়মনসিংহ",
            en: "Mymensingh",
            districts: [
                ["ময়মনসিংহ", "Mymensingh"],
                ["জামালপুর", "Jamalpur"],
                ["শেরপুর", "Sherpur"],
                ["নেত্রকোণা", "Netrokona"]
            ]
        }
    ];

    window.BD_ADDRESS_DATA = {
        divisions: divisions,
        areaTypes: [
            { value: "city_corporation", bn: "সিটি কর্পোরেশন", en: "City Corporation" },
            { value: "municipality", bn: "পৌরসভা", en: "Municipality" },
            { value: "upazila", bn: "উপজেলা", en: "Upazila" }
        ]
    };

    function createOption(value, label) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = label;
        return option;
    }

    function initializeAddress(prefix) {
        const divisionSelect = document.querySelector(
            `[name="${prefix}_division"]`
        );

        const districtSelect = document.querySelector(
            `[name="${prefix}_district"]`
        );

        const areaTypeSelect = document.querySelector(
            `[name="${prefix}_area_type"]`
        );

        const localAreaInput = document.querySelector(
            `[name="${prefix}_local_area"]`
        );

        const wardUnionInput = document.querySelector(
            `[name="${prefix}_ward_union"]`
        );

        if (!divisionSelect || !districtSelect) return;

        // Division options
        divisionSelect.innerHTML = "";
        divisionSelect.appendChild(
            createOption("", "বিভাগ নির্বাচন করুন / Select Division")
        );

        divisions.forEach(division => {
            divisionSelect.appendChild(
                createOption(
                    division.bn,
                    `${division.bn} — ${division.en}`
                )
            );
        });

        // District initial state
        districtSelect.innerHTML = "";
        districtSelect.appendChild(
            createOption("", "জেলা নির্বাচন করুন / Select District")
        );
        districtSelect.disabled = true;

        // Division change
        divisionSelect.addEventListener("change", function () {
            districtSelect.innerHTML = "";
            districtSelect.appendChild(
                createOption("", "জেলা নির্বাচন করুন / Select District")
            );

            const selectedDivision = divisions.find(
                division => division.bn === this.value
            );

            if (!selectedDivision) {
                districtSelect.disabled = true;
                districtSelect.value = "";
                return;
            }

            selectedDivision.districts.forEach(district => {
                districtSelect.appendChild(
                    createOption(
                    district[0],
                    `${district[0]} — ${district[1]}`
                    )
                );
            });

            districtSelect.disabled = false;
            districtSelect.value = "";
        });

        // Area Type
        if (areaTypeSelect) {
            areaTypeSelect.innerHTML = "";
            areaTypeSelect.appendChild(
                createOption("", "এলাকার ধরন নির্বাচন করুন / Select Area Type")
            );

            window.BD_ADDRESS_DATA.areaTypes.forEach(type => {
                areaTypeSelect.appendChild(
                    createOption(
                        type.value,
                        `${type.bn} — ${type.en}`
                    )
                );
            });

            areaTypeSelect.addEventListener("change", function () {
                updateAreaPlaceholder(
                    this.value,
                    localAreaInput,
                    wardUnionInput
                );
            });
        }
    }

    function updateAreaPlaceholder(type, localArea, wardUnion) {
        if (!localArea || !wardUnion) return;

        if (type === "city_corporation") {
            localArea.placeholder =
                "City Corporation Name / সিটি কর্পোরেশন";

            wardUnion.placeholder =
                "Ward Number / ওয়ার্ড নম্বর";
        } else if (type === "municipality") {
            localArea.placeholder =
                "Municipality Name / পৌরসভার নাম";

            wardUnion.placeholder =
                "Ward Number / ওয়ার্ড নম্বর";
        } else if (type === "upazila") {
            localArea.placeholder =
                "Upazila Name / উপজেলার নাম";

            wardUnion.placeholder =
                "Union Name / ইউনিয়নের নাম";
        } else {
            localArea.placeholder =
                "City / Municipality / Upazila";

            wardUnion.placeholder =
                "Ward / Union";
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        initializeAddress("present");
        initializeAddress("permanent");
    });

})();
