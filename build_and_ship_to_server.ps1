# This should make the build script fail if any command fails (i.e. no docker running)
$ErrorActionPreference = "Stop"

docker compose build
docker save -o dist/geekonomy-api.tar geekonomy-api
docker save -o dist/geekonomy-client.tar geekonomy-client

cp .env dist

get-content .env | foreach {
    $name, $value = $_.split('=')
    set-content env:\$name $value
}

echo "Connecting to $env:SSH_USER:$env:VPS_ADDRESS using key: $env:SSH_KEY_PATH"

# Copy dist through scp
echo "Copying dist to server..."
# Create the geekonomy folder on remote if it doesn't exist. Also create the cache folder and the sessions and highscores files since docker-compsoe will create them as directories
ssh -i $env:SSH_KEY_PATH $env:SSH_USER@${env:VPS_ADDRESS} "mkdir -p /home/$env:SSH_USER/geekonomy && mkdir -p /home/$env:SSH_USER/geekonomy/cache && touch /home/$env:SSH_USER/geekonomy/cache/sessions.json && touch /home/$env:SSH_USER/geekonomy/cache/highscores.json"
ssh -i $env:SSH_KEY_PATH $env:SSH_USER@${env:VPS_ADDRESS} "chmod 666 /home/$env:SSH_USER/geekonomy/cache/highscores.json && chmod 666 /home/$env:SSH_USER/geekonomy/cache/sessions.json"
scp -i $env:SSH_KEY_PATH -pr ./dist $env:SSH_USER@${env:VPS_ADDRESS}:/home/$env:SSH_USER/geekonomy
ssh -i $env:SSH_KEY_PATH $env:SSH_USER@${env:VPS_ADDRESS} "cd /home/$env:SSH_USER/geekonomy/dist && chmod +x load_images.sh generate_certificates.sh restart.sh && ./load_images.sh"
