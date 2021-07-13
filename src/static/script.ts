(async () => {
    // Initialize the Go code
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // Initialize the game

    // Restart the game on press of e
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            WASMBird();
        }
    });

    // Run main once
    WASMBird();
})();
