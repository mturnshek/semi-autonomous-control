const redis = require('redis');

class Connection {
  constructor() {
    this.pub = redis.createClient();
    this.sub = redis.createClient();
  }

  set_action_callback(action_callback) {
    this.sub.on('message', function(channel, message) {
      try {
        const action = JSON.parse(message);
        action_callback(action);
      } catch (e) {
        console.log("ERROR: Incorrectly formatted message.");
      }
    })
    this.sub.subscribe('action');
  }

  publish_state_buffer(state_buffer) {
    this.pub.publish('state_buffer', JSON.stringify({
      data: state_buffer
    }))
  }
}

module.exports = {
  Connection: Connection
}
