FROM node:22-alpine

# Variables pour installer glibc depuis le repo sgerrand
ENV GLIBC_VERSION=2.35-r0 \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# 1. Installer Chromium + glibc-compatibilty + dépendances
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ttf-freefont \
    libstdc++ \
    gcompat \
    wget \
    ca-certificates

# Copie des fichiers de package
COPY package.json ./

RUN if [ -f package-lock.json ]; then rm package-lock.json; fi

RUN rm -rf node_modules && \
npm install

# Copie des sources
#COPY . .

# Build votre appli Nuxt
# RUN npm run build

EXPOSE 3000 4000

CMD [ "npm", "run", "dev" ]
