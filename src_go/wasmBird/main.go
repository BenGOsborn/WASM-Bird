package main

import (
	"fmt"
	"math"
	"math/rand"
	"syscall/js"
	"wasmBird/lib"
)

type Pipe struct {
	gapStart  float64
	gapHeight float64
	pipeX     float64
	scored    bool
}

func WASMBird(this js.Value, args []js.Value) interface{} {
	// Initialize the canvas
	cvs := js.Global().Get("document").Call("getElementById", "canvas")
	ctx := cvs.Call("getContext", "2d")

	CVS_WIDTH := cvs.Get("width").Float()
	CVS_HEIGHT := cvs.Get("height").Float()

	// Initialize the values of the game
	const SPEED = 0.5
	var (
		score   float64 = 0
		exit    bool    = false
		GRAVITY float64 = CVS_WIDTH * (0.1 / 100)
	)

	// Declare the values for the pipe
	var (
		pipeMinHeight float64 = 0.1 * CVS_WIDTH
		pipeMaxHeight float64 = 0.6 * CVS_HEIGHT
		pipeMinGap    float64 = 0.2 * CVS_HEIGHT
		pipeMaxGap    float64 = 0.3 * CVS_HEIGHT
		pipeWidth     float64 = 0.2 * CVS_WIDTH
	)

	// Adjust according to a logarithmic scale
	var (
		pipeSpacing float64 = 0.5 * CVS_WIDTH
		dPipeX      float64 = CVS_WIDTH * (float64(SPEED) / 100)
	)

	// Store the pipes for drawing
	var pipes []*Pipe

	// Declare the values for the bird
	var (
		birdSize float64 = 0.075 * CVS_WIDTH
		birdX    float64 = 0.1 * CVS_WIDTH
		birdY    float64 = 0.5 * CVS_HEIGHT
		dBirdY   float64 = CVS_WIDTH * (1.0 / 100)
	)

	// Event listener for jump
	lib.AddEventListener("keypress", func(this js.Value, args []js.Value) interface{} {
		code := args[0].Get("code").String()
		if code == "Space" {
			dBirdY = -CVS_WIDTH * (1.0 / 100)
		}
		return nil
	})

	// Define the function to draw the next frame
	var drawFrame func()

	drawFrame = func() {
		ctx.Set("fillStyle", "#0099ff")
		ctx.Call("fillRect", 0, 0, CVS_WIDTH, CVS_HEIGHT)
		ctx.Set("fillStyle", "#ffcc00")
		ctx.Call("fillRect", 0, 0.9*CVS_HEIGHT, CVS_WIDTH, CVS_HEIGHT)

		// Iterate over the pipes and remove the ones that are out of frame
		tempPipes := []*Pipe{}
		for _, pipe := range pipes {
			if pipe.pipeX+pipeWidth > 0 {
				tempPipes = append(tempPipes, pipe)
			}
		}
		pipes = tempPipes

		// Attempt to add a new pipe
		if len(pipes) == 0 || CVS_WIDTH-(pipes[len(pipes)-1].pipeX+pipeWidth) > pipeSpacing {
			newPipe := new(Pipe)
			newPipe.gapStart = math.Floor(rand.Float64()*(pipeMaxHeight-pipeMinHeight) + pipeMinHeight)
			newPipe.gapHeight = math.Floor(rand.Float64()*(pipeMaxGap-pipeMinGap) + pipeMinGap)
			newPipe.pipeX = CVS_WIDTH
			newPipe.scored = false
			pipes = append(pipes, newPipe)
		}

		// Move the pipes and check their positions relative to the bird
		for _, pipe := range pipes {
			// Draw the pipe
			ctx.Set("fillStyle", "#00cc00")
			ctx.Call("fillRect", pipe.pipeX, 0, pipeWidth, pipe.gapStart)
			ctx.Call("fillRect", pipe.pipeX, pipe.gapStart+pipe.gapHeight, pipeWidth, CVS_HEIGHT)

			// Check if the bird is within the pipe
			if birdX+birdSize >= pipe.pipeX && birdX <= pipe.pipeX+pipeWidth {
				// Check if the bird has touched the pipe and stop if so
				if birdY <= pipe.gapStart || birdY+birdSize >= pipe.gapStart+pipe.gapHeight {
					exit = true
				}
			}

			// Attempt to increment the score
			if !pipe.scored && pipe.pipeX+pipeWidth < birdX+birdSize {
				score += 1
				pipe.scored = true
			}

			// Move the pipe
			pipe.pipeX -= dPipeX
		}

		// Draw in the bird
		ctx.Set("fillStyle", "#ff6600")
		ctx.Call("fillRect", birdX, birdY, birdSize, birdSize)

		// Exit if the bird touches the ground
		if birdY == CVS_HEIGHT-birdSize {
			exit = true
		}

		// Update the values for the bird
		birdY = math.Min(birdY+dBirdY, CVS_HEIGHT-birdSize)
		dBirdY += GRAVITY

		// // Speed up the game - ******* Pretty sure this is broken
		// var tempPipeSpacing float64 = 0
		// if score != 0 {
		// 	tempPipeSpacing = pipeSpacing - 1.0/(score*CVS_WIDTH)
		// }
		// pipeSpacing = math.Max(0.3*CVS_WIDTH, float64(tempPipeSpacing))

		// var tempDPipeX float64 = 0
		// if score != 0 {
		// 	tempDPipeX = 1.0 / (score * CVS_WIDTH)
		// }
		// dPipeX += tempDPipeX

		// Draw in the score
		ctx.Set("font", "30px urw-form, Helvetica, sans-serif")
		ctx.Set("fillStyle", "#ffffff")
		ctx.Set("textAlign", "left")
		ctx.Call("fillText", fmt.Sprintf("Score: %d", int(score)), 0.05*CVS_WIDTH, 0.1*CVS_HEIGHT)

		// Draw in the score
		ctx.Set("textAlign", "right")
		ctx.Call("fillText", fmt.Sprintf("High score: %d", int(score)), 0.95*CVS_WIDTH, 0.1*CVS_HEIGHT)

		// Draw the next frame or display lost message
		if !exit {
			// Draw the next frame
			js.Global().Call("requestAnimationFrame", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
				drawFrame()
				return nil
			}))
		} else {
			// Display on exit
			ctx.Set("textAlign", "center")
			ctx.Set("font", "40px urw-form, Helvetica, sans-serif")
			ctx.Call("fillText", "You lost!", 0.5*CVS_WIDTH, 0.45*CVS_HEIGHT)
			ctx.Set("font", "30px urw-form, Helvetica, sans-serif")
			ctx.Call("fillText", "Press 'r' to restart", 0.5*CVS_WIDTH, 0.55*CVS_HEIGHT)
		}
	}

	// I need a way of recurisvely calling the drawFrame function inside of itself so it can keep requesting animation frames
	drawFrame()

	return nil
}

func main() {
	// Channel used to prevent program terminating
	c := make(chan struct{}, 0)

	// Initialize the functions in JS
	js.Global().Set("WASMBird", js.FuncOf(WASMBird))

	// Prevent the program from terminating
	<-c
}
