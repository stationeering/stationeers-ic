"use strict";

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

function _instruction_slt(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) < this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sle(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) <= this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sgt(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) > this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sge(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) >= this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_seq(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) === this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sne(fields, allowedTypes) {
  var outputValue = this._getRegister(fields[1], undefined, allowedTypes[1]) !== this._getRegister(fields[2], undefined, allowedTypes[2]) ? 1 : 0;
  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sna(fields, allowedTypes) {
  var a = this._getRegister(fields[1], undefined, allowedTypes[1]);
  var b = this._getRegister(fields[2], undefined, allowedTypes[2]);
  var c = this._getRegister(fields[3], undefined, allowedTypes[3]);

  var outputValue = Math.abs(a - b) > c * Math.max(Math.abs(a), Math.abs(b)) ? 1 : 0;

  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_sap(fields, allowedTypes) {
  var a = this._getRegister(fields[1], undefined, allowedTypes[1]);
  var b = this._getRegister(fields[2], undefined, allowedTypes[2]);
  var c = this._getRegister(fields[3], undefined, allowedTypes[3]);

  var outputValue = Math.abs(a - b) <= c * Math.max(Math.abs(a), Math.abs(b)) ? 1 : 0;

  this._setRegister(fields[0], outputValue, undefined, allowedTypes[0]);
}

function _instruction_select(fields, allowedTypes) {
  var b = this._getRegister(fields[1], undefined, allowedTypes[1]);
  var c = this._getRegister(fields[2], undefined, allowedTypes[2]);
  var d = this._getRegister(fields[3], undefined, allowedTypes[3]);

  var result = b === 0 ? d : c;

  this._setRegister(fields[0], result, undefined, allowedTypes[0]);
}

function _instruction_sdse(fields, allowedTypes) {
  var value = this._isDeviceConnected(fields[1], allowedTypes[1]) ? 1 : 0;
  this._setRegister(fields[0], value, undefined, allowedTypes[0]);
}

function _instruction_sdns(fields, allowedTypes) {
  var value = this._isDeviceConnected(fields[1], allowedTypes[1]) ? 0 : 1;
  this._setRegister(fields[0], value, undefined, allowedTypes[0]);
}