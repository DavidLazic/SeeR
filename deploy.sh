#!/bin/bash

rm -rf dist
gulp build
git add dist/ && git commit -m "Production deployment."
git subtree push --prefix dist origin gh-pages
git add -A
git stash save
git checkout master
git branch -D gh-pages

