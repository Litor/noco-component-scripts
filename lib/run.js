#!/usr/bin/env node
'use strict';

var _getArgs = require('./getArgs');

var exec = require('child_process').exec;
var coffeeProcess = exec('gulp --gulpfile ' + __dirname + '/gulpfile.babel.js ' + (_getArgs.start ? ' test --start  --type ' + _getArgs.type : '') + (_getArgs.build ? ' --build' : '') + ' --cwd ' + process.cwd(), function (error, stdout, stderr) {});

coffeeProcess.stdout.pipe(process.stdout);
coffeeProcess.stderr.pipe(process.stderr);