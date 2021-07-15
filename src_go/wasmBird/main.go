package main

import (
	"fmt"
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

	const CVS_WIDTH = cvs.Get("width").Float()
	const CVS_HEIGHT = cvs.Get("height").Float()

	// Initialize the values of the game
	const SPEED = 0.5
	score := 0
	exit := false
	const GRAVITY = CVS_WIDTH * (0.1 / 100)

	// Declare the values for the pipe
	const pipeMinHeight = 0.1 * CVS_WIDTH
	const pipeMaxHeight = 0.6 * CVS_HEIGHT
	const pipeMinGap = 0.2 * CVS_HEIGHT
	const pipeMaxGap = 0.3 * CVS_HEIGHT
	const pipeWidth = 0.2 * CVS_WIDTH

	// Adjust according to a logarithmic scale
	pipeSpacing := 0.5 * CVS_WIDTH
	dPipeX := CVS_WIDTH * (SPEED / 100)

	// Store the pipes for drawing
	var pipes []*Pipe

	// Declare the values for the bird
	const birdSize = 0.075 * CVS_WIDTH
	const birdX = 0.1 * CVS_WIDTH
	birdY := 0.5 * CVS_HEIGHT
	dBirdY := CVS_WIDTH * (1 / 100)

	for !exit {
		ctx.Set("fillStyle", "#0099ff")
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
