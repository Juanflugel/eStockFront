var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	port = 5000;

app.use('/app', express.static(__dirname + '/app'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// app.use('/app1', express.static(__dirname + '/app1'));

server.listen(port, function(){
	console.log('Listen on Port ' + port);
});