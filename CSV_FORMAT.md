# CSV Program Format for IAS Simulator

## Overview
You can load custom programs into the IAS simulator by uploading a CSV file. This allows you to execute any program without modifying the code.

## CSV Format

The CSV file must have two columns:
- **Address**: Memory address (0-999)
- **Value**: 13-bit binary instruction or data

### Important Constraints

1. **Address Range**: Only addresses **0-999** are allowed
   - Addresses **1000-1003** are **reserved** for interrupt handling:
     - `1001`: Saved Program Counter (PC)
     - `1002`: Interrupt handler instruction
     - `1003`: Interrupt counter

2. **Binary Values**: Must be valid binary strings (only 0s and 1s)
   - Maximum length: 13 bits
   - Values shorter than 13 bits will be automatically padded with leading zeros

3. **Header Row**: Optional - the parser will automatically detect and skip a header row if present

## Example CSV File

```csv
Address,Value
0,0010000000101
1,1100000000110
2,1110000000111
5,0000000001010
6,0000000010100
7,0000000000000
```

This example program:
- Address 0: LOAD from address 5 (loads value 10 into AC)
- Address 1: ADD from address 6 (adds value 20 to AC)
- Address 2: STORE to address 7 (stores result 30 to address 7)
- Address 5: Data value 10
- Address 6: Data value 20
- Address 7: Result storage (initially 0)

## Instruction Format

Each 13-bit instruction consists of:
- **3 bits**: Opcode
- **10 bits**: Memory address (operand)

### Available Opcodes

| Opcode | Mnemonic | Operation |
|--------|----------|-----------|
| 001    | LOAD     | AC ← Memory[X] |
| 110    | ADD      | AC ← AC + Memory[X] |
| 111    | STORE    | Memory[X] ← AC |
| 100    | MUL      | AC,MQ ← AC × Memory[X] |
| 101    | DIV      | AC ← AC ÷ Memory[X]; MQ ← AC % Memory[X] |
| 010    | LDMQ     | MQ ← Memory[X] |
| 011    | SUB      | AC ← AC - Memory[X] |

## How to Use

1. Create a CSV file following the format above
2. Click the **"Load CSV"** button in the Execution Controls
3. Select your CSV file
4. The program will be loaded into memory (addresses 0-999 only)
5. The execution log will confirm successful loading or display any errors

## Error Handling

The parser will validate:
- CSV format (must have exactly 2 columns)
- Address validity (must be a number between 0-999)
- Binary value format (must contain only 0s and 1s)
- Binary value length (must not exceed 13 bits)

Any errors will be displayed in the execution log with the specific line number where the error occurred.

## Sample Program

A sample CSV file (`sample-program.csv`) is included in the project root demonstrating the correct format.
