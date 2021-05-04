FROM ubuntu:bionic
USER root
WORKDIR /src/app
COPY . .
EXPOSE 3000
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_11.x  | bash -
RUN apt-get -y install nodejs
RUN apt-get update && apt-get install build-essential -y
RUN npm install -g yarn
RUN yarn install
RUN yarn prod
CMD node out/server.js