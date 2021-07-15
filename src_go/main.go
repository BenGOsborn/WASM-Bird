package main

import (
	"fmt"
	"math"
	"math/rand"
	"syscall/js"
)

type Pipe struct {
	GapStart  float64
	GapHeight float64
	PipeX     float64
	Scored    bool
}

func addEventListener(eventName string, callback func(this js.Value, args []js.Value) interface{}) {
	js.Global().Get("document").Call("addEventListener", eventName, js.FuncOf(callback))
}

func WASMBird(this js.Value, args []js.Value) interface{} {
	// Initialize the canvas
	var (
		cvs        js.Value = js.Global().Get("document").Call("getElementById", "canvas")
		ctx        js.Value = cvs.Call("getContext", "2d")
		CVS_WIDTH  float64  = cvs.Get("width").Float()
		CVS_HEIGHT float64  = cvs.Get("height").Float()
	)

	// Initialize the values of the game
	const SPEED = 0.5
	var (
		highScore js.Value = args[0]
		score     float64  = 0
		exit      bool     = false
		GRAVITY   float64  = CVS_WIDTH * (0.1 / 100)
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

	// Event listeners for jump
	addEventListener("keypress", func(this js.Value, args []js.Value) interface{} {
		code := args[0].Get("code").String()
		if code == "Space" {
			dBirdY = -CVS_WIDTH * (1.0 / 100)
		}
		return nil
	})

	addEventListener("click", func(this js.Value, args []js.Value) interface{} {
		dBirdY = -CVS_WIDTH * (1.0 / 100)
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
			if pipe.PipeX+pipeWidth > 0 {
				tempPipes = append(tempPipes, pipe)
			}
		}
		pipes = tempPipes

		// Attempt to add a new pipe
		if len(pipes) == 0 || CVS_WIDTH-(pipes[len(pipes)-1].PipeX+pipeWidth) > pipeSpacing {
			newPipe := new(Pipe)
			newPipe.GapStart = math.Floor(rand.Float64()*(pipeMaxHeight-pipeMinHeight) + pipeMinHeight)
			newPipe.GapHeight = math.Floor(rand.Float64()*(pipeMaxGap-pipeMinGap) + pipeMinGap)
			newPipe.PipeX = CVS_WIDTH
			newPipe.Scored = false
			pipes = append(pipes, newPipe)
		}

		// Move the pipes and check their positions relative to the bird
		for _, pipe := range pipes {
			// Draw the pipe
			ctx.Set("fillStyle", "#00cc00")
			ctx.Call("fillRect", pipe.PipeX, 0, pipeWidth, pipe.GapStart)
			ctx.Call("fillRect", pipe.PipeX, pipe.GapStart+pipe.GapHeight, pipeWidth, CVS_HEIGHT)

			// Check if the bird is within the pipe
			if birdX+birdSize >= pipe.PipeX && birdX <= pipe.PipeX+pipeWidth {
				// Check if the bird has touched the pipe and stop if so
				if birdY <= pipe.GapStart || birdY+birdSize >= pipe.GapStart+pipe.GapHeight {
					exit = true
				}
			}

			// Attempt to increment the score
			if !pipe.Scored && pipe.PipeX+pipeWidth < birdX+birdSize {
				score += 1
				pipe.Scored = true
			}

			// Move the pipe
			pipe.PipeX -= dPipeX
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
		var tempPipeSpacing float64 = pipeSpacing
		if score != 0 {
			tempPipeSpacing = pipeSpacing - 1.0/(score*CVS_WIDTH)
		}
		pipeSpacing = math.Max(0.3*CVS_WIDTH, float64(tempPipeSpacing))

		var tempDPipeX float64 = dPipeX
		if score != 0 {
			tempDPipeX = dPipeX + 1.0/(score*CVS_WIDTH)
		}
		dPipeX = tempDPipeX

		// Update the high score
		if score > highScore.Get("highScore").Float() {
			highScore.Set("highScore", score)
			js.Global().Call("saveScore", score)
		}

		// Draw in the score
		ctx.Set("font", "30px urw-form, Helvetica, sans-serif")
		ctx.Set("fillStyle", "#ffffff")
		ctx.Set("textAlign", "left")
		ctx.Call("fillText", fmt.Sprintf("Score: %d", int(score)), 0.05*CVS_WIDTH, 0.1*CVS_HEIGHT)

		// Draw in the score
		ctx.Set("textAlign", "right")
		ctx.Call("fillText", fmt.Sprintf("High score: %d", int(highScore.Get("highScore").Float())), 0.95*CVS_WIDTH, 0.1*CVS_HEIGHT)

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
