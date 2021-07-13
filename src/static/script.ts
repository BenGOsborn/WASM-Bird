(async () => {
    // Initialize the Go code
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // ------------- Main logic ------------------

    // (TURN THIS INTO WASM ONCE DONE)

    // Initialize the canvas
    const cvs = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

    // Declare the constant values
    const pipeGap = 0.2 * cvs.height;
    const pipeWidth = 0.2 * cvs.width;

    // Main draw loop
    const draw = () => {
        // Initialize the background
        ctx.fillStyle = "#0099ff";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(0, cvs.height * 0.8, cvs.width, cvs.height);

        // Draw in the pipes

        // Draw the next frame
        requestAnimationFrame(draw);
    };

    // Start the loop
    draw();
})();
