build:
	GOOS=js GOARCH=wasm go build -o src/static/main.wasm src/go/main.go
