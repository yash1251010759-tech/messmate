document.getElementById("messForm")
.addEventListener("submit",
async function(e){

e.preventDefault();

const messData = {

name:
document.getElementById("messName").value,

foodType:
document.getElementById("foodType").value,

price:
document.getElementById("price").value

};

const response = await fetch(
"http://localhost:5000/addmess",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(messData)

});

const result =
await response.text();

alert(result);

});