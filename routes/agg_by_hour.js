var express = require('express');
var router = express.Router();

var helper = require('../helper.js');
var cb = require('../cb.js');

var bucket = cb.bucket();
var viewQuery = cb.viewQuery();


/**
 * Converts a time stamp into an hour day array
 */
function dateToArray(ts) {

   var d = new Date(ts);
   var year = d.getUTCFullYear();
   var month = d.getUTCMonth()+1;
   var day = d.getUTCDate();
   var hour = d.getUTCHours();

   return [year,month,day,hour,0,0];
}

function isValidHour(str) {
	
   var isValid = true;

   if (str.split('-').length != 3) isValid = false;
   if (str.split(':').length != 2) isValid = false;
   if (str.split('T').length != 2) isValid = false;

   return isValid;
}



/**
 * Retrieve aggregation results by hour
 */
router.get('/agg_by_hour', function (req, res) {
	
    var start = req.query.hour

    if (helper.isDefined(start)) {
        var ts = new Date(start).getTime();

        if ( isNaN(ts) || !isValidHour(start)) {
	
           var emsg = "Invalid date parameter!";
           res.json({ "error" : emsg });

        } else {

		//Use the hour aggregate, if not there, then get the calculation from Couchbase and cache t
		//Check if the aggregate is there
		var key = "agg::" + start;
		bucket.get(key, function(err, cbres) {

           		if (err) {
                		
				//The aggregate wasn't there, and so create it
				var start = dateToArray(ts);
				var end = start.slice();
                		end[3]=end[3]+1
				
			 	var q = viewQuery.from('time', 'stats')
                                                 .range(start,end,false)
                                                 .reduce(true)
                                                 .group_level(4)
                                                 .stale(1);

                                bucket.query(q, function(err, result) { 

					result = result[0].value;

					//Only store the aggregate for a full hour
					if ( result.count == 60) {
				
					    bucket.insert( key, result, function(err, cbres) {

            					if (err) {
                					var emsg = "Could not add the hour aggregate!";
                					res.json({ "error" : emsg });

            					} else {
            						res.json(result);
           					}        				     
				             });

					} else {
						res.json(result);
					}
				});

            		}
            		else {	
                		res.json(cbres);
            		}

        });


        }
    }
    else
    {
        var emsg = "Did you pass all mandatory parameters?";
        res.json({"error" : emsg});
    }    
});

module.exports = router;
