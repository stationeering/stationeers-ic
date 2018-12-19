module.exports = function (ic) {
  ic._registerOpcode("add", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_add, "math");
  ic._registerOpcode("sub", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_sub, "math");
  ic._registerOpcode("mul", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_mul, "math");
  ic._registerOpcode("div", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_div, "math");
  ic._registerOpcode("mod", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_mod, "math");
  ic._registerOpcode("sqrt", [["r", "a"], ["r", "i", "f", "a"]], _instruction_sqrt, "math");
  ic._registerOpcode("round", [["r", "a"], ["r", "i", "f", "a"]], _instruction_round, "math");
  ic._registerOpcode("trunc", [["r", "a"], ["r", "i", "f", "a"]], _instruction_trunc, "math");
  ic._registerOpcode("ceil", [["r", "a"], ["r", "i", "f", "a"]], _instruction_ceil, "math");
  ic._registerOpcode("floor", [["r", "a"], ["r", "i", "f", "a"]], _instruction_floor, "math");
  ic._registerOpcode("max", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_max, "math");
  ic._registerOpcode("min", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_min, "math");
  ic._registerOpcode("abs", [["r", "a"], ["r", "i", "f", "a"]], _instruction_abs, "math");
  ic._registerOpcode("log", [["r", "a"], ["r", "i", "f", "a"]], _instruction_log, "math");
  ic._registerOpcode("exp", [["r", "a"], ["r", "i", "f", "a"]], _instruction_exp, "math");
  ic._registerOpcode("rand", [["r", "a"]], _instruction_rand, "math");
};

function _instruction_add(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) + ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sub(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) - ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_mul(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) * ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_div(fields, allowedTypes, ic) {
  let outputValue = ic._getRegister(fields[1], undefined, allowedTypes[1]) / ic._getRegister(fields[2], undefined, allowedTypes[2]);
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_mod(fields, allowedTypes, ic) {
  let valueOne = ic._getRegister(fields[1], undefined, allowedTypes[1]);
  let valueTwo = ic._getRegister(fields[2], undefined, allowedTypes[2]);

  let outputValue = valueOne % valueTwo;
  if (outputValue < 0) {
    outputValue += valueTwo;
  }

  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sqrt(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.sqrt(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_round(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.round(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_trunc(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.trunc(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_ceil(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.ceil(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_floor(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.floor(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_max(fields, allowedTypes, ic) {
  let outputValue = Math.max(ic._getRegister(fields[1], undefined, allowedTypes[1]), ic._getRegister(fields[2], undefined, allowedTypes[2]));
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_min(fields, allowedTypes, ic) {
  let outputValue = Math.min(ic._getRegister(fields[1], undefined, allowedTypes[1]), ic._getRegister(fields[2], undefined, allowedTypes[2]));
  ic._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_abs(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.abs(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_log(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.log(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_exp(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.exp(ic._getRegister(fields[1], undefined, allowedTypes[1])), undefined, allowedTypes[0]);
}

function _instruction_rand(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], Math.random(), undefined, allowedTypes[0]);
}
