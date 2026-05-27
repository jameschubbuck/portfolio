#!/usr/bin/env bash
set -e
find . -name '*.go' -o -name '*.html' -o -name '*.css' -o -name '*.js' | grep -v -e '/\.' -e '/node_modules' -e '/out/' | entr -r go run .
