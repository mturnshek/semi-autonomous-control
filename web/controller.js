class Controller {
  constructor() {
    this.action = [1, 0, 0, 0, 0];

    this.left_pressed = false;
    this.up_pressed = false;
    this.right_pressed = false;
    this.down_pressed = false;

    // keycodes
    const left = 37;
    const up = 38;
    const right = 39;
    const down = 40;

    let controller = this;
    function press(e) {
      const code = e.keyCode;
      switch (code) {
        case left: controller.left_pressed = true; controller.update(); break;
        case up: controller.up_pressed = true; controller.update(); break;
        case right: controller.right_pressed = true; controller.update(); break;
        case down: controller.down_pressed = true; controller.update(); break;
      }
    }

    function release(e) {
      const code = e.keyCode;
      switch (code) {
        case left: controller.left_pressed = false; controller.update(); break;
        case up: controller.up_pressed = false; controller.update(); break;
        case right: controller.right_pressed = false; controller.update(); break;
        case down: controller.down_pressed = false; controller.update(); break;
      }
    }

    window.addEventListener('keydown', press, false);
    window.addEventListener('keyup', release, false);
  }

  get_action() {
    return this.action;
  }

  update() {
    if (this.left_pressed) {
      this.action = [0, 1, 0, 0, 0];
    } else if (this.up_pressed) {
      this.action = [0, 0, 1, 0, 0];
    } else if (this.right_pressed) {
      this.action = [0, 0, 0, 1, 0];
    } else if (this.down_pressed) {
      this.action = [0, 0, 0, 0, 1];
    } else {
      this.action = [1, 0, 0, 0, 0];
    }
  }
}
