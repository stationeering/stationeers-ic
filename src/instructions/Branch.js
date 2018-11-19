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
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bneal(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, true);
}

function _instruction_bltz(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_blez(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bgez(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bgtz(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_beq(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_bne(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, false, false);
}

function _instruction_brltz(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) < 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brlez(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) <= 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brgez(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) >= 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brgtz(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) > 0);
  let addr = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_breq(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) === ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_brne(fields, allowedTypes, ic) {
  let condition = (ic._getRegister(fields[0], undefined, allowedTypes[0]) !== ic._getRegister(fields[1], undefined, allowedTypes[1]));
  let addr = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._jumper(condition, addr, true, false);
}

function _instruction_bna(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = (Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT));
  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, false, false);
}

function _instruction_bap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = (Math.abs(a - b) <=  Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT));
  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brna(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = (Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b)));
  let addr = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  ic._jumper(condition, addr, true, false);
}

function _instruction_brap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let condition = (Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b)));
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