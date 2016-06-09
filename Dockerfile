FROM node:6

RUN mkdir /src

RUN npm install -g nodemon

WORKDIR /src
ADD app/package.json /src/package.json
RUN npm install

EXPOSE 3000

CMD nodemon -L --debug
