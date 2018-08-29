const { expect } = require("chai");
const { request } = require("supertest");
const fs = require("fs");

const readFaceData = require("../readFaceData");

describe("face recognition", function() {
  this.timeout(20000);
  it("adds a new user's name to the class names file", async () => {
    const data = fs.readFileSync(__dirname + "/../data/classNames.json");
    let json = JSON.parse(data);
    console.log(json.classNames.length);
    const faceData = await readFaceData("Tim");
    const newClassNamesLength = faceData[0].length;
    console.log(newClassNamesLength);
    expect(newClassNamesLength).to.equal(json.classNames.length + 1);
  });
});
