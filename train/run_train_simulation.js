const connection_module = require('./connection.js')
const connection = new connection_module.Connection();

const sim_module = require('../simulation.js')
const sim = new sim_module.Simulation(true, connection.publish_state_buffer.bind(connection));

connection.set_action_callback(sim.update.bind(sim));
