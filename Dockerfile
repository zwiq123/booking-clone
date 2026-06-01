FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma generate

RUN mkdir -p public/uploads

EXPOSE 3000

CMD ["npm", "run", "dev"]
