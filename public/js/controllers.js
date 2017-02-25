'use strict';

/* Controllers */

var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', function($scope, $location, $interval, socket) {
  $scope.sensordata = [];

  socket.on('request', function(data) {
    var sensor_row = {};

		$scope.time = getDateTime();
		$scope.voltage = data;
		$scope.sensordata = [];
    for (var i = 0; i <=11; i++) {

			$scope.sensordata.push({"voltage" : data, "time" : $scope.time});
		}
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
});


myApp.factory('socket', function($rootScope) {

	//Connect to the socket and expose events

	var socket = io.connect("/");
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		}
	};
});
