FROM node:6

RUN mkdir /src

WORKDIR /src
ADD package.json /src

EXPOSE 3000

CMD ./node_modules/.bin/nodemon -L --debug app/index.js
