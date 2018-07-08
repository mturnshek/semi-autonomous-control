class AgentConnection {
  constructor() {
    this.ws = new WebSocket("ws://localhost:8000");
  }

  set_action_callback(action_callback) {
    this.ws.onmessage = function(event) {
      const action = JSON.parse(event.data);
      action_callback(action);
    }
  }

  publish_state_buffer(state_buffer) {
    this.ws.send(JSON.stringify(state_buffer));
  }
}
