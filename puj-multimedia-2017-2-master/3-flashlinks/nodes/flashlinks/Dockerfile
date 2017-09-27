FROM flashlinks/nodejs

# Create app directory
WORKDIR /usr/src/app

# Copy app code
COPY package.json .
COPY app.js .
COPY env-docker.js ./env.js

# Install dependencies
RUN npm install

# Install node process manager
RUN npm install -g pm2

#start app
CMD [ "pm2-docker", "start", "app.js" ]
