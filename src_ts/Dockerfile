# Stage 1
# Build the code
FROM node:latest
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY server.ts .
COPY tsconfig.json .
ADD static ./static
RUN npm run build

# Stage 2
# Run production
FROM node:latest
WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
COPY --from=0 /usr/app/dist ./dist
COPY static/index.html ./dist/static
COPY static/styles.css ./dist/static

# Start the server
EXPOSE 3000
CMD npm run start