module.exports = function (ic) {
  ic._registerOpcode("push", [["r", "i", "f", "a"]], _instruction_push);
  ic._registerOpcode("pop", [["r", "a"]], _instruction_pop);
  ic._registerOpcode("peek", [["r", "a"]], _instruction_peek);
};

function _instruction_push(fields, allowedTypes, ic) {
  let stackPosition = ic._internalRegister[ic.STACK_POINTER_REGISTER];

  if (stackPosition >= ic.STACK_SIZE) {
    throw "STACK_OVERFLOW";
  }

  ic._stack[stackPosition] = ic._getRegister(fields[0], undefined, allowedTypes[0]);
  ic._internalRegister[ic.STACK_POINTER_REGISTER] = stackPosition + 1;
}

function _instruction_pop(fields, allowedTypes, ic) {
  let stackPosition = ic._internalRegister[ic.STACK_POINTER_REGISTER];

  if (stackPosition <= 0) {
    throw "STACK_UNDERFLOW";
  }

  stackPosition -= 1;
  ic._internalRegister[ic.STACK_POINTER_REGISTER] = stackPosition;
  ic._setRegister(fields[0], ic._stack[stackPosition], undefined, allowedTypes[0]);
}

function _instruction_peek(fields, allowedTypes, ic) {
  let stackPosition = ic._internalRegister[ic.STACK_POINTER_REGISTER];

  if (stackPosition <= 0) {
    throw "STACK_UNDERFLOW";
  }

  ic._setRegister(fields[0], ic._stack[stackPosition - 1], undefined, allowedTypes[0]);
}