FROM debian:oldstable-slim

RUN apt-get update && apt-get install -y procps \
	mkdir -p /home/app/staticfiles \
	&& apt-get clean \ app-get update && apt-get install -y nginx openssl nginx-extras \
	&& mkdir /etc/ssl/certs

COPY ./nginxsh.sh /var/www
COPY ./conf/nginx.conf /etc/nginx/sites-available/default

RUN chmod +x /var/www/nginxsh.sh
RUN mkdir -p /run/nginx

ENTRYPOINT ["var/www/nginxsh.sh"]

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
