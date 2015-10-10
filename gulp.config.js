module.exports = (function() {
    'use strict';

    var src;
    var srcApp;
    var temp;
    var config;
    var server;

    function getWiredepDefaultOptions() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    }

    src = './src/';
    srcApp = src + 'app/';
    temp = './temp/';
    server = src + 'server/';

    config = {
        // General paths
        src: src,
        srcApp: srcApp,
        temp: temp,
        server: server,
        // Paths by file type
        index: src + 'index.html',
        // All files in src
        all: src + '**/*.*',
        alljs: [
            src + '**/*.js',
            './*.js'
        ],
        js : [
            srcApp + '**/*.module.js',
            srcApp + '**/*.js',
            '!' + srcApp + '**/*.spec.js'
        ],
        css: temp + 'styles.css',
        less: src + 'styles/styles.less',

        /**
         * Bower and NPM Locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components',
            ignorePath: '../..'
        },

        /**
         * Node settings
         */
        defaultPort: 7203,
        nodeServer: './src/server/app.js'
    };

    /**
     * Returns an options object for wiredep
     */
    config.getWiredepDefaultOptions = getWiredepDefaultOptions;

    return config;
})();
