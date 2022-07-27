"use strict";

module.exports = function (ic) {
  ic._registerOpcode("bdse", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdse, "device");

  ic._registerOpcode("bdns", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdns, "device");

  ic._registerOpcode("brdse", [["d", "a"], ["r", "i", "a", "j"]], _instruction_brdse, "device");

  ic._registerOpcode("brdns", [["d", "a"], ["r", "i", "a", "j"]], _instruction_brdns, "device");

  ic._registerOpcode("bdseal", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdseal, "device");

  ic._registerOpcode("bdnsal", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdnsal, "device");

  ic._registerOpcode("j", [["r", "i", "a", "j"]], _instruction_j, "flow");

  ic._registerOpcode("bltz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltz, "flow");

  ic._registerOpcode("blez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blez, "flow");

  ic._registerOpcode("bgez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgez, "flow");

  ic._registerOpcode("bgtz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtz, "flow");

  ic._registerOpcode("beqz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqz, "flow");

  ic._registerOpcode("bnez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnez, "flow");

  ic._registerOpcode("breqz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_breqz, "flow");

  ic._registerOpcode("brnez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brnez, "flow");

  ic._registerOpcode("beq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beq, "flow");

  ic._registerOpcode("bne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bne, "flow");

  ic._registerOpcode("blt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blt, "flow");

  ic._registerOpcode("bgt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgt, "flow");

  ic._registerOpcode("ble", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_ble, "flow");

  ic._registerOpcode("bge", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bge, "flow");

  ic._registerOpcode("brlt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brlt, "flow");

  ic._registerOpcode("brgt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brgt, "flow");

  ic._registerOpcode("brle", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brle, "flow");

  ic._registerOpcode("brge", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brge, "flow");

  ic._registerOpcode("bltal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltal, "flow");

  ic._registerOpcode("bgtal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtal, "flow");

  ic._registerOpcode("bleal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bleal, "flow");

  ic._registerOpcode("bgeal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgeal, "flow");

  ic._registerOpcode("bna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bna, "flow");

  ic._registerOpcode("bap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bap, "flow");

  ic._registerOpcode("bnaz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnaz, "flow");

  ic._registerOpcode("bapz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapz, "flow");

  ic._registerOpcode("brnaz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brnaz, "flow");

  ic._registerOpcode("brapz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brapz, "flow");

  ic._registerOpcode("bnaal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnaal, "flow");

  ic._registerOpcode("bapal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapal, "flow");

  ic._registerOpcode("jal", [["r", "i", "a", "j"]], _instruction_jal, "flow");

  ic._registerOpcode("bltzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltzal, "flow");

  ic._registerOpcode("blezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blezal, "flow");

  ic._registerOpcode("bgezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgezal, "flow");

  ic._registerOpcode("bgtzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtzal, "flow");

  ic._registerOpcode("beqal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqal, "flow");

  ic._registerOpcode("bneal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bneal, "flow");

  ic._registerOpcode("jr", [["r", "i", "a"]], _instruction_jr, "flow");

  ic._registerOpcode("brltz", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brltz, "flow");

  ic._registerOpcode("brlez", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brlez, "flow");

  ic._registerOpcode("brgez", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brgez, "flow");

  ic._registerOpcode("brgtz", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brgtz, "flow");

  ic._registerOpcode("breq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_breq, "flow");

  ic._registerOpcode("brne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brne, "flow");

  ic._registerOpcode("brna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brna, "flow");

  ic._registerOpcode("brap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brap, "flow");

  ic._registerOpcode("beqzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqzal, "flow");

  ic._registerOpcode("bnezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnezal, "flow");

  ic._registerOpcode("bnazal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnazal, "flow");

  ic._registerOpcode("bapzal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapzal, "flow");
};

const CSHARP_EPSILON_TIMES_EIGHT = 1.121039E-44;

function _instruction_jr(fields, allowedTypes, ic) {
  let addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  ic._jumper(true, addr, true, false);
}

function _instruction_j(fields, allowedTypes, ic) {
  let addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  ic._jumper(true, addr, false, false);
}

function _instruction_jal(fields, allowedTypes, ic) {
  let addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  ic._jumper(true, addr, false, true);
}

function _instruction_bltzal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_blezal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgezal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgtzal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_beqal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bneal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bltz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_blez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bgez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bgtz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_beq(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bne(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_brltz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brlez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brgez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brgtz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_breq(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brne(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_bna(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_brna(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b));

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b));

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_bdse(fields, allowedTypes, ic) {
  let value = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

  if (value) {
    ic._programCounter = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  }
}

function _instruction_bdns(fields, allowedTypes, ic) {
  let condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_brdse(fields, allowedTypes, ic) {
  let condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brdns(fields, allowedTypes, ic) {
  let condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_bdseal(fields, allowedTypes, ic) {
  let condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bdnsal(fields, allowedTypes, ic) {
  let condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_blt(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a < b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_bgt(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a > b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_ble(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a <= b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_bge(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a >= b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_brlt(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a < b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brgt(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a > b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brle(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a <= b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brge(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a >= b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_bltal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a < b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgtal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a > b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bleal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a <= b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgeal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = a >= b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bnaal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bapal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_beqz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bnez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bnaz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bapz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_breqz(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brnez(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brnaz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brapz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_beqzal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bnezal(fields, allowedTypes, ic) {
  let condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;

  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bnazal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bapzal(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);

  let b = 0;

  let c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  let condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);

  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}