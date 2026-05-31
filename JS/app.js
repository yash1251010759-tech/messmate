const API_URL = "https://messmate-1-j4dn.onrender.com";

// LOAD MESSES
async function loadMessProviders() {
  try {
    const res = await fetch(`${API_URL}/messes`);
    const data = await res.json();

    const container = document.getElementById("messContainer");
    if (!container) return;

    container.innerHTML = "";

    data.forEach(mess => {
      container.innerHTML += `
        <div class="mess-card">
          <h3>${mess.name}</h3>
          <p>${mess.location}</p>
          <p>₹${mess.price}</p>
        </div>
      `;
    });

  } catch (err) {
    console.log(err);
  }
}

// AUTO LOAD (IMPORTANT)
document.addEventListener("DOMContentLoaded", loadMessProviders);