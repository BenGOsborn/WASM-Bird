package main

import (
	"fmt"
	"syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
	total := 0

	for _, value := range args {
		total += value.Int()
	}

	return js.ValueOf(total)
}

func addEventListener(elementID string, eventName string, callback func(this js.Value, args []js.Value) interface{}) {
	js.Global().Get("document").Call("getElementById", elementID).Call("addEventListener", eventName, js.FuncOf(callback))
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
