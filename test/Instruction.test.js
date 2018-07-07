"use strict";

const expect = require("chai").expect;

const IC = require("../lib/IC");

describe("Instruction Tests", function () {  
  describe("SELECT", function () {
    it("should choose B if A is < 1 and place in out", function () {
      let ic = new IC();
      ic.load("SELECT i0 i1 i2 o0");
      
      ic.setInputRegister(0, 0.5);
      ic.setInputRegister(1, 1);
      ic.setInputRegister(2, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should choose C if A is >= 1 and place in out", function () {
      let ic = new IC();
      ic.load("SELECT i0 i1 i2 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 1);
      ic.setInputRegister(2, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(2);
    });
  });

  describe("MAX", function () {
    it("should choose A if A > B and place in out", function () {
      let ic = new IC();
      ic.load("MAX i0 i1 o0");
      
      ic.setInputRegister(0, 2);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(2);
    });

    it("should choose B if B > A and place in out", function () {
      let ic = new IC();
      ic.load("MAX i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(2);
    });
  });

  describe("MIN", function () {
    it("should choose A if A < B and place in out", function () {
      let ic = new IC();
      ic.load("MIN i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should choose B if B < A and place in out", function () {
      let ic = new IC();
      ic.load("MIN i0 i1 o0");
      
      ic.setInputRegister(0, 2);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });
  });

  describe("ADD", function () {
    it("should add A to B and place in out", function () {
      let ic = new IC();
      ic.load("ADD i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(3);
    });
  });

  describe("SUB", function () {
    it("should subtract B from A and place in out", function () {
      let ic = new IC();
      ic.load("SUB i0 i1 o0");
      
      ic.setInputRegister(0, 2);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });
  });

  describe("MUL", function () {
    it("should multiply A and B and place in out", function () {
      let ic = new IC();
      ic.load("MUL i0 i1 o0");
      
      ic.setInputRegister(0, 2);
      ic.setInputRegister(1, 3);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(6);
    });
  });

  describe("DIV", function () {
    it("should divide A by B and place in out", function () {
      let ic = new IC();
      ic.load("DIV i0 i1 o0");
      
      ic.setInputRegister(0, 6);
      ic.setInputRegister(1, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(3);
    });
  });

  describe("MOD", function () {
    it("should modulus A by B and place in out", function () {
      let ic = new IC();
      ic.load("MOD i0 i1 o0");
      
      ic.setInputRegister(0, 5);
      ic.setInputRegister(1, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });
  });

  describe("EQ", function () {
    it("should put 1 in out if A == B", function () {
      let ic = new IC();
      ic.load("EQ i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should put 0 in out if A != B", function () {
      let ic = new IC();
      ic.load("EQ i0 i1 o0");
      
      ic.setInputRegister(0, 0);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0);
    });
  });

  describe("NEQ", function () {
    it("should put 1 in out if A != B", function () {
      let ic = new IC();
      ic.load("NEQ i0 i1 o0");
      
      ic.setInputRegister(0, 0);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should put 0 in out if A == B", function () {
      let ic = new IC();
      ic.load("NEQ i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0);
    });
  });

  describe("GT", function () {
    it("should put 1 in out if A > B", function () {
      let ic = new IC();
      ic.load("GT i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 0);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should put 0 in out if A <= B", function () {
      let ic = new IC();
      ic.load("GT i0 i1 o0");
      
      ic.setInputRegister(0, 0.5);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0);
    });
  });

  describe("LT", function () {
    it("should put 1 in out if A < B", function () {
      let ic = new IC();
      ic.load("LT i0 i1 o0");
      
      ic.setInputRegister(0, 0);
      ic.setInputRegister(1, 1);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });

    it("should put 0 in out if A >= B", function () {
      let ic = new IC();
      ic.load("LT i0 i1 o0");
      
      ic.setInputRegister(0, 1);
      ic.setInputRegister(1, 0.5);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0);
    });
  });

  describe("CEIL", function () {
    it("should round up to the closes whole integer", function () {
      let ic = new IC();
      ic.load("CEIL i0 o0");
      
      ic.setInputRegister(0, 0.2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });
  });

  describe("FLOR", function () {
    it("should round down to the closes whole integer", function () {
      let ic = new IC();
      ic.load("FLOR i0 o0");
      
      ic.setInputRegister(0, 0.9);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0);
    });
  });

  describe("ABS", function () {
    it("find absolute integer (i.e. remove negative if present)", function () {
      let ic = new IC();
      ic.load("ABS i0 o0");
      
      ic.setInputRegister(0, -20);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(20);
    });
  });

  describe("LOG", function () {
    it("perform natural log", function () {
      let ic = new IC();
      ic.load("LOG i0 o0");
      
      ic.setInputRegister(0, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(0.6931471805599453);
    });
  });

  describe("EXP", function () {
    it("perform natural exponential", function () {
      let ic = new IC();
      ic.load("EXP i0 o0");
      
      ic.setInputRegister(0, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(7.38905609893065);
    });
  });

  describe("ROU", function () {
    it("rounds to nearest whole integer", function () {
      let ic = new IC();
      ic.load("ROU i0 o0");
      
      ic.setInputRegister(0, 1.2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(1);
    });
  });

  describe("RAND", function () {
    it("multiplies number by a random value between 0 and 1", function () {
      let ic = new IC();
      ic.load("RAND i0 o0");
      
      ic.setInputRegister(0, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.be.at.above(0);
      expect(ic.getOutputRegisters()[0]).to.be.at.below(2);
    });
  });

  describe("STOR", function () {
    it("puts value A into output", function () {
      let ic = new IC();
      ic.load("STOR i0 o0");
      
      ic.setInputRegister(0, 2);

      ic.step();

      expect(ic.getOutputRegisters()[0]).to.equal(2);
    });
  });
});