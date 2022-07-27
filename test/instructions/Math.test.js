"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Math Tests", function () {
  describe("add", function () {
    it("should add to two values into a register", function () {
      let ic = new IC();
      ic.load("add r1 r0 2.5");

      ic.setInternalRegister(0, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(4);
    });
  });

  describe("sub", function () {
    it("should subtract to two values into a register", function () {
      let ic = new IC();
      ic.load("sub r1 r0 2.5");

      ic.setInternalRegister(0, 1.5);

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(-1);
    });
  });

  describe("mul", function () {
    it("should multiply to two values into a register", function () {
      let ic = new IC();
      ic.load("mul r1 4 2.5");

      ic.step();

      expect(ic.getInternalRegisters()[1]).to.equal(10);
    });
  });

  describe("div", function () {
    it("should divide to two values into a register", function () {
      let ic = new IC();
      ic.load("div r0 9 3");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(3);
    });
  });

  describe("mod", function () {
    it("should modulus to two values into a register", function () {
      let ic = new IC();
      ic.load("mod r0 -9 8");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(7);
    });
  });

  describe("sqrt", function () {
    it("should store the squareroot of s in d", function () {
      let ic = new IC();
      ic.load("sqrt r0 9");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(3);
    });
  });

  describe("round", function () {
    it("should store the round of s in d", function () {
      let ic = new IC();
      ic.load("round r0 1.51");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("trunc", function () {
    it("should store the trunc of s in d", function () {
      let ic = new IC();
      ic.load("trunc r0 -1.71");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(-1);
    });
  });

  describe("ceil", function () {
    it("should store the ceil of s in d", function () {
      let ic = new IC();
      ic.load("ceil r0 1.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("floor", function () {
    it("should store the floor of s in d", function () {
      let ic = new IC();
      ic.load("floor r0 1.01");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1);
    });
  });

  describe("max", function () {
    it("should store the max of s and t in d", function () {
      let ic = new IC();
      ic.load("max r0 1.01 2");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2);
    });
  });

  describe("min", function () {
    it("should store the min of s and t in d", function () {
      let ic = new IC();
      ic.load("min r0 1.01 2");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1.01);
    });
  });

  describe("abs", function () {
    it("should store the abs of s in d", function () {
      let ic = new IC();
      ic.load("abs r0 -99");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(99);
    });
  });

  describe("log", function () {
    it("should store the log of s in d", function () {
      let ic = new IC();
      ic.load("log r0 10");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(2.302585092994046);
    });
  });

  describe("exp", function () {
    it("should store the exp of s in d", function () {
      let ic = new IC();
      ic.load("exp r0 10");

      ic.step();

      var deviation = Math.abs(ic.getInternalRegisters()[0] - 22026.46579480671);

      expect(deviation).to.be.at.most(0.00001);
    });
  });

  describe("rand", function () {
    it("should store a random value in d", function () {
      let ic = new IC();
      ic.load("rand r0");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.not.equal(0);
    });
  });

  describe("sin", function () {
    it("should store the sin of s in d", function () {
      let ic = new IC();
      ic.load("sin r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0.8414709848078965);
    });
  });

  describe("asin", function () {
    it("should store the asin of s in d", function () {
      let ic = new IC();
      ic.load("asin r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1.5707963267948966);
    });
  });

  describe("tan", function () {
    it("should store the tan of s in d", function () {
      let ic = new IC();
      ic.load("tan r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(1.5574077246549023);
    });
  });

  describe("atan", function () {
    it("should store the atan of s in d", function () {
      let ic = new IC();
      ic.load("atan r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0.7853981633974483);
    });
  });

  describe("atan2", function () {
    it("should store the atan2 of s and t in d", function () {
      let ic = new IC();
      ic.load("atan2 r0 1 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0.7853981633974483);
    });
  });

  describe("cos", function () {
    it("should store the cos of s in d", function () {
      let ic = new IC();
      ic.load("cos r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0.5403023058681398);
    });
  });

  describe("acos", function () {
    it("should store the acos of s in d", function () {
      let ic = new IC();
      ic.load("acos r0 1");

      ic.step();

      expect(ic.getInternalRegisters()[0]).to.equal(0);
    });
  });
});