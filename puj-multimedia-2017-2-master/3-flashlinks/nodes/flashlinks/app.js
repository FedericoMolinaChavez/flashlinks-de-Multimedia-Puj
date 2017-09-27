var env = require('./env.js');
var os = require("os");
var pjson = require('./package.json');
var version = pjson.version;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressLogging = require('express-logging');
var logger = require('logops');

app.use(expressLogging(logger));

var port = process.env.PORT || 5000;

//rethinkdb setup
var r = require('rethinkdbdash')({
  servers: [
    {host: env.rdb_host, port: env.rdb_port}
  ]
});

//create rethinkdb DB
r.dbCreate('db_links').run().then(function(result) {
  console.log("db_links DB created")
}).error(function(error) {
  console.log("db_links already exist")
}).then(function(){
  r.db('db_links').tableCreate('links').run().then(function(result) {
    console.log("links table created")
  }).error(function(error) {
    console.log("links table already exist")
  });
});

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

//define routes
app.get('/fl/version', function(req, res) {
  res.send(JSON.stringify({'version':version}));
});

app.get('/fl/fail', function(req, res) {
  process.exit(1);
});

app.get('/fl/link', function(req, res) {  
  r.db('db_links').table('links')
    .run()
    .then(function(result) {
      res.end(JSON.stringify(result));
    })
    .error(function(err) {
       res.end(JSON.stringify([]));
      //res.status(500).send('Internal Server Error');
    })
});

app.post('/fl/link/add', function(req, res){
  var data = req.body;
  console.log(data);
  r.db('db_links').table('links')
    .insert(data)
    .run()
    .then(function(result) {
      res.send('Query executed');
    })
    .error(function(err) {
      res.status(500).send('Internal Server Error');
    })
});

app.post('/fl/link/edit/:uid', function(req, res){
  var id = req.params.uid;
  var link = req.body;
  console.log("editing link:" + id + " to:" + link);
  r.db('db_links').table('links')
    .filter({"id": id})
    .update(link)
    .run()
    .then(function(result) {
      res.send('Query executed');
    })
    .error(function(err) {
      res.status(500).send('Internal Server Error');
    })
});

app.post('/fl/link/delete/:uid', function(req, res){
  var id = req.params.uid;
  console.log("deleting link:" + id);
  r.db('db_links').table('links')
    .filter({"id": id})
    .delete()
    .run()
    .then(function(result) {
      res.send('Query executed');
    })
    .error(function(err) {
      res.status(500).send('Internal Server Error');
    })
});

app.get('/fl/tag', function(req, res) {
  tags = [];
  tags = ['google', 'search', 'whatsapp', 'facebook', 'social', 'chat', 'netflix', 'video'];
  res.end(JSON.stringify(tags));
})

/*
Server start
*/
var server = app.listen(port, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});
