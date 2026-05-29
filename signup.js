
console.log("Signup JS Connected");

document.getElementById("signupForm")
.addEventListener("submit", async function(e){

e.preventDefault();

console.log("Form Submitted");

const userData = {

name:
document.getElementById("name").value,

email:
document.getElementById("email").value,

password:
document.getElementById("password").value

};

console.log(userData);

try{

const response = await fetch(
"http://localhost:5000/signup",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(userData)

});

const result = await response.text();

console.log(result);

alert(result);

}
catch(error){

console.log(error);

alert("Error Connecting Backend");

}

});