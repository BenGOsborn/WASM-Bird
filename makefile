build:
	GOOS=js GOARCH=wasm go build -o src/static/wasm/one.wasm src/go/one.go
	GOOS=js GOARCH=wasm go build -o src/static/wasm/two.wasm src/go/two.go
