/* eslint no-console: 0 */
/* eslint func-names: 0 */
/* eslint vars-on-top: 0 */

// libs
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const utils = require('../utils');

// configs
const CWD = process.cwd();
const argv = require('yargs').argv;

if (!argv.project) {
    throw new Error('You should pass --project param with project name to webpack');
}

const webpackConfig = require(path.join(CWD, 'webpack.config'));
const unityConfig = require(path.join(CWD, argv.project, 'package.json')).unity || {};

const cert = utils.getCert(unityConfig);
const compiler = webpack(webpackConfig);

module.exports = function () {

    new WebpackDevServer(compiler, Object.assign({}, {
        hot: true,
        publicPath: webpackConfig.output.publicPath,
        quiet: true,
        https: cert && {
            key: cert,
            cert
        }
    }, unityConfig.server)).listen(unityConfig.port || utils.DEFAULTS.port, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        if (!process.env.NO_BROWSER) {
            utils.openBrowser(utils.getFullUrl(unityConfig.host, unityConfig.port));
        }
    });

}