const SUPABASE_URL = "https://nxekzyvfvtrwdpwvuklj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fnFoN8ecsee3fvi1FPYXRA_HiQj5qg8";

const supabaseClient =
  window.supabase && typeof window.supabase.createClient === "function"
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
    : null;

const GEO_ENDPOINTS = {
  divisions: "https://bdapi.vercel.app/api/v1/divisions",
  districts: "https://bdapi.vercel.app/api/v1/districts",
  upazilas: "https://bdapi.vercel.app/api/v1/upazilas",
  unions: "https://bdapi.vercel.app/api/v1/unions"
};

const FALLBACK_GEO = {
  divisions: [
    { id: "1", name: "Chattagram", bn_name: "চট্টগ্রাম" },
    { id: "2", name: "Rajshahi", bn_name: "রাজশাহী" },
    { id: "3", name: "Khulna", bn_name: "খুলনা" },
    { id: "4", name: "Barishal", bn_name: "বরিশাল" },
    { id: "5", name: "Sylhet", bn_name: "সিলেট" },
    { id: "6", name: "Dhaka", bn_name: "ঢাকা" },
    { id: "7", name: "Rangpur", bn_name: "রংপুর" },
    { id: "8", name: "Mymensingh", bn_name: "ময়মনসিংহ" }
  ],
  districts: [
    { id: "39", division_id: "8", name: "Jamalpur", bn_name: "জামালপুর" },
    { id: "40", division_id: "8", name: "Mymensingh", bn_name: "ময়মনসিংহ" },
    { id: "41", division_id: "8", name: "Netrokona", bn_name: "নেত্রকোণা" },
    { id: "42", division_id: "8", name: "Sherpur", bn_name: "শেরপুর" },
    { id: "26", division_id: "6", name: "Dhaka", bn_name: "ঢাকা" },
    { id: "27", division_id: "6", name: "Gazipur", bn_name: "গাজীপুর" },
    { id: "1", division_id: "1", name: "Chattogram", bn_name: "চট্টগ্রাম" },
    { id: "14", division_id: "2", name: "Rajshahi", bn_name: "রাজশাহী" },
    { id: "19", division_id: "3", name: "Khulna", bn_name: "খুলনা" },
    { id: "50", division_id: "5", name: "Sylhet", bn_name: "সিলেট" },
    { id: "5", division_id: "4", name: "Barishal", bn_name: "বরিশাল" },
    { id: "56", division_id: "7", name: "Rangpur", bn_name: "রংপুর" }
  ],
  upazilas: [
    { id: "310", district_id: "39", name: "Dewanganj", bn_name: "দেওয়ানগঞ্জ" },
    { id: "311", district_id: "39", name: "Islampur", bn_name: "ইসলামপুর" },
    { id: "312", district_id: "39", name: "Jamalpur Sadar", bn_name: "জামালপুর সদর" },
    { id: "313", district_id: "39", name: "Madarganj", bn_name: "মাদারগঞ্জ" },
    { id: "314", district_id: "39", name: "Melandaha", bn_name: "মেলান্দহ" },
    { id: "315", district_id: "39", name: "Sarishabari", bn_name: "সরিষাবাড়ী" },
    { id: "316", district_id: "39", name: "Bakshiganj", bn_name: "বকশীগঞ্জ" }
  ],
  unions: [
    { id: "1", upazila_id: "310", name: "Dangdhara", bn_name: "ডাংধরা" },
    { id: "2", upazila_id: "310", name: "Chikajani", bn_name: "চিকাজানি" },
    { id: "3", upazila_id: "310", name: "Bahadurabad", bn_name: "বাহাদুরাবাদ" },
    { id: "4", upazila_id: "310", name: "Chukaibari", bn_name: "চুকাইবাড়ি" },
    { id: "5", upazila_id: "310", name: "Par Ramrampur", bn_name: "পার রামরামপুর" },
    { id: "6", upazila_id: "310", name: "Hatibhanga", bn_name: "হাতিভাঙ্গা" },
    { id: "7", upazila_id: "310", name: "Jimira", bn_name: "জিমিরা" },
    { id: "8", upazila_id: "310", name: "Sanarbari", bn_name: "সানারবাড়ি" }
  ],
  cityCorporationsByDistrict: {
    "Dhaka": ["Dhaka North City Corporation (DNCC)", "Dhaka South City Corporation (DSCC)"],
    "Chattogram": ["Chattogram City Corporation (CCC)"],
    "Khulna": ["Khulna City Corporation (KCC)"],
    "Rajshahi": ["Rajshahi City Corporation (RCC)"],
    "Sylhet": ["Sylhet City Corporation (SCC)"],
    "Barishal": ["Barishal City Corporation (BCC)"],
    "Rangpur": ["Rangpur City Corporation (RpCC)"],
    "Mymensingh": ["Mymensingh City Corporation (MCC)"],
    "Gazipur": ["Gazipur City Corporation (GCC)"],
    "Narayanganj": ["Narayanganj City Corporation (NCC)"],
    "Cumilla": ["Cumilla City Corporation (CoCC)"]
  },
  municipalitiesByDistrict: {
    "Jamalpur": ["Dewanganj Pourashava", "Islampur Pourashava", "Jamalpur Pourashava", "Melandaha Pourashava", "Sarishabari Pourashava", "Madarganj Pourashava"],
    "Mymensingh": ["Mymensingh Pourashava", "Muktagacha Pourashava", "Bhaluka Pourashava", "Gafargaon Pourashava", "Trishal Pourashava", "Phulpur Pourashava", "Gauripur Pourashava", "Haluaghat Pourashava", "Ishwarganj Pourashava", "Fulbaria Pourashava"],
    "Sherpur": ["Sherpur Pourashava", "Nakla Pourashava", "Nalitabari Pourashava", "Sreebardi Pourashava"],
    "Netrokona": ["Netrokona Pourashava", "Mohanganj Pourashava", "Kendua Pourashava", "Durgapur Pourashava", "Madan Pourashava"],
    "Dhaka": ["Dhamrai Pourashava", "Savar Pourashava", "Dohars Pourashava"],
    "Gazipur": ["Kaliakoir Pourashava", "Sreepur Pourashava", "Kapasia Pourashava"],
    "Tangail": ["Tangail Pourashava", "Mirzapur Pourashava", "Kalihati Pourashava", "Sakhipur Pourashava", "Madhupur Pourashava", "Gopalpur Pourashava", "Bhuapur Pourashava", "Delduar Pourashava"],
    "Bogura": ["Bogura Pourashava", "Sherpur Pourashava", "Santahar Pourashava", "Shajahanpur Pourashava", "Kahalu Pourashava", "Nandigram Pourashava"],
    "Chattogram": ["Rangunia Pourashava", "Sitakunda Pourashava", "Mirsharai Pourashava", "Patiya Pourashava", "Banshkhali Pourashava", "Sandwip Pourashava", "Hathazari Pourashava", "Boalkhali Pourashava", "Satkania Pourashava", "Chandanish Pourashava", "Raozan Pourashava", "Nazirhat Pourashava"],
    "Sylhet": ["Beanibazar Pourashava", "Golapganj Pourashava", "Kanaighat Pourashava", "Zakiganj Pourashava", "Bishwanath Pourashava"]
  }
};

const geoState = {
  divisions: [],
  districts: [],
  upazilas: [],
  unions: [],
  loadedLive: false
};

function normalizeRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

async function fetchJsonSafe(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return normalizeRows(await res.json());
}

async function initGeoDatabase() {
  const badge = document.getElementById("geoStatusBadge");
  try {
    const [divisions, districts, upazilas, unions] = await Promise.all([
      fetchJsonSafe(GEO_ENDPOINTS.divisions),
      fetchJsonSafe(GEO_ENDPOINTS.districts),
      fetchJsonSafe(GEO_ENDPOINTS.upazilas),
      fetchJsonSafe(GEO_ENDPOINTS.unions)
    ]);

    if (divisions.length && districts.length && upazilas.length && unions.length) {
      geoState.divisions = divisions;
      geoState.districts = districts;
      geoState.upazilas = upazilas;
      geoState.unions = unions;
      geoState.loadedLive = true;
      badge.textContent = `Geo Data: Live (${unions.length} Unions)`;
      badge.className = "geo-badge geo-ready";
    } else {
      throw new Error("Incomplete payload");
    }
  } catch (err) {
    geoState.divisions = FALLBACK_GEO.divisions;
    geoState.districts = FALLBACK_GEO.districts;
    geoState.upazilas = FALLBACK_GEO.upazilas;
    geoState.unions = FALLBACK_GEO.unions;
    geoState.loadedLive = false;
    badge.textContent = "Geo Data: Offline Fallback";
    badge.className = "geo-badge geo-fallback";
  }

  populateDivisionSelect("presentDivision");
  populateDivisionSelect("permanentDivision");
}

function formatGeoLabel(item) {
  const en = item.name || "";
  const bn = item.bn_name || "";
  return bn && bn !== en ? `${en} (${bn})` : en;
}

function populateDivisionSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">Select Division</option>';
  [...geoState.divisions]
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    .forEach((div) => {
      const opt = document.createElement("option");
      opt.value = div.id;
      opt.textContent = formatGeoLabel(div);
      opt.dataset.nameEn = div.name || "";
      opt.dataset.label = formatGeoLabel(div);
      select.appendChild(opt);
    });
}

function populateDateDropdowns() {
  const daySel = document.getElementById("dobDay");
  const monthSel = document.getElementById("dobMonth");
  const yearSel = document.getElementById("dobYear");

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentYear = new Date().getFullYear();

  daySel.innerHTML = '<option value="">Day</option>';
  for (let d = 1; d <= 31; d++) {
    const val = String(d).padStart(2, "0");
    daySel.innerHTML += `<option value="${val}">${d}</option>`;
  }

  monthSel.innerHTML = '<option value="">Month</option>';
  months.forEach((m, idx) => {
    const val = String(idx + 1).padStart(2, "0");
    monthSel.innerHTML += `<option value="${val}">${m}</option>`;
  });

  yearSel.innerHTML = '<option value="">Year</option>';
  for (let y = currentYear; y >= 1940; y--) {
    yearSel.innerHTML += `<option value="${y}">${y}</option>`;
  }
}

function populateAcademicYearAndSessionDropdowns() {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  document.querySelectorAll("select.year-1966-current").forEach((sel) => {
    const prev = sel.value;
    sel.innerHTML = '<option value="">Select Passing Year</option>';
    for (let y = currentYear; y >= 1966; y--) {
      sel.innerHTML += `<option value="${y}">${y}</option>`;
    }
    if (prev) sel.value = prev;
  });

  document.querySelectorAll("select.session-next-year").forEach((sel) => {
    const prev = sel.value;
    sel.innerHTML = '<option value="">Select Session</option>';
    for (let startYr = nextYear; startYr >= 1966; startYr--) {
      const endTwoDigit = String((startYr + 1) % 100).padStart(2, "0");
      const sessionStr = `${startYr}-${endTwoDigit}`;
      sel.innerHTML += `<option value="${sessionStr}">${sessionStr}</option>`;
    }
    if (prev) sel.value = prev;
  });
}

function setupAddressCascade(prefix) {
  const divSel = document.getElementById(`${prefix}Division`);
  const distSel = document.getElementById(`${prefix}District`);
  const areaTypeSel = document.getElementById(`${prefix}AreaType`);
  const condBox = document.getElementById(`${prefix}ConditionalArea`);

  divSel.addEventListener("change", () => {
    const divId = divSel.value;
    distSel.innerHTML = '<option value="">Select District</option>';
    areaTypeSel.value = "";
    areaTypeSel.disabled = true;
    condBox.classList.add("hidden");
    condBox.innerHTML = "";

    if (!divId) {
      distSel.disabled = true;
      return;
    }

    const matchingDistricts = geoState.districts
      .filter((d) => String(d.division_id) === String(divId))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    matchingDistricts.forEach((dist) => {
      const opt = document.createElement("option");
      opt.value = dist.id;
      opt.textContent = formatGeoLabel(dist);
      opt.dataset.nameEn = dist.name || "";
      opt.dataset.label = formatGeoLabel(dist);
      distSel.appendChild(opt);
    });

    distSel.disabled = matchingDistricts.length === 0;
  });

  distSel.addEventListener("change", () => {
    areaTypeSel.value = "";
    condBox.classList.add("hidden");
    condBox.innerHTML = "";
    areaTypeSel.disabled = !distSel.value;
    if (prefix === "present" && document.getElementById("sameAddressCheckbox").checked) {
      syncSameAddress();
    }
  });

  areaTypeSel.addEventListener("change", () => {
    renderAreaConditionalFields(prefix);
    if (prefix === "present" && document.getElementById("sameAddressCheckbox").checked) {
      syncSameAddress();
    }
  });
}

function renderAreaConditionalFields(prefix) {
  const distSel = document.getElementById(`${prefix}District`);
  const areaType = document.getElementById(`${prefix}AreaType`).value;
  const condBox = document.getElementById(`${prefix}ConditionalArea`);

  const selectedDistOption = distSel.options[distSel.selectedIndex];
  const distId = distSel.value;
  const distNameEn = selectedDistOption ? selectedDistOption.dataset.nameEn || selectedDistOption.textContent : "";

  condBox.innerHTML = "";
  if (!areaType || !distId) {
    condBox.classList.add("hidden");
    return;
  }

  condBox.classList.remove("hidden");

  if (areaType === "City Corporation") {
    const ccList = FALLBACK_GEO.cityCorporationsByDistrict[distNameEn] || [`${distNameEn} City Corporation`];
    let wardOpts = '<option value="">Select Ward (1 - 99)</option>';
    for (let w = 1; w <= 99; w++) {
      wardOpts += `<option value="Ward - ${String(w).padStart(2, "0")}">Ward - ${String(w).padStart(2, "0")}</option>`;
    }

    condBox.innerHTML = `
      <div class="grid-2">
        <div class="field-group">
          <label for="${prefix}CityCorp">City Corporation (${distNameEn}) <span class="req">*</span></label>
          <select id="${prefix}CityCorp" name="${prefix}CityCorp" required>
            <option value="">Select City Corporation</option>
            ${ccList.map((cc) => `<option value="${cc}">${cc}</option>`).join("")}
            <option value="Other City Corporation">Other City Corporation</option>
          </select>
        </div>
        <div class="field-group">
          <label for="${prefix}WardNo">Ward No. (1 to 99) <span class="req">*</span></label>
          <select id="${prefix}WardNo" name="${prefix}WardNo" required>
            ${wardOpts}
          </select>
        </div>
      </div>
    `;
  } else if (areaType === "Municipality") {
    const muniList = FALLBACK_GEO.municipalitiesByDistrict[distNameEn] || [`${distNameEn} Pourashava`];
    let wardOpts = '<option value="">Select Ward (01 - 15)</option>';
    for (let w = 1; w <= 15; w++) {
      const code = String(w).padStart(2, "0");
      wardOpts += `<option value="Word - ${code}">Word - ${code}</option>`;
    }

    condBox.innerHTML = `
      <div class="grid-2">
        <div class="field-group">
          <label for="${prefix}Municipality">Municipality / Pourashava (${distNameEn}) <span class="req">*</span></label>
          <select id="${prefix}Municipality" name="${prefix}Municipality" required>
            <option value="">Select Municipality</option>
            ${muniList.map((m) => `<option value="${m}">${m}</option>`).join("")}
            <option value="Other Municipality">Other Municipality</option>
          </select>
        </div>
        <div class="field-group">
          <label for="${prefix}MunicipalityWard">Ward (Word - 01 to 15) <span class="req">*</span></label>
          <select id="${prefix}MunicipalityWard" name="${prefix}MunicipalityWard" required>
            ${wardOpts}
          </select>
        </div>
      </div>
    `;
  } else if (areaType === "Upazila") {
    const upazilasInDist = geoState.upazilas
      .filter((u) => String(u.district_id) === String(distId))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    const upazilaOptions = upazilasInDist
      .map((u) => `<option value="${u.id}" data-label="${formatGeoLabel(u)}">${formatGeoLabel(u)}</option>`)
      .join("");

    condBox.innerHTML = `
      <div class="grid-2">
        <div class="field-group">
          <label for="${prefix}UpazilaSelect">Upazila (${distNameEn}) <span class="req">*</span></label>
          <select id="${prefix}UpazilaSelect" name="${prefix}UpazilaSelect" required>
            <option value="">Select Upazila</option>
            ${upazilaOptions}
          </select>
        </div>
        <div class="field-group">
          <label for="${prefix}UnionSelect">Union (ইউনিয়ন) <span class="req">*</span></label>
          <select id="${prefix}UnionSelect" name="${prefix}UnionSelect" disabled required>
            <option value="">Select Upazila First</option>
          </select>
        </div>
      </div>
    `;

    const upaSel = document.getElementById(`${prefix}UpazilaSelect`);
    const unionSel = document.getElementById(`${prefix}UnionSelect`);

    upaSel.addEventListener("change", () => {
      const upaId = upaSel.value;
      unionSel.innerHTML = '<option value="">Select Union</option>';
      if (!upaId) {
        unionSel.disabled = true;
        return;
      }
      const unionsInUpa = geoState.unions
        .filter((un) => String(un.upazila_id) === String(upaId))
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      unionsInUpa.forEach((un) => {
        const opt = document.createElement("option");
        opt.value = formatGeoLabel(un);
        opt.textContent = formatGeoLabel(un);
        unionSel.appendChild(opt);
      });

      const customOpt = document.createElement("option");
      customOpt.value = "Other Union";
      customOpt.textContent = "Other Union (অন্যান্য ইউনিয়ন)";
      unionSel.appendChild(customOpt);

      unionSel.disabled = false;
    });
  }
}

function syncSameAddress() {
  const checked = document.getElementById("sameAddressCheckbox").checked;
  const wrapper = document.getElementById("permanentFieldsWrapper");
  const permInputs = wrapper.querySelectorAll("input, select");

  if (!checked) {
    permInputs.forEach((el) => {
      el.disabled = false;
    });
    return;
  }

  const pDiv = document.getElementById("presentDivision").value;
  const pDist = document.getElementById("presentDistrict").value;
  const pAreaType = document.getElementById("presentAreaType").value;

  const permDiv = document.getElementById("permanentDivision");
  permDiv.value = pDiv;
  permDiv.dispatchEvent(new Event("change"));

  setTimeout(() => {
    const permDist = document.getElementById("permanentDistrict");
    permDist.value = pDist;
    permDist.dispatchEvent(new Event("change"));

    setTimeout(() => {
      const permAreaType = document.getElementById("permanentAreaType");
      permAreaType.value = pAreaType;
      permAreaType.dispatchEvent(new Event("change"));

      setTimeout(() => {
        if (pAreaType === "City Corporation") {
          const ccVal = document.getElementById("presentCityCorp")?.value || "";
          const wVal = document.getElementById("presentWardNo")?.value || "";
          if (document.getElementById("permanentCityCorp")) document.getElementById("permanentCityCorp").value = ccVal;
          if (document.getElementById("permanentWardNo")) document.getElementById("permanentWardNo").value = wVal;
        } else if (pAreaType === "Municipality") {
          const mVal = document.getElementById("presentMunicipality")?.value || "";
          const mwVal = document.getElementById("presentMunicipalityWard")?.value || "";
          if (document.getElementById("permanentMunicipality")) document.getElementById("permanentMunicipality").value = mVal;
          if (document.getElementById("permanentMunicipalityWard")) document.getElementById("permanentMunicipalityWard").value = mwVal;
        } else if (pAreaType === "Upazila") {
          const uVal = document.getElementById("presentUpazilaSelect")?.value || "";
          const unVal = document.getElementById("presentUnionSelect")?.value || "";
          const permUpa = document.getElementById("permanentUpazilaSelect");
          if (permUpa) {
            permUpa.value = uVal;
            permUpa.dispatchEvent(new Event("change"));
            setTimeout(() => {
              if (document.getElementById("permanentUnionSelect")) {
                document.getElementById("permanentUnionSelect").value = unVal;
              }
            }, 30);
          }
        }

        document.getElementById("permanentPostOffice").value = document.getElementById("presentPostOffice").value;
        document.getElementById("permanentPostCode").value = document.getElementById("presentPostCode").value;
        document.getElementById("permanentHouseAddress").value = document.getElementById("presentHouseAddress").value;
      }, 30);
    }, 30);
  }, 30);
}

function setupAcademicLogic() {
  const map = {
    JSC: "panelJSC",
    SSC: "panelSSC",
    HSC: "panelHSC",
    Diploma: "panelDiploma"
  };

  document.querySelectorAll(".exam-checkbox").forEach((chk) => {
    chk.addEventListener("change", () => {
      const panelId = map[chk.value];
      const panel = document.getElementById(panelId);
      if (!panel) return;
      panel.classList.toggle("hidden", !chk.checked);
      populateAcademicYearAndSessionDropdowns();
      panel.querySelectorAll("input, select").forEach((input) => {
        input.required = chk.checked;
      });
    });
  });
}

function setupStatusLogic() {
  const map = {
    "Higher Studies": "panelHigherStudies",
    "Job Holder": "panelJobHolder",
    "Entrepreneur / Business": "panelEntrepreneur",
    "Others": "panelOthers"
  };

  document.querySelectorAll(".status-checkbox").forEach((chk) => {
    chk.addEventListener("change", () => {
      const panel = document.getElementById(map[chk.value]);
      if (!panel) return;
      panel.classList.toggle("hidden", !chk.checked);

      if (chk.value === "Higher Studies") {
        document.getElementById("hsInstituteName").required = chk.checked;
        document.getElementById("hsDepartment").required = chk.checked;
      } else if (chk.value === "Job Holder") {
        const jobSector = document.getElementById("jobSector");
        jobSector.required = chk.checked;
        if (!chk.checked) {
          jobSector.value = "";
          jobSector.dispatchEvent(new Event("change"));
        }
      }
    });
  });

  const jobSector = document.getElementById("jobSector");
  jobSector.addEventListener("change", () => {
    const val = jobSector.value;
    const govPanel = document.getElementById("panelGovJob");
    const privPanel = document.getElementById("panelPrivateJob");

    govPanel.classList.toggle("hidden", val !== "Government Service");
    privPanel.classList.toggle("hidden", val !== "Private");

    govPanel.querySelectorAll("input").forEach((inp) => {
      inp.required = val === "Government Service";
    });
    privPanel.querySelectorAll("input").forEach((inp) => {
      inp.required = val === "Private";
    });
  });
}

function setupPhotoUploader() {
  const photoInput = document.getElementById("photoInput");
  const photoPreview = document.getElementById("photoPreview");
  const photoPlaceholder = document.getElementById("photoPlaceholder");
  const clearBtn = document.getElementById("clearPhotoBtn");

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      showAlert("Photo size must be 3MB or less.", "error");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.classList.remove("hidden");
      photoPlaceholder.classList.add("hidden");
      clearBtn.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  });

  clearBtn.addEventListener("click", () => {
    photoInput.value = "";
    photoPreview.src = "";
    photoPreview.classList.add("hidden");
    photoPlaceholder.classList.remove("hidden");
    clearBtn.classList.add("hidden");
  });
}

function showAlert(message, type = "error") {
  const banner = document.getElementById("alertBanner");
  banner.textContent = message;
  banner.className = `alert-banner ${type === "success" ? "alert-success" : "alert-error"}`;
  banner.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function collectAddressPayload(prefix) {
  const divEl = document.getElementById(`${prefix}Division`);
  const distEl = document.getElementById(`${prefix}District`);
  const areaType = document.getElementById(`${prefix}AreaType`).value;

  const payload = {
    division: divEl.options[divEl.selectedIndex]?.dataset.label || divEl.options[divEl.selectedIndex]?.textContent || "",
    district: distEl.options[distEl.selectedIndex]?.dataset.label || distEl.options[distEl.selectedIndex]?.textContent || "",
    area_type: areaType,
    post_office: document.getElementById(`${prefix}PostOffice`).value.trim(),
    post_code: document.getElementById(`${prefix}PostCode`).value.trim(),
    house_address: document.getElementById(`${prefix}HouseAddress`).value.trim()
  };

  if (areaType === "City Corporation") {
    payload.city_corporation = document.getElementById(`${prefix}CityCorp`)?.value || "";
    payload.ward = document.getElementById(`${prefix}WardNo`)?.value || "";
  } else if (areaType === "Municipality") {
    payload.municipality = document.getElementById(`${prefix}Municipality`)?.value || "";
    payload.ward = document.getElementById(`${prefix}MunicipalityWard`)?.value || "";
  } else if (areaType === "Upazila") {
    const upaSel = document.getElementById(`${prefix}UpazilaSelect`);
    payload.upazila = upaSel?.options[upaSel.selectedIndex]?.dataset.label || upaSel?.options[upaSel.selectedIndex]?.textContent || "";
    payload.union = document.getElementById(`${prefix}UnionSelect`)?.value || "";
  }

  return payload;
}

async function uploadMemberPhoto(file) {
  if (!file || !supabaseClient) return null;
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const filePath = `dtsc/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabaseClient.storage.from("member-photos").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false
  });
  if (error) throw error;
  const { data } = supabaseClient.storage.from("member-photos").getPublicUrl(filePath);
  return data?.publicUrl || null;
}

function setupFormSubmission() {
  const form = document.getElementById("membershipForm");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("alertBanner").classList.add("hidden");

    const selectedExams = Array.from(document.querySelectorAll(".exam-checkbox:checked")).map((c) => c.value);
    if (selectedExams.length === 0) {
      showAlert("Please select at least one examination under Academic Information (JSC, SSC, HSC, or Diploma).", "error");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      showAlert("Please fill out all required fields before submitting.", "error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const photoFile = document.getElementById("photoInput").files[0] || null;
      const photoUrl = await uploadMemberPhoto(photoFile);

      const sameAddr = document.getElementById("sameAddressCheckbox").checked;
      const presentAddr = collectAddressPayload("present");
      const permanentAddr = sameAddr ? { ...presentAddr } : collectAddressPayload("permanent");

      const academicDetails = {};
      if (selectedExams.includes("JSC")) {
        academicDetails.jsc = {
          roll: document.getElementById("jscRoll").value.trim(),
          reg: document.getElementById("jscReg").value.trim(),
          gpa: document.getElementById("jscGpa").value.trim(),
          passing_year: document.getElementById("jscPassingYear").value,
          session: document.getElementById("jscSession").value
        };
      }
      if (selectedExams.includes("SSC")) {
        academicDetails.ssc = {
          trade: document.getElementById("sscTrade").value,
          session: document.getElementById("sscSession").value,
          roll: document.getElementById("sscRoll").value.trim(),
          reg: document.getElementById("sscReg").value.trim(),
          gpa: document.getElementById("sscGpa").value.trim(),
          passing_year: document.getElementById("sscPassingYear").value
        };
      }
      if (selectedExams.includes("HSC")) {
        academicDetails.hsc = {
          trade: document.getElementById("hscTrade").value,
          session: document.getElementById("hscSession").value,
          roll: document.getElementById("hscRoll").value.trim(),
          reg: document.getElementById("hscReg").value.trim(),
          gpa: document.getElementById("hscGpa").value.trim(),
          passing_year: document.getElementById("hscPassingYear").value
        };
      }
      if (selectedExams.includes("Diploma")) {
        academicDetails.diploma = {
          technology: document.getElementById("diplomaTech").value,
          session: document.getElementById("diplomaSession").value,
          roll: document.getElementById("diplomaRoll").value.trim(),
          reg: document.getElementById("diplomaReg").value.trim(),
          cgpa: document.getElementById("diplomaCgpa").value.trim(),
          passing_year: document.getElementById("diplomaPassingYear").value
        };
      }

      const currentStatuses = Array.from(document.querySelectorAll(".status-checkbox:checked")).map((c) => c.value);
      const statusDetails = {};
      if (currentStatuses.includes("Higher Studies")) {
        statusDetails.higher_studies = {
          institute_name: document.getElementById("hsInstituteName").value.trim(),
          department: document.getElementById("hsDepartment").value.trim()
        };
      }
      if (currentStatuses.includes("Job Holder")) {
        const sector = document.getElementById("jobSector").value;
        statusDetails.job_holder = {
          sector,
          government: sector === "Government Service" ? {
            organization_name: document.getElementById("govOrganizationName").value.trim(),
            designation: document.getElementById("govDesignation").value.trim(),
            department: document.getElementById("govDepartment").value.trim()
          } : null,
          private: sector === "Private" ? {
            organization: document.getElementById("privOrganization").value.trim(),
            designation: document.getElementById("privDesignation").value.trim(),
            department: document.getElementById("privDepartment").value.trim(),
            location: document.getElementById("privLocation").value.trim()
          } : null
        };
      }
      if (currentStatuses.includes("Entrepreneur / Business")) {
        statusDetails.entrepreneur = {
          business_name: document.getElementById("businessName").value.trim(),
          nature_and_location: document.getElementById("businessNature").value.trim()
        };
      }
      if (currentStatuses.includes("Others")) {
        statusDetails.others = document.getElementById("otherStatusDetails").value.trim();
      }

      const dob = `${document.getElementById("dobDay").value}-${document.getElementById("dobMonth").value}-${document.getElementById("dobYear").value}`;

      const record = {
        photo_url: photoUrl,
        full_name: document.getElementById("fullName").value.trim().toUpperCase(),
        father_name: document.getElementById("fatherName").value.trim(),
        mother_name: document.getElementById("motherName").value.trim(),
        date_of_birth: dob,
        blood_group: document.getElementById("bloodGroup").value,
        contact_number: document.getElementById("contactNumber").value.trim(),
        email: document.getElementById("email").value.trim(),
        same_address: sameAddr,
        present_address: presentAddr,
        permanent_address: permanentAddr,
        selected_exams: selectedExams,
        academic_details: academicDetails,
        current_statuses: currentStatuses,
        current_status_details: statusDetails,
        suggestions: document.getElementById("associationSuggestions").value.trim()
      };

      if (!supabaseClient) {
        throw new Error("Supabase client is not initialized.");
      }

      const { data, error } = await supabaseClient
        .from("dtsc_alumni_members")
        .insert([record])
        .select()
        .single();

      if (error) throw error;

      showAlert("Your DTSC Alumni Association membership registration has been submitted!", "success");
      openReceiptModal(data || record);
    } catch (err) {
      showAlert(`Submission error: ${err.message || err}`, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
    }
  });
}

function openReceiptModal(rec) {
  const modal = document.getElementById("receiptModal");
  const body = document.getElementById("receiptContent");
  body.innerHTML = `
    <p><strong>Reference ID:</strong> ${rec.id || "Pending Sync"}</p>
    <p><strong>Name:</strong> ${rec.full_name}</p>
    <p><strong>Blood Group:</strong> ${rec.blood_group}</p>
    <p><strong>Contact:</strong> ${rec.contact_number} | ${rec.email}</p>
    <p><strong>Examinations:</strong> ${(rec.selected_exams || []).join(", ")}</p>
    <p><strong>District:</strong> ${rec.present_address?.district || ""} (${rec.present_address?.area_type || ""})</p>
  `;
  modal.classList.remove("hidden");
}

function setupModals() {
  const sqlModal = document.getElementById("sqlModal");
  document.getElementById("openSqlModalBtn").addEventListener("click", () => sqlModal.classList.remove("hidden"));
  document.getElementById("closeSqlModalBtn").addEventListener("click", () => sqlModal.classList.add("hidden"));

  document.getElementById("copySqlBtn").addEventListener("click", async () => {
    const sqlText = document.getElementById("sqlCodeBlock").textContent;
    try {
      await navigator.clipboard.writeText(sqlText);
      document.getElementById("copySqlBtn").textContent = "Copied!";
      setTimeout(() => (document.getElementById("copySqlBtn").textContent = "Copy SQL"), 1800);
    } catch (_) {
      showAlert("Please copy the SQL manually.", "error");
    }
  });

  const receiptModal = document.getElementById("receiptModal");
  document.getElementById("closeReceiptModalBtn").addEventListener("click", () => receiptModal.classList.add("hidden"));
  document.getElementById("doneReceiptBtn").addEventListener("click", () => {
    receiptModal.classList.add("hidden");
    document.getElementById("membershipForm").reset();
    document.getElementById("clearPhotoBtn").click();
    document.querySelectorAll(".exam-panel, .status-panel, .sub-conditional-panel, .conditional-box").forEach((el) => el.classList.add("hidden"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateDateDropdowns();
  populateAcademicYearAndSessionDropdowns();
  setupAddressCascade("present");
  setupAddressCascade("permanent");
  document.getElementById("sameAddressCheckbox").addEventListener("change", syncSameAddress);
  setupAcademicLogic();
  setupStatusLogic();
  setupPhotoUploader();
  setupFormSubmission();
  setupModals();
  initGeoDatabase();
});
