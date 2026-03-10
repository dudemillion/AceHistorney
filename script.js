const text1 = document.getElementById("para1");
const text2 = document.getElementById("para2");
const text3 = document.getElementById("para3");
const button1 = document.getElementById("but1");
const button2 = document.getElementById("but2");
const button3 = document.getElementById("but3");
const start = document.getElementById("start");
const visual = document.getElementById("visual");
const bgm = document.getElementById("bgm");
const soundButton = document.getElementById("sound");
let chargesRead = false;
let talkedToClient = false;
let inspectedEvidence = false;
let evidence = [];
let ignoreClick = false;

bgm.volume = 0.05;

const blip = new Audio("audio/speak.wav");
blip.volume = 0.05;

let typing = false;
let fullText = "";
let currentIndex = 0;
let typingTimeout;
let soundEnabled = true;

function playBlip() {
    if (!soundEnabled) return;

    // restart sound quickly for repeated letters
    blip.currentTime = 0;
    blip.play().catch(() => {});
}

function getDelay(char, baseSpeed) {
    if (char === "." || char === "!" || char === "?") {
        return baseSpeed + 220;
    }
    if (char === "," || char === ";" || char === ":") {
        return baseSpeed + 120;
    }
    if (char === "—" || char === "-") {
        return baseSpeed + 100;
    }
    if (char === "\n") {
        return baseSpeed + 180;
    }
    if (char === " ") {
        return baseSpeed;
    }
    return baseSpeed;
}

function typeText(textbox, text, speed = 35) {
    clearTimeout(typingTimeout);

    fullText = text;
    currentIndex = 0;
    textbox.textContent = "";
    typing = true;

    function typeNextChar() {
        if (currentIndex >= fullText.length) {
            typing = false;
            return;
        }

        const char = fullText[currentIndex];
        textbox.textContent += char;
        if (
            char !== " " &&
            char !== "." &&
            char !== "," &&
            char !== "!" &&
            char !== "?" &&
            char !== ";" &&
            char !== ":" &&
            char !== "\n"
        ) {
            playBlip();
        }
        currentIndex++;
        typingTimeout = setTimeout(typeNextChar, getDelay(char, speed));
    }

    typeNextChar();
}
function finishTyping() {
    clearTimeout(typingTimeout);
    text1.textContent = fullText;
    typing = false;
}
function setScene(p1, p2 = "", p3 = "", b1 = "", b2 = "", b3 = "", img = "", a1 = null, a2 = null, a3 = null) {
    typeText(text1, p1, 50);
    text2.textContent = p2;
    text3.textContent = p3;

    button1.textContent = b1;
    button2.textContent = b2;
    button3.textContent = b3;

    if (img) {
        visual.src = img;
    }

    button1.onclick = a1;
    button2.onclick = a2;
    button3.onclick = a3;
}
document.addEventListener("click", () => {
    if (ignoreClick) {
        return;
    }
    if (typing) {
        finishTyping();
    }
});
start.addEventListener("click", function(event) {
    event.stopPropagation();
    startTrial();
});
function toggleSound() { 
    if (bgm.muted) { 
        bgm.muted = false; 
        soundButton.src = "media/sound.png"; 
        bgm.play(); 
    } else { 
        bgm.muted = true; 
        soundButton.src = "media/nosound.png"; 
    }
}
function startTrial() {
    document.getElementById("titlescreen").style.display = "none";
    document.body.classList.add("trial-mode");
    ignoreClick = true;
    setScene(
        "Boston, Massachusetts, December 1773.",
        "The courtroom is filled with tension while waiting for the trial to begin.",
        "Your client, Elias Parker, stands accused of destroying British tea in what is now being called the Boston Tea Party.",
        "Read the charges",
        "Talk to your client",
        "Inspect evidence",
        "media/start.png",
        readCharges
        //talkToClient,
       // inspectEvidence
    );
    button1.removeAttribute("hidden");
    button2.removeAttribute("hidden");
    button3.removeAttribute("hidden");
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function readCharges() {
    chargesRead = true;
    ignoreClick = true;
    setScene(
        "You grab the folder containing the charges against your client from underneath the table.",
        "Elias Parker is accused of participating in the destruction of British tea belonging to the East India Company.",
        "The prosecution claims that your client was seen at Griffin's Wharf on the night of the incident.",
        "Return",
        "Talk to your client",
        "Inspect evidence",
        "media/charges.png",
        startTrial
        //talkToClient,
        //inspectEvidence
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}