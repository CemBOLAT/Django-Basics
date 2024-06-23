
From nginx:alpine

EXPOSE 80

COPY ./index.html /usr/share/nginx/html/index.html

COPY ./nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf