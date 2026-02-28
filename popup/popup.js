document.addEventListener("DOMContentLoaded", () => {

    const xpDisplay = document.getElementById("xp");
    const waitingCount = document.getElementById("waitingCount");

    chrome.storage.local.get(["xp", "waitingRoom"], (data) => {

        xpDisplay.innerText = data.xp || 0;

        let waiting = data.waitingRoom || [];
        waitingCount.innerText = waiting.length + " notifications waiting";
    });

    document.getElementById("reset").onclick = () => {

        chrome.storage.local.set({ xp: 0 }, () => {
            xpDisplay.innerText = 0;
        });
    };

    document.getElementById("release").onclick = () => {

        chrome.storage.local.set({ waitingRoom: [] }, () => {
            waitingCount.innerText = "0 notifications waiting";
        });
    };
});