# webpack-preset-unity

webpack preset.

## Usage

### Install:

```js
npm install --save-dev webpack-preset-unity
```

### Configure

Require `webpack-preset-unity` from your own `webpack.config.js`. If you want, you can override all of the config fields.

```js
const config = require('webpack-preset-unity');

config.module.noParse = /node_modules\/localforage\/dist\/localforage.js/;

module.exports = config;
```