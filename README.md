## Heroku

This projects uses Heroku for deployment.

I recommend using `heroku builds:create -a polar-temple-33235` to build and push a new version of the production app from the current local directory (ignoring `.gitignore` elements). That way, it's not necessary pushing to the Git repo first. [See docs](https://github.com/heroku/heroku-builds).

## libgen.js

Library Genesis doesn't provide a public API, so this project depends on [libgeb.js](https://www.npmjs.com/package/libgen#usage-searching). However, currently working with a custom fork of the original library to implement search by ID and filtering by fields. Check the [repo](https://github.com/manuelvargastapia/libgen.js/tree/filter_by_fields).

## TODO

- [ ] Handle ocasional Gateway Timeouts of `getFastestMirror()`
- [ ] Use a model to generate response data (at least a BookModel)
- [ ] Provide beeter feedback by returning corresponding HTTP codes
  - [ ] Check [Express error handling](https://www.robinwieruch.de/node-express-error-handling)
- [ ] Change remote branch name of libgen.js
- [ ] Improve performance
  - [ ] Check [Express guide](https://expressjs.com/en/advanced/best-practice-performance.html)
