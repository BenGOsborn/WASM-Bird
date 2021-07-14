go:
	GOOS=js GOARCH=wasm go build -o src_ts/static/main.wasm src_ts/go/main.go

# Install the required npm packages
js-install:
	npm --prefix src_ts install

# Run npm development server
js-dev: js-install
	npm run --prefix src_ts dev

# Compile js app
js-compile:
	npm run --prefix src_ts compile

# Redirect the files into the correct folder
js-move:
	mkdir src_ts/dist && find . -wholename './src_ts/*.js' -not -path './src_ts/node_modules/*' -exec mv -t src_ts/dist {} +