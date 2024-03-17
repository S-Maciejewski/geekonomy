
# Please note that in order to run this command nginx.conf should look like this:
# server {
#     listen 80;
#     listen [::]:80;
#     server_name geekonomy.eu www.geekonomy.eu;
#     server_name 51.83.133.252;

#     access_log  /var/log/nginx/geekonomy.eu.access.log  main;
#     error_log  /var/log/nginx/geekonomy.eu.error.log;

#     location /.well-known/acme-challenge/ {
#         root /var/www/certbot;
#     }
    
#     location / {
#         return 301 https://geekonomy.eu$request_uri;
#     }
# }

# For reference see: https://mindsers.blog/post/https-using-nginx-certbot-docker/

docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d geekonomy.eu -d www.geekonomy.eu
