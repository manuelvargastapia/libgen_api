## Heroku

This projects uses Heroku for deployment.

I recommend using `heroku builds:create -a polar-temple-33235` to build and push a new version of the production app from the current local directory (ignoring `.gitignore` elements). That way, it's not necessary pushing to the Git repo first. [See docs](https://github.com/heroku/heroku-builds).

## TODO

- [ ] Handle ocasional Gateway Timeouts of `getFastestMirror()`
- [ ] Use a model to generate response data (at least a BookModel)
