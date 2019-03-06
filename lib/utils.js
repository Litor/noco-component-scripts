'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getValidPort = undefined;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function portIsOccupied(port) {
    // 创建服务并监听该端口
    return new Promise(function (resolve, reject) {
        var server = _net2.default.createServer().listen(port, '0.0.0.0');
        server.on('listening', function () {
            // 执行这块代码说明端口未被占用
            server.close(); // 关闭服务
            resolve(false);
        });

        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') {
                // 端口已经被使用
                resolve(true);
            }
        });
    });
}

var getValidPort = exports.getValidPort = function getValidPort(port) {
    return portIsOccupied(port).then(function (occupied) {
        if (occupied) {
            return getValidPort(++port);
        } else {
            return port;
        }
    });
};