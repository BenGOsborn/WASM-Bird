package main

import (
	"fmt"
	"syscall/js"
)

func addEventListener(elementID string, eventName string, callback func(this js.Value, args []js.Value) interface{}) {
	js.Global().Get("document").Call("getElementById", elementID).Call("addEventListener", eventName, js.FuncOf(callback))
}

type Canvas struct {
	// Declare all of the requirements for the canvas here
	id  string
	cvs js.Value
	ctx js.Value
}

func NewCanvas(id string) *Canvas {
	// Initialize the new canvas
	canvas := new(Canvas)

	// Set the default values
	canvas.id = id
	canvas.cvs = js.Global().Get("document").Call("getElementById", id)
	canvas.ctx = canvas.cvs.Call("getContext", "2d")

	return canvas
}

func WASMBird(this js.Value, args []js.Value) interface{} {
	total := 0

	for _, value := range args {
		total += value.Int()
	}

	return js.ValueOf(total)
}

func main() {
	// Channel used to prevent program terminating
	c := make(chan struct{}, 0)

	fmt.Println("Hello world from GO!")

	// Add an event listener
	addEventListener("canvas", "click", func(this js.Value, args []js.Value) interface{} {
		event := args[0].Get("pageX").Float()

		fmt.Println(event)

		return nil
	})

	// Expose functions
	js.Global().Set("add", js.FuncOf(add))

	// Prevent the program from terminating
	<-c
}
