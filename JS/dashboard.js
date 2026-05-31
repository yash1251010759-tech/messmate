// ===============================
// CONFIG
// ===============================
const API_URL = "https://messmate-1-j4dn.onrender.com/messes";


// ===============================
// LOAD ALL MESSES
// ===============================
async function loadMesses() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const container = document.getElementById("messContainer");
    const loadingMsg = document.getElementById("loadingMsg");

    if (!container) return;

    if (!data || data.length === 0) {
      if (loadingMsg) loadingMsg.textContent = "No mess found";
      return;
    }

    if (loadingMsg) loadingMsg.style.display = "none";

    container.innerHTML = data.map(mess => `
      <div class="mess-card">
        <h3>${mess.name}</h3>
        <p>${mess.type || "Food"}</p>
        <p>${mess.location || "No location"}</p>
        <p>₹${mess.price}</p>

        <button onclick="subscribeMess('${mess._id}', '${mess.name}', ${mess.price})">
          Subscribe
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.log("Load error:", err);

    const container = document.getElementById("messContainer");
    if (container) {
      container.innerHTML = "<p>Server error</p>";
    }
  }
}


// ===============================
// SEARCH MESSES
// ===============================
async function searchMess() {
  try {
    const query = document
      .getElementById("searchInput")
      .value.toLowerCase();

    const res = await fetch(API_URL);
    const data = await res.json();

    const filtered = data.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.location || "").toLowerCase().includes(query)
    );

    const container = document.getElementById("messContainer");

    container.innerHTML = filtered.map(mess => `
      <div class="mess-card">
        <h3>${mess.name}</h3>
        <p>${mess.location || "No location"}</p>
        <p>₹${mess.price}</p>
      </div>
    `).join("");

  } catch (err) {
    console.log("Search error:", err);
  }
}


// ===============================
// ENTER KEY SEARCH
// ===============================
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchMess();
    }
  });
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadMesses);