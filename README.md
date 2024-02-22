# Desafio Wavelight - Web

## Resumo

Objetivo: Desenvolver uma aplicação web com funcionalidade de conversão de vídeo para GIF. A aplicação deve incluir um front-end construído em React e um back-end em NestJS, ambos utilizando TypeScript.

Candidato: Victor Aguiar

Acesse a aplicação no navegador pelo endereço http://localhost/. Garanta que as portas 3000 (back-end), 80 (front-end) e 5432 (banco de dados) estejam disponíveis.

A aplicação foi desenvolvida em containers (front-end em React.js, back-end em Nest.js e banco de dados com PostgreSQL), e projetada para rodar em ambiente Linux, ou seja, caso você tente subir a stack em outro OS, precisará de algumas alterações. Vale lembrar que por ser feita em containers, a aplicação demorará um pouco para iniciar na primeira vez que a stack for levantada.

## Requisitos

- docker
- docker-compose

# Entregáveis

## Autenticação e Gestão de Usuários:

_Implementar autenticação simples_ - Implementei um sistema de autenticação bem simples (sem criptografia no banco de dados, sem necessidade de caracteres especiais etc), somente validando um email através do campo "type=email", pedindo uma senha com no mínimo 6 caracteres e impedindo cadastros duplicados.

## Funcionalidade de Upload e Biblioteca de GIFs:

_Desenvolver uma interface para que os usuários autenticados possam enviar arquivos de vídeo._ - Fiz uma interface bem modesta, com pouca estilização. Todo o ambiente foi feito na mesma página, numa tentativa de deixar a navegação mais "dinâmica".

## Conversão de Vídeo para GIF:

_Desenvolver uma API no back-end para receber arquivos de vídeo e convertê-los em GIF._ - Desenvolvi no back-end como requisitado, com as rotas GifController e VideoController como responsáveis por essas tarefas (mais explicações abaixo).

## Armazenamento de Dados:

_Decidir sobre uma estratégia de armazenamento para os dados dos usuários e os GIFs criados._ - Optei por armazenar os dados dos usuário no Postgres, assim como os dados dos vídeos (id do usuário correspondente, título do vídeo), o que futuramente foi utilizado para retornar os gifs de cada usuário, ou seja, se o usuário1 converteu o gif1, ele só conseguirá ver o gif1 na sua biblioteca (não verá gifs de outros usuários), graças à validação via banco de dados. Já os gifs, esses foram armazenados localmente no diretório /uploads, com um ponto de montagem no container Nest.js, em /app/uploads.

## Breve explicações sobre as rotas

Arquitetei 5 rotas para desenvolver a API:
- AuthController - Rota para fazer a autenticação de login
- UserController - Rota para cadastrar novos usuários
- RegistrationController - Rota para verificar se esse usuário já está cadastrado
- GifController - Rota para retornar os gifs de cada usuário 
- VideoController - Rota para lidar com a subida de videos e conversão dos mesmos para gif (Utilizei ffmpeg para fazer a conversão)

## Iniciar a stack localmente

```shell
make up
```

## Derrubar a stack localmente

```shell
make down
```

> [!NOTE]
> Sobre o armazenamento dos gifs, eu optei por armazenar os arquivos localmente com um ponto de montagem no container Nest por se tratar de uma arquitetura mais simples. Porém, para ganhar maior disponibilidade e desacoplamento dos dados, poderia também optar por armazenar esses dados num bucket por exemplo.