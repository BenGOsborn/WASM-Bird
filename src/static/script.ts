(async () => {
    // Initialize the Go code
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // Initialize the game

    // Initialize the max score by fetching from the URL initially
    const maxScore = { maxScore: 0 };

    const response = await fetch("/high_score");
    if (response.status === 200) {
        const json = await response.json();

        maxScore.maxScore = json.high_score;
    }

    // Restart the game on press of e
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            WASMBird(maxScore);
        }
    });

    // Run main once
    WASMBird(maxScore);
})();
