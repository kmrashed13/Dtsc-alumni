
/* =====================================================
   DTSC ALUMNI ASSOCIATION
   BANGLADESH ADDRESS DATA
   Division → District
===================================================== */

window.BD_ADDRESS_DATA = {
  divisions: [
    {
      en: "Barishal",
      bn: "বরিশাল",
      districts: ["Barguna", "Barishal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"]
    },
    {
      en: "Chattogram",
      bn: "চট্টগ্রাম",
      districts: ["Bandarban", "Brahmanbaria", "Chandpur", "Chattogram", "Cumilla", "Cox's Bazar", "Feni", "Khagrachhari", "Lakshmipur", "Noakhali", "Rangamati"]
    },
    {
      en: "Dhaka",
      bn: "ঢাকা",
      districts: ["Dhaka", "Faridpur", "Gazipur", "Gopalganj", "Kishoreganj", "Madaripur", "Manikganj", "Munshiganj", "Narayanganj", "Narsingdi", "Rajbari", "Shariatpur", "Tangail"]
    },
    {
      en: "Khulna",
      bn: "খুলনা",
      districts: ["Bagerhat", "Chuadanga", "Jashore", "Jhenaidah", "Khulna", "Kushtia", "Magura", "Meherpur", "Narail", "Satkhira"]
    },
    {
      en: "Mymensingh",
      bn: "ময়মনসিংহ",
      districts: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"]
    },
    {
      en: "Rajshahi",
      bn: "রাজশাহী",
      districts: ["Bogura", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Rajshahi", "Sirajganj"]
    },
    {
      en: "Rangpur",
      bn: "রংপুর",
      districts: ["Dinajpur", "Gaibandha", "Kurigram", "Lalmonirhat", "Nilphamari", "Panchagarh", "Rangpur", "Thakurgaon"]
    },
    {
      en: "Sylhet",
      bn: "সিলেট",
      districts: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"]
    }
  ]
};

/* =========================================
   ADDRESS HELPER FUNCTIONS
========================================= */

window.BD_ADDRESS_HELPERS = {

  getDivisions() {
    return window.BD_ADDRESS_DATA.divisions;
  },

  getDistricts(divisionName) {
    const division = window.BD_ADDRESS_DATA.divisions.find(
      item => item.en === divisionName || item.bn === divisionName
    );

    return division ? division.districts : [];
  },

  getDivisionNameEnglish(name) {
    const division = window.BD_ADDRESS_DATA.divisions.find(
      item => item.en === name || item.bn === name
    );

    return division ? division.en : "";
  },

  getDivisionNameBangla(name) {
    const division = window.BD_ADDRESS_DATA.divisions.find(
      item => item.en === name || item.bn === name
    );

    return division ? division.bn : "";
  }

};
