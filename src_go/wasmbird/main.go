package main

import (
	"fmt"
	"syscall/js"
)

func WASMBird(this js.Value, args []js.Value) interface{} {
	// Event listener for jump
	addEventListener("keypress", func(this js.Value, args []js.Value) interface{} {
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

	// Initialize the functions in JS
	js.Global().Set("WASMBird", js.FuncOf(WASMBird))

	// Prevent the program from terminating
	<-c
}
