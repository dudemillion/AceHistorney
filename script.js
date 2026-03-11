// Variables
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
let argued = false;
let reputation = 3

bgm.volume = 0.05;

const blip = new Audio("audio/speak.wav");
blip.volume = 0.05;

let typing = false;
let fullText = "";
let currentIndex = 0;
let typingTimeout;
let soundEnabled = true;

// Text typing sound
function playBlip() {
    if (!soundEnabled) return;

    blip.currentTime = 0;
    blip.play().catch(() => {});
}
// Delays the typing if any punctuation is found
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
// Typing
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
// If the user clicks to skip the typing
function finishTyping() {
    clearTimeout(typingTimeout);
    text1.innerHTML = fullText;
    typing = false;
}
// Main function for story loop, takes 3 texts, 3 buttons texts, image, and button actions
function setScene(p1, p2 = "", p3 = "", b1 = "", b2 = "", b3 = "", img = "", a1 = null, a2 = null, a3 = null) {
    typeText(text1, p1, 40);
    text2.innerHTML = p2;
    text3.innerHTML = p3;

    button1.innerHTML = b1;
    button2.innerHTML = b2;
    button3.innerHTML = b3;

    button1.hidden = !b1;
    button2.hidden = !b2;
    button3.hidden = !b3;

    if (img) {
        visual.src = img;
    }

    button1.onclick = a1;
    button2.onclick = a2;
    button3.onclick = a3;
}
// Prevents other clicks (like on buttons) from automatically skipping the text
document.addEventListener("click", () => {
    if (ignoreClick) {
        return;
    }
    if (typing) {
        finishTyping();
    }
});
// Also another check for other clicks, and the start button's function.
start.addEventListener("click", function(event) {
    event.stopPropagation();
    startTrial();
});
// Mute/unmute toggles for the music
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
// First scene, removes titlescreen and makes everything else come in.
function startTrial() {
    document.getElementById("titlescreen").style.display = "none";
    document.body.classList.add("trial-mode");
    button1.removeAttribute("hidden");
    button2.removeAttribute("hidden");
    button3.removeAttribute("hidden");
    prepScene();
}
function prepScene() {
    ignoreClick = true;

    if (chargesRead && talkedToClient && inspectedEvidence) {
        setScene(
            "You feel ready for the trial. You have everything you need. Just... breathe.",
            "You look towards the prosecutor for the case, Millennia Edgeworth. He seems... awfully calm. You feel he might have some ace up his sleeve; this might not go as well as you planned it.",
            "You stand there, waiting for the trial to begin. It's almost time.",
            "",
            "Start Trial",
            "",
            "media/placeholder.png",
            null,
            begintrial,
            null
        );
    } else {
        setScene(
            "Boston, Massachusetts, December 20th, 1773.",
            "The courtroom is filled with tension while waiting for the trial to begin.",
            "Your client, Elias Parker, stands accused of destroying British tea in what is now being called the Boston Tea Party.",
            "Read the charges",
            "Talk to your client",
            "Inspect evidence",
            "media/start.png",
            readCharges,
            talkToClient,
            inspectEvidence
        );
    }

    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function readCharges() {
    chargesRead = true;
    ignoreClick = true;
    setScene(
        inspectedEvidence ? "After reviewing the evidence, you realize the charges give it proper context. You pull the charge sheet from the folder." : "You grab the folder containing the charges against your client from beneath the table.",
        "Elias Parker is accused of participating in the destruction of British tea belonging to the East India Company.",
        "The prosecution claims that your client was seen at Griffin's Wharf on the night of the incident.",
        chargesRead && inspectedEvidence && talkedToClient ? "I'm ready." : "Return",
        "Talk to your client",
        "Inspect evidence",
        "media/charges.png",
        prepScene,
        talkToClient,
        inspectEvidence
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function talkToClient() {
    talkedToClient = true;
    ignoreClick = true;
    setScene(
        "You get up from your desk and move towards Elias. You hope to gather as much information he will give you, as even the smallest pieces of evidence could count.",
        "You approach Elias and ask him: 'Is there anything more I should know before the trial starts?'",
        "Elias immediately tells you 'I'm gonna be honest, I was at the harbor, but I did not touch the tea! They're lying!' ... You can't help but feel he was at the wrong place at the wrong time.",
        "Read Charges",
        chargesRead && inspectedEvidence && talkedToClient ? "I'm ready." : "Return",
        "Inspect Evidence",
        "media/placeholder.png",
        readCharges,
        prepScene,
        inspectEvidence
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function inspectEvidence() {
    inspectedEvidence = true;
    ignoreClick = true;
    if (evidence.length === 0) {
        evidence.push("teabags");
        evidence.push("security tape");
    }
    setScene(
        chargesRead ? "You open your folder once again and dig deeper to find the evidence collected from the scene of the crime. Knowing the charges, you can start making connections." : "You open your folder and look inside, there being the charges and the evidence. You go straight for the evidence, this is crucial to know before the charges right?",
        "Inside the folder, you find a plastic bag, containing a few teabags. These were collected from one of the crates which were opened and thrown into the harbor.",
        "You also find a casette tape. This is the security footage on the night of the incident. You feel uneasy, you don't think you saw him in the tape, but just one glimpse of his face even touching a crate would most definitely lose you this case.",
        "Read Charges",
        "Talk to client",
        chargesRead && inspectedEvidence && talkedToClient ? "I'm ready." : "Return",
        "media/placeholder.png",
        readCharges,
        talkToClient,  
        prepScene
    )
    setTimeout(() => {
       ignoreClick = false; 
    }, 100);
}
function begintrial() {
    ignoreClick = true;
    setScene(
        argued ? "'I apologize, Your Honor.'" : "'Order! Order in the court!'",
        argued ? "'Thank you.' replies the Judge, 'As I was saying,'" : "The judge strikes his gavel. The jury's murmurs die down as the judge states the case. 'This court will now hear the case of the Crown versus Elias Parker.'",
        "'The defendant stands accused of assisting in the destruction of East India Company tea during the disturbance at Griffin's Wharf.' The prosecution may now make their opening statment.",
        "Listen",
        argued ? "" : "Argue",
        "",
        "media/placeholder.png",
        prosecutorOpening,
        argued ? null : argueevent
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function argueevent() {
    ignoreClick = true;
    argued = true;
    reputation = reputation - 1;
    setScene(
        "'OBJECTION!'",
        "You exclaim towards the judge, apalled by your sudden and unnecessary response to the case statement.",
        "'My client would never do that!'<br>The judge glares at you, disappointed.<br>The prosecutor says, 'Your Honor, the defense has clearly lost it's mind over this case.'<br><br>'I agree.' The judge replies, 'The defense shall not interrupt me again, lest they require a <b>Guilty</b> charge.<br><br> <i>-1 Reputation</i><br>(Try not to interrupt the Judge during important statements!)",
        "Apologize & Continue",
        "",
        "",
        "media/placeholder.png",
        begintrial
    )
    setTimeout(() => {
       ignoreClick = false; 
    }, 100);
}
function prosecutorOpening() {
    ignoreClick = true;
    setScene(
        "'Your Honor, the Crown will demonstrate easily that this case is not complicated in the slightest.'",
        "<span style='color: #f54040;'>'On the night of December 16th, a mob of colonists boarded several merchant ships at Griffin's Wharf and destroyed hundreds of chests and barrels of tea belonging to the East India Company. Among those present was the defendant, Elias Parker.'</span>",
        "<span style='color: #f54040;'>'The Crown will present testimony placing the defendant at the scene and evidence linking him directly to the destuction of British property.'<br><br>'By the end of this trial, it will be obvious the defendant is guilty.'</span>",
        "Continue",
        "",
        "",
        "media/placeholder.png",
        callwitness
    )
    setTimeout(() => {
       ignoreClick = false; 
    }, 100);
}
function callwitness() {
    ignoreClick = true;
    setScene(
        "'The court will now hear testimony from the prosecution's witness.'",
        "<span style='color: #f54040;'>'The prosecution calls upon Thomas Wilkes, a watchman stationed at the harbor on the night of the incident.'</span>",
        "A nervous man steps up to the stand. He seems quite... disturbed? <br> You can't tell what's up with him, but something seems quite fishy here.",
        "Continue",
        "",
        "",
        "media/placeholder.png"
       // witnessintroduction
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}