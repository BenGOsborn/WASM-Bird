var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var _this = this;
(function () { return __awaiter(_this, void 0, void 0, function () {
    // ------------- Main logic ------------------
    function main() {
        // (TURN THIS INTO WASM ONCE DONE)
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
        // We can check the birds distance using one unit travelled - if the distance is greater than 1 unit of travel (dPipeX) there does not need to be another render (edge cases)
        var birdSize = 0.075 * cvs.width;
        var birdX = 0.1 * cvs.width;
        var birdY = 0.5 * cvs.height;
        var dBirdY = cvs.width * (1 / 100);
        var GRAVITY = cvs.width * (0.1 / 100);
        // Push the bird up
        window.addEventListener("keydown", function (e) {
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
            // Exit if the bird touches the ground
            if (birdY === cvs.height - birdSize)
                exit = true;
            // Draw in the bird and update values
            ctx.fillStyle = "#ff6600";
            ctx.fillRect(birdX, birdY, birdSize, birdSize);
            // Check that the position of the bird is not below the specified amount
            birdY = Math.min(birdY + dBirdY, cvs.height - birdSize);
            dBirdY += GRAVITY;
            // Filter the pipes out that are off of the screen
            pipes = pipes.filter(function (pipe) { return pipe.pipeX + pipeWidth > 0; });
            // Check if there are no pipes or the last pipe is at the threshold distance and add a new pipe
            if (pipes.length === 0 ||
                cvs.width - (pipes[pipes.length - 1].pipeX + pipeWidth) >
                    pipeSpacing) {
                // Initialize the height and gap size of the new pipe
                var gapStart = Math.floor(Math.random() * (pipeMaxHeight - pipeMinHeight) +
                    pipeMinHeight);
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
            // Draw the next frame if the game is still running
            if (!exit)
                requestAnimationFrame(draw);
        };
        // Start the event loop (maybe wrap this in its own while loop for continued games too)
        draw();
        // Down here I should make some sort of request to the server to log the score AND display some sort of error message (exit by returning)
        // Keep track of the scores in the session somehow...
    }
    var go, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                go = new Go();
                return [4 /*yield*/, WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)];
            case 1:
                result = _a.sent();
                go.run(result.instance);
                // Start the game (should be conditional)
                main();
                return [2 /*return*/];
        }
    });
}); })();
