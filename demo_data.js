var cb = require('./cb.js');
var con = cb.connect();
var helper = require('./helper.js');




var TMPL = { "l": "aa,bbb.cc",
	     "c": "0",
	     "lt_dts": "yyyy-mm-ddTHH:MM:00Z" };



function randomInt (low, high) {
	    return Math.floor(Math.random() * (high - low) + low);
}

function genValue(ts) {
	
	//Dirty copy
	var result =  JSON.parse(JSON.stringify(TMPL));

	var aa = randomInt(8,11);
	var bbb = randomInt(100,999);
	var cc = randomInt(10,99);

	result.l = result.l.replace("aa", aa);
	result.l = result.l.replace("bbb", bbb);
	result.l = result.l.replace("cc", cc);
	
	
	var dateStr = helper.genDateStr(ts)+":00Z"

	//console.log(dateStr);

	result.lt_dts = result.lt_dts.replace("yyyy-mm-ddTHH:MM:00Z", dateStr);
	
	//console.log(result);

	return result;
	
}


function gen24hours() {

	var bucket = cb.bucket();

	var now = new Date().getTime();
	var aDay = 8.64 * Math.pow(10, 7);;
 	var yesterday = now - aDay; 

	 for ( var i = now; i > yesterday; i-=60000 ) { 
		
		var key = "dax::" + helper.genDateStr(i);
		var doc = genValue(i);


		bucket.upsert( key, doc, function(err, cbres) {
		
			if (!err) {

				console.log(doc);
			
			} else {

				console.log(err);
			}
		});

	 }   
}


gen24hours();
