(async () => {
    // Initialize the Go code
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    console.log(add(1, 2, 4)); // It is not loaded - I need to wait for it to be loaded in
})();
