chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    // XP Reward
    if (message.type === "rewardXP") {

        chrome.storage.local.get(["xp"], (data) => {

            let xp = data.xp || 0;
            xp += message.value;

            chrome.storage.local.set({ xp: xp });
        });
    }

    // Store notifications in Waiting Room
    if (message.type === "storeNotification") {

        chrome.storage.local.get(["waitingRoom"], (data) => {

            let waitingRoom = data.waitingRoom || [];

            waitingRoom.push({
                text: message.text,
                time: Date.now()
            });

            chrome.storage.local.set({ waitingRoom: waitingRoom });
        });
    }
});
