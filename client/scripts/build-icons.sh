#!/usr/bin/env bash
set -e

RAW=$1

if [ -z "$RAW" ]; then
  echo "Usage: yarn run build:icons --line  (or: yarn build:icons line)"
  exit 1
fi

SET=${RAW#--}

svgr --out-dir "assets/icons/$SET" "public/icons/$SET"
