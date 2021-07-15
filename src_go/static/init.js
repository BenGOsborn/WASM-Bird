(async () => {
    // Initialize the Go WASM code
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // Inittialize the high score state
    const highScore = { highScore: 0 }

    const response = await fetch("/high_score");
    if (response.status === 200) {
        const json = await response.json();

        highScore.highScore = json.high_score;
    }

    // Declare function to save high scores
    function saveHighScore() {
        fetch("/high_score", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ high_score: highScore.highScore }),
        });
    }

    // Add an event listener for game restarts
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            WASMBird(highScore);
            saveHighScore();
        }
    });

    // Start the game
    WASMBird(highScore);
    saveHighScore();

})();
