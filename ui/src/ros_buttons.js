// Connecting to ROS
// -----------------
var ros = new ROSLIB.Ros();
var connectionstr = create_connectionion_str(window.location.hostname, '9090')

function create_connectionion_str(url, port) {
  return 'ws://'+url+':'+port;
}

// If there is an error on the backend, an 'error' emit will be emitted.
ros.on('error', function(error) {
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('error').style.display = 'inline';
  console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
  console.log('Connection made!');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('closed').style.display = 'none';
  document.getElementById('connected').style.display = 'inline';
});

ros.on('close', function() {
  console.log('Connection closed.');
  document.getElementById('connecting').style.display = 'none';
  document.getElementById('connected').style.display = 'none';
  document.getElementById('closed').style.display = 'inline';
});

function connectRosbridge(port) {
  // Create a connection to the rosbridge WebSocket server.
  connectionstr = create_connectionion_str(window.location.hostname, port)
  ros.connect(connectionstr);
  console.log('Connected to: '+connectionstr);
}

// Publish a Topic
var estop_publisher = new ROSLIB.Topic({
  ros : ros,
  name : '/emergency_stop',
  messageType : 'std_msgs/Empty'
});

// Publish a Topic
var start_publisher = new ROSLIB.Topic({
  ros : ros,
  name : '/mission_start',
  messageType : 'std_msgs/Empty'
});

var image_topic = null;
document.getElementById('imagetopic_input').value="/vehicle_1/camera/image_raw/compressed"
function setImageTopic(topic_name) {
  console.log("Triggered");
  console.log(image_topic);
  if(image_topic != null) {
    image_topic.unsubscribe();
    document.getElementById('my_image').src = "images/starling.jpg"
  }
  // Image topic
  image_topic = new ROSLIB.Topic({
    ros: ros, 
    name: topic_name,
    messageType: 'sensor_msgs/CompressedImage'
  });

  image_topic.subscribe(function(message) {
    var jpeg_file = btoa(String.fromCharCode.apply(null, message.data));
    document.getElementById('my_image').src = "data:image/jpg;base64," + jpeg_file;
  });

}

function sendEmergencyStop() {
  estop_publisher.publish({});
  console.log("Emergency Stop Pressed")
  $('#eStopSentMessage').show()
  document.getElementById('eStopButton').style.filter="brightness(50%)"
  setTimeout(function() {
      $('#eStopSentMessage').hide()
      document.getElementById('eStopButton').style.filter="brightness(100%)"
    }, 1000);
}

function sendMissionStart() {
  start_publisher.publish({})
  console.log("Mission Start Pressed")
  $('#missionStartSentMessage').show()
  document.getElementById('missionStartButton').style.filter="brightness(50%)"
  setTimeout(function() {
      $('#missionStartSentMessage').hide()
      document.getElementById('missionStartButton').style.filter="brightness(100%)"
    }, 1000);
}

document.getElementById('eStopButton').addEventListener('click',sendEmergencyStop);
document.getElementById('missionStartButton').addEventListener('click',sendMissionStart);
document.getElementById('rosbridgeport_input').addEventListener('input', function(evt) {connectRosbridge(this.value);})
document.getElementById('rosbridgeport_input').dispatchEvent(new Event('input')); // Trigger default
document.getElementById('imagetopic_input').addEventListener('input', function(evt) {setImageTopic(this.value);})
document.getElementById('imagetopic_input').dispatchEvent(new Event('input')); // Trigger default