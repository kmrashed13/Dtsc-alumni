

/* ==========================================
   DTSC ALUMNI ASSOCIATION
   MAIN JAVASCRIPT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // MOBILE MENU
  // ==========================================

  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", function () {

      navMenu.classList.toggle("active");

      const isOpen = navMenu.classList.contains("active");

      menuToggle.innerHTML = isOpen ? "✕" : "☰";

      menuToggle.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

    });

    // Close menu after clicking a link
    navMenu.querySelectorAll("a").forEach(function (link) {

      link.addEventListener("click", function () {

        navMenu.classList.remove("active");
        menuToggle.innerHTML = "☰";
        menuToggle.setAttribute("aria-expanded", "false");

      });

    });

  }

  // ==========================================
  // CURRENT YEAR
  // ==========================================

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // ==========================================
  // INITIAL DEMO STATISTICS
  // ==========================================
  // These are demo values only.
  // Real statistics will be connected to database later.

  const demoStats = {
    totalAlumni: 0,
    totalBatches: 0,
    totalEvents: 0,
    totalCommittee: 0
  };

  function updateStat(id, value) {

    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }

  }

  updateStat("totalAlumni", demoStats.totalAlumni);
  updateStat("totalBatches", demoStats.totalBatches);
  updateStat("totalEvents", demoStats.totalEvents);
  updateStat("totalCommittee", demoStats.totalCommittee);

  // ==========================================
  // SMOOTH SCROLL
  // ==========================================

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });

  // ==========================================
  // CONSOLE MESSAGE
  // ==========================================

  console.log("DTSC Alumni Association Website Loaded Successfully.");

});
