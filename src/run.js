#!/usr/bin/env node
import {start, build, type} from './getArgs'

var exec = require('child_process').exec;
var coffeeProcess= exec('gulp --gulpfile '+ __dirname + '/gulpfile.babel.js '+ (start?(' test --start  --type ' + type):'')+ (build?' --build':'') +' --cwd '+process.cwd(), function(error, stdout, stderr) {

});

coffeeProcess.stdout.pipe(process.stdout)
coffeeProcess.stderr.pipe(process.stderr);

