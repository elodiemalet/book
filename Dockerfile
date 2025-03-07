FROM node:22-alpine

WORKDIR /app

# Copie des fichiers de package
COPY package.json ./

RUN if [ -f package-lock.json ]; then rm package-lock.json; fi

RUN rm -rf node_modules && \
npm install

# Copie des sources
# COPY . .

# Build votre appli Nuxt
# RUN npm run build

EXPOSE 3000 4000

CMD [ "npm", "run", "dev" ]
