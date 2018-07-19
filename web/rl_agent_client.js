class RLAgentClient {
  constructor(sim, drawer) {
    this.ws = new WebSocket("ws://localhost:8000");
    const ws = this.ws

    this.ws.onmessage = function(event) {
      // get action from rl agent server, and update the simulation with it
      const action = JSON.parse(event.data);
      sim.update(action);
      if (drawer != null) {
          drawer.draw();
      }
      // send updated state back to rl agent server
      const state_buffer = sim.get_concatted_state_buffer();
      ws.send(JSON.stringify(state_buffer));
    }

    // after opening connection,
    // send initial state of the simulation to rl agent server
    this.ws.onopen = function(event) {
      const state_buffer = sim.get_concatted_state_buffer();
      ws.send(JSON.stringify(state_buffer));
    }

    this.ws.onerror = function(event){
      console.log(event);
    }

    this.ws.onclose = function(event){
      console.log('closed websocket');
    }
  }
}
