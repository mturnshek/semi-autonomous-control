console.log('did we... enter?');
const sim = new Simulation(true);
console.log('...');
const drawer = new Drawer(sim);
console.log('.....');
const rl_agent_client = new RLAgentClient(sim, drawer);
console.log('so we get everywhere.');
