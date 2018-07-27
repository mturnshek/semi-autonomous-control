class RLAgentClient {
  constructor(sim, drawer, controller) {
    this.sim = sim;
    this.drawer = drawer;
    this.controller = controller;
    this.ws = new WebSocket("ws://localhost:8000");

    this.ws.onmessage = function(event) {
      const action = JSON.parse(event.data);
      this.update_env(action);

      const state = this.get_state();
      this.ws.send(JSON.stringify(state));
    }.bind(this);

    this.ws.onopen = function(event) {
      const state = this.get_state();
      this.ws.send(JSON.stringify(state));
    }.bind(this);

    this.ws.onerror = function(event) {
      console.log(event);
    }.bind(this);

    this.ws.onclose = function(event) {
      console.log('closed websocket');
    }.bind(this);
  }

  update_env(action) {
    this.sim.update(action);
    if (this.drawer != null) {
        this.drawer.draw();
    }
  }

  get_state() {
    const state_buffer = this.sim.get_concatted_state_buffer();
    const controller_action = this.controller.get_action();
    const state = state_buffer.concat(controller_action);
    return state;
  }
}
