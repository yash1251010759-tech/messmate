const API_URL = "https://messmate-1-j4dn.onrender.com";

async function searchMess() {

  const query = document.getElementById("searchInput").value.toLowerCase();

  try {
    const res = await fetch(`${API_URL}/messes`);
    const data = await res.json();

    const filtered = data.filter(m =>
      m.name.toLowerCase().includes(query) ||
      (m.location || "").toLowerCase().includes(query)
    );

    const container = document.getElementById("messContainer");

    if (!filtered.length) {
      container.innerHTML = "<p>No results found</p>";
      return;
    }

    container.innerHTML = filtered.map(mess => `
      <div class="mess-card">
        <h3>${mess.name}</h3>
        <p>${mess.location || "No location"}</p>
        <p>₹${mess.price}</p>
        <p>⭐ ${mess.rating || 4}</p>
      </div>
    `).join("");

  } catch (err) {
    console.log("Search error:", err);
    alert("Search failed");
  }
}