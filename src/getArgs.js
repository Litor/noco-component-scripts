import fs from 'fs'

let nocoConfigPath = __dirname+'/../../../noco.config.js'
let config = {}
if(fs.existsSync(nocoConfigPath)){
    config = require(nocoConfigPath).default
}

export let nocoConfig = config

export default function getArg(key) {
    var index = process.argv.indexOf(key)
    var next = process.argv[index + 1]
    return (index < 0) ? null : (!next || next[0] === '-') ? true : next
}

export let start = getArg('start') || getArg('--start')
export let build = getArg('build') || getArg('--build')
export let type = getArg('type') || getArg('--type')
export let localize = getArg('localize') || getArg('--localize')
export let cwd = getArg('--cwd') + '/'
