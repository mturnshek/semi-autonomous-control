class Asteroid {
  constructor(x, y, map_size) {
    this.x = x;
    this.y = y;
    this.dx = 1.0;
    this.dy = 1.0;
    this.r = 2.0;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // map is cyclical
    this.x = this.x % map_size;
    this.y = this.y % map_size;
  }
}

class Feeler {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Spaceship {
  constructor(x, y, map_size) {
    this.x = x;
    this.y = y;
    this.dx = 0.0;
    this.dy = 0.0;
    this.r = 4.0;
    this.acceleration = 0.5;
    this.top_speed = 5.0;
    this.feeler_r = 8.0;
    this.num_feelers = 32; // what the ship uses to detect surrounding asteroids
  }

  get_feeler_array() {
    feelers = new Array();
    for (let i = 0; i < this.num_feelers; i++) {
      let x = this.x + this.feeler_r * Math.cos(2 * Math.PI * i / this.num_feelers);
      let y = this.y + this.feeler_r * Math.sin(2 * Math.PI * i / this.num_feelers);

      // map is cyclical
      x = x % this.map_size
      y = y % this.map_size

      feelers.push(new Feeler(x, y))
    }
    return feelers;
  }

  update(action) {
    if (action == [1, 0, 0, 0, 0]) {
      // this action means to do nothing
    } else if (action == [0, 1, 0, 0, 0]) {
      go_left()
    } else if (action == [0, 0, 1, 0, 0]) {
      go_right()
    } else if (action == [0, 0, 0, 1, 0]) {
      go_up()
    } else if (action == [0, 0, 0, 0, 1]) {
      go_down()
    }

    this.x += this.dx;
    this.y += this.dy;

    // map is cyclical
    this.x = this.x % map_size;
    this.y = this.y % map_size;
  }

  go_left() {
		if (this.dx > -this.top_speed) {
			this.dx -= this.acceleration;
		}
	}

	go_right() {
		if (this.dx < this.top_speed) {
			this.dx += this.acceleration;
		}
	}

	go_up() {
		if (this.dy > -this.top_speed) {
			this.dy -= this.acceleration;
		}
	}

	go_down() {
		if (this.dy < this.top_speed) {
			this.dy += this.acceleration;
		}
	}
}

class Simulation {
  constructor() {
    this.size = 100.0; // both width and height
    this.create_asteroids();
    this.create_spaceship();
  }

  create_asteroids() {
    let asteroid_spacing = 20.0;
    for (let x = 0; x < 100; x += 20) {
      for (let y = 0; y < 100; y += 20) {
        this.asteroids.push(new Asteroid(i, j));
      }
    }
  }

  create_spaceship() {
    this.spaceship = new Spaceship(size/2, size/2);
  }

  create_state() {

    asteroids.forEach(function(asteroid) {

    })
  }

  update(action) {
    this.spaceship.update(action)
    asteroids.forEach(function(asteroid) {
      asteroid.update()
    });
  }
}
