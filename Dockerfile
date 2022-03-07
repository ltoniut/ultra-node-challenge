FROM node:12.14-alpine as node

WORKDIR /app

COPY package*.json ./
COPY .npmrc ./

RUN npm install
RUN npm run build

COPY --from=builder /app/dist ./dist

CMD ["npm", "run"]