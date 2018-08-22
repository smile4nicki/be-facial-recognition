const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const predictFace = require("./predictFace");
const detectFaces = require("./detectFaces");
app.use(cors());
app.use(bodyParser.json({ extended: true, limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser());

const writeTestImage = (req, res) => {
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
    .then((prediction) => res.send({ prediction }));
};

const writeNewUser = (req, res, next) => {
  let newImages = req.body.newUserData.images;
  let name = req.body.newUserData.name;
  return new Promise(function(resolve, reject) {
    newImages.forEach((image, index) => {
      let formattedImage = image.split(",")[1];
      fs.writeFile(
        path.resolve(__dirname, `./data/faces/${name}${index}.jpeg`),
        formattedImage,
        "base64",
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }).then(() => detectFaces());
};

app.use("/predict", predictFace);
app.post("/write", writeTestImage);
app.post("/newUser", writeNewUser);

module.exports = app;
