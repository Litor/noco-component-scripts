import net from 'net'

function portIsOccupied(port) {
    // 创建服务并监听该端口
    return new Promise(function (resolve, reject) {
        var server = net.createServer().listen(port, '0.0.0.0');
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


export const getValidPort = function (port) {
    return portIsOccupied(port).then(function (occupied) {
        if (occupied) {
            return getValidPort(++port)
        } else {
            return port
        }
    })
}
