// Only run if the imageForm exists on the page
const imageForm = document.getElementById("imageForm");

if (imageForm) {
  imageForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const formData = new FormData();
    const imageFile = document.getElementById("image").files[0];

    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }

    formData.append("image", imageFile);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData
    });

    const result = await response.text();
    alert(result);

  });
}