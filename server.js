var express = require('express');
var mongoose = require('mongoose');
var stockOp = require('./model/stockop');

var app = express();
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
var path = require('path');
var cookieParser = require('cookie-parser');
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
app.get('/apikey', function(req, res,next) {  
  var apikey=process.env.ALPHA_API_KEY;  
  res.json(apikey);
});

app.get('/getstock', function(req, res,next) {  
  stockOp.getStock(function(err,asd){
    if(err) {
      throw err;
      }
    else{
      console.log("stockserved");
    res.json(asd);}
    });
});

io.sockets.on('connection',function(socket) {
  console.log("We have a new client: " + socket.id);
  socket.on('addStock',function(data) {
    console.log(1);
    var newStock = new stockOp({
      stockName: data
    })
    stockOp.saveStock(newStock,function(err){
    if(err) {
      throw err;
      }
    else
      console.log("stocksaved");
    });
    socket.broadcast.emit('addStock', data);
  });
    socket.on('removeStock',function(data) {
    stockOp.removeStock(data,function(err){
    if(err) {
      throw err;
      }
    else
      console.log("stockdeleted");
    });
    socket.broadcast.emit('removeStock', data);
  });
  socket.on('disconnect', function() {
    console.log("Client has disconnected");
  });
});