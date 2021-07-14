# Compile golang to WASM
go-build:
	GOOS=js GOARCH=wasm go build -o src_go/static/main.wasm src_go/main/main.go

# Start the Go server
go-start:
	go run src_go/server.go

# Install the required npm packages
js-install-dev:
	npm --prefix src_ts install

# Run npm development server
js-dev: js-install-dev
	npm run --prefix src_ts dev

# Compile js app
js-compile: js-install-dev
	npm run --prefix src_ts compile

# Move the other static files into the compiled app
js-build: js-compile
	find . -wholename './src_ts/static/*' -not -wholename './src_ts/static/*.js' -not -wholename './src_ts/static/*.ts' -exec cp -t src_ts/dist/static {} +