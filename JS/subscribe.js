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
    const response = await fetch("http://localhost:5000/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscriptionData)
    });

    const result = await response.text();
    alert(result);

  } catch (error) {
    alert("Error connecting to server. Is your backend running?");
    console.log(error);
  }

}