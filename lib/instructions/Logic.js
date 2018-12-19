"use strict";

module.exports = function (ic) {
  ic._registerOpcode("and", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_and, "logic");
  ic._registerOpcode("or", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_or, "logic");
  ic._registerOpcode("xor", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_xor, "logic");
  ic._registerOpcode("nor", [["r", "a"], ["r", "i", "f", "a"], ["r", "i", "f", "a"]], _instruction_nor, "logic");
};

function _instruction_and(fields, allowedTypes, ic) {
  var valueOne = ic._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
  var valueTwo = ic._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
  var result = valueOne && valueTwo ? 1 : 0;
  ic._setRegister(fields[0], result, undefined, allowedTypes[0]);
}

function _instruction_or(fields, allowedTypes, ic) {
  var valueOne = ic._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
  var valueTwo = ic._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
  var result = valueOne || valueTwo ? 1 : 0;
  ic._setRegister(fields[0], result, undefined, allowedTypes[0]);
}

function _instruction_xor(fields, allowedTypes, ic) {
  var valueOne = ic._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
  var valueTwo = ic._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
  var result = valueOne ^ valueTwo ? 1 : 0;
  ic._setRegister(fields[0], result, undefined, allowedTypes[0]);
}

function _instruction_nor(fields, allowedTypes, ic) {
  var valueOne = ic._getRegister(fields[1], undefined, allowedTypes[1]) != 0;
  var valueTwo = ic._getRegister(fields[2], undefined, allowedTypes[2]) != 0;
  var result = !valueOne && !valueTwo ? 1 : 0;
  ic._setRegister(fields[0], result, undefined, allowedTypes[0]);
}