'use strict';

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _vinylNamed = require('vinyl-named');

var _vinylNamed2 = _interopRequireDefault(_vinylNamed);

var _webpackStream = require('webpack-stream');

var _webpackStream2 = _interopRequireDefault(_webpackStream);

var _webpackLoaders = require('./webpack.loaders.js');

var _webpackLoaders2 = _interopRequireDefault(_webpackLoaders);

var _webpackPlugins = require('./webpack.plugins.js');

var _webpackPlugins2 = _interopRequireDefault(_webpackPlugins);

var _gulpConnect = require('gulp-connect');

var _gulpConnect2 = _interopRequireDefault(_gulpConnect);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _getArgs = require('./getArgs');

var _uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

var _uglifyjsWebpackPlugin2 = _interopRequireDefault(_uglifyjsWebpackPlugin);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var dist = _getArgs.cwd + (_getArgs.nocoConfig.dist || '/dist/');

function getWebpackConfig(productionMode, type, postfix) {
    var entry = _getArgs.cwd + '/src/' + type + (type.indexOf('.js') || type.indexOf('.vue') ? '' : '/index.js');
    var config = {
        context: _getArgs.cwd + '/src/' + postfix,
        entry: _defineProperty({}, postfix, entry),
        resolve: {
            extensions: ['.js', '.vue']
        },

        output: {
            publicPath: './',
            filename: '[name].js'
        },

        mode: productionMode ? 'production' : 'development',

        module: {
            rules: _webpackLoaders2.default
        },

        plugins: _webpackPlugins2.default
    };

    if (_getArgs.build) {
        config.optimization = {
            minimizer: [new _uglifyjsWebpackPlugin2.default()]
        };
    }

    return config;
}

_gulp2.default.task('clean', function (cb) {
    cb();
    try {
        del.sync([dist + '/**/*'], { force: true });
    } catch (e) {
        //console.log('%s do not clean', dest)
    }
});

_gulp2.default.task('webpack_prod', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(true, 'impl', 'min'))).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('webpack_dev', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(false, 'impl', 'index'))).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('webpack_profile', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(true, 'profile', 'profile'))).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('webpack_meta', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(true, 'meta', 'meta'))).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('changelog', function (cb) {
    cb();
    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)({
        context: _getArgs.cwd + '/changelog.js',
        entry: {
            'changelog': _getArgs.cwd + '/changelog'
        },
        resolve: {
            extensions: ['.js', '.vue']
        },

        output: {
            publicPath: './',
            filename: '[name].js'
        },

        mode: 'production',

        module: {
            rules: _webpackLoaders2.default
        },

        plugins: _webpackPlugins2.default,

        devtool: false
    })).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('example', function (cb) {
    var readDir = null;

    try {
        readDir = _fs2.default.readdirSync(_getArgs.cwd + '/src/example');

        readDir.forEach(function (it) {
            _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(false, 'example/' + it + '/config.js', 'example/' + it + '/config'))).pipe(_gulp2.default.dest(dist));
            _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(getWebpackConfig(false, 'example/' + it + '/index.js', 'example/' + it + '/index'))).pipe(_gulp2.default.dest(dist));
        });
    } catch (e) {}

    cb();
});

_gulp2.default.task('default', _gulp2.default.series(_gulp2.default.parallel('clean', 'webpack_prod', 'webpack_dev', 'webpack_profile', 'webpack_meta', 'example', 'changelog')));

function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return index < 0 ? null : !next || next[0] === "-" ? true : next;
}

_gulp2.default.task('test_action', function (cb) {

    var type = getArg('--type');

    var config = {
        context: _getArgs.cwd + '/src',
        entry: _getArgs.cwd + '/src/test/' + type + '/index.js',
        resolve: {
            extensions: ['.js', '.vue']
        },

        output: {
            publicPath: './',
            filename: '[name].js'
        },

        mode: 'development',

        module: {
            rules: _webpackLoaders2.default
        },

        watch: true,

        plugins: _webpackPlugins2.default,

        devtool: false
    };

    return _gulp2.default.src([__dirname + '/emptyEntry.js']).pipe((0, _vinylNamed2.default)()).pipe((0, _webpackStream2.default)(config)).pipe(_gulp2.default.dest(dist));
});

_gulp2.default.task('connect', function () {
    var proxyConfig = _getArgs.nocoConfig.proxy || [];

    (0, _utils.getValidPort)(8000).then(function (port) {
        _gulpConnect2.default.server({
            host: '0.0.0.0',
            root: dist,
            port: _getArgs.nocoConfig.port || port || '8080',
            livereload: true,
            middleware: function middleware(connect, opt) {
                var proxys = [];

                if (_httpProxyMiddleware2.default) {
                    for (var i = 0; i < proxyConfig.length; i++) {
                        proxys.push((0, _httpProxyMiddleware2.default)(proxyConfig[i].source, {
                            target: proxyConfig[i].target,
                            changeOrigin: true,
                            secure: false,
                            headers: {
                                Connection: 'keep-alive'
                            }
                        }));
                    }
                }

                return proxys;
            }
        });
    });
});

_gulp2.default.task('test', _gulp2.default.series(_gulp2.default.parallel('test_action', 'connect')));