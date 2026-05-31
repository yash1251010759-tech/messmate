// ===============================
// CONFIG
// ===============================
const API_URL = "https://messmate-1-j4dn.onrender.com";


// ===============================
// REVIEW FORM SUBMIT
// ===============================
document.getElementById("reviewForm")
.addEventListener("submit", async function (e) {

  e.preventDefault();

  const reviewData = {
    studentName: document.getElementById("studentName").value,
    messId: "Annapurna Mess", // ⚠️ ideally should be dynamic ID
    rating: Number(document.getElementById("rating").value),
    comment: document.getElementById("comment").value
  };

  try {

    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });

    const result = await response.json();

    if (result.success) {
      alert("Review submitted successfully 🚀");
      document.getElementById("reviewForm").reset();
    } else {
      alert(result.message || "Failed to submit review");
    }

  } catch (error) {
    console.log("Review error:", error);
    alert("Server error. Try again later.");
  }

});