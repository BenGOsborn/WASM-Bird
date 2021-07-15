package lib

import (
	"syscall/js"
)

func AddEventListener(eventName string, callback func(this js.Value, args []js.Value) interface{}) {
	js.Global().Get("document").Call("addEventListener", eventName, js.FuncOf(callback))
}
