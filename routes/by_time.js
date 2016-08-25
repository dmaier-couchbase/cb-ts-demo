var express = require('express');
var router = express.Router();

var helper = require('../helper.js');
var cb = require('../cb.js');

var bucket = cb.bucket();


/**
 * Adds a heading 0 to a single digit value
 */
function twoDigVal(val) {

	if ((''+val).length == 1) val = '0' + val;
	return val;
}


/**
 * Generates a key from a time stamp
 */
function genKey(ts) {

   var curr = new Date(ts);

   //dax::2016-08-25T13:13
   var year = curr.getUTCFullYear();
   
   var month = twoDigVal(curr.getUTCMonth()+1);
   var day = twoDigVal(curr.getUTCDate());
   var hour = twoDigVal(curr.getUTCHours());
   var min = twoDigVal(curr.getUTCMinutes());

   var strCurr = year + "-" + month + "-" + day + "T" + hour + ":" + min;

   return "dax::" + strCurr;
}


/**
 * Retrieves documents by time range
 */
router.get('/by_time', function (req, res) {
	
    var start = req.query.start;
    var end = req.query.end;

    
    if (helper.isDefined(start) && helper.isDefined(end))
    {
        var startTs = new Date(start).getTime();
        var endTs = new Date(end).getTime();

        if ( isNaN(startTs) || isNaN(endTs) ) {
          
           var emsg = "Invalid date parameter!";
           res.json({ "error" : emsg });

        } else {

          var keys = [];

          for ( var i = startTs; i < endTs; i+=60000 ) {
              
             keys.push(genKey(i));
 
          }

	  bucket.getMulti(keys, function(err, cbres) {

		 var result = {};

		 //Skip missing values, only provide the value
		 for (var key in cbres) {
			
			var doc = cbres[key];

			if (!doc.error) {
				
				result[key.split("dax::")[1]]=doc.value;
			}		

		 }
	          
		  res.json(result);
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
