var express = require('express');
var mongoose = require('mongoose');
var app = express();
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var io=require("socket.io").listen(listener);

mongoose.connect(process.env.MONGO_URI, {useMongoClient: true}, function(err){
    if(err) {
        console.log('Some problem with the connection ' +err);
    } else {
        console.log('The Mongoose connection is ready');
    }
});

app.use("/",express.static('public'));


app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/views/index.html');
});

io.sockets.on('connection',function(socket) {
  console.log("We have a new client: " + socket.id);
  socket.on('stockArray',function(data) {
    console.log(data);
    socket.broadcast.emit('stockArray', data);
    // This is a way to send to everyone including sender
    // io.sockets.emit('message', "this goes to everyone");
  });
  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });
});