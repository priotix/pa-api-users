FROM keymetrics/pm2:14-alpine
LABEL maintainer=priotix

RUN apk add --no-cache python build-base

COPY package.json package-lock.json /tmp/pa-api-users/

RUN cd /tmp/pa-api-users && npm install
RUN npm cache clean --force

RUN mkdir -p /var/www/pa-api-users && cp -a /tmp/pa-api-users/node_modules /var/www

WORKDIR /var/www/pa-api-users
ADD . /var/www/pa-api-users

CMD pm2-runtime start pm2.config.json --env ${NODE_ENV}
