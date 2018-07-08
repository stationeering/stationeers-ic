"use strict";

const expect = require("chai").expect;

const IC = require("../src/IC");

describe("IC Tests", function () {
  const VALID_SINGLE_INSTRUCTION = "SEL i0 i1 i2 r0";
  const VALID_MULTIPLE_INSTRUCTION = "SEL i0 i1 i2 r0\nMAX i0 i1 r2";
  const VALID_MULTIPLE_INSTRUCTION_WITH_COMMENT = "SEL i0 i1 i2 r0 // Comment\nMAX i0 i1 r2";
  const VALID_MULTIPLE_INSTRUCTION_WITH_COMMENT_ON_OWN_LINE = "SEL i0 i1 i2 r0\n // Comment\nMAX i0 i1 r2";
  const INVALID_SINGLE_INSTRUCTION = "INVALID i0 i1 r2";
  const INVALID_SINGLE_INSTRUCTION_MISS_FIELD = "SEL i0 i1 i2";
  const INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_NO_SUCH_INPUT = "SEL i5 i1 i2 o1";
  const INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_UNKNOWN_REGISTER = "SEL u0 i1 i2 o1";
  const INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_WRITING_TO_INPUT = "SEL i0 i1 i2 i1";
  const INVALID_SINGLE_INSTRUCTION_SHORT_REGISTER = "SEL i0 i1 i2 o";

  describe("Loading instructions", function () {
    it("loads a valid instruction and returns an empty error array", function () {
      let ic = new IC();

      let result = ic.load(VALID_SINGLE_INSTRUCTION);
      let instructionCount = ic.instructionCount();

      expect(result.length).to.equal(0);
      expect(instructionCount).to.equal(1);
    });

    it("loads a valid set of instructions and returns an empty error array", function () {
      let ic = new IC();

      let result = ic.load(VALID_MULTIPLE_INSTRUCTION);
      let instructionCount = ic.instructionCount();

      expect(result.length).to.equal(0);
      expect(instructionCount).to.equal(2);
    });

    it("loads a valid set of instructions with comment and returns an empty error array", function () {
      let ic = new IC();

      let result = ic.load(VALID_MULTIPLE_INSTRUCTION_WITH_COMMENT);
      let instructionCount = ic.instructionCount();

      expect(result.length).to.equal(0);
      expect(instructionCount).to.equal(2);
    });

    it("loads a valid set of instructions with comment and returns an empty error array", function () {
      let ic = new IC();

      let result = ic.load(VALID_MULTIPLE_INSTRUCTION_WITH_COMMENT_ON_OWN_LINE);
      let instructionCount = ic.instructionCount();

      expect(result.length).to.equal(0);
      expect(instructionCount).to.equal(2);
    });

    it("loads a invalid set of instructions and returns one error describing the fault", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("UNKNOWN_INSTRUCTION");
    });

    it("loads and verifies that opcode needs specific number of fields", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION_MISS_FIELD);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("FIELD_COUNT_MISMATCH");
    });

    it("only load the first 10 instructions", function () {
      let ic = new IC();

      let elevenInstructions = Array(11).fill(VALID_SINGLE_INSTRUCTION).join("\n");

      let result = ic.load(elevenInstructions);

      expect(result.length).to.equal(1);
      expect(result[0]["line"]).to.equal(11);
      expect(result[0]["error"]).to.equal("TOO_MANY_INSTRUCTIONS");
    });


    it("verifies that reads can't reference register out side of range", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_NO_SUCH_INPUT);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("OUT_OF_BOUND_REGISTER");
      expect(result[0]["field"]).to.equal(0);
    });


    it("verifies that a register must have a number otherwise it's out of bound", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION_SHORT_REGISTER);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("OUT_OF_BOUND_REGISTER");
      expect(result[0]["field"]).to.equal(3);
    });

    it("verifies that reads can't reference unknown register type", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_UNKNOWN_REGISTER);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("UNKNOWN_REGISTER");
      expect(result[0]["field"]).to.equal(0);
    });

    it("verifies that writes can't go to input registers", function () {
      let ic = new IC();

      let result = ic.load(INVALID_SINGLE_INSTRUCTION_INVALID_FIELD_WRITING_TO_INPUT);

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("READ_ONLY_REGISTER");
      expect(result[0]["field"]).to.equal(3);
    });
  });

  describe("Literal registers", function () {
    it("can handle a literal in place of a register for non output field", function () {
      let ic = new IC();

      let result = ic.load("ADD 1.2 1.5 r0");
      
      expect(result.length).to.equal(0);

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2.7);
    });

    it("verifies that literal registers can not be used for an output", function () {
      let ic = new IC();

      let result = ic.load("ADD i0 i1 2.2");

      expect(result.length).to.equal(1);

      expect(result[0]["line"]).to.equal(1);
      expect(result[0]["error"]).to.equal("READ_ONLY_REGISTER");
      expect(result[0]["field"]).to.equal(2);
    });
  });

  describe("Returns instructions", function () {
    it("including those with literals correctly", function () {
      let ic = new IC();

      let result = ic.load("ADD 1.2 1.5 r0\nSUB i0 1.5 r0");

      expect(result.length).to.equal(0);

      let instructions = ic.getInstructions();

      expect(instructions.length).to.equal(2);

      expect(instructions[0]).to.eql(["ADD", "1.2", "1.5", "r0"]);
      expect(instructions[1]).to.eql(["SUB", "i0", "1.5", "r0"]);
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
      let outputRegisters = ic.getInputRegisters();

      expect(outputRegisters.length).to.equal(3);
      expect(outputRegisters[0]).to.equal(0);
      expect(outputRegisters[1]).to.equal(0);
      expect(outputRegisters[2]).to.equal(0);
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

      ic.setOutputRegister(2, 100);
      expect(ic.getOutputRegisters()[2]).to.equal(100);
    });

    it("has internal registers which can be written and read", function () {
      let ic = new IC();

      ic.setInternalRegister(3, 100);
      expect(ic.getInternalRegisters()[3]).to.equal(100);
    });
  });

  describe("Step and flow behaviour", function () {
    it("increases the programme counter to increase and return true when there are more instructions to execute", function () {
      let ic = new IC();
      ic.load(VALID_MULTIPLE_INSTRUCTION);

      expect(ic.programCounter()).to.equal(0);
      expect(ic.step()).to.equal(true);
      expect(ic.programCounter()).to.equal(1);
      expect(ic.step()).to.equal(false);
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