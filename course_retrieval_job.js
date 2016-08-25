//Add the scheduler dependency
var schedule = require('node-schedule');

//Allows http requests
var request = require('request');

//Couchbase access
var cb = require('./cb.js');
var bucket = cb.bucket();


//Execute the job logic
function _sched()
{
    //Every 30 seconds
    var rule = new schedule.RecurrenceRule();
    rule.second = new schedule.Range(0, 59, 30);

    
    schedule.scheduleJob(rule, function() {

        console.log(JSON.stringify(new Date()) + " : " + "Executing course retrieval job ..." );
        
        var options = {
             uri: 'http://www.google.com/finance/info?q=INDEXDB%3ADAX'
        };

	
        request(options, function(error,res,body) {
           
          if (error && resp.statusCode !== 200) {
         
            console.log("ERROR: Could not retrieve data point!");
   
         } else {
             
            var tmp = body;

            //Remove comment chars
            tmp  = tmp.split("/")[2];
            tmp = JSON.parse(tmp);

            var doc = {};
            doc.l = tmp[0].l;
            doc.c = tmp[0].c;
            doc.lt_dts = tmp[0].lt_dts;

            
            //Parse minute ts
            //2016-08-25T12:02:12Z
            var ts = doc.lt_dts;
            ts = ts.split(':');
            ts = ts[0] + ":" + ts[1];
            
            var key = "dax::" + ts;

            //Upsert to Couchbase
            bucket.upsert( key, doc, function(err, cbres) {

                if (err)
                {
                   var emsg = "Could not write the data point!";
                   console.log("ERROR: " + emsg);

                }
                else
                {
                   console.log("INFO: Wrote data point " + key);
                }
            });
             
         }


        });
    

    });
}

//Module exports
module.exports = {
    
    /**
     * Connect to Couchbase
     */
    sched : function() {
	
		    
	console.log("Initializing course retrieval job ...");
    
        return _sched();
    }
};
