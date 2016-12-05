/* eslint vars-on-top:0 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const argv = require('yargs').argv;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// flags
const isDevelopmentMode = (process.env.NODE_ENV === 'development');
const isProductionMode = !isDevelopmentMode;
const isDashboardMode = (process.env.DASHBOARD !== 'false' && !argv.p);

/**
 * Fabric function thar creates config object
 * 
 * @param {String} CWD – Current working directory
 * @returns {Object} – Generated configs
 */
function createConfig(CWD) {
    CWD = path.join(CWD, argv.project) || path.join(require.resolve('.'), '../../..');

    const srcPath = path.resolve(path.join(CWD, 'src'));
    const corePath = path.resolve(path.join(CWD, '..', 'core'));
    const nodeModulesPath = path.join(CWD, '..', 'node_modules');
    const indexHtmlPath = path.resolve(CWD, 'index.html');
    const faviconPath = path.resolve(CWD, 'favicon.png');
    const buildPath = path.join(CWD, '..', '/build', argv.project);
    const package = require(CWD + '/package.json');
    const babelrc = fs.readFileSync(path.resolve(path.join(CWD, '..', '.babelrc')));

    let Dashboard;
    let DashboardPlugin;
    let dashboard;

    if (isDashboardMode) {
        Dashboard = require('webpack-dashboard');
        DashboardPlugin = require('webpack-dashboard/plugin');
        dashboard = new Dashboard();
    }

    return {
        bail: isProductionMode,
        devtool: isDevelopmentMode ? 'eval' : 'source-map',
        entry: {
            main: [ path.join(srcPath, 'index') ].concat(
                isProductionMode ? [] : [
                    require.resolve('webpack-dev-server/client'),
                    require.resolve('webpack/hot/dev-server')
                ]
            ),
            vendor: [ 'react', 'fetch-polyfill' ]
        },
        output: {
            path: buildPath,
            pathinfo: isDevelopmentMode,
            filename: isDevelopmentMode ? 'bundle.js' : '[name].' + package.version + '.js',
            chunkFilename: isProductionMode && '[name].' + package.version + '.chunk.js',
            publicPath: '/'
        },
        resolve: {
            root: path.resolve(path.join(CWD, '..')),
            extensions: [ '', '.js', '.jsx', '.json' ]
        },
        resolveLoader: {
            root: nodeModulesPath,
            moduleTemplates: [ '*-loader' ]
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loader: 'eslint',
                    include: [ srcPath, corePath ]
                },
                {
                    test: /\/src\/.+\.jsx?$/,
                    loader: 'baggage?style.css&[file].css&style.less&[file].less',
                    include: [ srcPath, corePath ]
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    include: [ srcPath, corePath ],
                    loader: 'babel',
                    query: Object.assign(package.babel || {}, Object.assign({ 
                        cacheDirectory: isDevelopmentMode
                    }, JSON.parse(babelrc)))
                },
                {
                    test: /\.(css|less)$/,
                    include: [ srcPath, corePath ],
                    loader: (function () {
                        const cssLoaders = 'css!csso!less!postcss'; 
                        
                        return isDevelopmentMode ? 
                            'style!' + cssLoaders : 
                            ExtractTextPlugin.extract('style', cssLoaders);
                    })()
                },
                {
                    test: /\.json$/,
                    loader: 'json'
                },
                {
                    test: /\.(jpg|png|gif|eot|ttf|otf|woff|woff2)$/,
                    loader: 'file'
                },
                {
                    test: /\.(mp4|webm)$/,
                    loader: 'url?limit=10000'
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-url'
                }
            ]
        },
        eslint: {
            useEslintrc: true
        },
        postcss: function() {
            return [
                require('postcss-cssnext')
            ];
        },
        plugins: [
            dashboard && new DashboardPlugin(dashboard.setData),
            new CopyWebpackPlugin([
                { from: path.join(argv.project, 'public'), to: 'public' },
                { copyUnmodified: true }
            ]),
            new LodashModuleReplacementPlugin(),
            new webpack.DefinePlugin({ 
                'process.env.NODE_ENV': isDevelopmentMode ? '"development"' : '"production"',
                IS_DEVELOP: isDevelopmentMode
            }),
            new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
        ].filter(Boolean).concat(
            isDevelopmentMode ? [
                new HtmlWebpackPlugin({
                    inject: true,
                    template: indexHtmlPath,
                    favicon: faviconPath
                }),
                new webpack.HotModuleReplacementPlugin()
            ] : [
                new HtmlWebpackPlugin({
                    inject: true,
                    template: indexHtmlPath,
                    favicon: faviconPath,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                        removeRedundantAttributes: true,
                        useShortDoctype: true,
                        removeEmptyAttributes: true,
                        removeStyleLinkTypeAttributes: true,
                        keepClosingSlash: true,
                        minifyJS: true,
                        minifyCSS: true,
                        minifyURLs: true
                    }
                }),
                new webpack.optimize.OccurrenceOrderPlugin(),
                new webpack.optimize.DedupePlugin(),
                new webpack.optimize.UglifyJsPlugin({
                    compressor: {
                        screw_ie8: true, // eslint-disable-line camelcase
                        warnings: false
                    },
                    mangle: {
                        screw_ie8: true // eslint-disable-line camelcase
                    },
                    output: {
                        comments: false,
                        screw_ie8: true // eslint-disable-line camelcase
                    }
                }),
                new ExtractTextPlugin('[name].' + package.version + '.css')
            ]
        )
    }
}

module.exports = createConfig; 
