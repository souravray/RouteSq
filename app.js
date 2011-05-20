
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

//error handeling

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype.__proto__ = Error.prototype;

app.get('/404', function(req, res){
  throw new NotFound;
});

app.get('/500', function(req, res){
  throw new Error('Server error!');
});

app.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade');
        res.end();
    } else {
        next(err);
    }
});

//middlewares
function loadRourte (req, res, next){
	
	routeModel.findOne({uuid: req.params.uuid}, function(err, route){
    console.log(route);
		if(err){ //throw new NotFound; 
		}
    else if(route){ 
			req.params.title = route.title;
			req.params.routes = route.paths;
		} else{
    	//throw new NotFound; 
    }
		next();
	});
	
}

function saveRoute(req, res, next){
	var routeObj = new routeModel();
  var _paths = JSON.parse(req.body._data);
  routeObj.title = req.body._title;
	console.log(req.params);
  routeObj.paths = _paths;
	routeObj.uuid= req.params.uuid;
  routeObj.save(function(err){
		if (err==null){
			
		}else {
			throw new NotFound;
		}
	});
	next();
}

function setUUId(req, res, next)
{
	protectRollover = false;
	// 01 Jan 2010 is the selected epoch. Use
	// to get this number (1262304000000)
	var millis = new Date().getTime() - 1262304000000;
	millis = millis * Math.pow(2, 12);
	var id = Math.floor(Math.random()*11) * Math.pow(2, 8);
	var uid = millis + id ;
  var uuid = uid.toString(32);
	req.params.uuid=uuid;
	next();
}

// Routes

app.get('/', function(req, res){
  res.render('index', {
    jsstack: 'basic',
    title: 'Route Square',
		jsstac: 'basic'
  });
});


app.get('/route', function(req, res, next){
	
	res.render('route',{
          jsstack: 'geoedit',
					title: 'My Route',
					uuid: null,
					routes: null
				});
});


app.get('/route/:uuid', loadRourte, function(req, res, next){
	if (req.xhr) {
		console.log(JSON.stringify(req.params.routes));
		res.write(JSON.stringify(req.params.routes));
		res.end();
	}else{
		if(req.params.routes==null)
			res.redirect('/');
		else
			res.render( 'route', {
				  jsstack: 'geoplot',
					title: req.params.title || 'My Route',
					uuid:req.params.uuid,
					routes:req.params.routes
				});
	}
});


app.post('/route', setUUId, saveRoute, function(req, res, next){
	res.redirect('/route/'+req.params.uuid);
});


// Only listen on $ node app.js

if (!module.parent) {
  app.listen(4007);
  console.log("Express server listening on port %d", app.address().port);
}
