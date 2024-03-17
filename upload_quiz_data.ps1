$QUIZ_DATA_PATH = './quiz_data.7z'

get-content .env | foreach {
    $name, $value = $_.split('=')
    set-content env:\$name $value
}

scp -i $env:SSH_KEY_PATH -pr $QUIZ_DATA_PATH $env:SSH_USER@${env:VPS_ADDRESS}:/home/$env:SSH_USER/geekonomy
