FROM node:8-alpine
MAINTAINER Richard Shi

LABEL name="app-api"
LABEL vendor="kujianet.com"

#RUN npm config set registry https://registry.cnpmjs.org
#RUN npm config set registry https://registry.npm.taobao.org

#RUN cd /opt && wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-64bit-static.tar.xz
#RUN tar -xvf ffmpeg-release-64bit-static.tar.xz
#ADD ./ffmpeg-3.4.1-64bit-static.tar.xz /opt/
#RUN ln -s /opt/ffmpeg-3.4.1-64bit-static/ffmpeg /usr/bin/ffmpeg

#alpine base image does not have git and gyp g++ toolchain
RUN apk add --no-cache git python binutils-gold curl g++ gcc gnupg libgcc linux-headers make

ADD .   /opt/cloud
#RUN cd /opt/cloud/silk && make && make decoder
#RUN ln -s /opt/cloud/silk/decoder /usr/bin/decoder
RUN cd /opt/cloud && npm install && npm cache clean --force
WORKDIR /opt/cloud

# Start cloud
EXPOSE 4200
CMD ["npm", "start"]
