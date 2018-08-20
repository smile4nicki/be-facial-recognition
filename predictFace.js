const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const recognizer = fr.FaceRecognizer();
const modelState = require("./model.json");

recognizer.load(modelState);

const stuartTest = fr.loadImage(
  "/Users/smile4nicki/Downloads/stuart_photos/stuart3.jpeg"
);

const prediction = recognizer.predict(stuartTest);

console.log(prediction);
