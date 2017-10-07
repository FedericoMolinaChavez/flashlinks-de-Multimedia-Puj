var os = require("os");
var pjson = require('./package.json');
var version = pjson.version;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressLogging = require('express-logging');
var logger = require('logops');

app.use(expressLogging(logger));

var port = process.env.PORT || 3000;

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

//Configuring data base with rethinkdb for metrics.
r.dbCreate('db_metrics').run().then(function(result) {
  console.log("db_metrics DB created")
}).error(function(error) {
  console.log("db_metrics already exist")
}).then(function(){
  r.db('db_metrics').tableCreate('metrics').run().then(function(result) {
    console.log("metrics table created")
  }).error(function(error) {
    console.log("metrics table already exist")
  });
});

app.get('/fl/metrics/', function(req, res) {  
  r.db('db_metric').table('metrics')
    .run()
    .then(function(result) {
      res.end(JSON.stringify(result));
    })
    .error(function(err) {
       res.end(JSON.stringify([]));
      //res.status(500).send('Internal Server Error');
    })
});

app.post('/fl/metrics/add', function(req, res){
  var data = req.body;
  console.log(data);
  r.db('db_metric').table('metrics')
    .insert(data)
    .run()
    .then(function(result) {
      res.send('Query executed');
    })
    .error(function(err) {
      res.status(500).send('Internal Server Error');
    })
});


app.post('/fl/metrics/visit/', function(req, res) {  
  var data = req.body;
  var url = data.url;
  r.db('db_metric').table('metrics')
    .filter(r.row('url').eq(url))
    .update({visits: r.row('visits').add(1).default(0)})
    .run()
    .then(function(result) {
      res.send('Query executed');
    })
    .error(function(err) {
      res.status(500).send('Internal Server Error');
    })
});

/*
Server start
*/
var server = app.listen(port, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});






