if [[ $TRAVIS_BRANCH == 'master' || "$TRAVIS_PULL_REQUEST" != "false"]]
  polylint
fi
