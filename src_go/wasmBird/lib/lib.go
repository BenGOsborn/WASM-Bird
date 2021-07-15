package lib

import (
	"syscall/js"
)

type Pipe struct {
	GapStart  float64
	GapHeight float64
	PipeX     float64
	Scored    bool
}

func AddEventListener(eventName string, callback func(this js.Value, args []js.Value) interface{}) {
	js.Global().Get("document").Call("addEventListener", eventName, js.FuncOf(callback))
}
