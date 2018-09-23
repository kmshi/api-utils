FROM node:8.3.0
MAINTAINER Richard Shi

LABEL name="utils"
LABEL vendor="kujianet.com"

# Installing the packages needed to run Nightmare, and install gm(graphicsmagick)
RUN apt-get -qqy update \
  && apt-get -qqy install \
  xvfb \
  x11-xkb-utils \
  xfonts-100dpi \
  xfonts-75dpi \
  xfonts-scalable \
  xfonts-cyrillic \
  fonts-wqy-zenhei \
  x11-apps \
  clang \
  libdbus-1-dev \
  libgtk2.0-dev \
  libnotify-dev \
  libgnome-keyring-dev \
  libgconf2-dev \
  libasound2-dev \
  libcap-dev \
  libcups2-dev \
  libxtst-dev \
  libxss1 \
  libnss3-dev \
  gcc-multilib \
  g++-multilib \
  graphicsmagick \
  && apt-get -qyy autoremove \
  && rm -rf /var/lib/apt/lists/*

#RUN npm config set registry https://registry.cnpmjs.org
#RUN npm config set registry https://registry.npm.taobao.org

#RUN cd /opt && wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz
#RUN tar -xvf ffmpeg-release-64bit-static.tar.xz
ADD ./ffmpeg-3.4.1-64bit-static.tar.xz /opt/
RUN ln -s /opt/ffmpeg-3.4.1-64bit-static/ffmpeg /usr/bin/ffmpeg

ADD .   /opt/cloud
RUN cd /opt/cloud/silk && make && make decoder
RUN ln -s /opt/cloud/silk/decoder /usr/bin/decoder

RUN cd /opt/cloud && npm install && npm cache clean --force
WORKDIR /opt/cloud

# Start cloud
EXPOSE 2001
CMD ["npm", "start"]
