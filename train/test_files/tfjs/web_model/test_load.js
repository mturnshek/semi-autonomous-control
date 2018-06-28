const tf = require('@tensorflow/tfjs');
const tfjs_converter = require('@tensorflow/tfjs-converter');

const MODEL_URL = '/test_files/tfjs/web_model/tensorflowjs_model.pb';
const WEIGHTS_URL = 'weights_manifest.json';

const model = tfjs_converter.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
