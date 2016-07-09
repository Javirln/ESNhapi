FROM node:6

RUN mkdir /src

RUN npm install -g nodemon

WORKDIR /src
ADD package.json /src

EXPOSE 3000

CMD npm install && nodemon -L --debug app/index.js
