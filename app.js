const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const predictFace = require("./predictFace");
app.use(cors());
app.use(bodyParser.json({ extended: true, limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser());

const writeImage = (req, res) => {
  let imageData = req.body.imageData;
  return new Promise(function(resolve, reject) {
    fs.writeFile(
      path.resolve(__dirname, "./data/faces/test_image.jpeg"),
      imageData,
      "base64",
      function(err) {
        if (err) reject(err);
        else resolve();
      }
    );
  })
    .then(() => predictFace())
    .then(prediction => res.send({ prediction }));
};

app.use("/predict", predictFace);
app.post("/write", writeImage);

module.exports = app;
