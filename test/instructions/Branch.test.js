"use strict";

const expect = require("chai").expect;

const IC = require("../../src/IC");

describe("Branch Tests", function () {
  describe("bdse", function () {
    it("should set pc to 9 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("bdse d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
    });
    
    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("bdse d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
    });
  });
    
  describe("bdns", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("bdns d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
    });
    
    it("should set pc to 9 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("bdns d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
    });
  });
    
  describe("brdse", function () {
    it("should set pc to 9 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("brdse d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
    });
    
    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("brdse d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
    });
  });
    
  describe("brdns", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("brdns d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
    });
    
    it("should set pc to 9 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("brdns d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
    });
  });
    
  describe("bdseal", function () {
    it("should set pc to 9 and RA to 1 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("bdseal d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });
    
    it("should set pc to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("bdseal d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });
    
  describe("bdnsal", function () {
    it("should set pc to 1 if device is set/connected", function () {
      let ic = new IC();
    
      ic.load("bdnsal d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
    
    it("should set pc to 9 and RA to 1 if device is not set/connected", function () {
      let ic = new IC();
      ic.setIOConnected(0, false);
    
      ic.load("bdnsal d0 9");
      ic.step();
    
      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });
  });
    

  describe("j", function () {
    it("should change the program counter to the a value provided", function () {
      let ic = new IC();
      ic.load("j 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
  });
    
  describe("bltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltz -1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltz 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("blez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blez 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blez 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgez 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgez -1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtz 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtz 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("beq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beq 1 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beq 1 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bne 1 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
    
    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bne 1 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
  });
    
  describe("j", function () {
    it("should change the program counter to the a value provided", function () {
      let ic = new IC();
      ic.load("j 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should change the program counter to the a value provided, rounding if floating", function () {
      let ic = new IC();
      ic.load("j 9.4");
    
      var output = ic.getProgramErrors();
    
      expect(output.length).to.equal(1);
      expect(output[0]["line"]).to.equal(0);
      expect(output[0]["error"]).to.equal("INVALID_FIELD_INVALID_TYPE");
      expect(output[0]["field"]).to.equal(0);
    });
    
    it("should accept a register as the jump address and then change the program counter to that value", function() {
      let ic = new IC();
      ic.load("move r0 9\nj r0");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should accept a register as the jump address and return an error if the jump result is negative", function() {
      let ic = new IC();
      ic.load("move r0 -9\nj r0");
    
      ic.step();
      var result = ic.step();
    
      expect(result).to.equal("INVALID_PROGRAM_COUNTER");
    });
    
    it("should accept a register as the jump address and then change the program counter to that value, rounded if floating", function() {
      let ic = new IC();
      ic.load("move r0 9.4\nj r0");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
  });
    
  describe("bltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltz -1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltz 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
    
  describe("blez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blez 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blez 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgez 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgez -1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtz 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtz 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("beq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beq 1 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beq 1 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("bne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bne 1 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
    
    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bne 1 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
  });
    
  describe("jr", function () {
    it("should change the program counter to be relative to the provided negative value", function () {
      let ic = new IC();
      ic.load("yield\nyield\nyield\njr -2\nyield\nyield\n");
    
      expect(ic.getProgramErrors().length).to.equal(0);
    
      ic.step();
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });
    
  describe("brltz", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrltz -1 -2\nyield\nyield\n");
    
      expect(ic.getProgramErrors().length).to.equal(0);
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(0);
    });
    
    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrltz 0 9\nyield\nyield\n");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
  });
    
  describe("brlez", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrlez 0 9\nyield\nyield\n");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(11);
    });
    
    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrlez 1 9\nyield\nyield\n");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
  });
    
  describe("brgez", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgez 0 9\nyield\nyield\n");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(11);
    });
    
    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgez -1 9\nyield\nyield\n");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
  });
    
  describe("brgtz", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgtz 1 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(11);
    });
    
    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrgtz 0 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
  });
    
  describe("breq", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbreq 1 1 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(11);
    });
    
    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbreq 1 0 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
  });
    
  describe("brne", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrne 1 1 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(3);
    });
    
    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("yield\nyield\nbrne 1 0 9");
    
      ic.step();
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(11);
    });
  });
 
  describe("bap", function () {
    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bna", function () {
    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });
  
  describe("brap", function () {
    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("brna", function () {
    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("jal", function () {
    it ("should change the program counter and set the return address register", function () {
      let ic = new IC();

      ic.load([
        "yield",
        "yield",
        "jal 9"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(3);
    });

    it ("should ensure that the ra alias is setup", function () {
      let ic = new IC();

      ic.load([
        "move ra 4",
        "move r10 ra"
      ].join("\n"));

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[10]).to.equal(4);
    });
  });

  describe("bap", function () {
    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bna", function () {
    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });
  
  describe("brap", function () {
    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brap 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("brna", function () {
    it ("should branch relative if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should branch relative if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("brna 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("jal", function () {
    it ("should change the program counter and set the return address register", function () {
      let ic = new IC();

      ic.load([
        "yield",
        "yield",
        "jal 9"
      ].join("\n"));

      ic.step();
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(3);
    });

    it ("should ensure that the ra alias is setup", function () {
      let ic = new IC();

      ic.load([
        "move ra 4",
        "move r10 ra"
      ].join("\n"));

      ic.step();
      ic.step();

      expect(ic.getInternalRegisters()[10]).to.equal(4);
    });
  });
  
  describe("bltzal", function () {
    it("should change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bltzal -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bltzal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bgezal", function () {
    it("should change the program counter if s >= 0", function () {
      let ic = new IC();
      ic.load("bgezal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s < 0", function () {
      let ic = new IC();
      ic.load("bgezal -1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("blezal", function () {
    it("should change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("blezal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("blezal 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bgtzal", function () {
    it("should change the program counter if s > 0", function () {
      let ic = new IC();
      ic.load("bgtzal 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s <= 0", function () {
      let ic = new IC();
      ic.load("bgtzal 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("beqal", function () {
    it("should change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("beqal 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it("should not change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("beqal 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bneal", function () {
    it("should change the program counter if s != t", function () {
      let ic = new IC();
      ic.load("bneal 1 1 9");

      ic.step();

      expect(ic._programCounter).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });

    it("should not change the program counter if s == t", function () {
      let ic = new IC();
      ic.load("bneal 1 0 9");

      ic.step();

      expect(ic._programCounter).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);      
    });
  });

  describe("blt", function () {
    it ("should branch if if a < b", function () {
      let ic = new IC();

      ic.load("blt 1 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if if a >= b", function () {
      let ic = new IC();

      ic.load("blt 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bgt", function () {
    it ("should branch if if a > b", function () {
      let ic = new IC();

      ic.load("bgt 2 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if if a <= b", function () {
      let ic = new IC();

      ic.load("bgt 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("ble", function () {
    it ("should branch if if a <= b", function () {
      let ic = new IC();

      ic.load("ble 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if if a > b", function () {
      let ic = new IC();

      ic.load("ble 2 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bge", function () {
    it ("should branch if if a >= b", function () {
      let ic = new IC();

      ic.load("bge 2 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if if a < b", function () {
      let ic = new IC();

      ic.load("bge 1 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("brlt", function () {
    it ("should branch relative if if a < b", function () {
      let ic = new IC();

      ic.load("yield\nbrlt 1 2 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should not branch if if a >= b", function () {
      let ic = new IC();

      ic.load("yield\nbrlt 1 1 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(2);
    });
  });

  describe("brgt", function () {
    it ("should branch relative if if a > b", function () {
      let ic = new IC();

      ic.load("yield\nbrgt 2 1 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should not branch if if a <= b", function () {
      let ic = new IC();

      ic.load("yield\nbrgt 1 1 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(2);
    });
  });

  describe("brle", function () {
    it ("should branch relative if if a <= b", function () {
      let ic = new IC();

      ic.load("yield\nbrle 1 1 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should not branch if if a > b", function () {
      let ic = new IC();

      ic.load("yield\nbrle 2 1 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(2);
    });
  });

  describe("brge", function () {
    it ("should branch relative if if a >= b", function () {
      let ic = new IC();

      ic.load("yield\nbrge 2 2 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(10);
    });

    it ("should not branch if if a < b", function () {
      let ic = new IC();

      ic.load("yield\nbrge 1 2 9");
      ic.step();
      ic.step();

      expect(ic.programCounter()).to.equal(2);
    });
  });
  
  describe("bltal", function () {
    it ("should branch if if a < b", function () {
      let ic = new IC();

      ic.load("bltal 1 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should not branch if if a >= b", function () {
      let ic = new IC();

      ic.load("bltal 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bgtal", function () {
    it ("should branch if if a > b", function () {
      let ic = new IC();

      ic.load("bgtal 2 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should not branch if if a <= b", function () {
      let ic = new IC();

      ic.load("bgtal 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bleal", function () {
    it ("should branch if if a <= b", function () {
      let ic = new IC();

      ic.load("bleal 1 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should not branch if if a > b", function () {
      let ic = new IC();

      ic.load("bleal 2 1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bgeal", function () {
    it ("should branch if if a >= b", function () {
      let ic = new IC();

      ic.load("bgeal 2 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should not branch if if a < b", function () {
      let ic = new IC();

      ic.load("bgeal 1 2 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bapal", function () {
    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bapal 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bapal 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("bnaal", function () {
    it ("should branch if abs(a - b) > c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bnaal 1 2.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
      expect(ic.getInternalRegisters()[17]).to.equal(1);
    });

    it ("should branch if abs(a - b) <= c * max(abs(a), abs(b))", function () {
      let ic = new IC();

      ic.load("bnaal 1 1.01 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
      expect(ic.getInternalRegisters()[17]).to.equal(0);
    });
  });

  describe("beqz", function () {
    it("should change the program counter if s == 0", function () {
      let ic = new IC();
      ic.load("beqz 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s != 0", function () {
      let ic = new IC();
      ic.load("beqz 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bnez", function () {
    it("should change the program counter if s != 0", function () {
      let ic = new IC();
      ic.load("bnez 1 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(9);
    });
    
    it("should not change the program counter if s == 0", function () {
      let ic = new IC();
      ic.load("bnez 0 9");
    
      ic.step();
    
      expect(ic._programCounter).to.equal(1);
    });
  });

  describe("bapz", function () {
    it ("should branch if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("bapz 1.121039E-45 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("bapz 0.1 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("bnaz", function () {
    it ("should branch if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("bnaz 0.1 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(9);
    });

    it ("should not branch if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();

      ic.load("bnaz 1.121039E-45 0.1 9");
      ic.step();

      expect(ic.programCounter()).to.equal(1);
    });
  });

  describe("breqz", function () {
    it("should change the program counter if s == 0", function () {
      let ic = new IC();
      ic.load("yield\nbreqz 0 9");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(10);
    });
    
    it("should not change the program counter if s != 0", function () {
      let ic = new IC();
      ic.load("yield\nbreqz 1 9");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(2);
    });
  });
  
  describe("brnez", function () {
    it("should change the program counter if s != 0", function () {
      let ic = new IC();
      ic.load("yield\nbrnez 1 9");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(10);
    });
    
    it("should not change the program counter if s == 0", function () {
      let ic = new IC();
      ic.load("yield\nbrnez 0 9");
    
      ic.step();
      ic.step();
    
      expect(ic._programCounter).to.equal(2);
    });
  });

  describe("brapz", function () {
    it ("should branch if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();
  
      ic.load("yield\nbrapz 1.121039E-45 0.1 9");
      ic.step();
      ic.step();
  
      expect(ic.programCounter()).to.equal(10);
    });
  
    it ("should not branch if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();
  
      ic.load("yield\nbrapz 0.1 0.1 9");
      ic.step();
      ic.step();
  
      expect(ic.programCounter()).to.equal(2);
    });
  });
  
  describe("brnaz", function () {
    it ("should branch if abs(a - 0) > c * max(abs(a), abs(0))", function () {
      let ic = new IC();
  
      ic.load("yield\nbrnaz 0.1 0.1 9");
      ic.step();
      ic.step();
  
      expect(ic.programCounter()).to.equal(10);
    });
  
    it ("should not branch if abs(a - 0) <= c * max(abs(a), abs(0))", function () {
      let ic = new IC();
  
      ic.load("yield\nbrnaz 1.121039E-45 0.1 9");
      ic.step();
      ic.step();
  
      expect(ic.programCounter()).to.equal(2);
    });
  });
});