// ==========================================
// FocusXP Pro - Full Stable Version
// ==========================================
let guiltActive = false;
let currentSessionMinutes = 0;
let twentyMinuteInterval = null;
chrome.storage.local.get("blockedSites", (data) => {

    const distractingSites = data.blockedSites || [];

    if (distractingSites.some(site =>
        window.location.hostname.includes(site))) {

        showInterceptionScreen();
    }

});

let noClickCount = 0;


// ==========================================
// INTERCEPTION SCREEN
// ==========================================
function showInterceptionScreen() {

    const overlay = document.createElement("div");

    overlay.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:#0d0d0d;
            color:white;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            z-index:999999;
            font-family:Arial;
            text-align:center;
        ">
            <h1>Why are you here?</h1>
            <input id="intent" placeholder="Type your intention..."
                   style="padding:10px;margin:10px;width:250px;border-radius:10px;" />

            <h2>How much time will this take?</h2>
            <input id="timeInput" type="number" min="1"
                   placeholder="Minutes..."
                   style="padding:10px;margin:10px;width:250px;border-radius:10px;" />

            <button id="startBtn"
                    style="padding:10px;margin:10px;border-radius:10px;">
                Start
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("startBtn").onclick = () => {

        const intention = document.getElementById("intent").value.trim();
        const minutes = parseInt(document.getElementById("timeInput").value);

        if (!intention) {
            alert("Please type your intention.");
            return;
        }

        if (!minutes || minutes <= 0) {
            alert("Enter valid number of minutes.");
            return;
        }

        overlay.remove();
        startMonitoring(minutes);
    };
}

// ==========================================
// MONITORING
// ==========================================
function startMonitoring(minutes) {
    currentSessionMinutes = minutes;
    const startTime = Date.now();

    // Start user-defined timer
    setTimeout(() => {
        askCompletion();
    }, minutes * 60 * 1000);

   

   

    // Apply YouTube thumbnail blackout if on YouTube
    if (window.location.hostname.includes("youtube.com")) {
        startThumbnailBlackout();
    }
}

// ==========================================
// COMPLETION CHECK
// ==========================================
function askCompletion() {

    const overlay = document.createElement("div");

    overlay.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:black;
            color:white;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            z-index:999999;
            font-family:Arial;
            text-align:center;
        ">
            <h2>Did you find what you were looking for?</h2>
            <button id="yesBtn" style="padding:10px;margin:10px;">Yes</button>
            <button id="noBtn" style="padding:10px;margin:10px;">No</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("yesBtn").onclick = () => {

    overlay.remove();

    // Start repeating 20-minute completion cycle
    if (!twentyMinuteInterval) {

        twentyMinuteInterval = setInterval(() => {
            askCompletion();
        }, 20 * 60 * 1000);
    }
};

    document.getElementById("noBtn").onclick = () => {

    overlay.remove();

    noClickCount++;

    if (noClickCount >= 3) {
    startGlitch();
    noClickCount = 0;
} else {
    showGuiltOverlay();

    // Add close button during guilt phase
    setTimeout(() => {
        addDisciplineCloseButton();
    }, 100);
};
};
}

// ==========================================
// GUILT OVERLAY
// ==========================================
function showGuiltOverlay() {

    const overlay = document.createElement("div");

    const messages = [
        "Still scrolling? Exactly.",
        "This is why nothing changes.",
        "You don’t lack time. You waste it.",
        "Another hour you’ll never get back.",
        "Your goals feel ignored.",
        "This is comfort. Not progress.",
        "You said you wanted better.",
        "Discipline is doing it anyway.",
        "You’re delaying your own glow-up.",
        "Your future is watching.",
        "This is the easy choice.",
        "Hard now or hard later.",
        "You’re feeding distraction.",
        "This won’t fix your life.",
        "You know you should stop.",
        "Enough is enough.",
        "Close it. Now.",
        "You’re stronger than a screen.",
        "You don’t need this.",
        "Act like the person you want to become."
    ];

    const randomMessage = messages[
        Math.floor(Math.random() * messages.length)
    ];

    overlay.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:black;
            color:red;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            z-index:999999;
            font-family:Arial;
            text-align:center;
            padding:20px;
        ">
            <h1 style="font-size:28px;">${randomMessage}</h1>
            <h2 id="countdown" style="margin-top:20px;">10</h2>
        </div>
    `;

    document.body.appendChild(overlay);
    guiltActive = true;
    let time = 10;

    const interval = setInterval(() => {

        time--;
        document.getElementById("countdown").innerText = time;

        if (time <= 0) {
            clearInterval(interval);
            overlay.remove();
            guiltActive = false;
        }

    }, 1000);
}


function startThumbnailBlackout() {

    function blackoutThumbnails() {

        // Blacken thumbnail images
        const images = document.querySelectorAll("img");

        images.forEach(img => {
            if (img.src && img.src.includes("ytimg.com")) {
                img.style.filter = "brightness(0)";
            }
        });

        // Target ONLY hover preview videos
        const previewVideos = document.querySelectorAll(
            "ytd-moving-thumbnail-renderer video"
        );

        previewVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    setInterval(blackoutThumbnails, 1500);
}
function startGlitch() {

    const glitchOverlay = document.createElement("div");

    glitchOverlay.innerHTML = `
        <div style="
            position:fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            background:black;
            z-index:999999;
        "></div>
    `;

    document.body.appendChild(glitchOverlay);

    const glitchInterval = setInterval(() => {

        document.body.style.filter =
            Math.random() > 0.5
                ? "contrast(200%) hue-rotate(90deg)"
                : "invert(1)";

        document.body.style.transform =
            Math.random() > 0.5
                ? "translateX(5px)"
                : "translateX(-5px)";

    }, 100);

    // Stop glitch after 60 seconds
    setTimeout(() => {

        clearInterval(glitchInterval);
        document.body.style.filter = "none";
        document.body.style.transform = "none";
        glitchOverlay.remove();

    }, 60000);
}
function addDisciplineCloseButton() {

    const closeBtn = document.createElement("button");

    closeBtn.innerText = "Close Site (+10 XP)";
    closeBtn.style.position = "fixed";
    closeBtn.style.bottom = "30px";
    closeBtn.style.left = "50%";
    closeBtn.style.transform = "translateX(-50%)";
    closeBtn.style.padding = "12px 20px";
    closeBtn.style.background = "#4CAF50";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "8px";
    closeBtn.style.zIndex = "1000000";
    closeBtn.style.cursor = "pointer";

    document.body.appendChild(closeBtn);

    closeBtn.onclick = () => {

    chrome.runtime.sendMessage({
        type: "rewardXP",
        value: 10
    });

    showXPAnimation(10);

    setTimeout(() => {
        chrome.runtime.sendMessage({
            type: "closeCurrentTab"
        });
    }, 1000);
};
}
function showXPAnimation(amount) {

    const xpPopup = document.createElement("div");

    xpPopup.innerText = "+" + amount + " XP";

    xpPopup.style.position = "fixed";
    xpPopup.style.top = "50%";
    xpPopup.style.left = "50%";
    xpPopup.style.transform = "translate(-50%, -50%)";
    xpPopup.style.fontSize = "32px";
    xpPopup.style.fontWeight = "bold";
    xpPopup.style.color = "#2ecc71";
    xpPopup.style.zIndex = "1000000";
    xpPopup.style.transition = "all 1s ease-out";
    xpPopup.style.opacity = "1";

    document.body.appendChild(xpPopup);

    setTimeout(() => {
        xpPopup.style.transform = "translate(-50%, -150px)";
        xpPopup.style.opacity = "0";
    }, 50);

    setTimeout(() => {
        xpPopup.remove();
    }, 1000);
}
