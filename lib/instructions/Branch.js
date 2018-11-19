"use strict";

module.exports = function (ic) {
  ic._registerOpcode("bdse", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdse);
  ic._registerOpcode("bdns", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdns);
  ic._registerOpcode("brdse", [["d", "a"], ["r", "i", "a", "j"]], _instruction_brdse);
  ic._registerOpcode("brdns", [["d", "a"], ["r", "i", "a", "j"]], _instruction_brdns);
  ic._registerOpcode("bdseal", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdseal);
  ic._registerOpcode("bdnsal", [["d", "a"], ["r", "i", "a", "j"]], _instruction_bdnsal);

  ic._registerOpcode("j", [["r", "i", "a", "j"]], _instruction_j);
  ic._registerOpcode("bltz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltz);
  ic._registerOpcode("blez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blez);
  ic._registerOpcode("bgez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgez);
  ic._registerOpcode("bgtz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtz);
  ic._registerOpcode("beqz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqz);
  ic._registerOpcode("bnez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnez);

  ic._registerOpcode("breqz", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_breqz);
  ic._registerOpcode("brnez", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brnez);

  ic._registerOpcode("beq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beq);
  ic._registerOpcode("bne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bne);

  ic._registerOpcode("blt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blt);
  ic._registerOpcode("bgt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgt);
  ic._registerOpcode("ble", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_ble);
  ic._registerOpcode("bge", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bge);

  ic._registerOpcode("brlt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brlt);
  ic._registerOpcode("brgt", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brgt);
  ic._registerOpcode("brle", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brle);
  ic._registerOpcode("brge", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brge);

  ic._registerOpcode("bltal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltal);
  ic._registerOpcode("bgtal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtal);
  ic._registerOpcode("bleal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bleal);
  ic._registerOpcode("bgeal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgeal);

  ic._registerOpcode("bna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bna);
  ic._registerOpcode("bap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bap);

  ic._registerOpcode("bnaz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnaz);
  ic._registerOpcode("bapz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapz);

  ic._registerOpcode("brnaz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brnaz);
  ic._registerOpcode("brapz", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_brapz);

  ic._registerOpcode("bnaal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnaal);
  ic._registerOpcode("bapal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapal);

  ic._registerOpcode("jal", [["r", "i", "a", "j"]], _instruction_jal);
  ic._registerOpcode("bltzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bltzal);
  ic._registerOpcode("blezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_blezal);
  ic._registerOpcode("bgezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgezal);
  ic._registerOpcode("bgtzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bgtzal);
  ic._registerOpcode("beqal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqal);
  ic._registerOpcode("bneal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bneal);

  ic._registerOpcode("jr", [["r", "i", "a"]], _instruction_jr);
  ic._registerOpcode("brltz", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brltz);
  ic._registerOpcode("brlez", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brlez);
  ic._registerOpcode("brgez", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brgez);
  ic._registerOpcode("brgtz", [["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brgtz);
  ic._registerOpcode("breq", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_breq);
  ic._registerOpcode("brne", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brne);
  ic._registerOpcode("brna", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brna);
  ic._registerOpcode("brap", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a"]], _instruction_brap);

  ic._registerOpcode("beqzal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_beqzal);
  ic._registerOpcode("bnezal", [["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnezal);
  ic._registerOpcode("bnazal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bnazal);
  ic._registerOpcode("bapzal", [["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "a", "j"]], _instruction_bapzal);
};

var CSHARP_EPSILON_TIMES_EIGHT = 1.121039E-44;

function _instruction_jr(fields, allowedTypes, ic) {
  var addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  ic._jumper(true, addr, true, false);
}

function _instruction_j(fields, allowedTypes, ic) {
  var addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  ic._jumper(true, addr, false, false);
}

function _instruction_jal(fields, allowedTypes, ic) {
  var addr = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  ic._jumper(true, addr, false, true);
}

function _instruction_bltzal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_blezal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bgezal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bgtzal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_beqal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bneal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bltz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_blez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bgez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bgtz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_beq(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bne(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_brltz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brlez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brgez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brgtz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_breq(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brne(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_bna(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bap(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_brna(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b));
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brap(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b));
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_bdse(fields, allowedTypes, ic) {
  var value = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;

  if (value) {
    ic._programCounter = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  }
}

function _instruction_bdns(fields, allowedTypes, ic) {
  var condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_brdse(fields, allowedTypes, ic) {
  var condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brdns(fields, allowedTypes, ic) {
  var condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_bdseal(fields, allowedTypes, ic) {
  var condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 1 : 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bdnsal(fields, allowedTypes, ic) {
  var condition = ic._isDeviceConnected(fields[0], allowedTypes[0]) ? 0 : 1;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_blt(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a < b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_bgt(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a > b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_ble(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a <= b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_bge(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a >= b;

  ic._jumper(condition, addr, false, false);
}

function _instruction_brlt(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a < b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brgt(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a > b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brle(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a <= b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_brge(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a >= b;

  ic._jumper(condition, addr, true, false);
}

function _instruction_bltal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a < b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgtal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a > b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bleal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a <= b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bgeal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = a >= b;

  ic._jumper(condition, addr, false, true);
}

function _instruction_bnaal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bapal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  var condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_beqz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bnez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bnaz(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bapz(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_breqz(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brnez(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brnaz(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brapz(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_beqzal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) === 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bnezal(fields, allowedTypes, ic) {
  var condition = ic._getRegister(fields[0], undefined, allowedTypes[0]) !== 0;
  var addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bnazal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}

function _instruction_bapzal(fields, allowedTypes, ic) {
  var a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  var b = 0;
  var c = ic._getRegister(fields[1], undefined, allowedTypes[1]);

  var condition = Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT);
  var addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  ic._jumper(condition, addr, false, true);
}