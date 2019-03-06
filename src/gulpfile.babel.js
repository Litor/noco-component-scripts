import gulp from 'gulp'
import named from 'vinyl-named'
import webpackGulp from 'webpack-stream'
import loaders from './webpack.loaders.js'
import plugins from './webpack.plugins.js'
import gulpConnect from 'gulp-connect'
import proxy from 'http-proxy-middleware'
import {nocoConfig, build, cwd} from './getArgs'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import fs from 'fs'
import {getValidPort} from './utils'

var dist = cwd + (nocoConfig.dist || '/dist/')


function getWebpackConfig(productionMode, type, postfix) {
    var entry = cwd + '/src/' + (type) + ((type.indexOf('.js') || type.indexOf('.vue')) ? '' : '/index.js')
    var config = {
        context: cwd + '/src/' + postfix,
        entry: {
            [postfix]: entry,
        },
        resolve: {
            extensions: ['.js', '.vue']
        },

        output: {
            publicPath: './',
            filename: '[name].js'
        },

        mode: productionMode ? 'production' : 'development',

        module: {
            rules: loaders,
        },

        plugins: plugins
    }

    if (build) {
        config.optimization = {
            minimizer: [new UglifyJsPlugin()]
        }
    }

    return config
}

gulp.task('clean', cb => {
    cb()
    try {
        del.sync([dist + '/**/*'], {force: true})
    } catch (e) {
        //console.log('%s do not clean', dest)
    }
})


gulp.task('webpack_prod', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(getWebpackConfig(true, 'impl', 'min')))
        .pipe(gulp.dest(dist))
})

gulp.task('webpack_dev', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(getWebpackConfig(false, 'impl', 'index')))
        .pipe(gulp.dest(dist))
})

gulp.task('webpack_profile', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(getWebpackConfig(true, 'profile', 'profile')))
        .pipe(gulp.dest(dist))
})

gulp.task('webpack_meta', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(getWebpackConfig(true, 'meta', 'meta')))
        .pipe(gulp.dest(dist))
})

gulp.task('changelog', function (cb) {
    cb()
    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp({
            context: cwd + '/changelog.js',
            entry: {
                'changelog': cwd + '/changelog',
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
                rules: loaders,
            },

            plugins: plugins,

            devtool: false,
        }))
        .pipe(gulp.dest(dist))
})

gulp.task('example', function (cb) {
    var readDir = null

    try {
        readDir = fs.readdirSync(cwd + '/src/example')

        readDir.forEach(function (it) {
            gulp
                .src([__dirname + '/emptyEntry.js'])
                .pipe(named())
                .pipe(webpackGulp(getWebpackConfig(false, 'example/' + it + '/config.js', 'example/' + it + '/config')))
                .pipe(gulp.dest(dist))
            gulp
                .src([__dirname + '/emptyEntry.js'])
                .pipe(named())
                .pipe(webpackGulp(getWebpackConfig(false, 'example/' + it + '/index.js', 'example/' + it + '/index')))
                .pipe(gulp.dest(dist))
        })
    } catch (e) {

    }

    cb()
})

gulp.task('default', gulp.series(gulp.parallel('clean', 'webpack_prod', 'webpack_dev', 'webpack_profile', 'webpack_meta', 'example', 'changelog')))


function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return (index < 0)
        ? null
        : (!next || next[0] === "-") ? true : next;
}

gulp.task('test_action', function (cb) {

    var type = getArg('--type')

    var config = {
        context: cwd + '/src',
        entry: cwd + '/src/test/' + type + '/index.js',
        resolve: {
            extensions: ['.js', '.vue']
        },

        output: {
            publicPath: './',
            filename: '[name].js'
        },

        mode: 'development',

        module: {
            rules: loaders,
        },

        watch: true,

        plugins: plugins,

        devtool: false,
    }

    return gulp
        .src([__dirname + '/emptyEntry.js'])
        .pipe(named())
        .pipe(webpackGulp(config))
        .pipe(gulp.dest(dist))
})

gulp.task('connect', () => {
        var proxyConfig = nocoConfig.proxy || []

        getValidPort(8000).then(function (port) {
            gulpConnect.server({
                host: '0.0.0.0',
                root: dist,
                port: nocoConfig.port || port || '8080',
                livereload: true,
                middleware: function (connect, opt) {
                    let proxys = []

                    if (proxy) {
                        for (let i = 0; i < proxyConfig.length; i++) {
                            proxys.push(proxy(proxyConfig[i].source, {
                                target: proxyConfig[i].target,
                                changeOrigin: true,
                                secure: false,
                                headers: {
                                    Connection: 'keep-alive'
                                }
                            }))
                        }
                    }

                    return proxys
                }
            })
        })

    }
)

gulp.task('test', gulp.series(gulp.parallel('test_action', 'connect')))
