
docker build -t server .

docker run --name server -d \
-e QUIZ_PATH='./quiz_path' \
-p 80:8080 \
server:latest