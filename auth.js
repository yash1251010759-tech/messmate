function checkAuth() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn) {
    const loginLink = document.getElementById("loginLink");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline";
  }
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("isAdmin");
  window.location.href = "index.html";
}