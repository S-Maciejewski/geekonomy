
docker build -t server .

docker run --name server -d `
-e QUIZ_DATA_PATH='./QUIZ_DATA_PATH' `
-p 80:8080 `
server:latest