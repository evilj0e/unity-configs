# roll-preset-unity

Default configuration with utils to start & build application.

## Usage

### Install:

```js
npm install --save-dev roll-preset-unity
```

### Configure

Default configuration starts your app on http://localhost:9000.
You can override that configuration by `unity` block in your `package.json` file of your project.

Example:
```json
{
  "name": "project51",
  "version": "0.0.1",
  "dependencies": {
    "roll-preset-unity": "^1.0.0"
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