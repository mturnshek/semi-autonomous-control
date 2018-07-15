class Drawer {
  constructor(sim) {
    this.sim = sim;
    this.scale_factor = 4.0;

    let elem = document.getElementById('draw-shapes');
    let params = { width: sim.map_size*this.scale_factor, height: sim.map_size*this.scale_factor };
    this.two = new Two(params).appendTo(elem);

    this.spaceship_not_colliding_fill = '#77dd77';
    this.spaceship_not_colliding_stroke = '#aaaacc';
    this.spaceship_colliding_fill = '#ff7777';
    this.spaceship_colliding_stroke = '#eeaacc';
    this.spaceship_linewidth = 1;

    this.asteroid_fill = '#5f5f5f';
    this.asteroid_stroke = '#ffffff';
    this.asteroid_linewidth = 0.1;

    this.feeler_not_active = '#aaaacc';
    this.feeler_active = '#ff0000'
    this.feeler_linewidth = 0.1;
  }

  draw_spaceship() {
    let circle = this.two.makeCircle(
      this.sim.spaceship.x * this.scale_factor,
      this.sim.spaceship.y * this.scale_factor,
      this.sim.spaceship.r * this.scale_factor);
    if (this.sim.state_buffer[2][this.sim.spaceship.num_feelers] == 1.0) {
      circle.fill = this.spaceship_colliding_fill;
      circle.stroke = this.spaceship_colliding_stroke;
    } else {
      circle.fill = this.spaceship_not_colliding_fill;
      circle.stroke = this.spaceship_not_colliding_stroke;
    }
    circle.linewidth = this.spaceship_linewidth;
  }

  draw_asteroids() {
    const two = this.two;
    const drawer = this;
    this.sim.asteroids.forEach(function(asteroid) {
      let circle = two.makeCircle(
        asteroid.x * drawer.scale_factor,
        asteroid.y * drawer.scale_factor,
        asteroid.r * drawer.scale_factor);
      circle.fill = drawer.asteroid_fill;
      circle.stroke = drawer.asteroid_stroke;
      circle.linewidth = drawer.asteroid_linewidth;
    });
  }

  draw_feelers() {
    const two = this.two;
    const drawer = this;
    let i = 0;
    this.sim.spaceship.get_feeler_array().forEach(function(feeler) {
      let circle = two.makeCircle(
        feeler.x * drawer.scale_factor,
        feeler.y * drawer.scale_factor,
        feeler.r + 0.5 * drawer.scale_factor);
      if (drawer.sim.state_buffer[2][i] == 1.0) { // feeler is colliding
        circle.fill = drawer.feeler_active;
        circle.stroke = drawer.feeler_active;
      } else {
        circle.fill = drawer.feeler_not_active;
        circle.stroke = drawer.feeler_not_active;
      }
      circle.linewidth = drawer.feeler_linewidth;
      i += 1;
    });
  }

  draw() {
    this.two.clear();
    this.draw_spaceship();
    this.draw_asteroids();
    this.draw_feelers();
    this.two.update();
  }
}
