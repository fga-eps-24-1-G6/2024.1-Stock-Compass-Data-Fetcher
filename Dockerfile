FROM node:18-alpine AS builder

RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app
COPY ["package.json", "yarn.lock", "./"]

FROM builder as dev
RUN yarn install --frozen-lockfle
COPY . .
ENV ENVIRONMENT=development
CMD [ "yarn", "start:dev" ]

FROM builder as prod
RUN yarn install --frozen-lockfle --production
COPY . .
ENV ENVIRONMENT=production
RUN yarn build
CMD [ "yarn", "start:prod" ]
