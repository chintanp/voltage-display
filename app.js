
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    socket = require('./routes/socket.js'),
    RandomSignal = require("random-signal"),
    Fakerator = require("fakerator");
var execFileSync = require('child_process').execFileSync;

var fakerator = new Fakerator();
var cwd = __dirname +"/bms/"
var cmd = "./bms";

fakerator.seed(12354);

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

// Configuration
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);

io.sockets.on('connection', function(socket) {

  setInterval(function () {
      var num = fakerator.random.number(-5, 5);
      var output = execFileSync(cmd, {cwd : cwd}).toString();
      var voltageString = output.substring(output.indexOf("Cell volts =") + 12, output.indexOf("Cell Temps ="));
      var voltages = voltageString.split(/\b\s+\b/);
      var voltage_int = [];
      voltages.forEach(function(element) {
        voltage_int.push(parseInt(element, 16)/10000);
	
      });
      console.log(voltage_int.length);
      socket.emit('request', voltage_int);
      //console.log("Number" + num);
    }, 2000);

});

// Start server
server.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
