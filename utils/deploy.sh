#!/bin/bash -e
npm --no-git-tag-version version $1
git add package.json package-lock.json
git commit -m $1
git push
npm publish
./utils/github-pages.sh mammooc mammooc-rating-widget dev
rm -rf ./mammooc-rating-widget
