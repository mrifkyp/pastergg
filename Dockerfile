FROM node:18-slim

RUN apt-get update && \
    apt-get install -y wget gnupg && \
    apt-get install -y libxshmfence1 libgbm-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
