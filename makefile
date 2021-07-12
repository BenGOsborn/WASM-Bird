build:
	GOOS=js GOARCH=wasm go build -o src/static/one.wasm src/go/one.go
	GOOS=js GOARCH=wasm go build -o src/static/two.wasm src/go/two.go
