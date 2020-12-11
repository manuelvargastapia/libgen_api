# LibGen Mobile API

This is the backend for LibGen Mobile, the non-official mobile client for Library Genesis built with Flutter.

As well as LibGen Mobile, this project is Open Source, so feel free to collaborate. Check LibGen Mobile [README](https://github.com/manuelvargastapia/libgen_mobile_app/blob/master/README.md) for more details.

(*Versión en español*)[README.es.md]

## libgen.js

Library Genesis doesn't provide a public API, so this project depends on [libgeb.js](https://www.npmjs.com/package/libgen#usage-searching). However, currently we're working with a custom fork of the original library to extend the main funcionality. Check the [repo](https://github.com/manuelvargastapia/libgen.js/tree/filter_by_fields).

## Run

`npm start` runs *api.ts* file directcly, without building. Allows hot reload and logging.

`npm run serve` build and run *api.ts* file from generated *dist* folder. Doesn't allos hot reload, but still you can see the logs.

In both cases, it's possible to pass *port* and *hostname* as command line arguments. For example: 

`npm run serve -- --port=8000 --hostname=255.255.255.255`

Default values are **3000** and **0.0.0.0**, respectively.

The logging depends on [debug](https://www.npmjs.com/package/debug) package. There is no need to validate or remove to release.

`heroku local` (or `heroku local web`) runs the project with the command specified in *Procfile* file. No logs nor hot reload.

After submitting to Heroku, the `postinstall` command will be run. Because of this, there is no need to include in Git the generated *dist* folder.

See [*package.json*](package.json) for details.

[Learn more about Heroku](https://devcenter.heroku.com/categories/nodejs-support).

## TODO

- [ ] Improve performance
