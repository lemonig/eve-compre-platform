FROM nginx:alpine

RUN mkdir -p /app
ADD _file/build.zip /tmp/
RUN cd /tmp && unzip build.zip
RUN rm -rf /usr/share/nginx/html/*
RUN cp -a /tmp/build/* /usr/share/nginx/html
RUN cp -a /etc/nginx/* /app/
RUN cp -a /app/* /etc/nginx/
COPY _nginx/default.conf /etc/nginx/conf.d/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


