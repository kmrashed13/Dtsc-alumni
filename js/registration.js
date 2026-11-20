/* DTSC Alumni Association - Main Registration Logic */
(function () {
  "use strict";

  const $ = id => document.getElementById(id);

  const SUPABASE_URL =
    "https://nxekzyvfvtrwdpwvuklj.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_fnFoN8ecsee3fvi1FPYXRA_HiQj5qg8";

  const TABLE_NAME = "alumni_members";
  const PHOTO_BUCKET = "alumni-photos";

  let supabaseClient = null;
  let geo = [];
  let geoReady = false;

  if (window.supabase?.createClient) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );
  }

  function norm(value) {
    return String(value || "").trim().toLowerCase();
  }

  function itemName(item) {
    if (typeof item === "string") return item;
    return item?.name || item?.en || item?.bn_name || "";
  }

  function setOptions(element, items, placeholder) {
    if (!element) return;

    element.innerHTML = "";
    element.add(new Option(placeholder || "Select", ""));

    (items || []).forEach(value => {
      element.add(new Option(value, value));
    });

    element.disabled = !items || items.length === 0;
  }

  function findDivision(value) {
    return geo.find(
      division => norm(itemName(division)) === norm(value)
    );
  }

  function findDistrict(division, value) {
    return (division?.districts || []).find(
      district => norm(itemName(district)) === norm(value)
    );
  }

  function districtAreas(district, type) {
    if (!district) return [];

    if (type === "Upazila") {
      return (district.upazilas || [])
        .map(itemName)
        .filter(Boolean);
    }

    if (type === "Municipality") {
      const list = [];

      (district.upazilas || []).forEach(upazila => {
        const municipalities =
          upazila.pourashavas || upazila.municipalities || [];

        municipalities.forEach(municipality => {
          const name = itemName(municipality);
          if (name) list.push(name);
        });
      });

      return [...new Set(list)].sort((a, b) =>
        a.localeCompare(b)
      );
    }

    if (type === "City Corporation") {
      return window.BD_CITY_CORPORATIONS?.[
        norm(itemName(district))
      ] || [];
    }

    return [];
  }

  function resetAddressOptions(prefix) {
    setOptions($(prefix + "_area"), [], "Select area");
    setOptions($(prefix + "_ward"), [], "Select ward");

    $(prefix + "_ward_field")?.classList.add("hidden");
    $(prefix + "_union_field")?.classList.add("hidden");
  }

  function setupAddress(prefix) {
    const division = $(prefix + "_division");
    const district = $(prefix + "_district");
    const areaType = $(prefix + "_area_type");
    const area = $(prefix + "_area");
    const ward = $(prefix + "_ward");

    const wardField = $(prefix + "_ward_field");
    const unionField = $(prefix + "_union_field");

    if (!division || !district || !areaType || !area) return;

    setOptions(
      division,
      geo.map(itemName).filter(Boolean),
      "Select division"
    );

    setOptions(district, [], "Select district");
    setOptions(area, [], "Select area");
    setOptions(ward, [], "Select ward");

    division.addEventListener("change", function () {
      const selectedDivision = findDivision(division.value);

      setOptions(
        district,
        (selectedDivision?.districts || []).map(itemName).filter(Boolean),
        "Select district"
      );

      areaType.value = "";
      areaType.disabled = !division.value;

      resetAddressOptions(prefix);
    });

    district.addEventListener("change", function () {
      areaType.value = "";
      areaType.disabled = !district.value;

      resetAddressOptions(prefix);
    });

    areaType.addEventListener("change", function () {
      const selectedDivision = findDivision(division.value);
      const selectedDistrict = findDistrict(
        selectedDivision,
        district.value
      );

      const areas = districtAreas(
        selectedDistrict,
        areaType.value
      );

      setOptions(area, areas, "Select area");
      setOptions(ward, [], "Select ward");

      if (areaType.value === "City Corporation") {
        setOptions(
          ward,
          Array.from({ length: 99 }, (_, i) => String(i + 1)),
          "Select ward"
        );

        wardField?.classList.remove("hidden");
        unionField?.classList.add("hidden");
      } else if (areaType.value === "Municipality") {
        setOptions(
          ward,
          Array.from(
            { length: 15 },
            (_, i) => String(i + 1).padStart(2, "0")
          ),
          "Select ward"
        );

        wardField?.classList.remove("hidden");
        unionField?.classList.add("hidden");
      } else if (areaType.value === "Upazila") {
        wardField?.classList.add("hidden");
        unionField?.classList.remove("hidden");
      } else {
        wardField?.classList.add("hidden");
        unionField?.classList.add("hidden");
      }
    });
  }

  async function loadGeo() {
    const message = $("formMessage");

    try {
      const response = await fetch(window.BD_GEO_URL);

      if (!response.ok) {
        throw new Error("Address data request failed");
      }

      geo = await response.json();

      if (!Array.isArray(geo)) {
        throw new Error("Unexpected address data format");
      }

      geoReady = true;

      setupAddress("present");
      setupAddress("permanent");

      message.textContent = "Address dropdowns loaded.";
      message.className = "message";

      if ($("same_address")?.checked) {
        copySameAddress();
      }

    } catch (error) {
      message.textContent =
        "Address data could not load. Check internet and refresh.";

      message.className = "message";
      console.error("Address loading error:", error);
    }
  }

  const ADDRESS_KEYS = [
    "division",
    "district",
    "area_type",
    "area",
    "ward",
    "union",
    "post_office",
    "post_code",
    "address"
  ];

  function copySameAddress() {
    if (!geoReady || !$("same_address")?.checked) return;

    /*
      Copy in cascade order:
      Division → District → Area Type → Area → Ward
    */

    const pairs = [
      ["division", "change"],
      ["district", "change"],
      ["area_type", "change"],
      ["area", "change"],
      ["ward", "change"],
      ["union", "input"],
      ["post_office", "input"],
      ["post_code", "input"],
      ["address", "input"]
    ];

    pairs.forEach(([key, eventName]) => {
      const source = $("present_" + key);
      const target = $("permanent_" + key);

      if (!source || !target) return;

      target.value = source.value;

      if (eventName === "change") {
        target.dispatchEvent(new Event("change"));
      }
    });
  }

  function setupSameAddress() {
    const checkbox = $("same_address");
    const permanentBlock = $("permanentAddress");

    if (!checkbox || !permanentBlock) return;

    checkbox.addEventListener("change", function () {
      permanentBlock.classList.toggle(
        "hidden",
        checkbox.checked
      );

      if (checkbox.checked) {
        copySameAddress();
      }
    });

    ADDRESS_KEYS.forEach(key => {
      const source = $("present_" + key);
      if (!source) return;

      source.addEventListener("change", function () {
        if (checkbox.checked) copySameAddress();
      });

      source.addEventListener("input", function () {
        if (checkbox.checked) copySameAddress();
      });
    });
  }

  function setupAcademic() {
    const level = $("academic_level");
    const otherWrap = $("otherAcademicWrap");

    level?.addEventListener("change", function () {
      otherWrap?.classList.toggle(
        "hidden",
        level.value !== "Other"
      );
    });
  }

  function collectFormData() {
    const data = {};

    document.querySelectorAll(
      "#alumniRegistrationForm input:not([type=file]):not([type=checkbox]), " +
      "#alumniRegistrationForm select, " +
      "#alumniRegistrationForm textarea"
    ).forEach(element => {
      if (element.id) {
        data[element.id] = element.value;
      }
    });

    data.same_address = $("same_address")?.checked || false;

    return data;
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function addressSummary(prefix, title) {
    const labels = [
      "division",
      "district",
      "area_type",
      "area",
      "ward",
      "union",
      "post_office",
      "post_code",
      "address"
    ];

    return {
      title,
      items: labels
        .map(key => [
          key.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()),
          $(prefix + "_" + key)?.value || "—"
        ])
        .filter(item => item[1] !== "—")
    };
  }

  function renderReview() {
    const data = collectFormData();

    const groups = [
      {
        title: "Personal Information",
        items: [
          ["Full Name", data.full_name],
          ["Father's Name", data.father_name],
          ["Mother's Name", data.mother_name],
          ["Date of Birth", data.date_of_birth],
          ["Gender", data.gender],
          ["Blood Group", data.blood_group],
          ["Mobile", data.phone],
          ["Email", data.email]
        ].filter(item => item[1])
      },
      {
        title: "Academic Information",
        items: [
          ["Academic Level", data.academic_level],
          ["Department / Group", data.department],
          ["Session / Batch", data.session],
          ["Passing Year", data.passing_year],
          ["Roll Number", data.roll_number],
          ["Registration Number", data.registration_number],
          ["Other Academic Level", data.other_academic],
          ["Occupation", data.occupation]
        ].filter(item => item[1])
      },
      addressSummary("present", "Present Address")
    ];

    if (!data.same_address) {
      groups.push(
        addressSummary("permanent", "Permanent Address")
      );
    }

    const reviewBox = $("reviewSummary");

    reviewBox.innerHTML = groups.map(group => `
      <div class="review-group">
        <h4>${escapeHTML(group.title)}</h4>
        <dl>
          ${group.items.map(([key, value]) => `
            <dt>${escapeHTML(key)}</dt>
            <dd>${escapeHTML(value)}</dd>
          `).join("")}
        </dl>
      </div>
    `).join("");
  }

  window.DTSC_REGISTRATION = {
    collect: collectFormData,
    renderReview,
    loadGeo
  };

  loadGeo();
  setupSameAddress();
  setupAcademic();

  $("alumniRegistrationForm")?.addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();

      const message = $("formMessage");
      const submitButton = $("submitBtn");

      if (!$("consent").checked) {
        message.textContent =
          "Please confirm the information is accurate.";
        return;
      }

      if (!supabaseClient) {
        message.textContent =
          "Supabase client could not initialize.";
        return;
      }

      const data = collectFormData();
      const photo = $("photo")?.files?.[0] || null;

      let photoUrl = null;

      submitButton.disabled = true;
      message.textContent = "Submitting application…";

      try {
        if (photo) {
          const safeName = photo.name.replace(/[^\w.-]/g, "_");

          const path =
            `applications/${Date.now()}-${safeName}`;

          const uploadResult = await supabaseClient
            .storage
            .from(PHOTO_BUCKET)
            .upload(path, photo, { upsert: false });

          if (uploadResult.error) {
            throw uploadResult.error;
          }

          photoUrl = uploadResult.data?.path || path;
        }

        /*
          Important:
          This payload assumes these columns exist in
          public.alumni_members:
          full_name, phone, email, academic_level,
          department, passing_year, form_data,
          photo_url, status.
        */

        const payload = {
          full_name: data.full_name,
          phone: data.phone,
          email: data.email || null,
          academic_level: data.academic_level || null,
          department: data.department || null,
          passing_year: data.passing_year || null,
          form_data: data,
          photo_url: photoUrl,
          status: "pending"
        };

        const result = await supabaseClient
          .from(TABLE_NAME)
          .insert(payload);

        if (result.error) {
          throw result.error;
        }

        message.textContent =
          "Application submitted successfully!";

        message.className = "message success";

        $("alumniRegistrationForm").reset();

      } catch (error) {
        message.textContent =
          "Submit failed: " + (error.message || error);

        message.className = "message";
        console.error("Registration submit error:", error);

      } finally {
        submitButton.disabled = false;
      }
    }
  );

})();
