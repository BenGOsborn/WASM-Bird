(async () => {
    // Initialize the Go WASM code
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // The below code is NOT executing
    WASMBird();
})();
