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
# Create the dist folder on remote if it doesn't exist
ssh -i $env:SSH_KEY_PATH $env:SSH_USER@${env:VPS_ADDRESS} "mkdir -p /home/$env:SSH_USER/geekonomy"
scp -i $env:SSH_KEY_PATH -pr ./dist $env:SSH_USER@${env:VPS_ADDRESS}:/home/$env:SSH_USER/geekonomy
ssh -i $env:SSH_KEY_PATH $env:SSH_USER@${env:VPS_ADDRESS} "cd /home/$env:SSH_USER/geekonomy/dist && ./load_images.sh"
