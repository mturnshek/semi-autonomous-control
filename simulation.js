function distance (o1, o2) {
  var dx = o2.x - o1.x;
  var dy = o2.y - o1.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function is_overlapping(o1, o2) {
  return (distance(o1, o2) < o1.r + o2.r);
}

class Asteroid {
  constructor(x, y, map_size) {
    this.x = x;
    this.y = y;
    this.dx = 1.0;
    this.dy = 1.0;
    this.r = 2.0;
    this.map_size = map_size
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // map is cyclical
    this.x = this.x % this.map_size;
    this.y = this.y % this.map_size;
  }
}

class Feeler {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0.0;
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
    this.map_size = map_size;
  }

  get_feeler_array() {
    let feelers = new Array();
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
    this.x = this.x % this.map_size;
    this.y = this.y % this.map_size;
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
  constructor(train_mode) {
    this.map_size = 100.0; // both width and height
    this.create_asteroids();
    this.create_spaceship();
    this.train_mode = train_mode;
    this.state_buffer = Array(3); // the amount of 'frames' the model takes is 3
  }

  create_asteroids() {
    this.asteroids = new Array();
    let asteroid_spacing = 20.0;
    for (let x = 0; x < 100; x += 20) {
      for (let y = 0; y < 100; y += 20) {
        this.asteroids.push(new Asteroid(x, y, this.map_size));
      }
    }
  }

  create_spaceship() {
    this.spaceship = new Spaceship(this.map_size/2, this.map_size/2, this.map_size);
  }

  update_state() {
    let feeler_array = this.spaceship.get_feeler_array();
    let new_state_array = Array();

    // check feeler collisions
    let feeler = null
    for (let i = 0; i < feeler_array.length; i++) {
      feeler = feeler_array[i];
      new_state_array[i] = 0.0; // feeler not active
      this.asteroids.forEach(function(asteroid) {
        if (is_overlapping(feeler, asteroid)) {
          new_state_array[i] = 1.0; // feeler active
        }
      });
    }
    // check spaceship collision
    new_state_array[feeler_array.length] = 0.0; // spaceship not colliding
    let spaceship = this.spaceship;
    this.asteroids.forEach(function(asteroid) {
      if (is_overlapping(spaceship, asteroid)) {
        new_state_array[feeler_array.length] = 1.0; // spaceship is colliding
      }
    });
    // add ship velocity to state
    new_state_array.push(this.spaceship.dx);
    new_state_array.push(this.spaceship.dy);

    // update state buffer with new state, pushing the old ones back
    this.state_buffer[0] = this.state_buffer[1];
    this.state_buffer[1] = this.state_buffer[2];
    this.state_buffer[2] = new_state_array;
    console.log('entering here?');
    console.log(this.state_buffer);
  }

  update(action) {
    if (this.train_mode) {
      console.log('entered train mode update');
      this.spaceship.update(action);
      this.asteroids.forEach(function(asteroid) {
        asteroid.update();
      });
      this.update_state();
    }
    else {
      // tfjs stuff ... not necessary to test visual/train
      // also need to add the action to the state here, before sampling
      // production, sample from model using the given action and state
    }
  }
}
