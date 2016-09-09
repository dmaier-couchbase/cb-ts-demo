//Express
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

//Other modules
var by_time = require('./by_time.js');

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
router.all('/', function(req, res) {

	res.json({"success" : true});
});


/**
 * Get available annotations
 * 
 * For now we just return a default annotation. But we might consider to add an endpoint in order to add annotation
 */

router.all('/annotations', function(req, res) {
	
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
router.all('/search', function(req, res){
	
	var result = [];
	res.json(metrics);
	  
});



/**
 * TODO: Move to helper module
 */
function twoDigVal(val) {

        if ((''+val).length == 1) val = '0' + val;
        return val;
}


/**
 * TODO: Move to helper module
 */
function genKey(ts) {

   //dax::2016-08-25T13:13
   var date = new Date(ts);
   
   //UTC?
   var year = date.getUTCFullYear();
   var month = twoDigVal(date.getUTCMonth()+1);
   var day = twoDigVal(date.getUTCDate());
   var hour = twoDigVal(date.getUTCHours());
   var min = twoDigVal(date.getUTCMinutes());

   var key = "dax::" + year + "-" + month + "-" + day + "T" + hour + ":" + min;

   return key;
}


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
router.all('/query', jsonParser, function(req, res){
	
	console.log(req.url);
	console.log(req.body);

	var result = [];

	if ( typeof req.body !== 'undefined' ) {
		
		var targets = req.body.targets;
		
		//Make sure that only our 'dax' metric is queryable
        	if (typeof targets !== 'undefined' && targets.length == 1 && targets[0].target == metrics[0] ) {

                	
			//Now get the acutal requested time range
			//range: { from: '2016-09-09T08:47:36.336Z',to: '2016-09-09T14:47:36.336Z' }

			var from = new Date(req.body.range.from).getTime();
			var to = new Date(req.body.range.to).getTime();

			//First let's just do a multi-get, we will extend this example later to also use the aggregate documents
			var keys = [];

          		for ( var i = from; i < to; i+=60000 ) {

             			keys.push(genKey(i));
          		}

			//console.log(keys);

			bucket.getMulti(keys, function(err, cbres) {

                 		var result = {};
				result.target = metrics[0];
				result.datapoints = [];
				
                 		//Skip missing values, only provide the value
                 		for (var key in cbres) {

                        		var doc = cbres[key];

                        		if (!doc.error) {
						
						var time = new Date(doc.value.lt_dts).getTime();
						var fValue = parseFloat(doc.value.l.replace(',',''));
                                		var dp = [ fValue, time ];
						
						result.datapoints.push(dp);
		
                        		}
                 		}

				//console.log(result);
				res.json([result]);
          		});
				

        	} else {

                	console.log("Filter criteria not matched! Returning empty result.");
                	res.json(result);
        	}



	} else {
		
		 console.log("ERROR: Invalid request");
	}

});



module.exports = router;
