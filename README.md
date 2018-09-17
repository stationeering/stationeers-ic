# Stationeers IC Simulator

An implementation of the suggested [Stationeers](https://store.steampowered.com/app/544550/Stationeers/) IC system. This was developed for a feature on [stationeering.com](https://stationeering.com), but is available for use by others if they wish.

## Working on stationeers-ic

```
npm install
npm test
```

You may need to globally install eslint depending on your npm environment. Pull requests are happily taken, however all submissions must include unit tests for functionality added/altered.

## Using stationeers-ic

### Adding as Dependency

To use in your project, ensure you have a working node and npm environment:

```
npm install https://github.com/stationeering/stationeers-ic.git --save
```

### Including and Initialising

```
// Require IC, legacy.
const IC = require('stationeers-ic');
// Require IC, ES6.
import IC from 'stationeers-ic';

// Create new IC.
let ourIC = new IC();
```

### Loading Program

```
// Load a program, a string seperated by new line characters. "\n"
ourIC.load(myString);

// Load a program, however more visible in code.
ourIC.load([
  "move r0 99",
  "move r1 90
].join("\n"));
```

### Validating the Program

```
// Get any program errors, array of objects.
var errors = ourIC.getProgramErrors();
```

Error object format:

```
{
  "line": <line number>,
  "error": <error_name>,
  "field": <(optional) field number at fault, 0 indexed after instruction>,
  "type": warning|error
}
```

Current Error Types:

* INVALID_FIELD_NO_SUCH_REGISTER - The register number you have specified does not exist.
* INVALID_FIELD_UNKNOWN_TYPE - The register is invalid, or the alias has not been created.
* INVALID_FIELD_NOT_READABLE - Instruction requires a source which can be read from, either a register or a literal number.
* INVALID_FIELD_NOT_REGISTER - Instruction requires the field to be a register
* INVALID_FIELD_NOT_DEVICE - Instruction requires the field to be a device.
* MISSING_FIELD - Instruction requires an additional field in this position.
* UNKNOWN_INSTRUCTION - The instruction you have specified does not exist, check the spelling.
* LINE_TOO_LONG - The line is more than 64 characters, reduce the length.
* PROGRAM_TOO_LONG - The program is too long, only 128 instructions/lines are permitted.

Any error objects of type "error" will prevent the program from running.

### Interacting with Internal Registers

```
// Retrieve a copy of the internal registers, array of floating point numbers.
var registerState = ourIC.getInternalRegisters();

// Get all labels for the internal registers, only populated once label instructions have executed.
var registerLabels = ourIC.getInternalLabels();

// Set register 5 to 9.999.
ourIC.setInternalRegister(5, 9.999);
```

### Interacting with IO Registers

```
// Get the device names for each register, names aligned to array orders. (d0..d5,db)
var deviceNames = ourIC.getIONames();

// Get current IO/Device registers, array of objects, [{ "field": <value> }]
var deviceRegisters = ourIC.getIORegisters();

// Get any aliases that have been set for device registers, only populated once aliases have been executed.
var deviceLabels = ourIC.getIOLabels();

// Set a device register, set d2.Setting to 1.
ourIC.setIORegister(2, "Setting", 1) {
```

### Running the Program

```
// Step the IC forward one instruction.
ourIC.step();

// Move the IC forward 128 instructions or until error/yield.
var total = 0;
var lastResult = this.step();

while(!lastResult && total < 128) {
	total++;       
	lastResult = this.step(); 
}
```

`this.step()` will return an error if the program can not continue.

* YIELD - Yield instruction was run, halt until new power tick.
* INVALID_REGISTER_LOCATION - Attempt to access a register which does not exist.
* END_OF_PROGRAM - Program counter has gone beyond end of program.
* INVALID_PROGRAM_COUNTER - Program counter is less that 0.
* INVALID_PROGRAM - Program is not valid.

### Resetting the Program Counter

```
// Restart program counter to 0.
ourIC.restart();
```

### Ignoring Program Errors

```
// Ignore any program errors, execute as a no op.
ourIC.setIgnoreErrors(true);
```

