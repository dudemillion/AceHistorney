// Variables
const text1 = document.getElementById("para1");
const text2 = document.getElementById("para2");
const text3 = document.getElementById("para3");
const button1 = document.getElementById("but1");
const button2 = document.getElementById("but2");
const button3 = document.getElementById("but3");
const extrabutton = document.getElementById("extrabut");
extrabutton.hidden = true;
const start = document.getElementById("start");
const visual = document.getElementById("visual");
const bgm = document.getElementById("bgm");
const objectionAudio = document.getElementById("objectionAudio");
const gavel = document.getElementById("gavel");
const testimony1 = document.getElementById("testimony1");
const testimony2 = document.getElementById("testimony2");
const contradiction1 = document.getElementById("contradiction1");
const contradiction2 = document.getElementById("contradiction2");
const finalpush = document.getElementById("finalpush");
const victory = document.getElementById("victory");
const soundButton = document.getElementById("sound");
const tape = document.getElementById("tape");
const inputSection = document.getElementById("inputSection");
const inputPrompt = document.getElementById("inputPrompt");
const playerInput = document.getElementById("playerInput");
const submitInput = document.getElementById("submitInput");
let testimonyPhase = 1;
let currentTrack = null;
let soundEnabled = false;
tape.hidden = true;
let chargesRead = false;
let talkedToClient = false;
let inspectedEvidence = false;
let evidence = [];
const evidenceNames = {
    "teabags": "Tea Bags",
    "security tape": "Security Tape",
    "lantern log": "Lantern Duty Log"
};
const evidenceDescriptions = {
    "teabags": "Tea Bags — Collected from one of the destroyed crates at Griffin's Wharf.",
    "security tape": "Security Tape — Harbor footage from the night of the incident showing Elias at the dock.",
    "lantern log": "Lantern Duty Log — A record showing the harbor lanterns were extinguished at 6:00 PM."
};
let ignoreClick = false;
let argued = false;
let reputation = 3
let statementIndex = 0
let revisedStatementIndex = 0;
let popup = document.getElementById("objection");
const objectionWrap = document.getElementById("objectionWrap");
const testimony = [
    "I was stationed at Griffin's Wharf that night, keeping an eye on the harbor...",
    "Late in the evening, I witnessed a mob of people approaching the ships.",
    "I clearly saw the defendant, Elias Parker, throwing crates of tea into the harbor!",
    "There's no doubt in my mind about it!"
]
const revisedTestimony = [
    "Okay, okay, I may not have seen the exact moment the tea hit the water...",
    "But I definitely saw the defendant standing near the crates before they were destroyed.",
    "The view was completely clear, and well lit. Enough so that I could see the defendant's face.",
    "I know it was him!"
];
bgm.volume = 0.05;
objectionAudio.volume = 0.05;
gavel.volume = 0.05;
testimony1.volume = 0.05;
testimony2.volume = 0.05;
contradiction1.volume = 0.05;
contradiction2.volume = 0.05;
finalpush.volume = 0.05;
victory.volume = 0.05;


const blip = new Audio("audio/speak.wav");
blip.volume = 0.05;

let typing = false;
let fullText = "";
let currentIndex = 0;
let typingTimeout;

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
function setScene(p1 = "", p2 = "", p3 = "", b1 = "", b2 = "", b3 = "", img = "", a1 = null, a2 = null, a3 = null) {
    if(p1) {
        typeText(text1, p1, 40);
    } else {
        text1.innerHTML = p1;
    }
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

// submit button event listener
submitInput.addEventListener("click", handleInputAnswer);

// keydown event to finish typing
document.addEventListener("keydown", function(e) {
    if (e.key === " " && typing) {
        finishTyping();
    }
});

visual.addEventListener("mouseover", function() {
    visual.style.filter = "brightness(1.15)";
});

visual.addEventListener("mouseout", function() {
    visual.style.filter = "brightness(1)";
});

// Mute/unmute toggles for the music
function toggleSound() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        soundButton.src = "media/sound.png";
        if (currentTrack) {
            currentTrack.play().catch(() => {});
        }
    } else {
        soundButton.src = "media/nosound.png";
        if (currentTrack) {
            currentTrack.pause();
        }
    }
}
// Effect for successful objections
function objectionEffect() {
    objectionWrap.classList.remove("show-objection");
    void objectionWrap.offsetWidth;
    objectionWrap.classList.add("show-objection");
    document.body.classList.add("shake");
    playSfx(objectionAudio);
    setTimeout(() => {
        objectionWrap.classList.remove("show-objection");
        document.body.classList.remove("shake");
    }, 900);
}

// show input box
function showInputChallenge(promptText) {
    inputSection.hidden = false;
    inputPrompt.textContent = promptText;
    playerInput.value = "";
    playerInput.focus();
}

// hide input box
function hideInputChallenge() {
    inputSection.hidden = true;
    inputPrompt.textContent = "";
    playerInput.value = "";
}

// Music handlers
function playTrack(track, loop = true) {
    if (currentTrack && currentTrack !== track) {
        currentTrack.pause();
        currentTrack.currentTime = 0;
    }
    currentTrack = track;
    currentTrack.loop = loop;
    if (soundEnabled) {
        try {
            currentTrack.play().catch(() => {});
        } catch (err) {
            console.error("Track failed to play:", err);
        }
    }
}

// stops music tracks
function stopTrack() {
    if (currentTrack) {
        currentTrack.pause();
        currentTrack.currentTime = 0;
    }
    currentTrack = null;
}

// SFX player
function playSfx(sound) {
    if (!soundEnabled) {
        return;
    }
    try {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    } catch (err) {
        console.error("SFX failed to play:", err);
    }
}

// reviews evidence by looping through the evidence array and showing the descriptions of each item
function reviewEvidence() {
    ignoreClick = true;
    extrabutton.hidden = true;

    let evidenceList = "";
    for (let i = 0; i < evidence.length; i++) {
        const item = evidence[i];
        evidenceList += `<b>${evidenceNames[item]}</b><br>${evidenceDescriptions[item]}<br><br>`;
    }
    setScene(
        "You open your evidence folder and review the items collected from the scene.",
        evidenceList,
        "One of these may expose a contradiction in the witness testimony.",
        "Return to testimony",
        "",
        "",
        "media/reviewevidence.png",
        returnToCurrentTestimony
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

// returns to the current testimony based on the testimonyPhase variable
function returnToCurrentTestimony() {
    if (testimonyPhase === 2) {
        showrevisedstatement();
    } else {
        showStatement();
    }
}

// event listener for the extra button to review evidence
extrabutton.addEventListener("click", reviewEvidence);

// checks players input if its correect or not
function handleInputAnswer() {
    const answer = playerInput.value.trim().toLowerCase();

    if (answer === "griffin's wharf" || answer === "griffins wharf") {
        hideInputChallenge();
        setScene(
            "'Exactly, Your Honor.'",
            "You answer without hesitation: 'The incident took place at Griffin's Wharf.'",
            "The court accepts your response and seems satisfied with the case.",
            "Continue",
            "",
            "",
            "media/telljudge.png",
            judgeverdictbuild
        );
    } else {
        reputation--;
        if (reputation <= 0) {
            hideInputChallenge();
            mistrialEnding();
        } else {
            text3.innerHTML = `Incorrect. <br><br><i>-1 Reputation (Remaining: ${reputation})</i>`;
        }
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
    playTrack(bgm);
    if (chargesRead && talkedToClient && inspectedEvidence) {
        setScene(
            "You feel ready for the trial. You have everything you need. Just... breathe.",
            "You look towards the prosecutor for the case, Millennia Edgeworth. He seems... awfully calm. You feel he might have some ace up his sleeve; this might not go as well as you planned it.",
            "You stand there, waiting for the trial to begin. It's almost time.",
            "",
            "Start Trial",
            "",
            "media/lookpros.png",
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
        "media/talkclient.png",
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
        "You also find a casette tape. This is the security footage on the night of the incident. You vaguely remember the contents of the tape; The defendant was at the dock, and you know that for certain.",
        "Read Charges",
        "Talk to client",
        chargesRead && inspectedEvidence && talkedToClient ? "I'm ready." : "Return",
        "media/reviewevidence.png",
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
        "media/judge.png",
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
    objectionEffect();
    setScene(
        "'OBJECTION!'",
        "You exclaim towards the judge, apalled by your sudden and unnecessary response to the case statement.",
        "'My client would never do that!'<br>The judge glares at you, disappointed.<br>The prosecutor says, 'Your Honor, the defense has clearly lost it's mind over this case.'<br><br>'I agree.' The judge replies, 'The defense shall not interrupt me again, lest they require a <b>Guilty</b> charge.<br><br> <i>-1 Reputation</i><br>(Try not to interrupt the Judge during important statements!)",
        "Apologize & Continue",
        "",
        "",
        "media/objection.png",
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
        "media/prosopen.png",
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
        "media/calwit.png",
        startTestimony
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function startTestimony() {
    testimonyPhase = 1;
    playTrack(testimony1);
    statementIndex = 0;
    showStatement();
}
function showStatement() {
    ignoreClick = true;
    extrabutton.hidden = false;
    extrabutton.innerHTML = "Review evidence";
    setScene(
        `"${testimony[statementIndex]}"`,
        "",
        "",
        "Press",
        "Present Evidence",
        "Next Statement",
        "media/witness1.png",
        pressStatement,
        presentEvidence,
        nextStatement
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function nextStatement() {
    statementIndex++;
    if (statementIndex >= testimony.length) {
        statementIndex = 0;
    }
    showStatement();
}
function pressStatement() {
    ignoreClick = true;
    setScene(
        statementIndex === 2 ? "(Wait a second...)<br> 'Are you 100% certain you saw my client throwing that tea into the harbor?'" : "You lean forward.",
        statementIndex === 2 ? "'I-I don't know what you mean. Of course I did!'" 
            : statementIndex === 0 ? "Are you sure you were stationed specifically at Griffin's Wharf?" 
            : statementIndex === 1 ? "If there was a mob of people, how can you be so certain my client was present?" 
            : "'Are you absolutely certain about what you saw that night?'",
        statementIndex === 2 ? "(Interesting...)" 
            : statementIndex === 0 ? "W-what? Of course I was!" 
            : statementIndex === 1 ? "I-I saw him! I know I did!"
            : "Wilkes hesitates, then nods nervously. 'Y-Yes! I believe so!'",
        "Return to testimony",
        "",
        "",
        "media/witnessscared.png",
        showStatement
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function presentEvidence() {
    ignoreClick = true;
    setScene(
        "(What evidence will you present?)",
        "",
        "",
        "Teabags",
        "Security Tape",
        "Return to testimony",
        "media/reviewevidence.png",
        wrongEvidence,
        statementIndex === 2 ? objection : wrongEvidence,
        testimonyPhase === 2 ? showrevisedstatement : showStatement
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function objection() {
    extrabutton.hidden = true;
    playTrack(contradiction1);
    objectionEffect();
    ignoreClick = true;
    setTimeout(() => {
        setScene(
            "You slam your desk.",
            "'Are you absolutely certain you saw my client throwing that tea into the harbor?'",
            "The witness hesitates, then stutters, 'I-I... I'm pretty sure... I-I think I did...'",
            "Continue",
            "",
            "",
            "media/aftercrtv.png",
            objectioncont
        );
    }, 700);
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function objectioncont() {
    ignoreClick = true;
    playTrack(contradiction1);
    setScene(
        "'Well then, how can you explain THIS?'",
        "You slam the cassette tape onto the desk.",
        "'This tape shows my client at the dock, but not throwing any tea into the harbor. How can you be so sure you saw him do that?'",
        "Continue",
        "",
        "",
        "media/casette.png",
        witnesssurpise
    )
}
function wrongEvidence() {
    ignoreClick = true;
    reputation--;
    objectionEffect();
    if (reputation === 0) {
        stopTrack();
        setScene(
            "'OBJECTION!'",
            "You present the evidence... but it doesn't contradict the testimony.",
            "The judge has had enough, and feels ready to deliver a verdict.<br><br><span style='color: red; font-size: 50px;'><b>Guilty.</b></span><br><br>You have lost the case.",
            "",
            "",
            "",
            "media/judge.png",
        );
    } else {
    setScene(
        "'OBJECTION!'",
        "You present the evidence... but it doesn't contradict the testimony.",
        `The judge frowns.<br> 'What does this have to do with anything?'<br>'You reply, 'Err... whoops.' <br><br><i>-1 Reputation (Remaining: ${reputation})</i>`,
        "Try again",
        "",
        "",
        "media/mistake.png",
        showStatement
    );
    }
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function witnesssurpise() {
    ignoreClick = true;
    setScene(
        "The witness is taken aback by your evidence, and is at a loss for words.",
        "<span style='color: #948a35'>'Wh... Ahhh... Um... '</span>",
        "<span style='color: #4287f5'>You add on, 'What's the matter? Tea got your tongue?'</span>",
        "Continue",
        "",
        "",
        "media/witnessscared.png",
        prosrebut
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function prosrebut() {
    ignoreClick = true;
    objectionEffect()
    setTimeout(() => {
        setScene(
            "'Objection.'",
            "<span style='color: #f54040;'>Your Honor, we haven't even viewed the contents of the tape. How can we so easily believe that this tape is exactly what the defense claims it is?</span>",
            "The judge replies, <span style='color: #f5af2f;'>'This is true. Mr. Rights, if you will, please present to the courtroom the contents of this tape.'</span>",
            "Present tape",
            "",
            "",
            "media/proscontent.png",
            tapepresentation
        )
    }, 700);
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function tapepresentation() {
    ignoreClick = true;
    setScene(
        "'Gladly.'",
        "You slot the cassette tape into the provided CRTV and grab the remote.",
        "Everyone in the courtroom is watching, full of tension.",
        "Play",
        "",
        "",
        "media/tapein.png",
        playtape
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

// i couldnt finish the tape
function playtape() {
    stopTrack();
    setScene();
    visual.hidden = true;
    tape.hidden = false;
    setTimeout(() => {
        setScene("", "", "", "Continue", "", "", "", explainvideo);
    }, 5000);
}
function explainvideo() {
    ignoreClick = true;
    tape.hidden = true;
    visual.hidden = false;
    playTrack(contradiction1);
    setScene(
        "'As you can clearly see in this tape, my client is most obviously not even near the ships where the incident happened!'",
        "'Easily, my client is innocent. This tape proves his innocence.'",
        "The witness is staring, mouth agape, at a loss for words.",
        "Continue",
        "",
        "",
        "media/aftercrtv.png",
        timestamphold
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function timestamphold() {
    ignoreClick = true;
    popup.src = "media/holdit.webp";
    stopTrack(testimony1);
    objectionEffect();
    setScene(
        "'Hold it.'",
        "The prosecutor looks at the tape, and then back at you. He realizes something, then looks at you smugly.<br><br>'Mr. Rights, I believe you have made a crucial mistake.'",
        "The prosecutor continues, 'There is no timestamp on this tape. How can we be sure this tape is from the night of the incident?'",
        "Continue",
        "",
        "",
        "media/smugpros.png",
        timestamphold2
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function timestamphold2() {
    ignoreClick = true;
    setScene(
        "(Shoot! I forgot to check the timestamp on the tape! I need to find a way to prove this tape is from the night of the incident.)",
        "'Mr. Wrights. The prosecution has made a valid point. Can you prove this tape is from the night of the incident?'",
        "The judge looks at you, waiting for your response.<br><br>(Come on! Think! Is there a way to prove this tape is from the night of the incident?)",
        "I can't prove it.",
        "I can prove it.",
        "",
        "media/thinkdef.png",
        timestampholdfail,
        timestampholdsuccess
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function timestampholdfail() {
    ignoreClick = true;
    setScene(
        "'I can't prove it.'",
        "The judge replies, 'Then the court will have to void this evidence. I will have to consider the case without it, and the prosecution's case is quite strong. Is there any further evidence you wish to present?'",
        "'I... uhm... (Dang it! There's no evidence to prove it!)<br><br>After a long pause, you say, 'Your Honor, the defense has no further evidence to present.'",
        "Continue",
        "",
        "",
        "media/mistake.png",
        casefail
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function timestampholdsuccess() {
    ignoreClick = true;
    setScene(
        "'I can prove it.'",
        "'Really then? Then explain to the court how you can prove this claim.'",
        "The prosecutor smirks at you, confident that you have no way to prove it. You know you have to think fast, and find a way to prove this tape is from the night of the incident.",
        "Wait!",
        "",
        "",
        "media/objection.png",
        timestampholdsuccess2
    )
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function casefail() {
    ignoreClick = true;
    setScene(
        "'I apologize, Your Honor.'",
        "The judge glares at you, disappointed. 'This court has heard enough. The defendant is hereby found <span style='color: red; font-size: 50px;'><b>Guilty</b></span> of the charges against him.'",
        "You have lost the case.",
        "",
        "",
        "",
        "media/judge.png",
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}
function timestampholdsuccess2() {
    playTrack(contradiction1);
    ignoreClick = true;
    popup.src = "media/holdit.png";
    objectionEffect();
    setScene(
        "'Hold it!'",
        "You slam your hands onto the desk. 'The tape itself may not contain a timestamp... but it does contain something just as useful.'",
        "The judge leans forward. 'And what, exactly, would that be?'",
        "Present evidence",
        "",
        "",
        "media/slamdesk.png",
        teabaglink
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function teabaglink() {
    ignoreClick = true;
    setScene(
        "'These tea leaves, Your Honor.'",
        "You hold up the evidence bag. 'These were collected from one of the damaged crates at Griffin's Wharf after the incident.'",
        "'And in the footage, one can clearly see a crate already split open, spilling the same type of tea onto the dock.'",
        "Continue",
        "",
        "",
        "media/teaevidence.png",
        teabagexplain
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function teabagexplain() {
    ignoreClick = true;
    setScene(
        "You point toward the screen.",
        "'That damage did not exist before the harbor disturbance. The crate shown in this footage is already broken open, and tea is already spilling from it.'",
        "'This means the recording could only have been taken during or immediately after the destruction of the tea that night.'",
        "Continue",
        "",
        "",
        "media/telljudge.png",
        judgeacceptslink
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function judgeacceptslink() {
    ignoreClick = true;
    setScene(
        "The judge strokes his chin thoughtfully.",
        "'Hm. So while the tape does not show the hour, the state of the cargo shown within it does align with the physical evidence collected from the crime scene.'",
        "The prosecutor's smug expression falters for the first time.",
        "Continue",
        "",
        "",
        "media/judgethink.png",
        witnessCornered
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function witnessCornered() {
    ignoreClick = true;
    setScene(
        "'If this tape truly shows the harbor during the incident,' you say, 'then my client was present... but not handling the tea.'",
        "You point at Thomas Wilkes. 'So I ask again: how could you have seen Elias Parker throwing crates into the harbor?'",
        "The witness begins to tremble.",
        "Continue",
        "",
        "",
        "media/askwitness.png",
        startrevisedtestimony1
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function startrevisedtestimony1() {
    ignoreClick = true;
    if (!evidence.includes("lantern log")) {
    evidence.push("lantern log");
    }
    setScene(
        "The witness wipes sweat from his brow and quickly changes his story.",
        "<span style='color: #948a35;'>'A-Alright... maybe I did not see the exact moment the tea was thrown.'</span>",
        "<span style='color: #948a35;'>'But I still saw the defendant near the crates before they were destroyed!'</span><br><br>(During the altercation over the tape, the bailiff retrieves the harbor manintenance log from the court records and submits it to the judge.)",
        "Continue",
        "",
        "",
        "media/witnessscared.png",
        startrevisedtestimony2
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function startrevisedtestimony2() {
    testimonyPhase = 2;
    playTrack(testimony2);
    revisedStatementIndex = 0;
    showrevisedstatement();
}

function showrevisedstatement() {
    ignoreClick = true;
    extrabutton.hidden = false;
    extrabutton.innerHTML = "Review evidence";
    setScene(
        `"${revisedTestimony[revisedStatementIndex]}"`,
        "",
        "",
        "Press",
        "Present Evidence",
        "Next Statement",
        "media/witnessscared.png",
        pressrevisedstatement,
        presentrevisedevidence,
        nextrevisedstatement
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function nextrevisedstatement() {
    revisedStatementIndex++;
    if (revisedStatementIndex >= revisedTestimony.length) {
        revisedStatementIndex = 0;
    }
    showrevisedstatement();
}

function pressrevisedstatement() {
    ignoreClick = true;
    setScene(
        revisedStatementIndex === 2 ? "'You claim the lanterns gave enough light for a clear view?'" : "You press the witness for more detail.",
        revisedStatementIndex === 0 ? "<span style='color: #948a35;'>I-I was mistaken about that exact part, alright?</span>" : revisedStatementIndex === 1 ? "<span style='color: #948a35;'>He was near the crates! I know he was!</span>" : revisedStatementIndex === 2 ? "<span style='color: #948a35;'>O-Of course! The dock was lit well enough for me to see!</span>" : "<span style='color: #948a35;'>I know what I saw! I won't change my answer again!</span>", 
        revisedStatementIndex === 2 ? "(The lanterns... wait. That's it.)" : "",
        "Return to testimony",
        "",
        "",
        "media/witnessscared.png",
        showrevisedstatement
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function presentrevisedevidence() {
    ignoreClick = true;
    setScene(
        "(What evidence will you present?)",
        "",
        "",
        "Teabags",
        "Lantern Log",
        "Return to testimony",
        "media/witnessscared.png",
        wrongEvidence,
        revisedStatementIndex === 2 ? lanternlogobjection : wrongEvidence,
        showrevisedstatement
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function lanternlogobjection() {
    popup.src = "media/objection.png";
    playTrack(contradiction2);
    objectionEffect();
    extrabutton.hidden = true;
    setTimeout(() => {
        setScene(
            "'OBJECTION!'",
            "You raise a folded document high above your desk.",
            "'This Lantern Duty Log states that the harbor lanterns were extinguished before the disturbance began. If that is true, then the dock was far too dark for this witness to identify anyone clearly!'",
            "Continue",
            "",
            "",
            "media/dcument.png",
            lanternlogexplain
        );
    }, 700);
}

function lanternlogexplain() {
    ignoreClick = true;
    setScene(
        "The judge adjusts his glasses and reads the document carefully.",
        "'According to this record... the lanterns along Griffin's Wharf were put out earlier that evening, at 6:00 PM. The disturbance began at 7:00 PM, meaning the dock was in complete darkness.'",
        "You point toward the witness. 'So tell me, Thomas Wilkes... how exactly did you recognize Elias Parker in the dark?'",
        "Continue",
        "",
        "",
        "media/eaddoc.png",
        revisedwitnessbreakdown
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function revisedwitnessbreakdown() {
    ignoreClick = true;
    setScene(
        "The witness recoils, his face turning pale.",
        "<span style='color: #948a35;'>'I... I... maybe the moonlight...! Maybe I only thought I saw him clearly...!'</span>",
        "The courtroom bursts into murmurs as the witness begins to fall apart.",
        "Continue",
        "",
        "",
        "media/witnessscared.png",
        prosecutordamagecontrol
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function prosecutordamagecontrol() {
    ignoreClick = true;
    objectionEffect();
    setScene(
        "'Objection.'",
        "<span style='color: #f54040;'>Even if the witness was mistaken about visibility, the defendant still admits he was present at the harbor that night.</span>",
        "<span style='color: #f54040;'>Presence alone may not prove his guilt, but it certainly does not prove his innocence!</span>",
        "Continue",
        "",
        "",
        "media/prosopen.png",
        finalPushIntro
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalPushIntro() {
    ignoreClick = true;
    setScene(
        "(He's right... being there doesn't automatically make Elias innocent.)",
        "(But the prosecution still has no proof that Elias ever touched the tea.)",
        "This is it. One final push should break the case open.",
        "Continue",
        "",
        "",
        "media/thinkdef.png",
        finalreasoning
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalreasoning() {
    ignoreClick = true;
    popup.src = "media/holdit.png";
    playTrack(finalpush);
    objectionEffect();
    setScene(
        "'HOLD IT!' 'Your Honor, the prosecution's entire case rests on one assumption.'",
        "'That is that Elias Parker was present at Griffin's Wharf, he must have taken part in the destruction of the tea.'",
        "'But presence is not proof of guilt!'",
        "Continue",
        "",
        "",
        "media/objection.png",
        finalreasoning2
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalreasoning2() {
    ignoreClick = true;
    setScene(
        "'The witness has now admitted he could not clearly identify my client.'",
        "'The tape shows my client standing at the dock, but never handling a single crate.'",
        "'And the prosecution has failed to produce any physical evidence tying Elias Parker to the tea itself.'",
        "Continue",
        "",
        "",
        "media/objection.png",
        finalreasoning3
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalreasoning3() {
    ignoreClick = true;
    setScene(
        "You slam your hands onto the desk one last time.",
        "'This court has heard plenty of suspicion and assumption, but it never heard solid proof!'",
        "'And without proof, the Crown has no case against Elias Parker.'",
        "Continue",
        "",
        "",
        "media/slamdesk.png",
        prosecutorlastrebut
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function prosecutorlastrebut() {
    ignoreClick = true;
    objectionEffect();
    setScene(
        "'Objection.'",
        "<span style='color: #f54040;'>The defendant still admits he was at the harbor that night. That alone is suspicious.</span>",
        "<span style='color: #f54040;'>Surely the defense cannot expect this court to ignore that fact.</span>",
        "Continue",
        "",
        "",
        "media/prosopen.png",
        finalanswer
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalanswer() {
    ignoreClick = true;
    popup.src = "media/holdit.png";
    objectionEffect();
    setScene(
        "'HOLD IT! Despite the assumptions and suspicions, the prosecution has failed to provide any evidence that my client is guilty.'",
        "'The law states that the judge must decide based on evidence, not on suspicion!'",
        "'And the evidence at hand does not prove Elias Parker destroyed the tea.'",
        "Answer the judge",
        "",
        "",
        "media/objection.png",
        finalquestion
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function finalquestion() {
    setScene(
        "The judge looks at you one last time.",
        "'Very well, defense. Then answer this clearly for the court.'",
        "'At what harbor location did this incident take place?'",
        "",
        "",
        "",
        "media/judgeask.png"
    );
    showInputChallenge("Type the harbor location.");
}

function judgeverdictbuild() {
    ignoreClick = true;
    stopTrack();
    playSfx(gavel);
    setScene(
        "'ORDER! ORDER IN THE COURT!', the Judge exclaims. The courtroom falls silent.",
        "The judge lowers his head, thinking carefully over everything that has been presented.",
        "'This court must determine whether the prosecution has proven the defendant's guilt beyond reasonable doubt.'",
        "Continue",
        "",
        "",
        "media/judgethink.png",
        verdict
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

// if player enters wrong answer and reputation goes to 0, the judge declares a mistrial
function mistrialEnding() {
    hideInputChallenge();
    stopTrack();
    setScene(
        "'Hmm... it seems this court cannot reach a clean conclusion from the evidence presented today.'",
        "The judge strikes the gavel. 'The matter is suspended pending further review.'",
        "<span style='color: gold; font-size: 50px;'><b>Mistrial.</b></span>",
        "",
        "",
        "",
        "media/judge.png"
    );
}

function verdict() {
    ignoreClick = true;
    playTrack(victory);
    setScene(
        "'After reviewing the testimony and evidence presented before this court...'",
        "'The prosecution has failed to prove that Elias Parker directly participated in the destruction of East India Company property.'",
        "<span style='color: #4cff4c; font-size: 50px;'><b>Not Guilty.</b></span>",
        "Finish",
        "",
        "",
        "media/judge.png",
        endingScene
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}

function endingScene() {
    ignoreClick = true;
    setScene(
        "Elias exhales shakily, as though he had been holding his breath the entire trial.",
        "'Thank you,' he whispers.",
        "The courtroom slowly empties, but you know one thing for certain: today, the Crown did not get the easy conviction it wanted.",
        "",
        "",
        "",
        "media/hug.png"
    );
    setTimeout(() => {
        ignoreClick = false;
    }, 100);
}