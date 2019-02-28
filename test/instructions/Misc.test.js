"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Misc Tests", function () {
  describe("move", function () {
    it("should move/load a value into register from literal", function () {
      let ic = new IC();
      ic.load("move r1 1.5");

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it("should move/load a value into register from another register", function () {
      let ic = new IC();
      ic.load("move r1 r2");

      ic.setInternalRegister(2, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });
  });

  describe("hcf", function () {
    it ("should cause a step to return a notice", function () {
      let ic = new IC();

      ic.load("hcf");
      
      expect(ic.step()).to.equal("HALT_AND_CATCH_FIRE");
    });
  });

  describe("sleep", function () {
    it ("should not allow the programme counter to increase until the sleep period has passed", function () {
      let ic = new IC();

      ic.load("sleep 1.7");

      let code = ic.step();
      expect(ic._programCounter).to.equal(0);
      expect(code).to.equal("SLEEP");
      expect(ic.getSleepPeriod()).to.equal(1.7);

      ic.step();
      expect(ic._programCounter).to.equal(0);
      ic.step();
      expect(ic._programCounter).to.equal(0);
      ic.step();
      expect(ic._programCounter).to.equal(0);
      ic.step();
      expect(ic._programCounter).to.equal(1);
    });
  });
});