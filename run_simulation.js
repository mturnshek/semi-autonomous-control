sim = new Simulation(false, null);
drawer = new Drawer(sim);
controller = new Controller();

function f() {
  sim.update(controller.action);
  drawer.draw();
}

setInterval(f, 50);
