FROM node:6

RUN mkdir /src

RUN npm install -g nodemon

WORKDIR /src
ADD package.json /src
RUN npm install

EXPOSE 3000

CMD nodemon -L --debug app/index.js
