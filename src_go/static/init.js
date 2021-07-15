function saveScore(score) {
    fetch("/high_score", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ high_score: score }),
    });
}

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

    // Add an event listener for game restarts
    addEventListener("keypress", async (e) => {
        if (e.code === "KeyR") {
            WASMBird(highScore);
        }
    });

    // Start the game
    WASMBird(highScore);
})();
