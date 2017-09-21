#!/bin/bash -e
npm --no-git-tag-version version $1
git push
./utils/github-pages.sh mammooc mammooc-rating-widget dev
rm -rf ./mammooc-rating-widget
