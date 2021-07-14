package main

import (
	"fmt"
	"syscall/js"
)

func add(this js.Value, i []js.Value) interface{} {
	total := 0;

	for _, value := range i {
		total += value.Int();
	}

	return js.ValueOf(total);
}


func main() {
	c := make(chan struct{}, 0);

	// Verify that code executed
	fmt.Println("Hello world");

	// Expose functions
	js.Global().Set("add", js.FuncOf(add));

	<-c;

	// document := js.Global().Get("document");

	// p := document.Call("createElement", "p");
	// p.Set("innerHTML", "Hello WASM from Go!");
	// p.Set("className", "block");

	// styles := document.Call("createElement", "style");
	// styles.Set("innerHTML", `
	// 	.block {
	// 		border: 1px solid black; color: white; background: black;
	// 	}
	// `);

	// document.Get("head").Call("appendChild", styles);
	// document.Get("body").Call("appendChild", p);
}