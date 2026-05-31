const API_URL = "https://messmate-1-j4dn.onrender.com";

// Only run if the imageForm exists on the page
const imageForm = document.getElementById("imageForm");

if (imageForm) {
  imageForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const formData = new FormData();
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }

    formData.append("image", imageFile);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert("Image uploaded successfully 🚀");
        console.log("Image URL:", result.imageUrl);
      } else {
        alert(result.message || "Upload failed");
      }

    } catch (error) {
      console.log(error);
      alert("Error connecting to server");
    }

  });
}