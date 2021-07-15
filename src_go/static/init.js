(async () => {
    // Initialize the Go WASM code
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // Add an event listener for game restarts
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            WASMBird();
        }
    });

    // Start the game
    WASMBird();
})();
