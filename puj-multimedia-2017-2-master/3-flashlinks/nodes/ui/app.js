var express     = require('express');
var path        = require('path');
var serveStatic = require('serve-static');
var http        = require('http');

var port = process.env.UI_PORT || 9000;

app = express();
app.use(express.static(__dirname + '/src'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

var server = app.listen(port, function() {
  var port = server.address().port;
  console.log("server started on port", port);
});
