if [[ $TRAVIS_BRANCH == 'master' || "$TRAVIS_PULL_REQUEST" == "true"]]
  polylint
fi
