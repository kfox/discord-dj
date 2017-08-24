FROM alpine

ENV APK_OPTIONS \
  --quiet \
  --no-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community/ \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main/

ENV APP_DEPENDENCIES \
  bash \
  nodejs-current \
  youtube-dl

ENV \
  APP_DIR="/discord-dj"

RUN apk ${APK_OPTIONS} update
RUN apk ${APK_OPTIONS} add ${APP_DEPENDENCIES}

RUN addgroup -g 1000 node && \
  adduser -u 1000 -G node -s /bin/sh -h ${APP_DIR} -D node

WORKDIR ${APP_DIR}

RUN npm install pm2 --global --loglevel error
COPY package.json ./

ENV BUILD_DEPENDENCIES \
  autoconf \
  automake \
  binutils \
  bzip2 \
  ca-certificates \
  cmake \
  coreutils \
  curl \
  expat \
  expat-dev \
  g++ \
  gcc \
  git \
  gperf \
  libgcc \
  libgomp \
  libstdc++ \
  libtool \
  make \
  musl=1.1.16-r17 \
  openssl-dev \
  python \
  tar \
  yasm \
  zlib-dev

RUN apk ${APK_OPTIONS} --virtual .build-deps add ${BUILD_DEPENDENCIES}

USER node
RUN export MAKEFLAGS="-j$(($(grep -c ^processor /proc/cpuinfo) + 1))" && \
  npm install --loglevel error

USER root
RUN apk --quiet del .build-deps

USER node
COPY . ./

CMD [ "pm2", "start", "pm2-config.json", "--no-daemon" ]
