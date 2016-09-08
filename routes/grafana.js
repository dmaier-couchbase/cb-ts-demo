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

/**
 * Get the available targets/metrics
 *
 * For now we just return the value 'dax' but would be actually a good idea to extend our example with a target attribute which reflects the prefix of the document
 *
 *  dax:$ts : { 'target' : 'dax', ... }
 *
 */
router.all('/grafana/search/', function(req, res){
	
	var result = [];
	res.json(metrics);
	  
});

/**
 * Query for data points by filtering by target
 *
 * The result looks like this:
 *
 * {"target": "dax", "datapoints": [[3.0, 1450754160], [2.0, 1450754220], ... ]}
 *
 * whereby the entry in the tuple is the data point value and the second one the time stamp
 * 
 */
router.all('/grafana/query/', function(req, res){
	
	console.log(req.url);
	console.log(req.body);

	var result = [];

	var targets = req.body.targets;

	//Make sure that only our 'dax' metric is queryable
	if (typeof targets !== 'undefined' && targets.length == 1 && target[0] == metrics[0] ) {
		
		//TODO: Add Couchbase logic - T
		res.json(result);
	} else {

		res.json(result);
	}
});


module.exports = router;
