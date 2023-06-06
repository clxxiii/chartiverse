FROM node:18

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

RUN npx prisma migrate dev

CMD [ "node", "build"]