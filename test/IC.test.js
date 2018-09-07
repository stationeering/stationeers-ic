"use strict";

const expect = require("chai").expect;

const IC = require("../src/IC");

describe("IC Tests", function () {
  const VALID_MULTIPLE_INSTRUCTION = "YIELD\nYIELD\nYIELD\n";

  describe("Loading instructions", function () {
    it ("reads a string with instructions and can return the number of lines/instructions read", function() {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);

      expect(ic.getInstructionCount()).to.equal(4);
    });
  });

  describe("Parsing a line", function () {
    it ("should handle a command with random spacing", function () {
      let ic = new IC();

      var input = "TOKEN a0   a1   b0";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0", "a1", "b0"]);
    });

    it ("should handle a command followed by a comment", function () {
      let ic = new IC();

      var input = "TOKEN a0 // This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0"]);
    });

    it ("should handle a command followed by a comment, but with no space", function () {
      let ic = new IC();

      var input = "TOKEN a0// This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal(["TOKEN", "a0"]);
    });

    it ("should handle a comment on it's own", function () {
      let ic = new IC();

      var input = " // This is a comment";

      var output = ic._parseLine(input);

      expect(output).to.deep.equal([]);
    });
  });
  
  describe("Validating program", function () {
    it("will allow an empty line", function() {
      let ic = new IC();

      var input = ""

      var output = ic._validateLine(input);

      expect(output).to.equal(undefined);
    });

    it("will allow a comment line", function() {
      let ic = new IC();

      var input = "// This is a comment, ignore me."

      var output = ic._validateLine(input);

      expect(output).to.equal(undefined);
    });
  });

  describe("Inputs, outputs and registers", function () {
    it("has input registers which can be read", function () {
      let ic = new IC();
      let inputRegisters = ic.getInputRegisters();

      expect(inputRegisters.length).to.equal(3);
      expect(inputRegisters[0]).to.equal(0);
      expect(inputRegisters[1]).to.equal(0);
      expect(inputRegisters[2]).to.equal(0);
    });

    it("has output registers which can be read", function () {
      let ic = new IC();
      let outputRegisters = ic.getOutputRegisters();

      expect(outputRegisters.length).to.equal(1);
      expect(outputRegisters[0]).to.equal(0);
    });

    it("has internal registers which can be read", function () {
      let ic = new IC();
      let internalRegisters = ic.getInternalRegisters();

      expect(internalRegisters.length).to.equal(5);
      expect(internalRegisters[0]).to.equal(0);
      expect(internalRegisters[1]).to.equal(0);
      expect(internalRegisters[2]).to.equal(0);
      expect(internalRegisters[3]).to.equal(0);
      expect(internalRegisters[4]).to.equal(0);
    });

    it("has input registers which can be written and read", function () {
      let ic = new IC();

      ic.setInputRegister(1, 100);
      expect(ic.getInputRegisters()[1]).to.equal(100);
    });

    it("has output registers which can be written and read", function () {
      let ic = new IC();

      ic.setOutputRegister(0, 100);
      expect(ic.getOutputRegisters()[0]).to.equal(100);
    });

    it("has internal registers which can be written and read", function () {
      let ic = new IC();

      ic.setInternalRegister(3, 100);
      expect(ic.getInternalRegisters()[3]).to.equal(100);
    });
  });

  describe("Step and flow behaviour", function () {
    it("increases the programme counter to increase", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);

      expect(ic.programCounter()).to.equal(0);
      ic.step();
      expect(ic.programCounter()).to.equal(1);
      ic.step();
      expect(ic.programCounter()).to.equal(2);
    });

    it("restart sets programme counter to 0", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      ic.restart();
      expect(ic.programCounter()).to.equal(0);
    });
  });
});