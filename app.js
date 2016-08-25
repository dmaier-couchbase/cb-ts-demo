//Basic express requirements
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

//The express application initialization
var app = express();

//The static resources
app.use('/',express.static(__dirname + '/public'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));

//Couchbase
var cb = require('./cb.js');
var con = cb.connect();

//Jobs
var course_retrieval_job = require('./course_retrieval_job.js');

//The service's base URL
var SERVICE_URL = '/service/';

//-- cean: Routers
var by_time = require('./routes/by_time.js');
app.use(SERVICE_URL, by_time);


//Web server
server = app.listen(9000, function () { 
	
	var host = server.address().address
	var port = server.address().port 

	console.log('Example app listening at http://%s:%s', host, port)

	//Init job
	course_retrieval_job.sched();
	  
});
