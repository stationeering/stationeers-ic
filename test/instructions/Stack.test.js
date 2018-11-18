"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Stack Tests", function () {

  describe("push", function () {
    it ("should push the value in the register to the stack", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();

      expect(ic.getInternalRegisters()[16]).to.equal(1);
      expect(ic.getStack()[0]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is full", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);
      ic.load("push r0\nj 0");

      for (var i = 0; i < 512; i++) {
        expect(ic.step()).to.equal(undefined);
        expect(ic.step()).to.equal(undefined);
      }

      expect(ic.step()).to.equal("STACK_OVERFLOW");
    });

    it ("should provide a stack pointer alias automatically", function () {
      let ic = new IC();

      ic.load("push sp\npush sp");

      ic.step();
      ic.step();

      expect(ic.getStack()[0]).to.equal(0);
      expect(ic.getStack()[1]).to.equal(1);
    });
  });

  describe("pop", function () {
    it ("should pop the current the value of the stack to the register", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0\npop r1");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();     
      ic.step();
      
      expect(ic.getInternalRegisters()[16]).to.equal(0);
      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is empty", function () {
      let ic = new IC();

      ic.load("pop r0");

      expect(ic.step()).to.equal("STACK_UNDERFLOW");
    });
  });

  describe("peek", function () {
    it ("should peek the current the value of the stack to the register, but not change the stack pointer", function () {
      let ic = new IC();

      ic.setInternalRegister(0, 1.5);

      ic.load("push r0\npeek r1");
      expect(ic.getProgramErrors().length).to.equal(0);

      ic.step();
      ic.step();
      
      expect(ic.getInternalRegisters()[16]).to.equal(1);
      expect(ic.getInternalRegisters()[1]).to.equal(1.5);
    });

    it ("should throw return an error when the stack is empty", function () {
      let ic = new IC();

      ic.load("peek r0");

      expect(ic.step()).to.equal("STACK_UNDERFLOW");
    });
  });
});