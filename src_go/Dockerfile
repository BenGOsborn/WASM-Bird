# Stage 1
# Build the WASM file
FROM golang:latest
WORKDIR /usr/app
COPY main.go .
RUN GOOS=js GOARCH=wasm go build -o main.wasm main.go

# Stage 2
# Build the server
FROM node:latest
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
COPY server.js .
ADD static .
COPY --from=0 /usr/app/main.wasm static

# Start the server
EXPOSE 3000
CMD ls
CMD npm run start