const fs = require('fs');
require('es6-promise').polyfill();
require('isomorphic-fetch');
const tf = require('@tensorflow/tfjs');
const tfjs_converter = require('@tensorflow/tfjs-converter');

fs.readdir('./', (err, files) => {
  files.forEach(file => {
    console.log(file);
  });
})

const MODEL_URL = 'tensorflowjs_model.pb';
const WEIGHTS_URL = 'weights_manifest.json';

const model = tfjs_converter.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
