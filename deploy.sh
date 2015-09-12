#!/bin/bash

gulp build
git add dist/ && git commit -m "Production deployment."
git subtree push --prefix dist origin gh-pages
git stash save
git checkout master
git checkout -D gh-pages

