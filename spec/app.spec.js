const { expect } = require("chai");
const request = require("supertest");
const fs = require("fs");
const app = require("../app");
const readFaceData = require("../readFaceData");
const detectFaces = require("../detectFaces");
let testPayload;

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

describe("detectFaces", function() {
  this.timeout(30000);
  beforeEach(function() {
    const classNames = { classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"] };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
  });
  it("returns a result", async () => {
    const resultData = await detectFaces("Tim");
    expect(resultData).to.be.an("array");
    expect(resultData.length).to.equal(5);
  });
});

describe.only("API call", function() {
  this.timeout(30000);
  beforeEach(function() {
    const classNames = { classNames: ["stuart", "Nic", "Ant", "Tim", "Rick"] };
    fs.writeFileSync("./data/classNames.json", JSON.stringify(classNames));
    testPayload = fs.readFileSync(__dirname + "/../data/testPayload.json");
  });
  it("returns a 200 response to the user", () => {
    request(app)
      .post("/newUser")
      .send(JSON.parse(testPayload))
      .then(res => {
        console.log(res);
      });
  });
});
