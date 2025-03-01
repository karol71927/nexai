FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]