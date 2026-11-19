

/* ==========================================
   DTSC ALUMNI ASSOCIATION
   ALUMNI DIRECTORY JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // DEMO ALUMNI DATA
  // ==========================================
  // Demo profiles only. Replace with database data later.

  const alumniData = [];

  // ==========================================
  // ELEMENTS
  // ==========================================

  const alumniGrid = document.getElementById("alumniGrid");
  const alumniSearch = document.getElementById("alumniSearch");
  const batchFilter = document.getElementById("batchFilter");
  const departmentFilter = document.getElementById("departmentFilter");
  const searchButton = document.getElementById("searchButton");
  const resetButton = document.getElementById("resetButton");
  const resultCount = document.getElementById("alumniResultCount");
  const emptyState = document.getElementById("emptyState");

  // ==========================================
  // SAFETY CHECK
  // ==========================================

  if (!alumniGrid) return;

  // ==========================================
  // HELPERS
  // ==========================================

  function escapeHTML(value) {

    return String(value ?? "").replace(/[&<>"']/g, function (char) {

      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };

      return map[char];

    });

  }

  // ==========================================
  // POPULATE FILTERS
  // ==========================================

  function populateFilters() {

    if (batchFilter) {

      const batches = [...new Set(
        alumniData.map(item => item.batch).filter(Boolean)
      )].sort((a, b) => b - a);

      batches.forEach(batch => {

        const option = document.createElement("option");
        option.value = batch;
        option.textContent = batch;

        batchFilter.appendChild(option);

      });

    }

    if (departmentFilter) {

      const departments = [...new Set(
        alumniData.map(item => item.department).filter(Boolean)
      )].sort();

      departments.forEach(department => {

        const option = document.createElement("option");
        option.value = department;
        option.textContent = department;

        departmentFilter.appendChild(option);

      });

    }

  }

  // ==========================================
  // ALUMNI CARD
  // ==========================================

  function createAlumniCard(alumni) {

    const name = escapeHTML(alumni.name);
    const id = escapeHTML(alumni.id || "Not Assigned");
    const batch = escapeHTML(alumni.batch || "N/A");
    const department = escapeHTML(alumni.department || "N/A");
    const profession = escapeHTML(alumni.profession || "N/A");

    const photo = alumni.photo
      ? escapeHTML(alumni.photo)
      : "assets/images/default-avatar.png";

    return `
      <article class="alumni-card">

        <div class="alumni-card-top">
          <img
            class="alumni-avatar"
            src="${photo}"
            alt="${name}"
            loading="lazy"
            onerror="this.onerror=null;this.src='assets/images/default-avatar.png';"
          >
        </div>

        <div class="alumni-card-body">

          <h3>${name}</h3>

          <p class="alumni-id">
            Alumni ID: ${id}
          </p>

          <div class="alumni-info">

            <p>
              <strong>Passing Year:</strong> ${batch}
            </p>

            <p>
              <strong>Department:</strong> ${department}
            </p>

            <p>
              <strong>Profession:</strong> ${profession}
            </p>

          </div>

          <div class="alumni-card-footer">
            <a href="login.html">Member Profile</a>
          </div>

        </div>

      </article>
    `;

  }

  // ==========================================
  // RENDER ALUMNI
  // ==========================================

  function renderAlumni(data) {

    alumniGrid.innerHTML = "";

    if (resultCount) {
      resultCount.textContent = `${data.length} alumni found`;
    }

    if (emptyState) {
      emptyState.classList.toggle("show", data.length === 0);
    }

    if (data.length === 0) return;

    alumniGrid.innerHTML = data.map(createAlumniCard).join("");

  }

  // ==========================================
  // SEARCH & FILTER
  // ==========================================

  function filterAlumni() {

    const searchText = alumniSearch
      ? alumniSearch.value.trim().toLowerCase()
      : "";

    const selectedBatch = batchFilter
      ? batchFilter.value
      : "";

    const selectedDepartment = departmentFilter
      ? departmentFilter.value
      : "";

    const filteredData = alumniData.filter(function (alumni) {

      const searchableText = [
        alumni.name,
        alumni.id,
        alumni.batch,
        alumni.department,
        alumni.profession
      ].join(" ").toLowerCase();

      const matchesSearch = !searchText ||
        searchableText.includes(searchText);

      const matchesBatch = !selectedBatch ||
        String(alumni.batch) === selectedBatch;

      const matchesDepartment = !selectedDepartment ||
        alumni.department === selectedDepartment;

      return matchesSearch &&
        matchesBatch &&
        matchesDepartment;

    });

    renderAlumni(filteredData);

  }

  // ==========================================
  // RESET FILTERS
  // ==========================================

  function resetFilters() {

    if (alumniSearch) alumniSearch.value = "";
    if (batchFilter) batchFilter.value = "";
    if (departmentFilter) departmentFilter.value = "";

    renderAlumni(alumniData);

  }

  // ==========================================
  // EVENTS
  // ==========================================

  if (searchButton) {
    searchButton.addEventListener("click", filterAlumni);
  }

  if (alumniSearch) {

    alumniSearch.addEventListener("input", filterAlumni);

    alumniSearch.addEventListener("keydown", function (event) {

      if (event.key === "Enter") {
        filterAlumni();
      }

    });

  }

  if (batchFilter) {
    batchFilter.addEventListener("change", filterAlumni);
  }

  if (departmentFilter) {
    departmentFilter.addEventListener("change", filterAlumni);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetFilters);
  }

  // ==========================================
  // INITIALIZE
  // ==========================================

  populateFilters();
  renderAlumni(alumniData);

  console.log("DTSC Alumni Directory Loaded.");

});
