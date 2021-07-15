# Stage 1 - Build the WASM file
FROM golang:latest
WORKDIR /usr/app
ADD wasmBird/* .
RUN go mod download
RUN GOOS=js GOARCH=wasm go build -o main.wasm main.go

# Stage 2 - Start the node server
FROM node:latest
WORKDIR /usr/app
COPY --from=0 /usr/app