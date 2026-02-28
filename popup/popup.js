document.addEventListener("DOMContentLoaded", () => {

    const xpDisplay = document.getElementById("xp");
    const levelDisplay = document.getElementById("level");
    const resetBtn = document.getElementById("reset");

    const blockedSitesInput = document.getElementById("blockedSites");
    const saveBtn = document.getElementById("saveSites");

    // ================= LOAD STORED DATA =================
    chrome.storage.local.get(["xp", "blockedSites"], (data) => {

        const xp = data.xp || 0;

        xpDisplay.innerText = xp;
        levelDisplay.innerText = getLevelInfo(xp);

        // Auto-fill saved sites
        if (data.blockedSites && data.blockedSites.length > 0) {
            blockedSitesInput.value = data.blockedSites.join("\n");
            showSavedState(true);
        }
    });

    // ================= SAVE SITES =================
    saveBtn.onclick = () => {

        const sites = blockedSitesInput.value
            .split("\n")
            .map(site => site.trim())
            .filter(site => site.length > 0);

        chrome.storage.local.set({ blockedSites: sites }, () => {
            showSavedState(false);
        });
    };

    function showSavedState(initialLoad) {
        saveBtn.innerText = "Saved ✓";
        saveBtn.style.background = "#2ecc71";

        if (!initialLoad) {
            setTimeout(() => {
                saveBtn.innerText = "Save Sites";
                saveBtn.style.background = "#4CAF50";
            }, 2000);
        }
    }

    // ================= RESET XP =================
    resetBtn.onclick = () => {
        chrome.storage.local.set({ xp: 0 }, () => {
            xpDisplay.innerText = 0;
            levelDisplay.innerText = getLevelInfo(0);
        });
    };

    // ================= LEVEL SYSTEM =================
    function getLevelInfo(xp) {

        if (xp >= 100000) return "Level 100 - Monk";
        if (xp >= 50000) return "Level 50 - Discipline Master";
        if (xp >= 20000) return "Level 20 - Elite Focus";
        if (xp >= 10000) return "Level 10 - Focused Warrior";
        if (xp >= 5000) return "Level 7 - Consistent Grinder";
        if (xp >= 2000) return "Level 5 - Strong Discipline";
        if (xp >= 1000) return "Level 4 - Rising Focus";
        if (xp >= 600) return "Level 3 - Building Momentum";
        if (xp >= 300) return "Level 2 - Good Attention Span";
        if (xp >= 100) return "Level 1 - Beginner";

        return "Level 0 - Distracted Soul";
    }

});