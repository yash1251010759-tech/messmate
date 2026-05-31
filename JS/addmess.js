// ===============================
// CONFIG (Backend URL)
// ===============================
const API_URL = "https://messmate-1-j4dn.onrender.com";


// ===============================
// ADD MESS FORM SUBMIT
// ===============================
document.getElementById("messForm")
.addEventListener("submit", async function (e) {

    e.preventDefault();

    const messData = {
        name: document.getElementById("messName").value,
        type: document.getElementById("foodType").value,
        price: document.getElementById("price").value,
        location: document.getElementById("location")?.value || "Not specified",
        description: document.getElementById("description")?.value || "",
        image: document.getElementById("image")?.value || ""
    };

    try {

        const response = await fetch(`${API_URL}/messes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(messData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Mess added successfully 🚀");
            document.getElementById("messForm").reset();
        } else {
            alert(result.message || "Something went wrong");
        }

    } catch (error) {
        console.log("Error:", error);
        alert("Server error. Try again later.");
    }

});