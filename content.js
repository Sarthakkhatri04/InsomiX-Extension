const distractingSites = ["instagram.com", "youtube.com"];

if (distractingSites.some(site => window.location.href.includes(site))) {
    showInterceptionScreen();
}

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
        ">
            <h1>Why are you here?</h1>
            <input id="intent" placeholder="Type your intention..." style="padding:10px;margin:10px;width:250px; border-radius: 10px;" />
            <button id="startBtn" style="padding:10px; margin: 10px; border-radius: 10px;">Start</button>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("startBtn").onclick = () => {

        const val = document.getElementById("intent").value.trim();

        if (!val) {
            alert("You must type your intention.");
            return;
        }

        overlay.remove();
        startMonitoring();
    };
}

function startMonitoring() {

    let startTime = Date.now();
    let scrolled = false;

    window.addEventListener("scroll", () => {
        scrolled = true;
    });

    // 20-minute trigger
    setTimeout(() => {
        if (scrolled) {
            show20MinOverlay();
        }
    }, 20 * 60 * 1000);

    // XP reward if user leaves within 60 sec
    window.addEventListener("beforeunload", () => {

        let timeSpent = Math.floor((Date.now() - startTime) / 1000);

        if (timeSpent < 60) {
            chrome.runtime.sendMessage({
                type: "rewardXP",
                value: 10
            });
        }
    });

    rewriteNotifications();
}

function show20MinOverlay() {

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

// Notification Rewrite + Waiting Room
function rewriteNotifications() {

    document.querySelectorAll("span[class*='notification']").forEach(el => {

        if (el.innerText && el.innerText.toLowerCase().includes("new")) {

            const original = el.innerText;

            chrome.runtime.sendMessage({
                type: "storeNotification",
                text: original
            });

            el.innerText = "Small dopamine hits waiting. This can wait 3 hours.";
        }
    });
}
