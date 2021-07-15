package main

import (
	"fmt"
	"math"
	"math/rand"
	"syscall/js"
	"time"
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
	var score float64 = 0
	exit := false
	GRAVITY := CVS_WIDTH * (0.1 / 100)

	// Declare the values for the pipe
	pipeMinHeight := 0.1 * CVS_WIDTH
	pipeMaxHeight := 0.6 * CVS_HEIGHT
	pipeMinGap := 0.2 * CVS_HEIGHT
	pipeMaxGap := 0.3 * CVS_HEIGHT
	pipeWidth := 0.2 * CVS_WIDTH

	// Adjust according to a logarithmic scale
	pipeSpacing := 0.5 * CVS_WIDTH
	dPipeX := CVS_WIDTH * (SPEED / 100)

	// Store the pipes for drawing
	var pipes []*Pipe

	// Declare the values for the bird
	birdSize := 0.075 * CVS_WIDTH
	birdX := 0.1 * CVS_WIDTH
	birdY := 0.5 * CVS_HEIGHT
	dBirdY := CVS_WIDTH * (1 / 100)

	// Event listener for jump
	lib.AddEventListener("keypress", func(this js.Value, args []js.Value) interface{} {
		code := args[0].Get("code").String()
		if code == "Space" {
			dBirdY = -CVS_WIDTH * (1 / 100)
		}
		return nil
	})

	for !exit {
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
		if len(pipes) == 0 || CVS_WIDTH-(pipes[len(pipes)-1].pipeX+pipeWidth) > 0 {
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

		// Speed up the game
		var tempPipeSpacing float64 = 0
		if score != 0 {
			tempPipeSpacing = pipeSpacing - 1/(score*CVS_WIDTH)
		}
		pipeSpacing = math.Max(0.3*CVS_WIDTH, float64(tempPipeSpacing))

		var tempDPipeX float64 = 0
		if score != 0 {
			tempDPipeX = 1 / (score * CVS_WIDTH)
		}
		dPipeX += tempDPipeX

		// Draw in the score
		ctx.Set("font", "30px urw-form, Helvetica, sans-serif")
		ctx.Set("fillStyle", "#ffffff")
		ctx.Set("textAlign", "left")
		ctx.Call("fillText", fmt.Sprintf("Score: %f", score), 0.05*CVS_WIDTH, 0.1*CVS_HEIGHT)

		// Draw in the score
		ctx.Set("textAlign", "right")
		ctx.Call("fillText", fmt.Sprintf("High score: %f", score), 0.95*CVS_WIDTH, 0.1*CVS_HEIGHT)

		time.Sleep(time.Second)
	}

	// Display on exit
	ctx.Set("textAlign", "center")
	ctx.Set("font", "40px urw-form, Helvetica, sans-serif")
	ctx.Call("fillText", "You lost!", 0.5*CVS_WIDTH, 0.45*CVS_HEIGHT)
	ctx.Set("font", "30px urw-form, Helvetica, sans-serif")
	ctx.Call("fillText", "Press 'r' to restart", 0.5*CVS_WIDTH, 0.55*CVS_HEIGHT)

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
