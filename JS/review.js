document.getElementById("reviewForm")
.addEventListener("submit",
async function(e){

e.preventDefault();

const reviewData = {

studentName:
document.getElementById("studentName").value,

messName:"Annapurna Mess",

rating:
document.getElementById("rating").value,

comment:
document.getElementById("comment").value

};

const response = await fetch(
"http://localhost:5000/review",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(reviewData)

});

const result =
await response.text();

alert(result);

});