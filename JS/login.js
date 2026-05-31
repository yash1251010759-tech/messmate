// ===============================
// CONFIG
// ===============================
const API_URL = "https://messmate-1-j4dn.onrender.com";


// ===============================
// LOGIN FORM
// ===============================
document.getElementById("loginForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData)
    });

    const result = await response.json();

    // ===============================
    // SUCCESS LOGIN
    // ===============================
    if (result.success) {

      localStorage.setItem("userEmail", loginData.email);
      localStorage.setItem("isLoggedIn", "true");

      if (result.isAdmin) {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.setItem("isAdmin", "false");
      }

      alert("Login Successful 🎉");

      window.location.href = "index.html";

    } 
    // ===============================
    // FAIL LOGIN
    // ===============================
    else {
      alert(result.message || "Invalid credentials");
    }

  } catch (error) {
    console.log("Login error:", error);
    alert("Server error. Try again later.");
  }

});