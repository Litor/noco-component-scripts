'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cwd = exports.localize = exports.type = exports.build = exports.start = exports.nocoConfig = undefined;
exports.default = getArg;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var nocoConfigPath = __dirname + '/../../../noco.config.js';
var config = {};
if (_fs2.default.existsSync(nocoConfigPath)) {
    config = require(nocoConfigPath).default;
}

var nocoConfig = exports.nocoConfig = config;

function getArg(key) {
    var index = process.argv.indexOf(key);
    var next = process.argv[index + 1];
    return index < 0 ? null : !next || next[0] === '-' ? true : next;
}

var start = exports.start = getArg('start') || getArg('--start');
var build = exports.build = getArg('build') || getArg('--build');
var type = exports.type = getArg('type') || getArg('--type');
var localize = exports.localize = getArg('localize') || getArg('--localize');
var cwd = exports.cwd = getArg('--cwd') + '/';