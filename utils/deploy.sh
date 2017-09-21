#!/bin/bash -e
npm version $1
git push
git push --tags
./utils/github-pages.sh mammooc mammooc-rating-widget dev
rm -rf ./mammooc-rating-widget
