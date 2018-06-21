sim = new Simulation(true);
drawer = new Drawer(sim);
controller = new Controller();

function f() {
  console.log(controller.action);
  sim.update(controller.action);
  drawer.draw();
}

setInterval(f, 50);
