FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN mkdir -p public/uploads

EXPOSE 3000

CMD ["npm", "run", "dev"]
