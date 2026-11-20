
/* ==========================================
   DTSC ALUMNI
   BANGLADESH ADDRESS SYSTEM
========================================== */

const BD_GEO_URL =
  "https://iqbalhasandev.github.io/bangladesh-geo-json/bangladesh-geo.json";

let BD_GEO = [];

const addressKeys = [
  "division", "district", "area_type", "area", "ward",
  "union", "post_office", "post_code", "address"
];

async function loadBDGeo() {
  try {
    const res = await fetch(BD_GEO_URL);
    if (!res.ok) throw new Error("Address data load failed");

    BD_GEO = await res.json();

    setupAddress("present");
    setupAddress("permanent");

  } catch (e) {
    console.error(e);
    if (submitMessage) {
      submitMessage.textContent = "Address data loading failed. Reload page.";
    }
  }
}

function geoName(item) {
  return item?.name || "";
}

function geoBN(item) {
  return item?.bn_name || item?.name || "";
}

function setOptions(el, list, placeholder, bilingual = false) {
  if (!el) return;

  el.innerHTML = "";
  el.add(new Option(placeholder, ""));

  (list || []).forEach(item => {
    const name = geoName(item);
    if (!name) return;

    const label = bilingual && item.bn_name
      ? `${name} (${item.bn_name})`
      : name;

    el.add(new Option(label, name));
  });
}

function findDivision(name) {
  return BD_GEO.find(d => d.name === name);
}

function findDistrict(divName, districtName) {
  return findDivision(divName)?.districts?.find(
    d => d.name === districtName
  );
}

function findUpazila(district, name) {
  return district?.upazilas?.find(u => u.name === name);
}

function setupAddress(prefix) {
  const division = $(prefix + "_division");
  const district = $(prefix + "_district");
  const type = $(prefix + "_area_type");
  const area = $(prefix + "_area");
  const ward = $(prefix + "_ward");
  const union = $(prefix + "_union");
  const unionField = $(prefix + "_union_field");

  if (!division || !district || !type || !area) return;

  setOptions(division, BD_GEO, "Select Division");
  setOptions(district, [], "Select District");
  setOptions(type, [], "Select Area Type");
  setOptions(area, [], "Select Area");

  district.disabled = true;
  type.disabled = true;
  area.disabled = true;

  if (ward) {
    setOptions(ward, [], "Select Ward");
    ward.disabled = true;
  }

  if (unionField) unionField.style.display = "none";

  /* Division -> District */
  division.onchange = () => {
    const div = findDivision(division.value);

    setOptions(district, div?.districts || [], "Select District");
    district.disabled = !div;

    setOptions(type, [], "Select Area Type");
    type.disabled = true;

    setOptions(area, [], "Select Area");
    area.disabled = true;

    if (ward) {
      setOptions(ward, [], "Select Ward");
      ward.disabled = true;
    }

    if (union) union.value = "";
    if (unionField) unionField.style.display = "none";
  };

  /* District -> Area Type */
  district.onchange = () => {
    const dist = findDistrict(division.value, district.value);
    const types = [];

    if (dist?.city_corporations?.length)
      types.push("City Corporation");

    if (dist?.upazilas?.some(u => u.pourashavas?.length))
      types.push("Municipality");

    if (dist?.upazilas?.length)
      types.push("Upazila");

    setOptions(type, types.map(x => ({ name: x })), "Select Area Type");
    type.disabled = !types.length;

    setOptions(area, [], "Select Area");
    area.disabled = true;

    if (ward) {
      setOptions(ward, [], "Select Ward");
      ward.disabled = true;
    }

    if (union) union.value = "";
    if (unionField) unionField.style.display = "none";
  };

  /* Area Type -> Area */
  type.onchange = () => {
    const dist = findDistrict(division.value, district.value);
    let list = [];

    if (type.value === "City Corporation") {
      list = dist?.city_corporations || [];
    }

    if (type.value === "Municipality") {
      list = (dist?.upazilas || []).flatMap(u => u.pourashavas || []);
    }

    if (type.value === "Upazila") {
      list = dist?.upazilas || [];
    }

    setOptions(area, list, "Select Area");
    area.disabled = !list.length;

    if (ward) {
      setOptions(ward, [], "Select Ward");
      ward.disabled = true;
    }

    if (union) union.value = "";
    if (unionField) {
      unionField.style.display =
        type.value === "Upazila" ? "block" : "none";
    }
  };

  /* Area -> Ward */
  area.onchange = () => {
    if (ward) {
      setOptions(ward, [], "Select Ward");

      const max = type.value === "City Corporation" ? 99 :
                  type.value === "Municipality" ? 15 : 0;

      for (let i = 1; i <= max; i++) {
        const number = type.value === "Municipality"
          ? String(i).padStart(2, "0")
          : String(i);

        ward.add(new Option(number, number));
      }

      ward.disabled = max === 0;
    }

    if (unionField) {
      unionField.style.display =
        type.value === "Upazila" ? "block" : "none";
    }

    if (union && type.value === "Upazila") {
      const dist = findDistrict(division.value, district.value);
      const up = findUpazila(dist, area.value);
      const unionNames = up?.unions || [];

      // Union is an input field; keep it editable.
      union.placeholder = unionNames.length
        ? "Enter Union Name"
        : "Enter Union Name";
    }
  };
}

/* Initialize */
loadBDGeo();
