"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Logic Tests", function () {
  describe("and", function () {
    it("should store 1 in d if s and t are > 0", function () {
      let ic = new IC();
      ic.load("and r0 0.01 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d if s and t are < 0", function () {
      let ic = new IC();
      ic.load("and r0 -0.01 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are == 0", function () {
      let ic = new IC();
      ic.load("and r0 0 0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("or", function () {
    it("should store 1 in d if s or t are > 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d if s or t are < 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are == 0", function () {
      let ic = new IC();
      ic.load("or r0 0.00 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });

  describe("xor", function () {
    it("should store 1 in d = 0.00 xor t = 0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.00 0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d = 0.01 xor t = 0.00", function () {
      let ic = new IC();
      ic.load("xor r0 0.01 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d = 0.01 xor t = 0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.01 0.02");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 0 in d = -0.01 xor t = -0.01", function () {
      let ic = new IC();
      ic.load("xor r0 -0.01 -0.02");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 1 in d = 0.00 xor t = -0.01", function () {
      let ic = new IC();
      ic.load("xor r0 0.00 -0.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 1 in d = -0.01 xor t = 0.00", function () {
      let ic = new IC();
      ic.load("xor r0 -0.01 0.00");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });
  });

  describe("nor", function () {
    it("should store 1 in d if s and t are both 0", function () {
      let ic = new IC();
      ic.load("nor r0 0 0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });

    it("should store 0 in d if s and t are both 1", function () {
      let ic = new IC();
      ic.load("nor r0 1 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });

    it("should store 0 in d if s and t are both -1", function () {
      let ic = new IC();
      ic.load("nor r0 -1 -1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });
});