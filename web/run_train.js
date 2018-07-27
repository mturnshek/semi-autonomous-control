const sim = new Simulation(true);
const drawer = new Drawer(sim);
const markov_action_generator = new MarkovActionGenerator();
const rl_agent_client = new RLAgentClient(sim, drawer, markov_action_generator);

document.getElementById('toggle-visualizer').onclick = function(e) {
  if (rl_agent_client.drawer == null) {
    rl_agent_client.drawer = drawer;
  } else {
    rl_agent_client.drawer = null;
  }
}
