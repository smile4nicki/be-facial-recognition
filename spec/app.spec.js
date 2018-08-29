const { expect } = require("chai");
const { request } = require("supertest");
const fs = require("fs");

const readFaceData = require("../readFaceData");

describe("readFaceData", function() {
  this.timeout(35000);
  beforeEach(function() {
    const classNames = { classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"] };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
  });
  it("adds a new name when it is not currently in the array of class names", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Jerry");
    const newClassNamesLength = faceData[0].length;
    expect(newClassNamesLength).to.equal(json.classNames.length + 1);
  });
  it("does not add a name already in the array of class names", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Tim");
    const newClassNamesLength = faceData[0].length;
    expect(newClassNamesLength).to.equal(json.classNames.length);
  });
  it("creates an array of four images for each user to train the model", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    const faceData = await readFaceData("Tim");
    const newClassNamesLength = faceData[0].length;
    const trainingData = faceData[1];
    expect(trainingData.length).to.equal(newClassNamesLength);
    expect(trainingData[0].length).to.equal(4);
  });
});
