from node:21.3-slim
workdir /front
copy public public
copy src src
copy package.json package.json
run npm install
expose 3000
entrypoint ["npm", "start"]
