const API_URL = "https://messmate-1-j4dn.onrender.com";

console.log("Signup JS Connected");

document.getElementById("signupForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  console.log("Form Submitted");

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    if (result.success) {
      alert("Signup Successful 🎉");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Signup failed");
    }

  } catch (error) {
    console.log(error);
    alert("Error Connecting Backend");
  }
});