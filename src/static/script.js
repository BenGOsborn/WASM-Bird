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
var _this = this;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var go, result, cvs, ctx, pipeMinHeight, pipeMaxHeight, pipeMinGap, pipeMaxGap, pipeSpacing, pipeWidth, dPipeX, pipes, draw;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                go = new Go();
                return [4 /*yield*/, WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject)];
            case 1:
                result = _a.sent();
                go.run(result.instance);
                cvs = document.getElementById("canvas");
                ctx = cvs.getContext("2d");
                pipeMinHeight = 0.1 * cvs.height;
                pipeMaxHeight = 0.6 * cvs.height;
                pipeMinGap = 0.2 * cvs.height;
                pipeMaxGap = 0.3 * cvs.height;
                pipeSpacing = 0.4 * cvs.width;
                pipeWidth = 0.15 * cvs.width;
                dPipeX = cvs.width / 100;
                pipes = [];
                draw = function () {
                    // Initialize the background
                    ctx.fillStyle = "#0099ff";
                    ctx.fillRect(0, 0, cvs.width, cvs.height);
                    ctx.fillStyle = "#ffcc00";
                    ctx.fillRect(0, cvs.height * 0.8, cvs.width, cvs.height);
                    // Draw in the pipes and check that the bird is not within the pipe
                    // Filter the pipes out that are off of the screen
                    pipes.filter(function (pipe) { return pipe.pipeX + pipeWidth > 0; });
                    // Check if there are no pipes or the last pipe is at the threshold distance and add a new pipe
                    if (pipes.length === 0 || pipes[pipes.length - 1].pipeX - pipeWidth > pipeSpacing) {
                        // Initialize the height and gap size of the new pipe
                        var gapStart = Math.floor(Math.random() * (pipeMaxHeight - pipeMinHeight) + pipeMinHeight);
                        var gapHeight = Math.floor(Math.random() * (pipeMaxGap - pipeMinGap) + pipeMinGap);
                        // Add a new pipe to the list of pipes
                        var newPipe = { gapHeight: gapStart, gapSize: pipeGap };
                        pipes.push();
                    }
                    pipes.map(function (pipe) {
                        if (pipes.length === 0)
                            ;
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
                return [2 /*return*/];
        }
    });
}); })();
