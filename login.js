document.getElementById("loginForm")
.addEventListener("submit", async function(e) {

  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const response = await fetch("http://localhost:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData)
  });

  const result = await response.text();

  if (result === "Login Successful") {

    // ✅ This is now INSIDE the handler — it runs after successful login
    localStorage.setItem("userEmail", loginData.email);
    localStorage.setItem("isLoggedIn", "true");

    alert("Login Successful! Welcome back 🎉");

    // ✅ Go to index (home page), not dashboard
    window.location.href = "index.html";

  } else {
    alert(result);
  }

});