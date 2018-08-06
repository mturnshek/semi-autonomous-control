// gives distance, accounting for map wrapping
function distance (o1, o2) {
  const map_size = 100;
  const dx = o2.x - o1.x;
  const dx_wrap = dx - map_size;
  const dy = o2.y - o1.y;
  const dy_wrap = dy - map_size;

  distance1 = Math.sqrt(dx*dx + dy*dy);
  distance2 = Math.sqrt(dx_wrap*dx_wrap + dy*dy);
  distance3 = Math.sqrt(dx*dx + dy_wrap*dy_wrap);
  distance4 = Math.sqrt(dx_wrap*dx_wrap + dy_wrap*dy_wrap);

  return Math.min(distance1, distance2, distance3, distance4);
}

function is_overlapping(o1, o2) {
  return (distance(o1, o2) < o1.r + o2.r);
}

class Asteroid {
  constructor(x, y, map_size) {
    this.x = x;
    this.y = y;
    this.vel_min = -0.8;
    this.vel_max = 0.8;
    this.dx = Math.random() * (this.vel_max - this.vel_min) + this.vel_min;
    this.dy = Math.random() * (this.vel_max - this.vel_min) + this.vel_min;
    this.vel_update_perturbation = 0.05;
    this.r = 2.0;
    this.map_size = map_size
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    // over time, add asteroid speed perturbations
    this.dx += (Math.random() - 0.5) * this.vel_update_perturbation;
    this.dy += (Math.random() - 0.5) * this.vel_update_perturbation;

    // still, stay in vel range
    if (this.dx > this.vel_max) {
      this.dx = this.vel_max;
    } else if (this.dx < this.vel_min) {
      this.dx = this.vel_min;
    }
    if (this.dy > this.vel_max) {
      this.dy = this.vel_max;
    } else if (this.dy < this.vel_min) {
      this.dy = this.vel_min;
    }

    // map is cyclical
    this.x = (this.x + this.map_size) % this.map_size;
    this.y = (this.y + this.map_size) % this.map_size;
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
    this.acceleration = 1.0;
    this.top_speed = 2.5;
    this.speed_decay = 0.5; // must be less than acceleration to allow movement
    this.feeler_inner_r = 6.0; // feelers are what the ship uses to detect surrounding asteroids
    this.feeler_middle_r = 9.0;
    this.feeler_outer_r = 12.0;
    this.num_inner_feelers = 32; // inner ring
    this.num_middle_feelers = 32; //middle ring
    this.num_outer_feelers = 32; // outer ring
    this.num_feelers = this.num_inner_feelers + this.num_middle_feelers + this.num_outer_feelers;
    this.map_size = map_size;
  }

  add_feeler_ring(feeler_array, num_feelers, feeler_ring_radius) {
    for (let i = 0; i < num_feelers; i++) {
      let x = this.x + feeler_ring_radius * Math.cos(2 * Math.PI * i / num_feelers);
      let y = this.y + feeler_ring_radius * Math.sin(2 * Math.PI * i / num_feelers);

      // map is cyclical
      this.x = (this.x + this.map_size) % this.map_size;
      this.y = (this.y + this.map_size) % this.map_size;

      feeler_array.push(new Feeler(x, y))
    }
  }

  get_feeler_array() {

    let feelers = new Array();
    this.add_feeler_ring(feelers, this.num_inner_feelers, this.feeler_inner_r);
    this.add_feeler_ring(feelers, this.num_middle_feelers, this.feeler_middle_r);
    this.add_feeler_ring(feelers, this.num_outer_feelers, this.feeler_outer_r);
    return feelers;
  }

  update(action) {
    const action_str = action.toString();
    if (action_str == [1, 0, 0, 0, 0].toString()) {
      // this action means to do nothing
    } else if (action_str == [0, 1, 0, 0, 0].toString()) {
      this.go_left()
    } else if (action_str == [0, 0, 1, 0, 0].toString()) {
      this.go_up()
    } else if (action_str == [0, 0, 0, 1, 0].toString()) {
      this.go_right()
    } else if (action_str == [0, 0, 0, 0, 1].toString()) {
      this.go_down()
    }

    this.x += this.dx;
    this.y += this.dy;

    if ((-this.speed_decay <= this.dx) && (this.dx <= this.speed_decay)) {
      this.dx = 0.0;
    } else if (this.speed_decay < this.dx) {
      this.dx -= this.speed_decay;
    } else if (this.dx < -this.speed_decay) {
      this.dx += this.speed_decay;
    }

    if ((-this.speed_decay <= this.dy) && (this.dy <= this.speed_decay)) {
      this.dy = 0.0;
    } else if (this.speed_decay < this.dy) {
      this.dy -= this.speed_decay;
    } else if (this.dy < -this.speed_decay) {
      this.dy += this.speed_decay;
    }

    // map is cyclical
    this.x = (this.x + this.map_size) % this.map_size;
    this.y = (this.y + this.map_size) % this.map_size;
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
    this.train_mode = train_mode;

    this.map_size = 100.0; // both width and height
    this.create_asteroids();
    this.create_spaceship();
    this.init_state_buffer();
  }

  create_asteroids() {
    this.asteroids = new Array();
    let asteroid_spacing = 30.0;
    for (let x = 0; x < this.map_size; x += asteroid_spacing) {
      for (let y = 0; y < this.map_size; y += asteroid_spacing) {
        this.asteroids.push(new Asteroid(x, y, this.map_size));
      }
    }
  }

  create_spaceship() {
    this.spaceship = new Spaceship(this.map_size/2, this.map_size/2, this.map_size);
  }

  init_state_buffer() {
    this.state_buffer = Array(3); // the amount of 'frames' the model takes is 3

    // the magic number 3 is an input for x velocity, y velocity, and spaceship collision binary
    const state_size = this.spaceship.num_feelers + 3;
    this.state_buffer[0] = Array(state_size).fill(0.0);
    this.state_buffer[1] = Array(state_size).fill(0.0);
    this.state_buffer[2] = Array(state_size).fill(0.0);
  }

  get_concatted_state_buffer() {
    let a = this.state_buffer[0]
    let b = this.state_buffer[1]
    let c = this.state_buffer[2]
    let flat_state_buffer = a.concat(b.concat(c));
    return flat_state_buffer;
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
  }

  update(action) {
    if (this.train_mode) {
      this.spaceship.update(action);
      this.asteroids.forEach(function(asteroid) {
        asteroid.update();
      });
      this.update_state();
    }
    else {
      this.spaceship.update(action);
      this.asteroids.forEach(function(asteroid) {
        asteroid.update();
      });
      this.update_state();
      // tfjs stuff ... not necessary to test visual/train
      // also need to add the action to the state here, before sampling
      // production, sample from model using the given action and state
    }
  }
}
