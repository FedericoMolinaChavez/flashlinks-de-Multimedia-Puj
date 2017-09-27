FROM flashlinks/nodejs

ARG API_HOST
ENV API_HOST=$API_HOST

ARG API_PORT
ENV API_PORT=$API_PORT

# Create app directory
WORKDIR /usr/src/app

# Copy app code
COPY src/ ./src
COPY package.json .
COPY bower.json .
COPY app.js .

# Install dependencies
RUN npm install
RUN npm run bower

# Create env.js
RUN \
  envsubst < ./src/js/env.js.tmpl > ./src/js/env.js

#start app
CMD [ "npm", "start" ]
