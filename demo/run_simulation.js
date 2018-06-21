sim = new Simulation(true);

function f() {
    sim.update([0, 0, 0, 0, 0]);
}

setInterval(f, 100);
