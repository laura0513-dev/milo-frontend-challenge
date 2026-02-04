FROM node:25
WORKDIR /milo-challenge
COPY package.json .
COPY package-lock.json .
RUN npm ci
RUN rm -rf ./node_modules/.cache

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npm start"]