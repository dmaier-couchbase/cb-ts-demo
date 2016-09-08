//
//Express
var express = require('express');
var router = express.Router();

//Helper
var helper = require('../helper.js');

//Couchbase
var cb = require('../cb.js');
var bucket = cb.bucket();
var viewQuery = cb.viewQuery();


//A generic annotation
var annotation = {
       	name : "annotation name",
	enabled: true,
	datasource: "generic datasource",
	showLine: true
};

//A default annotation
var annotations = [{ annotation: annotation, "title": "Couchbase", "time": new Date().getTime(), text: "Backed by Couchbase", tags: "couchbase" }];

//Metrics/Targets
var metrics = ['dax'];



/** 
 * Respond successfully if this service is available
 *
 */
router.all('/grafana/', function(req, res) {

	res.json({"success" : true});
});


/**
 * Get available annotations
 * 
 * For now we just return a default annotation. But we might consider to add an endpoint in order to add annotation
 */

router.all('/grafana/annotations/', function(req, res) {
	
	res.json(annotations);
});

router.all('/grafana/search/', function(req, res){
	
	var result = [];
	res.json(metrics);
	  
});


router.all('/grafana/query/', function(req, res){
	
	console.log(req.url);
	console.log(req.body);

	var result = [];

	//TODO: Add Couchbase logic - return results by also applying a filter

	res.json(result);
});


module.exports = router;
