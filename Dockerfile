# FROM node:20: el nombre y versión de la imagen base utilizada (obtenida de hub.docker.com)
# WORKDIR /app: el directorio de trabajo utilizado dentro de la imagen
# COPY package*.json ./: copia package.json y package-lock.json al raíz
# RUN npm install: ejecuta el npm install que descarga todo lo indicado en package.json
# Instala las dependencias del sistema necesarias para Chrome Headless
# COPY . .: copia el resto de los archivos fuente de nuestra app a la imagen
# EXPOSE 3000: al correr la app, será expuesta en el puerto 3000
# CMD ["npm", "start"]: ejecuta finalmente un npm start para iniciar la app
# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chrome that Puppeteer
# installs, work.
# Install @puppeteer/browsers, puppeteer and puppeteer-core into /home/pptruser/node_modules.



FROM node
WORKDIR / 

COPY package*.json ./
RUN npm install 

RUN apt-get update && apt-get install -yq \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY . . 
EXPOSE 3030
CMD ["npm", "start", "google-chrome-stable"]



