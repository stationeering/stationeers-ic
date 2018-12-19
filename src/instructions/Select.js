module.exports = function (ic) {
  ic._registerOpcode("slt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_slt, "select");
  ic._registerOpcode("sgt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sgt, "select");
  ic._registerOpcode("sle", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sle, "select");
  ic._registerOpcode("sge", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sge, "select");
  ic._registerOpcode("seq", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_seq, "select");
  ic._registerOpcode("sne", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sne, "select");

  ic._registerOpcode("sap", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sap, "select");
  ic._registerOpcode("sna", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sna, "select");

  ic._registerOpcode("select", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_select, "select");

  ic._registerOpcode("sdse", [["r", "a"], ["d", "a"]], _instruction_sdse, "select");
  ic._registerOpcode("sdns", [["r", "a"], ["d", "a"]], _instruction_sdns, "select");

  ic._registerOpcode("sltz", [["r", "a"], ["r", "i", "f", "a"]], _instruction_sltz, "select");
  ic._registerOpcode("sgtz", [["r", "a"], ["r", "i", "f", "a"]], _instruction_sgtz, "select");

  ic._registerOpcode("slez", [["r", "a"], ["r", "i", "f", "a"]], _instruction_slez, "select");
  ic._registerOpcode("sgez", [["r", "a"], ["r", "i", "f", "a"]], _instruction_sgez, "select");

  ic._registerOpcode("seqz", [["r", "a"], ["r", "i", "f", "a"]], _instruction_seqz, "select");
  ic._registerOpcode("snez", [["r", "a"], ["r", "i", "f", "a"]], _instruction_snez, "select");

  ic._registerOpcode("sapz", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sapz, "select");
  ic._registerOpcode("snaz", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_snaz, "select");
};

const CSHARP_EPSILON_TIMES_EIGHT = 1.121039E-44;

function _instruction_slt(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) < ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sle(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) <= ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sgt(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) > ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sge(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) >= ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_seq(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) === ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sne(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) !== ic._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sna(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let b = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  let c = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  let outputValue = (Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT)) ? 1 : 0;

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let b = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  let c = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  let outputValue = (Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT)) ? 1 : 0;

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_select(fields, allowedTypes, ic) {
  let b = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  let d = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  let result = (b === 0 ? d : c);

  ic._setRegister(fields[0], result, undefined, allowedTypes[0]);
}

function _instruction_sdse(fields, allowedTypes, ic) {
  let value = ic._isDeviceConnected(fields[1], allowedTypes[1]) ? 1 : 0;
  ic._setRegister(fields[0], value, undefined, allowedTypes[0]);
}

function _instruction_sdns(fields, allowedTypes, ic) {
  let value = ic._isDeviceConnected(fields[1], allowedTypes[1]) ? 0 : 1;
  ic._setRegister(fields[0], value, undefined, allowedTypes[0]);
}

function _instruction_sltz(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) < 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sgtz(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) > 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_slez(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) <= 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sgez(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) >= 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_seqz(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) === 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_snez(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) !== 0 ? 1 : 0;
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_snaz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let b = 0;
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let outputValue = (Math.abs(a - b) > Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT)) ? 1 : 0;

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sapz(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let b = 0;
  let c = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let outputValue = (Math.abs(a - b) <= Math.max(c * Math.max(Math.abs(a), Math.abs(b)), CSHARP_EPSILON_TIMES_EIGHT)) ? 1 : 0;

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}
