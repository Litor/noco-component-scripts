import StringReplacePlugin from 'string-replace-webpack-plugin'
var os = require('os')
import {build} from './getArgs'

const VueLoaderPlugin = require('vue-loader/lib/plugin')

var plugins = [
    // fix for moment
    new VueLoaderPlugin(),
    new StringReplacePlugin(),
]

export default plugins
