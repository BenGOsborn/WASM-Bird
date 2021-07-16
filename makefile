# --------------------- Go app -------------------------

# Compile Go to WASM
go-compile:
	cd src_go/; GOOS=js GOARCH=wasm go build -o static/main.wasm main.go

# Install npm dependencies
go-install:
	npm install --prefix src_go

# Start the server for the app built using WASM
go-dev: go-install
	npm run --prefix src_go dev

# Build the Go app Docker image
go-build:
	docker build -t bengosborn/go-wasmbird src_go

# Run the Go app Docker image
go-run: go-build
	docker run -dp 3000:3000 bengosborn/go-wasmbird:latest

# --------------------- TS app -------------------------

# Install npm dependencies
ts-install:
	npm install --prefix src_ts

# Run npm development server
ts-dev: ts-install
	npm run --prefix src_ts dev

# Build the TS Docker image
ts-build:
	docker build -t bengosborn/ts-wasmbird src_ts

# Run the TS Docker image
ts-run: ts-build
	docker run -dp 3000:3000 bengosborn/ts-wasmbird:latest