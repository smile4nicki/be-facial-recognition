const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");

const predictFace = async () => {
  recognizer.load(modelState);
  const imageToTest = fr.loadImage(`./data/faces/test_image.jpeg`);
  const prediction = recognizer.predict(imageToTest);
  return prediction;
};

module.exports = predictFace;
