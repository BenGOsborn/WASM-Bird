go:
	GOOS=js GOARCH=wasm go build -o src_ts/static/main.wasm src_ts/go/main.go

# Install the required npm packages
js-install-dev:
	npm --prefix src_ts install

js-install-prod:
	npm --prefix src_ts install --production

# Run npm development server
js-dev: js-install-dev
	npm run --prefix src_ts dev

# Compile js app
js-compile: js-install-dev
	npm run --prefix src_ts compile

# Move the other static files into the compiled app
js-build: js-compile
	find . -wholename './src_ts/static/*' -not -wholename './src_ts/static/*.js' -not -wholename './src_ts/static/*.ts' -exec cp -t src_ts/dist/static {} +

js-prod:
	npm run --prefix src_ts start