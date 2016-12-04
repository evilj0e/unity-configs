# roll-preset-unity

Default configuration with utils to start & build family of applications.

## Usage

### Install:

```js
npm install --save-dev roll-preset-unity
```

### Configure

**Important** You should setup `--project` before usage that preset. 
It will be used by `webpack-preset-unity` to specify which project should be build or run.
```json
{
  "name": "project51",
  "version": "0.0.1",
  "dependencies": {
    "roll-preset-unity": "^1.0.0"
  },
  "scripts": {
    "start": ./node_modules/.bin/roll --project 'project1'",
    "build": ./node_modules/.bin/roll --build --project 'project1' -p"
  }
}
``` 

Default configuration starts your app on http://localhost:9000.
You can override that configuration by `unity` block in your project's `package.json` (for previous example with project1, it should be placed in package.json of project1 directory).

Example:
```json
{
  "name": "project1",
  "version": "0.0.1",
  "dependencies": {
    "roll-preset-unity": "^3.0.0"
  },
  "unity": {
    "certName": "mysite.ru.pem", 
    "host": "https://local.mysite.ru",
    "port": "9000",
    "server": {
      "historyApiFallback": {
        "rewrites": [{
          "from": "/^\/(user|order|cart|item)\/.*$/",
          "to": "/"
        }]
      },
      "proxy": {
        "/api/": {
          "target": "https://mysite.ru",
          "secure": false,
          "changeOrigin": true
        }
      }
    }
  }
}
```

## Configurable fields

### certName
Adds a pem-file to switch on https on your dev workaround.
You should put your pem-file in the same dir where package.json situated. If you want use other directory, you should keep certName value relative to basePath.
(Ex. `"certName": "../configs/mysite.ru.pem"`)

Default: `certName` is undefined. Http server, without any certs

### host
Host, which will be used for development server.

Default: `http://localhost`

### port
Port, which will be used for development server.

Default: `9000`

### server
You can use that field to add / override configs which used by `WebpackDevServer`.

Default: 
```
{
    "hot": true,
    "publicPath": webpackConfig.output.publicPath,
    "quiet": true
}
```

## Default config 

```
{
  ...
  "unity": {
    "host": "http://localhost",
    "port": "9000",
    "server": {
      "hot": true,
      "publicPath": webpackConfig.output.publicPath,
      "quiet": true
  },
  ...
}
```