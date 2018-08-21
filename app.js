const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const predictFace = require("./predictFace");
app.use(cors());
app.use(bodyParser.json({ limit: "50kb" }));

const writeImage = (req, res) => {
  let imageData = req.body.imageData;
  fs.writeFile(
    path.resolve(__dirname, "test1.png"),
    imageData,
    "base64",
    function(err) {
      if (err) throw err;
    }
  );
  res.send({ message: "Image loaded" });
};

app.use("/predict", predictFace);
app.post("/write", writeImage);

module.exports = app;
