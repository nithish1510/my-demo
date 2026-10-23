/* ============================================
   Style 3 JavaScript
   Three features:
   1. Open and close the menu on small screens
   2. Check the contact form before sending
   3. Live clock in the top bar
   ============================================ */


try {
/* ---------- 1. MENU BUTTON ---------- */

var menuBtn = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

// on click, add or remove the class "show"
menuBtn.addEventListener("click", function () {
  menu.classList.toggle("show");
});

// close the menu after a link is clicked
var links = document.querySelectorAll(".menu a");
for (var i = 0; i < links.length; i++) {
  links[i].addEventListener("click", function () {
    menu.classList.remove("show");
  });
}


} catch (err) { console.error(err); }

try {
/* ---------- 2. CONTACT FORM CHECK ---------- */

var form = document.getElementById("contactForm");
var formMsg = document.getElementById("formMsg");
var TO = "nithishprakash1510@gmail.com";
var KEY = "portfolioMessages";   // localStorage keys: sent list + draft
var DRAFT = "portfolioDraft";
var COOLDOWN = 30000;           // 30 s between two messages

var fName = document.getElementById("name");
var fMsg = document.getElementById("message");
var fTrap = document.getElementById("website");

function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v === null ? d : v; } catch (e) { return d; } }

/* ---- email = name + @ + provider + .com ---- */
var emailUser = document.getElementById("emailUser");
var atBtn = document.getElementById("atBtn");
var provBtn = document.getElementById("provBtn");
var otherDom = document.getElementById("otherDom");
var tld = document.getElementById("tld");
var mbMenu = document.getElementById("mbMenu");
var provider = "";          // "gmail", "outlook", ... or "other"

function openMenu(e) { if (e) e.stopPropagation(); mbMenu.classList.add("open"); }
atBtn.addEventListener("click", openMenu);
provBtn.addEventListener("click", openMenu);
document.addEventListener("click", function (e) { if (!mbMenu.contains(e.target)) mbMenu.classList.remove("open"); });

// typing "@" inside the name box opens the provider list too
emailUser.addEventListener("input", function () {
  if (emailUser.value.indexOf("@") !== -1) {
    emailUser.value = emailUser.value.replace(/@.*/, "");
    openMenu();
  }
  saveDraft();
});

function setProvider(p) {
  provider = p;
  atBtn.classList.add("done");
  if (p === "other") {
    provBtn.hidden = true; otherDom.hidden = false; tld.textContent = "";
    otherDom.focus();
  } else {
    otherDom.hidden = true; provBtn.hidden = false;
    provBtn.textContent = p + " \u25BE";
    tld.textContent = ".com";
    tld.classList.remove("pop"); void tld.offsetWidth; tld.classList.add("pop");
  }
  saveDraft();
}
mbMenu.querySelectorAll("button[data-d]").forEach(function (b) {
  b.addEventListener("click", function (e) {
    e.stopPropagation();
    setProvider(b.dataset.d);
    mbMenu.classList.remove("open");
  });
});
otherDom.addEventListener("input", saveDraft);

/* live instructions: shows the step the visitor is on and the final address */
function updateHowto() {
  var step = 1;
  var okUser = /^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(emailUser.value.trim());
  var okProv = provider && (provider !== "other" || otherDom.value.trim().length > 3);
  if (okUser) step = 2;
  if (okUser && okProv) step = 3;
  document.querySelectorAll("#howto .row").forEach(function (r) {
    var s = +r.dataset.s;
    r.className = "row" + (s < step ? " done" : (s === step ? " on" : ""));
  });
  document.getElementById("howFinal").textContent = (okUser && okProv) ? "Your email: " + getEmail() : "";
  mbMenu.querySelectorAll("button[data-d]").forEach(function (b) { b.classList.toggle("sel", b.dataset.d === provider); });
}

function getEmail() {
  var u = emailUser.value.trim();
  if (provider === "other") return u + "@" + otherDom.value.trim();
  return u + "@" + provider + ".com";
}

/* ---- rules: only a proper message can be sent ---- */
function validate() {
  var ok = true;
  var n = fName.value.trim(), e = getEmail(), m = fMsg.value.trim();
  var eName = document.getElementById("eName"), eEmail = document.getElementById("eEmail"), eMsg = document.getElementById("eMsg");
  eName.textContent = eEmail.textContent = eMsg.textContent = "";

  if (!/^[A-Za-z][A-Za-z .'-]{1,39}$/.test(n)) { eName.textContent = "Enter your real name (letters only, 2 to 40)."; ok = false; }
  var u = emailUser.value.trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,39}$/.test(u)) { eEmail.textContent = "Type your email name first (letters, numbers, . _ - and at least 3)."; ok = false; }
  else if (!provider) { eEmail.textContent = "Click the @ and choose your mail (gmail, outlook...)."; ok = false; }
  else if (provider === "other" && !/^[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(otherDom.value.trim())) { eEmail.textContent = "Type the mail domain, like college.edu.in"; ok = false; }
  if (m.length < 10) { eMsg.textContent = "Message is too short (at least 10 characters)."; ok = false; }
  else if (/^(.)\1+$/.test(m.replace(/\s/g, "")) || m.split(/\s+/).length < 2) { eMsg.textContent = "Please write a proper sentence."; ok = false; }
  return ok;
}

/* ---- draft: what you type is kept if you refresh ---- */
var draft = load(DRAFT, {});
fName.value = draft.n || ""; fMsg.value = draft.m || "";
emailUser.value = draft.u || "";
if (draft.p) { setProvider(draft.p); if (draft.p === "other") otherDom.value = draft.o || ""; }
var countEl = document.getElementById("count");
function saveDraft() {
  if (typeof updateHowto === 'function') updateHowto();
  store(DRAFT, { n: fName.value, u: emailUser.value, p: provider, o: otherDom.value, m: fMsg.value });
  countEl.textContent = fMsg.value.length + " / 500";
}
[fName, fMsg].forEach(function (el) { el.addEventListener("input", saveDraft); });
saveDraft();

/* ---- saved messages list ---- */
var sentBox = document.getElementById("sentBox");
var sentList = document.getElementById("sentList");
function renderSent() {
  var list = load(KEY, []);
  sentBox.hidden = list.length === 0;
  sentList.innerHTML = "";
  list.slice().reverse().forEach(function (m) {
    var li = document.createElement("li");
    var b = document.createElement("b");
    b.textContent = m.name + " · " + new Date(m.time).toLocaleString("en-IN");
    var p = document.createElement("span");
    p.textContent = m.message;
    li.appendChild(b); li.appendChild(p);
    sentList.appendChild(li);
  });
}
document.getElementById("clearSent").addEventListener("click", function () { store(KEY, []); renderSent(); });
renderSent();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  formMsg.textContent = "";

  if (fTrap.value !== "") return;                       // bot caught
  if (!validate()) return;

  var last = load("portfolioLast", 0);
  var wait = COOLDOWN - (Date.now() - last);
  if (wait > 0) { formMsg.textContent = "Please wait " + Math.ceil(wait / 1000) + " s before sending another message."; return; }

  var name = fName.value.trim(), email = getEmail(), message = fMsg.value.trim();

  // 1. save it in this browser
  var list = load(KEY, []);
  list.push({ name: name, email: email, message: message, time: Date.now() });
  store(KEY, list.slice(-20));
  store("portfolioLast", Date.now());

  // 2. open the visitor's mail app with a fixed, clean format
  var subject = "Portfolio message from " + name;
  var body = "Hi Nithish,\n\n" + message + "\n\nName: " + name + "\nReply to: " + email;
  window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

  formMsg.textContent = "Saved. Your mail app is opening, press send there to finish.";
  form.reset(); provider = ""; atBtn.classList.remove("done"); provBtn.hidden = false; provBtn.textContent = "pick mail \u25BE"; otherDom.hidden = true; tld.textContent = ""; store(DRAFT, {}); saveDraft(); renderSent();
});


} catch (err) { console.error(err); }

try {
/* ---------- 3. LIVE CLOCK ---------- */

var clock = document.getElementById("clock");

function showTime() {
  var now = new Date();

  // format the time for India (hours and minutes only)
  var time = now.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit"
  });

  clock.textContent = "Coimbatore, " + time;
}

showTime();                    // show it once right away
setInterval(showTime, 1000);   // then update it every second


/* ============================================
   EXTRA FEATURES
   4. Blur typing text
   5. Reveal sections on scroll
   6. Left scroll rail
   7. Projects open on tap (phones)
   8. Email builder
   ============================================ */

} catch (err) { console.error(err); }

try {
/* ---------- 4. BLUR TYPING TEXT ---------- */
var heroName = document.getElementById("heroName");
var nameText = heroName.textContent;
heroName.textContent = "";
for (var c = 0; c < nameText.length; c++) {
  var ch = document.createElement("span");
  ch.className = "ch";
  ch.textContent = nameText[c];
  ch.style.setProperty("--d", (0.35 + c * 0.14) + "s");
  heroName.appendChild(ch);
}
setTimeout(function () { heroName.classList.add("go"); }, 100);

// split sentences into words that fade in one after another
var blurBlocks = document.querySelectorAll(".blur-words");
blurBlocks.forEach(function (el) {
  var words = el.textContent.trim().split(/\s+/);
  el.textContent = "";
  words.forEach(function (w, i) {
    var sp = document.createElement("span");
    sp.className = "w";
    sp.textContent = w + (i < words.length - 1 ? " " : "");
    sp.style.setProperty("--d", (i * 0.045) + "s");
    el.appendChild(sp);
  });
});

} catch (err) { console.error(err); }

try {
/* ---------- 5. REVEAL ON SCROLL ---------- */
document.querySelectorAll(".label, .project, .slider, .mail-builder").forEach(function (el) {
  if (!el.classList.contains("cell")) el.classList.add("reveal");
});

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add("go"); io.unobserve(e.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal, .blur-words").forEach(function (el) {
  if (el.closest(".hero")) { setTimeout(function () { el.classList.add("go"); }, 900); }
  else io.observe(el);
});

} catch (err) { console.error(err); }

try {
/* ---------- 6. LEFT SCROLL RAIL ---------- */
var railFill = document.getElementById("railFill");
var railDot = document.getElementById("railDot");
var railName = document.getElementById("railName");
var railPct = document.getElementById("railPct");
var secs = [["top", "Home"], ["about", "About"], ["skills", "Skills"], ["projects", "Projects"], ["contact", "Contact"]];

var target = 0, shown = 0, lastName = "", lastPct = "", ticking = false;
var railH = 0;

function measure() { railH = railFill.parentElement.clientHeight; }
measure();
window.addEventListener("resize", measure);

function updateTarget() {
  var max = document.documentElement.scrollHeight - window.innerHeight;
  target = max > 0 ? window.scrollY / max : 0;
  var cur = "Home";
  for (var k = 0; k < secs.length; k++) {
    var el = document.getElementById(secs[k][0]);
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) cur = secs[k][1];
  }
  if (cur !== lastName) { railName.textContent = cur; lastName = cur; }
}

// the dot glides towards where the scroll is (smooth, no jumping)
function frame() {
  shown += (target - shown) * 0.14;
  if (Math.abs(target - shown) < 0.0005) shown = target;
  railFill.style.transform = "scaleY(" + shown + ")";
  railDot.style.transform = "translateY(" + (shown * (railH - 34)) + "px) rotate(" + (shown * 2400) + "deg)";
  var pct = ("0" + Math.round(shown * 100)).slice(-2);
  if (pct !== lastPct) { railPct.textContent = pct; lastPct = pct; }
  requestAnimationFrame(frame);
}
window.addEventListener("scroll", updateTarget, { passive: true });
updateTarget();
requestAnimationFrame(frame);

} catch (err) { console.error(err); }

try {
/* ---------- 7. PROJECT ROWS: tap to open on phones ---------- */
document.querySelectorAll(".project").forEach(function (p) {
  p.addEventListener("click", function () { p.classList.toggle("open"); });
});



} catch (err) { console.error(err); }

try {
/* ---------- 9. PHOTO TILT (follows the mouse) ---------- */
var tilt = document.getElementById("tilt");
var tiltCard = document.getElementById("tiltCard");
var glare = document.getElementById("glare");
var tiltFrame = null, tx = 0, ty = 0;

tilt.addEventListener("mousemove", function (e) {
  var r = tilt.getBoundingClientRect();
  var x = (e.clientX - r.left) / r.width;    // 0 to 1
  var y = (e.clientY - r.top) / r.height;
  tx = x; ty = y;
  if (tiltFrame) return;
  tiltFrame = requestAnimationFrame(function () {
    tiltFrame = null;
    var ry = (tx - 0.5) * 28;     // left/right turn
    var rx = (0.5 - ty) * 22;     // up/down turn
    tilt.classList.add("live");
    tiltCard.style.transform = "rotateY(" + ry + "deg) rotateX(" + rx + "deg) rotateZ(0deg) scale(1.04)";
    tiltCard.style.boxShadow = (-ry * 0.8) + "px " + (rx * 0.8 + 14) + "px 0 #111";
    glare.style.setProperty("--gx", (tx * 100) + "%");
    glare.style.setProperty("--gy", (ty * 100) + "%");
  });
});
tilt.addEventListener("mouseleave", function () {
  tilt.classList.remove("live");
  tiltCard.style.transform = "";     // back to the resting tilt
  tiltCard.style.boxShadow = "";
});

} catch (err) { console.error(err); }
