package main

import (
	"fmt"
	"math"
	"math/rand"
	"syscall/js"
	lib "wasmBird/lib"
)

type Pipe struct {
	gapStart  float32
	gapHeight float32
	pipeX     float32
	scored    bool
}

func WASMBird(this js.Value, args []js.Value) interface{} {
	// Event listener for jump
	lib.AddEventListener("keypress", func(this js.Value, args []js.Value) interface{} {
		code := args[0].Get("code").String()
		if code == "Space" {
			fmt.Println("Space!")
		}
		return nil
	})

	// Initialize the canvas
	cvs := js.Global().Get("document").Call("getElementById", "canvas")
	ctx := cvs.Call("getContext", "2d")

	CVS_WIDTH := cvs.Get("width").Float()
	CVS_HEIGHT := cvs.Get("height").Float()

	// Initialize the values of the game
	const SPEED = 0.5
	score := 0
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
		if len(pipes) == 0 || CVS_WIDTH-(pipes[len(pipes)-1].pipeX+pipeWidth > 0) {
			newPipe := new(Pipe)
			newPipe.gapStart = float32(math.Floor(rand.Float32()*(pipeMaxHeight-pipeMinHeight) + pipeMinHeight))
			newPipe.gapHeight = float32(math.Floor(rand.Float32()*(pipeMaxGap-pipeMinGap) + pipeMinGap))
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
		ctx.Set("fillRect", birdX, birdY, birdSize, birdSize)

		// Exit if the bird touches the ground
		if birdY == CVS_HEIGHT-birdSize {
			exit = true
		}

		// Update the values for the bird
		birdY = math.Min(birdY+dBirdY, CVS_HEIGHT-birdSize)
		dBirdY += GRAVITY

		// Speed up the game
		// pipeSpacing = math.Max(0.3 * CVS_WIDTH) // Not done yet
	}

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
