chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // ================= XP REWARD =================
    if (message.type === "rewardXP") {

        chrome.storage.local.get(["xp"], (data) => {
            let xp = data.xp || 0;
            xp += message.value;
            chrome.storage.local.set({ xp });
        });
    }

    // ================= CLOSE CURRENT TAB =================
    if (message.type === "closeCurrentTab") {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                chrome.tabs.remove(tabs[0].id);
            }
        });
    }
});