var http = require('http');

http.createServer(function (req, res) {
    res.write('alive');
    res.end();
}).listen(8080);
