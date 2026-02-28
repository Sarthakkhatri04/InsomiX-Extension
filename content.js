// ==========================================
// FocusXP Pro - Full Stable Version
// ==========================================
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

    const startTime = Date.now();

    // Start user-defined timer
    setTimeout(() => {
        askCompletion();
    }, minutes * 60 * 1000);

    // Reward quick exit (< 60 seconds)
    window.addEventListener("beforeunload", () => {

        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        if (timeSpent < 60) {
            chrome.runtime.sendMessage({
                type: "rewardXP",
                value: 100
            });
        }
    });

    rewriteNotifications();

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
        chrome.runtime.sendMessage({ type: "openNewTab" });
    };

    document.getElementById("noBtn").onclick = () => {

    overlay.remove();

    noClickCount++;

    if (noClickCount >= 1) {
        startGlitch();
        noClickCount = 0; // reset after punishment
    } else {
        showGuiltOverlay();
    }
};
}

// ==========================================
// GUILT OVERLAY
// ==========================================
function showGuiltOverlay() {

    const overlay = document.createElement("div");

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
        ">
            <h1>Was it worth it?</h1>
            <h2 id="countdown">10</h2>
        </div>
    `;

    document.body.appendChild(overlay);

    let time = 10;

    const interval = setInterval(() => {

        time--;
        document.getElementById("countdown").innerText = time;

        if (time <= 0) {
            clearInterval(interval);
            overlay.remove();
        }

    }, 1000);
}

// ==========================================
// NOTIFICATION REWRITE
// ==========================================
function rewriteNotifications() {

    document.querySelectorAll("span[class*='notification']").forEach(el => {

        if (el.innerText &&
            el.innerText.toLowerCase().includes("new")) {

            const original = el.innerText;

            chrome.runtime.sendMessage({
                type: "storeNotification",
                text: original
            });

            el.innerText =
                "Small dopamine hits waiting. This can wait 3 hours.";
        }
    });
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
