"use strict";

module.exports = function (ic) {
  ic._registerOpcode("l", [["r", "a"], ["d", "a"], ["s"]], _instruction_l, "device");
  ic._registerOpcode("s", [["d", "a"], ["s"], ["r", "i", "f", "a"]], _instruction_s, "device");

  ic._registerOpcode("ls", [["r", "a"], ["d", "a"], ["r", "i", "a"], ["s"]], _instruction_ls, "device");
  ic._registerOpcode("lr", [["r", "a"], ["d", "a"], ["s"], ["s"]], _instruction_lr, "device");

  ic._registerOpcode("lb", [["r", "a"], ["r", "i", "a"], "s", "s"], _instruction_lb, "device");
  ic._registerOpcode("sb", [["r", "i", "a"], "s", ["r", "i", "f", "a"]], _instruction_sb, "device");
};

function _instruction_l(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], ic._getRegister(fields[1], fields[2], allowedTypes[1]), undefined, allowedTypes[0]);
}

function _instruction_s(fields, allowedTypes, ic) {
  ic._setRegister(fields[0], ic._getRegister(fields[2], undefined, allowedTypes[2]), fields[1], allowedTypes[0]);
}

function _instruction_ls(fields, allowedTypes, ic) {
  var deviceNumber = ic._resolveDeviceNumber(fields[1], allowedTypes[1]);
  var slotNumber = Number(ic._getRegister(fields[2], undefined, allowedTypes[2])).toString();

  if (!Object.keys(ic._ioSlot[deviceNumber]).includes(slotNumber.toString()) || !Object.keys(ic._ioSlot[deviceNumber][slotNumber]).includes(fields[3])) {
    ic.setIOSlot(deviceNumber, slotNumber, fields[3], 0);
  }

  var value = ic._ioSlot[deviceNumber][slotNumber][fields[3]];
  ic._setRegister(fields[0], value, undefined, allowedTypes[0]);
}

function _instruction_lr(fields, allowedTypes, ic) {
  var deviceNumber = ic._resolveDeviceNumber(fields[1], allowedTypes[1]);

  if (!Object.keys(ic._ioReagent[deviceNumber]).includes(fields[3]) || !Object.keys(ic._ioReagent[deviceNumber][fields[3]]).includes(fields[2])) {
    ic.setIOReagent(deviceNumber, fields[3], fields[2], 0);
  }

  var value = ic._ioReagent[deviceNumber][fields[3]][fields[2]];
  ic._setRegister(fields[0], value, undefined, allowedTypes[0]);
}

/* eslint no-unused-vars: 0 */

function _instruction_lb(fields, allowedTypes, ic) {}

function _instruction_sb(fields, allowedTypes, ic) {}