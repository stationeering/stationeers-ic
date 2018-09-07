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