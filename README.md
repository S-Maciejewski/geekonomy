# Geekonomy - macroeconomic data quiz 

A quiz-game of guessing which country is described by displayed economic statistics. 
Data fed by WorldBank's API: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information
Indicators can be explored here: https://databank.worldbank.org/source/world-development-indicators

It *should* be deployed here: https://geekonomy.eu but if it's not up, you can run it locally with docker-compose. That requires a bit of work so you can just message me and I'll bring it up if it's down (probably because of cost reasons).

Features planned in the future:
- country (or countries if metrics for them are shown) is highlighted on the map upon clicking answer
- mutiple quiz difficulty levels, i.e. 4 metrics 4 countries, 6 metrics 4 countries, 8 metrics 3 countries etc.

## Development
The project uses fastify API as a server and React served by nginx for the front-end. Both of those can be brought up with docker-compose but you can also run each of them separately with `npm start` in the respective directories (`server` and `client/data_quiz`).

## Data
The project uses quiz_*.json files as a way of stoting both question and correct answer data for the game engine to use. The engine is a part of the server and while it can be ran without generating quiz data, you'll need to generate some to have any quiz returned by the `/quiz` endpoint which you can then answer with POST to `/answer`.

### Generating data
This part is tricky, it requires getting the data from the WorldBank API and then processing it into the quiz_*.json files. The process is not automated and requires some manual work. You'll need to get the dump of WB data and process it with the `processor` in `data` directory.

It essentially turns the WB data into something like a data warehouse with a star schema. **You'll need a running DB instance, I used a local postgres instance.** The processor will then process the data **reading it from the data warehouse** and generate the quiz_*.json files.

## Deployment
For cost reasons the project is built off-site and then deployed to a VPS. The deployment process is essentially filling out a proper `.env` running the `build_and_ship.sh` script which builds the docker images and then pushes them to the VPS. The VPS then pulls the images and runs them with docker-compose. 
> Note: You'll need to generate the quiz data and move it to the server separately. There might also be some problems with certbot since it requires any certificates to be present and it requires a DNS record to be present. You can skip that by modifying nginx.conf to use http instead of https and removing the certbot container from the docker-compose file.

> Note: **For some reason the client's REACT_APP_API_URL is not being set properly in the docker-compose file. You'll need to set it manually in the `client/data_quiz/.env` file before building!.**
