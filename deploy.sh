#!/bin/bash

git remote set-url origin git@github.com:DavidLazic/SeeR.git
rm -rf dist
gulp build
git add dist/ && git commit -m "Production deployment."
git subtree push --prefix dist origin gh-pages
git add -A
git stash save
git checkout master
git branch -D gh-pages
git remote set-url origin git@bitbucket.org:DavidLazic/seer.git
git stash clear


