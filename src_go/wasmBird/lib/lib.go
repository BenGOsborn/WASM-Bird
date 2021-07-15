package lib

import (
	// "syscall/js"
	"fmt"
)

// func AddEventListener(eventName string, callback func(this js.Value, args []js.Value) interface{}) {
// 	js.Global().Get("document").Call("addEventListener", eventName, js.FuncOf(callback))
// }

// type Canvas struct {
// 	// Declare all of the requirements for the canvas here
// 	id  string
// 	cvs js.Value
// 	ctx js.Value
// }

// func NewCanvas(id string) *Canvas {
// 	// Initialize the new canvas
// 	canvas := new(Canvas)

// 	// Set the default values
// 	canvas.id = id
// 	canvas.cvs = js.Global().Get("document").Call("getElementById", id)
// 	canvas.ctx = canvas.cvs.Call("getContext", "2d")

// 	return canvas
// }

func Test() {
	fmt.Println("This is a test!")
}
