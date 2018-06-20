var ROSLIB = require('roslib');

var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

ros.on('connection', function() {
console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
console.log('Connection to websocket server closed.');
});

var test = new ROSLIB.Topic({
  ros : ros,
  name : '/state',
  messageType : 'std_msgs/Float32MultiArray'
});

test.publish({data: [20.0, 32.0, 5.0, 64.0]})
