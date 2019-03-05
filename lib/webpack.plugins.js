'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringReplaceWebpackPlugin = require('string-replace-webpack-plugin');

var _stringReplaceWebpackPlugin2 = _interopRequireDefault(_stringReplaceWebpackPlugin);

var _getArgs = require('./getArgs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var os = require('os');


var VueLoaderPlugin = require('vue-loader/lib/plugin');

var plugins = [
// fix for moment
new VueLoaderPlugin(), new _stringReplaceWebpackPlugin2.default()];

exports.default = plugins;