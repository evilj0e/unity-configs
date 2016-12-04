const path = require('path');
const opn = require('opn');
const fs = require('fs');
const execSync = require('child_process').execSync;

const CWD = process.cwd();
const DEFAULTS = {
    port: 9000,
    host: 'http://localhost'
};

/**
 * Gets certificate file if it exists
 * @param {Object} unityConfig – configuration object
 * @returns stream || false
 */
function getCert(unityConfig) {
    if (!unityConfig) {
        return false;
    }

    if (unityConfig.certName) {
        const certPath = path.join(CWD, unityConfig.certName);

        try {
            fs.accessSync(certPath, fs.F_OK);
            return fs.readFileSync(certPath);
        } catch (e) {
            console.info('Your cert-file is not exists. Check your certPath.');
        }
    }

    return false;
}

/**
 * Opens google chrome for debugging
 *
 * @param {String} pathToOpen – path to open
 * @returns null
 */
function openBrowser(pathToOpen) {
    if (!pathToOpen) {
        return;
    }

    if (process.platform === 'darwin') {
        try {
            execSync('ps cax | grep "Google Chrome"');
            execSync('osascript ' +
                path.resolve(__dirname, './openChrome.applescript') + ' ' + pathToOpen);
            return;
        } catch (err) {
            console.log(err);
        }
    }

    opn(path);
}

/**
 * Gets full url by host, port
 *
 * @param {string} [host='localhost']
 * @param {string} [port='9000']
 * @returns host:port or http://localhost:9000
 */
function getFullUrl(host = DEFAULTS.host, port = DEFAULTS.port) {
    port = port ? ':' + port : '';

    console.log(host + port);

    return host + port;
}

module.exports = {
    getCert,
    getFullUrl,
    openBrowser,
    DEFAULTS
};
