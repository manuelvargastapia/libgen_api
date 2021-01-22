# LibGen Mobile API

Este es el *backend* para [LibGen Mobile](https://github.com/manuelvargastapia/libgen_mobile_app/tree/master), el cliente móvil no oficial para Library Genesis, creado con Flutter.

Al igual que LibGen Mobile, este es un proyecto *Open Source*, así que toda colaboración es bienvenida. Ver el [README](https://github.com/manuelvargastapia/libgen_mobile_app/blob/master/README.es.md) de LibGen Mobile para más detalles.

[*English version*](README.md)

## libgen.js

Library Genesis no provee una API pública, aspí que este proyecto depende de [libgen.js](https://www.npmjs.com/package/libgen#usage-searching). Sin embargo, actualmente se está trabajando con un *fork* de la librería original para extender sus funcionalidades base. Ver [repo](https://github.com/manuelvargastapia/libgen.js/tree/filter_by_fields).

## Ejecución

`npm start` ejecuta directamente el archivo *api.ts* sin compilar. Permite *hot reload* y ver los *logs*.

`npm run serve` compila y ejecuta posteriormente el archivo *api.ts* desde el directorio *dist* generado. No permite hot reload, pero aún es posible ver los logs.

En ambos casos, es posible pasar el *port* y *hostname* como argumentos de línea de comandos. Por ejemplo:

`npm run serve -- --port=8000 --hostname=255.255.255.255`

Los valores por defecto son **3000** y **0.0.0.0**, respectivamente.

El *logging* se realiza con el paquete [debug](https://www.npmjs.com/package/debug). No es necesario validarlo o removerlo para el paso a producción.

`heroku local` (también, `heroku local web`) ejecuta el proyecto con el comando especificado en el archivo *Procfile*. No muestra *logs* ni permite *hot reload*.

Luego de subir a Heroku, se ejecuta el comando `postinstall` automáticamente. Debido a esto, no es necesario incluir el directorio *dist* en Git.

Ver [*package.json*](package.json) para más detalles.

[Aprender más de Heroku](https://devcenter.heroku.com/categories/nodejs-support).

## TODO

- [ ] Mejorar rendimiento
