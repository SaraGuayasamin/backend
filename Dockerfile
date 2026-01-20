FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app
COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
