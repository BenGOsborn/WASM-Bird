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

    // Initialize the state of the game
    const SPEED = 0.5; // Maybe this should also be interchangeable on some logarithmic scale (percentage of width to travel per render)
    const DONE = false;
    const SCORE = 0;

    // Initialize the canvas
    const cvs = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = cvs.getContext("2d") as CanvasRenderingContext2D;

    // Declare the constants for the pipe
    const pipeMinHeight = 0.1 * cvs.height;
    const pipeMaxHeight = 0.6 * cvs.height;

    const pipeMinGap = 0.2 * cvs.height;
    const pipeMaxGap = 0.3 * cvs.height;

    const pipeSpacing = 0.5 * cvs.width; // Maybe this should be interchangeable from some logarithmic scale and clamped so not too close

    const pipeWidth = 0.2 * cvs.width;
    const dPipeX = cvs.width * (SPEED / 100);

    interface Pipe {
        gapStart: number;
        gapHeight: number;
        pipeX: number;
    }

    // Store the pipes for drawing
    let pipes: Pipe[] = [];

    // Main draw loop
    const draw = () => {
        // Initialize the background
        ctx.fillStyle = "#0099ff";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(0, cvs.height * 0.9, cvs.width, cvs.height);

        // Filter the pipes out that are off of the screen
        pipes = pipes.filter((pipe) => pipe.pipeX + pipeWidth > 0);

        // Check if there are no pipes or the last pipe is at the threshold distance and add a new pipe
        if (
            pipes.length === 0 ||
            cvs.width - (pipes[pipes.length - 1].pipeX + pipeWidth) >
                pipeSpacing
        ) {
            // Initialize the height and gap size of the new pipe
            const gapStart = Math.floor(
                Math.random() * (pipeMaxHeight - pipeMinHeight) + pipeMinHeight
            );
            const gapHeight = Math.floor(
                Math.random() * (pipeMaxGap - pipeMinGap) + pipeMinGap
            );

            // Add a new pipe to the list of pipes
            const newPipe: Pipe = { gapStart, gapHeight, pipeX: cvs.width };
            pipes = [...pipes, newPipe];
        }

        // Move the pipe and check the position of the bird and the pipe
        pipes.forEach((pipe) => {
            ctx.fillStyle = "#00cc00";
            ctx.fillRect(pipe.pipeX, 0, pipeWidth, pipe.gapStart);
            ctx.fillRect(
                pipe.pipeX,
                pipe.gapStart + pipe.gapHeight,
                pipeWidth,
                cvs.height
            );

            pipe.pipeX -= dPipeX;
        });

        // Keep drawing if not finished
        if (!DONE) {
            requestAnimationFrame(draw);
        }
    };

    // Start the event loop (maybe wrap this in its own while loop for continued games too)
    draw();

    // Down here I should make some sort of request to the server to log the score AND display some sort of error message (exit by returning)
})();
