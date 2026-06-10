FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=development

# install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install

# copy source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
