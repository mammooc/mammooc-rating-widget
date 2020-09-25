# mammooc-rating-widget
Widget to provide ratings and evaluations from mammmooc.org to other platforms. For documentation and a demo visit:
https://mammooc.github.io/mammooc-rating-widget/

Feel free to contribute to the project!

[![Build Status](https://travis-ci.org/mammooc/mammooc-rating-widget.svg?branch=master)](https://travis-ci.org/mammooc/mammooc-rating-widget)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/mammooc.svg)](https://saucelabs.com/u/mammooc)

## Developing

Always develop on the `dev` branch (due to different staging and production URLs).

## Releasing

1. Create the documentation (on `dev` branch):
   ```
   npm run analyze
   ```

2. Switch to `master` and merge the `dev` branch

3. Build artefacts and release to npm

   ```
   npm version 3.1.2
   npm publish
   npm run bundle
   ```

4. Push everything incl. the new tag

5. Zip the content from the build directory and name it `mammooc-rating-widget-v3.1.2.zip`

6. Create a new GitHub release named `Version 3.1.2` for the tag pushed a few moments ago and shortly describe your changes.
