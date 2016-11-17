# webpack-preset-unity

webpack preset.

## Usage

### Install:

```js
npm install --save-dev webpack-preset-unity
```

### Configure

Require `webpack-preset-unity` from your own `webpack.config.js`. If you want, you can override all of the config fields.
The module returns the fabric function that creates common config for webpack.
Because your project can be builded in unexpected environment you shoud know `CWD` – current working directory. 
It can be passed to the factory by argument like in example. 
By default, `CWD` will be `path.join(require.resolve('.'), '../../..')` – 3 levels up from the webpack-preset-unity's main file. 

```js
const config = require('webpack-preset-unity')(__dirname);

config.module.noParse = /node_modules\/localforage\/dist\/localforage.js/;

module.exports = config;
```