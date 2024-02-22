FROM node:16-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

# Colocando o ffmpeg no container para lidar com a conversão de gifs
RUN apk update && apk add --no-cache ffmpeg

# Criando o diretório uploads
RUN mkdir uploads

# Criando um arquivo index.html para conseguir servir os gifs quando acessados
RUN echo "<!DOCTYPE html><html><head><title>Index Page</title></head><body><h1>Você ainda não converteu nenhum gif</h1></body></html>" > uploads/index.html

EXPOSE 3000

COPY . .

CMD ["npm", "start"]