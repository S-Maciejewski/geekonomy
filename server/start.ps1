
docker build -t server .

docker run --name server -d `
-e QUIZ_DATA_PATH='/quiz_data' `
-e SERVER_ADDRESS='0.0.0.0' `
-e PORT=80 `
-v C:\Projekty\geekonomy\quiz_data:/quiz_data `
-p 80:80 `
--rm `
server:latest