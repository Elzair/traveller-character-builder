#!/bin/sh
TOTAL=$(wc -l $(find . -path ./utils/cepheus-scraper/node_modules -prune -o -path ./lib/fmt/node_modules -prune -o -path ./node_modules -prune -o -type f \( -iname "*.js" -or -iname "*.json" ! -iname  "package-lock.json" \)) 2>/dev/null | tail -n 1 | awk '{print $1}')
DUP=$(wc -l utils/cepheus-scraper/careers.json | awk '{print $1}')
dc -e $TOTAL' '$DUP' - p'