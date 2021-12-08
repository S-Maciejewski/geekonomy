docker rm -f nginx-proxy nginx-proxy-letsencrypt
docker-compose down

docker run --detach --name nginx-proxy --publish 80:80 --publish 443:443 --volume /etc/nginx/certs --volume /etc/nginx/vhost.d --volume /usr/share/nginx/html --volume /var/run/docker.sock:/tmp/docker.sock:ro jwilder/nginx-proxy

docker run --detach --name nginx-proxy-letsencrypt --volumes-from nginx-proxy --volume /var/run/docker.sock:/var/run/docker.sock:ro jrcs/letsencrypt-nginx-proxy-companion

docker-compose up -d --build

docker network connect geekonomy_default nginx-proxy