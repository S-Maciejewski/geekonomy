docker compose build

# package the images and scp them to the server
docker save -o dist/geekonomy-api.tar geekonomy-api
docker save -o dist/geekonomy-client.tar geekonomy-client
docker save -o dist/geekonomy-certbot.tar geekonomy-certbot

cp .env dist

get-content .env | foreach {
    $name, $value = $_.split('=')
    set-content env:\$name $value
}

# Copy dist through scp
scp -i $SSH_KEY_PATH dist $SSH_USER@${VPS_ADDRESS}:/home/$SSH_USER/geekonomy/dist
