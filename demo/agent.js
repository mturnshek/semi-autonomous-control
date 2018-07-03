tf = require('')

class Agent {
  constructor() {
    this.model = tf.sequential();
    // define the model
    this.model.add(tf.layers.dense({units: 64, inputShape: [302]}));
    this.model.add(tf.layers.dense({units: 64}));
    this.model.add(tf.layers.dense({units: 5, activation: 'softmax'}));

    // load in our weights
    console.log(this.model);
    console.log(this.model.weights);
    const test_state = Array(302);
    for (let i = 0; i < test_state.length; i++) {
      test_state[i] = i
    }
    console.log(test_state);
    this.predict(test_state).print();
    this.act(test_state).print();


    // // Build and compile model.
    // const model = tf.sequential();
    // model.add(tf.layers.dense({units: 1, inputShape: [1]}));
    // model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
    //
    // // Generate some synthetic data for training.
    // const xs = tf.tensor2d([[1], [2], [3], [4]], [4, 1]);
    // const ys = tf.tensor2d([[1], [3], [5], [7]], [4, 1]);
    //
    // // Train model with fit().
    // model.fit(xs, ys, {epochs: 1000});
    //
    // // Run inference with predict().
    // model.predict(tf.tensor2d([[5]], [1, 1])).print();
  }

  predict(state) {
    const state_tensor = tf.tensor2d([state], [1, 302]);
    console.log(state_tensor);
    return this.model.predict(state_tensor, {batch_size: 1});
  }

  act(state) {
    const prediction = this.predict(state);
    const action_int = tf.argMax(prediction, 1);
    return action_int;
  }
}

const a = new Agent();
