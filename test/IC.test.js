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

    it ("should handle a command followed by a alternative comment", function () {
      let ic = new IC();

      var input = "TOKEN a0 # This is a comment";

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

      var input = "move r17 r18";

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
    it("has IO registers which can be read", function () {
      let ic = new IC();
      let ioRegisters = ic.getIORegisters();

      expect(ioRegisters.length).to.equal(6);
      expect(ioRegisters[0]).to.deep.equal({});
      expect(ioRegisters[5]).to.deep.equal({});
    });

    it("has internal registers which can be read", function () {
      let ic = new IC();
      let internalRegisters = ic.getInternalRegisters();

      expect(internalRegisters.length).to.equal(16);
      expect(internalRegisters[0]).to.equal(0);
      expect(internalRegisters[15]).to.equal(0);
    });

    it("has IO registers which can be written and read", function () {
      let ic = new IC();

      ic.setIORegister(1, "field", 100);
      expect(ic.getIORegisters()[1]["field"]).to.equal(100);
      expect(ic.getIORegisters()[2]).to.deep.equal({});
    });

    it("has internal registers which can be written and read", function () {
      let ic = new IC();

      ic.setInternalRegister(3, 100);
      expect(ic.getInternalRegisters()[3]).to.equal(100);
    });

    it("requesting a field on an IO register which doesn't exist will default it to 0", function () {
      let ic = new IC();
      ic._getRegister("d0", "Test");

      var keys = Object.keys(ic.getIORegisters()[0]);

      expect(keys).contains("Test");
    });

    it("will remove IO register fields when they are set to undefined", function () {
      let ic = new IC();

      ic.setIORegister(1, "field", 100);
      expect(ic.getIORegisters()[1]["field"]).to.equal(100);

      ic.setIORegister(1, "field", undefined);      
      expect(Object.keys(ic.getIORegisters()[1])).not.to.contains("field");
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

    it("does not increase the programme counter if the program is invalid", function () {
      let ic = new IC();
      ic.load("invalid");
      expect(ic.programCounter()).to.equal(0);

      expect(ic.step()).to.equal("INVALID_PROGRAM");

      expect(ic.programCounter()).to.equal(0);
    });

    it("returns YIELD if the step executed a yield instruction", function () {
      let ic = new IC();
      ic.load("yield");
      
      var output = ic.step();

      expect(output).to.equal("YIELD");
    });

    it("returns END_OF_PROGRAM if the step executed the last line and is not a YIELD", function () {
      let ic = new IC();
      ic.load("move r0 20");
      
      var output = ic.step();

      expect(output).to.equal("END_OF_PROGRAM");
    });
  });
  
  describe("alias", function () {
    it ("should create an entry in aliases inside the IC and store the register index when run", function () {
      let ic = new IC();

      ic.load("alias bob r5");

      expect(Object.keys(ic._aliases)).to.contains("bob");

      ic.step();

      expect(ic._aliases["bob"]).to.equal(5);
    });

    it ("should allow programs to reference an alias rather than a register in code", function () {
      let ic = new IC();

      ic.load([
        "alias test r5",
        "move test 7"
      ].join("\n"));

      expect(ic.getProgramErrors().length).to.equal(0);      
    });

    it ("should still error if an unused alias is found", function () {
      let ic = new IC();

      ic.load([
        "move test 7"
      ].join("\n"));

      var output = ic.getProgramErrors();

      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_UNKNOWN_TYPE");
      expect(output[0]["field"]).to.equal(0);     
    });

    it ("should cause substitutions of aliases with registers when an alias is encountered in a command being writen to", function() {
      let ic = new IC();

      ic.load([
        "alias test r5",
        "move test 7"
      ].join("\n"));

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[5]).to.equal(7);            
    });

    it ("should cause substitutions of aliases with registers when an alias is encountered in a command being read from", function() {
      let ic = new IC();

      ic.load([
        "move r0 7",
        "alias test r0",
        "move r1 test"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(7);            
    });
  });
});