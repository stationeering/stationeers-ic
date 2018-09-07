"use strict";

const expect = require("chai").expect;

const IC = require("../src/IC");

describe("IC Tests", function () {
  const VALID_MULTIPLE_INSTRUCTION = "yield\nyield\nyield\n";

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

      var input = "";

      var output = ic._validateLine(input, 0);

      expect(output.length).to.equal(0);
    });

    it("will allow a comment line", function() {
      let ic = new IC();

      var input = "// This is a comment, ignore me.";

      var output = ic._validateLine(input, 0);

      expect(output.length).to.equal(0);
    });

    it("will return an error for an unknown instruction", function () {
      let ic = new IC();

      var input = "unknown";

      var output = ic._validateLine(input, 123);

      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("UNKNOWN_INSTRUCTION");
    });

    it ("will not return an error if a valid instruction with no arguements is passed", function () {
      let ic = new IC();

      var input = "yield";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(0);
    });

    it ("will return a errors if parameters are missing", function () {
      let ic = new IC();

      var input = "move";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("MISSING_FIELD");
      expect(output[0]["field"]).to.equal(0);
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("MISSING_FIELD");
      expect(output[1]["field"]).to.equal(1);      
    });

    it ("will return errors if parameters are provided when not needed", function () {
      let ic = new IC();

      var input = "yield i0 i2";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("EXTRA_FIELD");
      expect(output[0]["field"]).to.equal(0);
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("EXTRA_FIELD");
      expect(output[1]["field"]).to.equal(1);      
    });

    it ("will return errors if d is not writeable", function () {
      let ic = new IC();

      var input = "move i0 i2";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_READONLY");
      expect(output[0]["field"]).to.equal(0);     
    });

    it ("will return errors if s is not readable", function () {
      let ic = new IC();

      var input = "move r0 o";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_WRITEONLY");
      expect(output[0]["field"]).to.equal(1);     
    });

    it ("will return errors if t is not readable", function () {
      let ic = new IC();

      var input = "add r0 r1 o";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_WRITEONLY");
      expect(output[0]["field"]).to.equal(2);     
    });

    it ("will return errors if j is a float not an address", function () {
      let ic = new IC();

      var input = "j 1.1";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_NOT_ADDRESS");
      expect(output[0]["field"]).to.equal(0);     
    });

    it ("will return errors if j is a register not an address", function () {
      let ic = new IC();

      var input = "j r0";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_NOT_ADDRESS");
      expect(output[0]["field"]).to.equal(0);     
    });

    it ("will return errors if valid type is beyond the range", function () {
      let ic = new IC();

      var input = "move r7 i8";

      var output = ic._validateLine(input, 123);

      expect(output.length).to.equal(2);
      expect(output[0]["line"]).to.equal(123);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_NO_SUCH_REGISTER");
      expect(output[0]["field"]).to.equal(0);     
      expect(output[1]["line"]).to.equal(123);
      expect(output[1]["error"]).to.equal("INVALID_FIELD_NO_SUCH_REGISTER");
      expect(output[1]["field"]).to.equal(1);         
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
      expect(ic.step()).to.equal(true);

      expect(ic.programCounter()).to.equal(1);
      ic.restart();
      expect(ic.programCounter()).to.equal(0);
    });

    it("does not increase the programme counter if the program is invalid", function () {
      let ic = new IC();
      ic.load("invalid");
      expect(ic.programCounter()).to.equal(0);

      expect(ic.step()).to.equal(false);

      expect(ic.programCounter()).to.equal(0);
    });
  });
});