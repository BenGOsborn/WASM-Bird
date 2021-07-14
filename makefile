go:
	GOOS=js GOARCH=wasm go build -o src_ts/static/main.wasm src_ts/go/main.go

js-dev:
	npm run --prefix src_ts dev

js-install:
	npm --prefix src_ts install