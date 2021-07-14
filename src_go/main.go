package main

import (
	"fmt"
	"reflect"
	"syscall/js"
)

func add(this js.Value, args []js.Value) interface{} {
	total := 0

	for _, value := range args {
		total += value.Int()
	}

	return js.ValueOf(total)
}

func addEventListener(elementID string, event string) {
	callback := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		history := reflect.ValueOf(args)

		for i := 0; i < history.Len(); i++ {
			test := history.Index(i).Interface().(map[string]interface{})
			fmt.Println("test", test["pageX"].(string))
		}

		return nil
	})
	js.Global().Get("document").Call("getElementById", elementID).Call("addEventListener", event, callback)
}

func main() {
	// Channel used to prevent program terminating
	c := make(chan struct{}, 0)

	fmt.Println("Hello world from GO!")

	// Add an event listener
	addEventListener("canvas", "click")

	// Expose functions
	js.Global().Set("add", js.FuncOf(add))

	// Prevent the program from terminating
	<-c
}
