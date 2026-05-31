const API_URL = "http://localhost:5000/providers";

// LOAD ALL MESS
async function loadMesses() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    const container = document.getElementById("messContainer");
    const loadingMsg = document.getElementById("loadingMsg");

    if (!data || data.length === 0) {
      loadingMsg.textContent = "No mess found";
      return;
    }

    loadingMsg.style.display = "none";

    container.innerHTML = data.map(mess => `
      <div class="mess-card">
        <h3>${mess.name}</h3>
        <p>${mess.type || "Food"}</p>
        <p>₹${mess.price}</p>

        <button onclick="subscribeMess('${mess.name}', ${mess.price})">
          Subscribe
        </button>
      </div>
    `).join("");

  } catch (err) {
    console.log(err);
    document.getElementById("messContainer").innerHTML =
      "<p>Server error</p>";
  }
}

// SEARCH
async function searchMess() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const res = await fetch(API_URL);
  const data = await res.json();

  const filtered = data.filter(m =>
    m.name.toLowerCase().includes(query) ||
    (m.location && m.location.toLowerCase().includes(query))
  );

  const container = document.getElementById("messContainer");

  container.innerHTML = filtered.map(mess => `
    <div class="mess-card">
      <h3>${mess.name}</h3>
      <p>${mess.location}</p>
      <p>₹${mess.price}</p>
    </div>
  `).join("");
}

// ENTER KEY SEARCH
document.getElementById("searchInput")
  .addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchMess();
  });

// INIT
loadMesses();