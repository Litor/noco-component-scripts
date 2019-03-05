'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = getArg;
var nocoConfig = exports.nocoConfig = require(__dirname + '/../../../noco.config.js').default;

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