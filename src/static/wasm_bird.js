var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
function WASMBird() {
    // Initialize the state of the game
    var SPEED = 0.5; // Maybe this should also be interchangeable on some logarithmic scale (percentage of width to travel per render)
    var score = 0;
    var exit = false;
    // Initialize the canvas
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    // Declare the constants for the pipe
    var pipeMinHeight = 0.1 * cvs.height;
    var pipeMaxHeight = 0.6 * cvs.height;
    var pipeMinGap = 0.2 * cvs.height;
    var pipeMaxGap = 0.3 * cvs.height;
    var pipeSpacing = 0.5 * cvs.width; // Maybe this should be interchangeable from some logarithmic scale and clamped so not too close
    var pipeWidth = 0.2 * cvs.width;
    var dPipeX = cvs.width * (SPEED / 100);
    // Store the pipes for drawing
    var pipes = [];
    // Declare the constants for the bird
    var birdSize = 0.075 * cvs.width;
    var birdX = 0.1 * cvs.width;
    var birdY = 0.5 * cvs.height;
    var dBirdY = cvs.width * (1 / 100);
    var GRAVITY = cvs.width * (0.1 / 100);
    // Push the bird up
    window.addEventListener("keypress", function (e) {
        if (e.code === "Space") {
            dBirdY = -cvs.width * (1 / 100);
        }
    });
    // Main draw loop
    var draw = function () {
        // Initialize the background
        ctx.fillStyle = "#0099ff";
        ctx.fillRect(0, 0, cvs.width, cvs.height);
        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(0, cvs.height * 0.9, cvs.width, cvs.height);
        // Filter the pipes out that are off of the screen
        pipes = pipes.filter(function (pipe) { return pipe.pipeX + pipeWidth > 0; });
        // Check if there are no pipes or the last pipe is at the threshold distance and add a new pipe
        if (pipes.length === 0 ||
            cvs.width - (pipes[pipes.length - 1].pipeX + pipeWidth) >
                pipeSpacing) {
            // Initialize the height and gap size of the new pipe
            var gapStart = Math.floor(Math.random() * (pipeMaxHeight - pipeMinHeight) + pipeMinHeight);
            var gapHeight = Math.floor(Math.random() * (pipeMaxGap - pipeMinGap) + pipeMinGap);
            // Add a new pipe to the list of pipes
            var newPipe = { gapStart: gapStart, gapHeight: gapHeight, pipeX: cvs.width };
            pipes = __spreadArray(__spreadArray([], pipes), [newPipe]);
        }
        // Move the pipe and check the position of the bird and the pipe
        pipes.forEach(function (pipe) {
            ctx.fillStyle = "#00cc00";
            ctx.fillRect(pipe.pipeX, 0, pipeWidth, pipe.gapStart);
            ctx.fillRect(pipe.pipeX, pipe.gapStart + pipe.gapHeight, pipeWidth, cvs.height);
            // Check if the bird is in the pipe
            if (birdX + birdSize >= pipe.pipeX &&
                birdX <= pipe.pipeX + pipeWidth) {
                // Increment the score for each time it passes through then divide by the number of times it passes through (pipeWidth + birdSize) / Speed
                score += 1;
                // If the bird touches the pipe then stop
                if (birdY <= pipe.gapStart ||
                    birdY + birdSize >= pipe.gapStart + pipe.gapHeight) {
                    exit = true;
                }
            }
            // Move the pipe
            pipe.pipeX -= dPipeX;
        });
        // Exit if the bird touches the ground
        if (birdY === cvs.height - birdSize)
            exit = true;
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
        ctx.fillText("Score: " + Math.floor(score / ((pipeWidth + birdSize) / dPipeX)), 0.05 * cvs.width, 0.1 * cvs.height);
        // Draw the next frame if the game is still running
        if (!exit)
            requestAnimationFrame(draw);
    };
    // Start the event loop (maybe wrap this in its own while loop for continued games too)
    draw();
}
