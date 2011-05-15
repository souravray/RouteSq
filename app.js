
/**
 * Module dependencies.
 */

var express = require('express');

var mongoose = require('mongoose')
var routeModel = require("./routemodel").routeModel;

var app = module.exports = express.createServer();

// Configurationr

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
	app.use(express.logger());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

function loadMap (req, res, next){
		next();
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Route Square',
		jsstac: 'basic'
  });
});

app.get('/route', function(req, res, next){
	
	res.render('route',{
					title: 'Route Square',
					jsstac: 'geo'
				});
});

app.get('/route/:id', loadMap, function(req, res, next){
	res.render( 'route', {
			id:req.id,
			routes:req.data
		});
});


app.put('/route/:id', loadMap, function(req, res, next){
	res.render( 'route', {
			id:req.id,
			routes:req.data
		});
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(4007);
  console.log("Express server listening on port %d", app.address().port);
}
