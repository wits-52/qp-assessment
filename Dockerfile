FROM node:alpine
RUN apk add --no-cache bash
RUN npm install typescript -g
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "/bin/bash", "docker-entrypoint.sh" ] 


