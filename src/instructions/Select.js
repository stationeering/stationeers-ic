module.exports = function (ic) {
  ic._registerOpcode("slt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_slt);
  ic._registerOpcode("sgt", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sgt);
  ic._registerOpcode("sle", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sle);
  ic._registerOpcode("sge", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sge);
  ic._registerOpcode("seq", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_seq);
  ic._registerOpcode("sne", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sne);

  ic._registerOpcode("sap", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sap);
  ic._registerOpcode("sna", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sna);

  ic._registerOpcode("select", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_select);

  ic._registerOpcode("sdse", [["r", "a"], ["d", "a"]], _instruction_sdse);
  ic._registerOpcode("sdns", [["r", "a"], ["d", "a"]], _instruction_sdns);
};

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

  let outputValue = (Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b))) ? 1 : 0;

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sap(fields, allowedTypes, ic) {
  let a = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let b = ic._getRegister(fields[2], undefined, allowedTypes[2]);
  let c = ic._getRegister(fields[3], undefined, allowedTypes[3]);

  let outputValue = (Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b))) ? 1 : 0;

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