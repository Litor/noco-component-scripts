import ExtractTextPlugin from 'extract-text-webpack-plugin'
const autoprefixer = require('autoprefixer');

var loaders = {}

loaders.js = {
    test: /\.js$/i,
    use: [
        {
            loader: 'babel-loader',
            options: {
                babelrc: false,
                "presets": ["env"],
                "plugins": [
                    "jsx-v-model",
                    "transform-vue-jsx",
                    "transform-object-rest-spread",
                    "syntax-async-functions",
                    ["transform-runtime", {
                        "helpers": false,
                        "polyfill": false,
                        "regenerator": true,
                        "moduleName": "babel-runtime"
                    }]
                ]
            }
        }
    ],

}
loaders.html = {
    test: /\.html$/i,
    use:[
        {
            loader: 'file-loader',
            query: {
                context: __dirname + '/src',
                name: '[name].[ext]'
            }
        }
    ]

}

loaders.vue = {
    test: /\.vue$/i,
    use:[
        {
            loader: 'vue-loader'
        }
    ]
}

loaders.promise = {
    test: /\.js$/i,
    include: [/pages/],
    exclude: loaders.js.exclude,
    use: [
        'promise-loader?global,[name].promise',
        'babel-loader',
    ]
}

loaders.css = {
    test: /\.(css)$/i,
    use: [

        require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 1,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                // Necessary for external CSS imports to work
                // https://github.com/facebookincubator/create-react-app/issues/2677
                ident: 'postcss',
                plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                        browsers: [
                            '>1%',
                            'last 4 versions',
                            'Firefox ESR',
                            'not ie < 9', // React doesn't support IE8 anyway
                        ],
                        flexbox: 'no-2009',
                    }),
                ],
            },
        },
    ],
}

loaders.less = {
    test: /\.less$/i,
    use:[
        require.resolve('style-loader'),
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 1,
            },
        },
        require.resolve('less-loader'),
    ]
}

loaders.fonts = {
    test: /.*\.(ttf|eot|woff|woff2)(\?.*)?$/i,
    use:[
        {
            loader: 'url-loader',
            query: {
                limit: 0.01 * 1024,
                name: 'statics/fonts/[path][name].[ext]',
            }
        }
    ]
}

loaders.url = {
    test: /.*\.(gif|png|jpe?g|svg|ico|webP)$/i,
    use:[
        {
            loader: 'url-loader',
            query: {
                limit: 1 * 1024,
                name: 'statics/images/[path][name].[ext]',
            }
        }
    ]
}

loaders.svg = {
    test: /\.svg$/,
    include: /images/,
    loader:'svg-sprite-loader',
    query: {
        limit: 1 * 1024,
        name: 'statics/images/[path][name].[ext]',
    },
}

var usedLoaders = [
    loaders.vue,
    loaders.js,
    loaders.html,
    loaders.less,
    loaders.url,
    loaders.fonts,
    loaders.css
]

export default usedLoaders
