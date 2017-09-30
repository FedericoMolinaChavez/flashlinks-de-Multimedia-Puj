var os = require("os");
var pjson = require('./package.json');
var version = pjson.version;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressLogging = require('express-logging');
var logger = require('logops');

app.use(expressLogging(logger));
var clientLinks = request.createClient('http://links:5000/');
var clientMetrics = request.createClient('http://metric:3000/');


var port = process.env.PORT || 1000;

//Configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});


//links functions
app.get('/fl/version', function(req, res) {
    clientLinks.get('fl/version', function(err, res2, body) {
        res.end(JSON.stringify(body));
    });
});

app.get('/fl/link', function(req, res) {  

	clientLinks.get('/fl/link', function(req, res1, body) { 
		res.end(JSON.stringify(body));
	});
});


app.post('/fl/link/add', function(req, res){
	clientLinks.post('/fl/link/add', function(req, res1, body){
		res.end(JSON.stringify(body));
	});
});

app.post('/fl/link/delete', function (req, res){
	var id = req.params.uid;
	var data = req.body;
	clientLinks.post('/fl/link/delete'+id, data , function(req,res1,body){
		res.end(JSON.stringify(body));
	});
});

app.post('/fl/link/edit/:uid', function(req, res) {
	var id = req.params.uid;
	var data = req.body;
    clientLinks.post('fl/link/edit/'+id, data, function(err, res1, body) {
        res.end();
    });
});


