/* eslint no-console: 0 */

// libs
const path = require('path');
const rimrafSync = require('rimraf').sync;
const webpack = require('webpack');

// configs
const ERRORCODE = 1;
const CWD = process.cwd();
const webpackConfig = require(path.join(CWD, 'webpack.config'));

module.exports = function () {

    rimrafSync(path.join(CWD, 'build'));

    webpack(webpackConfig).run((err, stats) => {
        if (err) {
            console.error('Failed to create a production build. Reason:');
            console.error(err.message || err);
            process.exit(ERRORCODE);
        }
        
        console.log('Successfully generated a bundle in the build folder!');
    });

}