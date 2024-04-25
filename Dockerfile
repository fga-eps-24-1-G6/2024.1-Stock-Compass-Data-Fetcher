FROM node:18-alpine AS builder

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]

FROM builder as dev
RUN yarn install --frozen-lockfle
COPY . .
CMD [ "yarn", "start:dev" ]

FROM builder as prod
RUN yarn install --frozen-lockfle --production
COPY . .
RUN yarn add global @nest/cli
RUN uarn build
CMD [ "yarn", "start:prod" ]
