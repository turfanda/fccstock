var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require("./routes/routes");
var bodyParser = require('body-parser');
var session = require('express-session');
var io=require("socket.io")(listener);
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/",express.static('public'));

app.use(session({
    secret: 'turfanda',
    saveUninitialized: true,
    resave: true
}));

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

app.use("/", routes);

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});


