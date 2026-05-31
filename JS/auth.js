// ===============================
// AUTH CHECK
// ===============================
function checkAuth() {
  try {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const loginLink = document.getElementById("loginLink");
    const logoutBtn = document.getElementById("logoutBtn");

    if (isLoggedIn === "true") {
      if (loginLink) loginLink.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginLink) loginLink.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }

  } catch (error) {
    console.log("Auth check error:", error);
  }
}


// ===============================
// LOGOUT
// ===============================
function logout() {
  try {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");

    window.location.href = "index.html";

  } catch (error) {
    console.log("Logout error:", error);
  }
}


// ===============================
// AUTO RUN
// ===============================
document.addEventListener("DOMContentLoaded", checkAuth);