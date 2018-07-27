class MarkovActionGenerator {
  constructor() {
    this.chance_of_random_action = 0.3;
    this.none = [1, 0, 0, 0, 0];
    this.left = [0, 1, 0, 0, 0];
    this.up = [0, 1, 1, 0, 0];
    this.right = [0, 0, 0, 1, 0];
    this.down = [0, 0, 0, 0, 1];
    this.action = this.random_action();
  }

  random_action() {
    const r = Math.random()
    if (r < 0.2) {
      return this.none;
    } else if (r < 0.4) {
      return this.left;
    } else if (r < 0.6) {
      return this.up
    } else if (r < 0.8) {
      return this.right;
    } else {
      return this.down;
    }
  }

  get_action() {
    if (Math.random() > this.chance_of_random_action) {
      this.action = this.random_action();
    }
    return this.action;
  }
}
