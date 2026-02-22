FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i --force
COPY . .
CMD ["npm", "start"]
