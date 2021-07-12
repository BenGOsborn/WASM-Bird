FROM golang:latest

WORKDIR /app

# How do I mount a volume onto this for dev ?

COPY go.mod .

RUN go mod download

COPY . .

ENV PORT 8000

RUN go build

CMD ["./WASM-Bird"]