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

# Redirect the files into the correct folder
# Copy all of the static files except for ts files and then copy the server.js file
# mkdir src_ts/dist && find . -wholename './src_ts/*.js' -not -path './src_ts/node_modules/*' -exec mv -t src_ts/dist {} +
# js-move:
# 	mkdir src_ts/dist && find . -wholename './src_ts/*.js' -not -path './src_ts/node_modules/*' -exec mv -t src_ts/dist {} +

#  && cp src_ts/server.js src_ts/dist && cp -r src_ts/static src_ts/dist && 
# Move all of the static files into the dist and move the server as well
js-move: js-compile
	find . -wholename './src_ts/static/*' -not -wholename './src_ts/static/*.js' -not -wholename './src_ts/static/*.ts' -exec cp -t src_ts/dist/static {} +