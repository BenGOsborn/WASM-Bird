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

    // Declare the constants for the pipe
    const pipeMinHeight = 0.1 * cvs.height;
    const pipeMaxHeight = 0.6 * cvs.height;

    const pipeMinGap = 0.2 * cvs.height;
    const pipeMaxGap = 0.3 * cvs.height;

    const pipeSpacing = 0.4 * cvs.width;

    const pipeWidth = 0.15 * cvs.width;
    const dPipeX = cvs.width / 100;

    interface Pipe {
        gapStart: number;
        gapHeight: number;
        pipeX: number;
    }

    // Store the pipes for drawing
    const pipes: Pipe[] = [];

    // Main draw loop
    const draw = () => {
        // Initialize the background
        ctx.fillStyle = "#0099ff";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(0, cvs.height * 0.8, cvs.width, cvs.height);

        // Draw in the pipes and check that the bird is not within the pipe
        // Filter the pipes out that are off of the screen
        pipes.filter(pipe => pipe.pipeX + pipeWidth > 0);

        // Check if there are no pipes or the last pipe is at the threshold distance and add a new pipe
        if (pipes.length === 0 || pipes[pipes.length - 1].pipeX - pipeWidth > pipeSpacing) {
            // Initialize the height and gap size of the new pipe
            const gapStart = Math.floor(
                Math.random() * (pipeMaxHeight - pipeMinHeight) + pipeMinHeight
            );
            const gapHeight = Math.floor(
                Math.random() * (pipeMaxGap - pipeMinGap) + pipeMinGap
            );

            // Add a new pipe to the list of pipes
            const newPipe: Pipe = {gapHeight: gapStart, gapSize: pipeGap};
            pipes.push();
        } 

        pipes.map((pipe) => {
            if (pipes.length === 0)
        });

        ctx.fillStyle = "#00cc00";
        ctx.fillRect(pipeX, 0, pipeX + pipeWidth, gapStart);
        ctx.fillRect(pipeX, gapStart + pipeGap, pipeX + pipeWidth, cvs.height);
        pipeX -= dPipeX;

        // Draw the next frame
        requestAnimationFrame(draw);
    };

    // Start the loop
    draw();
})();
