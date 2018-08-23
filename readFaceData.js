const path = require("path");
const fs = require("fs");
const fr = require("face-recognition");
const detector = fr.FaceDetector();
const dataPath = path.resolve("./data/faces");
let classNamesForModel;

const readFaceData = async (newName = "") => {
  if (newName !== "") {
    const data = fs.readFileSync("./data/classNames.json");
    let json = JSON.parse(data);
    if (json.classNames.indexOf(newName === -1)) {
      json.classNames[json.classNames.length] = newName;
    }
    fs.writeFileSync("./data/classNames.json", JSON.stringify(json));
    classNamesForModel = JSON.parse(fs.readFileSync("./data/classNames.json"))
      .classNames;
    const allFiles = fs.readdirSync(dataPath);
    const imagesByClass = classNamesForModel.map((c) =>
      allFiles
        .filter((f) => f.includes(c))
        .map((f) => path.join(dataPath, f))
        .map((fp) => {
          const image = fr.loadImage(fp);
          return detector.detectFaces(image, 150)[0];
        })
    );
    const numTrainingFaces = 4;
    const trainDataByClass = imagesByClass.map((imgs) =>
      imgs.slice(0, numTrainingFaces)
    );
    const testDataByClass = imagesByClass.map((imgs) =>
      imgs.slice(numTrainingFaces)
    );
    return [classNamesForModel, trainDataByClass, testDataByClass];
  }
};

module.exports = readFaceData;
