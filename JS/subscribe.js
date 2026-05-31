const API_URL = "https://messmate-1-j4dn.onrender.com";

async function subscribeMess(messName, price) {

  // Check login first
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const studentEmail = localStorage.getItem("userEmail");

  if (!isLoggedIn || !studentEmail) {
    alert("Please login first to subscribe!");
    window.location.href = "login.html";
    return;
  }

  const subscriptionData = {
    studentEmail: studentEmail,
    messName: messName,
    plan: "Monthly",
    price: price
  };

  try {
    const response = await fetch(`${API_URL}/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(subscriptionData)
    });

    const result = await response.json();

    alert(result.message || "Subscribed successfully 🎉");

  } catch (error) {
    console.log(error);
    alert("Error connecting to server");
  }
}