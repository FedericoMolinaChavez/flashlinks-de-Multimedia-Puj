FROM node:7.10.1-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh gettext curl


# Create app directory
WORKDIR /usr/src/app

# Copy app code
COPY package.json .
COPY app.js .


# Install dependencies
RUN npm install

# Install node process manager
RUN npm install -g pm2

#start app
CMD [ "pm2-docker", "start", "app.js" ]
