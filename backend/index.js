const express = require('express');
const multer = require('multer');
const cors = require("cors")
const fs = require("fs/promises")
const tf = require('@tensorflow/tfjs-node');

const app = express();
const port = 5000;

app.use(cors())

const upload = multer({ dest: 'uploads/' });

const modelPath = './model-files/model.json';

let model;

async function loadModel() {
  try {
    model = await tf.loadLayersModel(`file://${modelPath}`);
    console.log('Model loaded successfully.');
  } catch (error) {
    console.error('Error loading model:', error);
  }
}

loadModel();

async function predictImage(imagePath) {
  try {
    const data = await fs.readFile(imagePath);
    const imageTensor = tf.node.decodeImage(data);
    const processedImage = imageTensor.reshape([1, 224, 224, 3]).div(255);
    const prediction = await model.predict(processedImage).data();
    const malignant_pred = prediction[0];
    const benign_pred = prediction[1];
    const result = malignant_pred > benign_pred ? "Malignant" : "Benign";
    return { result };
  } catch (err) {
    console.error('Error reading file:', err);
    throw err; 
  }
}

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const prediction = await predictImage(req.file.path);
    res.json({ prediction });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
