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
	fmt.Println("Load")

	// Add an event listener for key presses
	addEventListener("canvas", "keypress", func(this js.Value, args []js.Value) interface{} {
		fmt.Println("LOl!")

		code := args[0].Get("code").String()
		if code == "Space" {
			fmt.Println("Space!")
		}
		return nil
	})

	return nil
}

func main() {
	// Channel used to prevent program terminating
	c := make(chan struct{}, 0)

	js.Global().Set("WASMBird", js.FuncOf(WASMBird))

	// Prevent the program from terminating
	<-c
}
