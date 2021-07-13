(async () => {
    // Initialize the Go code
    const go = new Go();

    const result = await WebAssembly.instantiateStreaming(
        fetch("main.wasm"),
        go.importObject
    );
    go.run(result.instance);

    // ------------- Main logic ------------------

    function main() {
        // Initialize the state of the game
        const SPEED = 0.5; // Maybe this should also be interchangeable on some logarithmic scale (percentage of width to travel per render)
        let score = 0;
        let exit = false;

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

        // Declare the constants for the bird
        // We can check the birds distance using one unit travelled - if the distance is greater than 1 unit of travel (dPipeX) there does not need to be another render (edge cases)
        const birdSize = 0.075 * cvs.width;

        const birdX = 0.1 * cvs.width;
        let birdY = 0.5 * cvs.height;
        let dBirdY = cvs.width * (1 / 100);
        const GRAVITY = cvs.width * (0.1 / 100);

        // Push the bird up
        window.addEventListener("keypress", (e) => {
            if (e.code === "Space") {
                dBirdY = -cvs.width * (1 / 100);
            }
        });

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
                    Math.random() * (pipeMaxHeight - pipeMinHeight) +
                        pipeMinHeight
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

                // Check if the bird is in the pipe
                if (
                    birdX + birdSize >= pipe.pipeX &&
                    birdX <= pipe.pipeX + pipeWidth
                ) {
                    // Increment the score for each time it passes through then divide by the number of times it passes through (pipeWidth + birdSize) / Speed
                    score += 1;

                    // If the bird touches the pipe then stop
                    if (
                        birdY <= pipe.gapStart ||
                        birdY + birdSize >= pipe.gapStart + pipe.gapHeight
                    ) {
                        exit = true;
                    }
                }

                // Move the pipe
                pipe.pipeX -= dPipeX;
            });

            // Exit if the bird touches the ground
            if (birdY === cvs.height - birdSize) exit = true;

            // Draw in the bird and update values
            ctx.fillStyle = "#ff6600";
            ctx.fillRect(birdX, birdY, birdSize, birdSize);

            // Check that the position of the bird is not below the specified amount
            birdY = Math.min(birdY + dBirdY, cvs.height - birdSize);
            dBirdY += GRAVITY;

            // Draw the score
            ctx.font = "30px urw-form, Helvetica, sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.fillText(
                `Score: ${Math.floor(
                    score / ((pipeWidth + birdSize) / dPipeX)
                )}`,
                0.05 * cvs.width,
                0.1 * cvs.height
            );

            // Draw the next frame if the game is still running
            if (!exit) requestAnimationFrame(draw);
        };

        // Start the event loop (maybe wrap this in its own while loop for continued games too)
        draw();

        // Draw out the score
    }

    // Start the game (should be conditional)
    addEventListener("keypress", (e) => {
        if (e.code === "KeyR") {
            main();
        }
    });
})();
