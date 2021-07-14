(async () => {
    // Initialize the game

    // Initialize the high score by fetching from the URL initially
    const highScore = { highScore: 0 };

    const response = await fetch("/high_score");
    if (response.status === 200) {
        const json = await response.json();

        highScore.highScore = json.high_score;
    }

    // Restart the game on press of e
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            WASMBird(highScore);
        }
    });

    // Run main once
    WASMBird(highScore);
})();
