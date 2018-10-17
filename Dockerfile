FROM node:alpine

RUN mkdir -p /app
WORKDIR /app

COPY build .
RUN npm i -pq

CMD ["node", "src"]
