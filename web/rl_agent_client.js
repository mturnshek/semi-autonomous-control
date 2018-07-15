class RLAgentClient {
  constructor(sim, drawer) {
    this.ws = new WebSocket("ws://localhost:8000");
    const ws = this.ws

    this.ws.onmessage = function(event) {
      console.log(ws.readyState);
      console.log('onmessage start');
      // get action from rl agent server, and update the simulation with it
      const action = JSON.parse(event.data);
      console.log(action);
      sim.update(action);
      if (drawer != null) {
          drawer.draw();
      }
      // send updated state back to rl agent server
      const state_buffer = sim.get_concatted_state_buffer();
      console.log('before send');
      ws.send(JSON.stringify(state_buffer));
      console.log('after send');
      console.log(ws.readyState);
    }

    // after opening connection,
    // send initial state of the simulation to rl agent server
    this.ws.onopen = function(event) {
      console.log(ws.readyState);
      const state_buffer = sim.get_concatted_state_buffer();
      ws.send(JSON.stringify(state_buffer));
      console.log('sent onopen');
    }

    this.ws.onerror = function(event){
      console.log(event);
    }

    this.ws.onclose = function(event){
      console.log('closed......');
    }
  }
}
