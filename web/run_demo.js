const sim = new Simulation(true);
const drawer = new Drawer(sim);
const controller = new Controller();
const rl_agent_client = new RLAgentClient(sim, drawer, controller);
