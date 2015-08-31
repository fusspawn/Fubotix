var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app).listen(8080);
var io = require('socket.io').listen(server);
var fs = require("fs");
var captcha_solver = require('2captcha');
var cors = require('cors');
captcha_solver.setApiKey('c7437360bd3346a863eb1bf233a75905');

var players = {};
app.use(cors());
app.use(express.static("public"));
app.get('/', function(req, res) {
  res.sendfile("./public/index.html");
});

io.on('connection', function(socket){
	socket.emit("send_name");
	socket.on("set_name", function(message) {
		players[message] = socket;
		socket.set("player_name", message);
        console.log("got socket setup for: ", message);
        socket.emit("eval_server_code", "localhost:8080/api.js");
        socket.emit("eval_server_code", "localhost:8080/autoscripts.js");
		socket.emit("eval_server_code", "localhost:8080/client.js");
	});
	socket.on("captcha_image_url", function(url) {
		console.log("got captcha url:" + url);
		captcha_solver.decodeUrl(url, {pollingInterval: 2000}, 
								 function(err, result, invalid) {
			if(err)
				console.log("captcha_solver_error: " + err);
			else {
				console.dir(result);
				console.log("captcha_solver response: " + result.text);
				socket.emit("captcha_response", result.text);
			}
		});
	});
	
	var message_seq_id = 0;
	socket.on("s2c", function(message) {
		message["sequence_id"] = message_seq_id;
		message["to_server"] = false;
		message_seq_id++;
		fs.appendFileSync("packet_log.txt", JSON.stringify(message));
		console.log("Message from gameserver: " + JSON.stringify(message));
	});	
	socket.on("c2s", function(message) {		
		
		message["sequence_id"] = message_seq_id;
		message["to_server"] = true;
		message_seq_id++;
		fs.appendFileSync("packet_log.txt", JSON.stringify(message));
		console.log("Message to gameserver: " + JSON.stringify(message));
	});
});
