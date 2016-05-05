FROM node:6

RUN mkdir /src

WORKDIR /src
ADD ../app/ /src/

RUN npm install

EXPOSE 3000

CMD npm start