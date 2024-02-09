var http = require('http');

http.createSever(function (req,res) {
  res.write('alive');
  res.end();
}).listen(8080);
