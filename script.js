/* ============================================
   Style 8 JavaScript
   Two features:
   1. Open and close the menu on small screens
   2. Check the contact form before sending
   ============================================ */


/* ---------- 1. MENU BUTTON ---------- */

var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

// on click, add or remove the class "show"
menuBtn.addEventListener("click", function () {
  menu.classList.toggle("show");
});

// close the menu after a link is clicked
var links = document.querySelectorAll(".links a");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    menu.classList.remove("show");
  });
}


/* ---------- 2. CONTACT FORM CHECK ---------- */

var form = document.getElementById("contactForm");
var formMsg = document.getElementById("formMsg");

form.addEventListener("submit", function (event) {

  event.preventDefault(); // stop the page from reloading

  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;

  // any empty box -> warning
  if (name === "" || email === "" || message === "") {
    formMsg.textContent = "Please fill all the fields.";
    formMsg.style.color = "#d93025";
    return;
  }

  // email must contain @
  if (email.indexOf("@") === -1) {
    formMsg.textContent = "Please enter a valid email.";
    formMsg.style.color = "#d93025";
    return;
  }

  // save the message in localStorage (key: "contactMessages")
  try {
    var saved = JSON.parse(localStorage.getItem("contactMessages")) || [];
    saved.push({
      name: name,
      email: email,
      message: message,
      time: new Date().toLocaleString()
    });
    localStorage.setItem("contactMessages", JSON.stringify(saved));
  } catch (e) {
    formMsg.textContent = "Sorry, could not save your message.";
    formMsg.style.color = "#d93025";
    return;
  }

  // all good
  formMsg.textContent = "Thank you, your message has been received.";
  formMsg.style.color = "#1a7f4b";
  form.reset();
});
