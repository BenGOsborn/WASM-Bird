# Compile golang to WASM
go-compile:
	cd src_go/wasmBird; GOOS=js GOARCH=wasm go build -o ../static/main.wasm main.go

# Start the server for the app built using WASM
go-start:
	npm run --prefix src_go dev

# Build the Go app Docker image
# go-build:

# Run npm development server
js-dev:
	npm run --prefix src_ts dev

# Compile js app
js-compile:
	npm run --prefix src_ts compile

# Move the other static files into the compiled app
js-build: js-compile
	find . -wholename './src_ts/static/*' -not -wholename './src_ts/static/*.js' -not -wholename './src_ts/static/*.ts' -exec cp -t src_ts/dist/static {} +
