# wb-data-quiz

A quiz-game of guessing which country is described by displayed economic statistics. 
Data fed by WorldBank's API: https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information
Indicators can be explored here: https://databank.worldbank.org/source/world-development-indicators


MVP: user is presented with i.e. 5 indicators in form of graphs or raw time series and 4 country names. They have to guess which country matches the data


Nice to have:
- upon clicking the answer, user sees the metrics for choosen country displayed on the plots (to see the comparison between his guess and the country portrayed by metrics)
- country (or countries if metrics for them are shown) is highlighted on the map upon clicking answer

- (_release cost cutting_) save pre-calculated quizes in an efficient way (lots of them i.e. as JSON files on S3?) to minimize the cost of running a heavy Postgres instance. It could eliminate the need for database, thus minimizing hosting costs, epspecially if reads from S3 are infrequent at the beginning

- (_release cost cutting_) consider folding the Engine and Session management from into the client to avoid the need for server entirely - it would mean just hosing a heavier client (free on GH pages) and a fairly large set of small, easily downloaded json files on a service like S3. This would mean that the player can 'cheat' by inspecting the contents of this single, pre-defined file while it's browser downloads it
