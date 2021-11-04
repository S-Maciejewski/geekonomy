cat "$(ls -t *.log | head -1)" | pino-pretty | less
