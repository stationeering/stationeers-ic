module.exports = function (ic) {
  ic._registerOpcode("move", [["r", "a"], ["r", "i", "f", "a"]], _instruction_move, "misc");

  ic._registerOpcode("yield", [], _instruction_yield, "misc");

  ic._registerOpcode("hcf", [], _instruction_hcf, "misc");
};

/* eslint no-unused-vars: 0 */ 

function _instruction_move(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_yield(fields, allowedTypes, ic) {
  throw "YIELD";
}

function _instruction_hcf(fields, allowedTypes, ic) {
  throw "HALT_AND_CATCH_FIRE";
}
