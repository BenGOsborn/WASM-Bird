# [WASM Bird](https://wasm-bird.herokuapp.com/)

## A flappy bird inspired game created using Golang, WASM, and TypeScript.

### Requirements

-   Docker

NOTE: If you are building using Docker, ignore the following requirements. If you are not, then ignore the above requirements.

-   NodeJS v10.19.0
-   Golang v1.16.5 (Golang version only)

### Instructions

1. Clone the repository

DOCKER:

-   TypeScript version
    -   <code>make ts-run</code>
-   Golang version
    -   <code>make go-run</code>

NO DOCKER (DEV ONLY):

-   TypeScript version
    -   <code>make ts-dev</code>
-   Golang version
    -   <code>make go-dev</code>

### How it was built

The repository features two versions of the same app, where one version is built in TypeScript, and the other is built using Golang and WASM. The project was first built in TypeScript for convenience when designing the app, and was then translated into its Golang counterpart as an experiment and learning excercise for WASM.

Both apps interact with a simple HTML canvas for displaying the app, the only difference between the two is the languages they will built in. Apart from a few event listeners written in JS to restart the game on exit, the rest of the game logic for the WASM app is built entirely using Golang. It interacts with the Canvas using the <code>syscall/js</code> package, which allows Go to interact with the JS DOM. This allows Go to do things such as interacting with Javascript objects, draw on the canvas, add event listeners, and even set timeouts.

For both apps, the static files are served using a NodeJS + ExpressJS server, which is able to serve .wasm files. Both apps are also containerized using Docker for portability. A [demo](https://wasm-bird.herokuapp.com/) of the project has been deployed to Heroku.

### Conclusion

Although no benchmarks have been run on the two apps, it feels like the WASM version of the app is slower than the regular TypeScript version. Perhaps this is because it is computationally expensive to interact with JS from WASM, although I have done no research into whether this is the case or not. It is also more difficult to build an app using pure WASM. Overall it is my recommendation that WASM should be used as a supplement to JS, where computationally expensive tasks that require little interaction with the JS DOM can be offloaded to WASM.

#### Todo

-   MAYBE add webpack for the TS
-   WebGL with WASM might be interesting (my own game engine + visualizing algorithms)
