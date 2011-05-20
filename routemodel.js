/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  ,db = mongoose.connect('mongodb://localhost/test') 
  , Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

/**
 * Schema definition
 */


var RouteSchema = new Schema({
    id		: ObjectId
  , uuid	: {type: String, index: true}
	,	title : String
  , paths : [ ]
});


mongoose.model('Route', RouteSchema);
exports.routeModel = mongoose.model('Route');
