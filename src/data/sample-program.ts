/**
 * Sample IAS program demonstrating LOAD operation
 * Each instruction is 13 bits: 3-bit opcode + 10-bit address
 */

export type Instruction = {
  address: number
  binary: string
  opcode: string
  operand: string
  comment: string
}

export const SAMPLE_PROGRAM: Instruction[] = [
  {
    address: 0,
    binary: "0010000000101", // LOAD from address 5
    opcode: "001",
    operand: "0000000101",
    comment: "LOAD value from memory[5] into AC",
  },
  {
    address: 1,
    binary: "1100000000110", // ADD from address 6
    opcode: "110",
    operand: "0000000110",
    comment: "ADD value from memory[6] to AC",
  },
  {
    address: 2,
    binary: "1110000000111", // STORE to address 7
    opcode: "111",
    operand: "0000000111",
    comment: "STORE AC value to memory[7]",
  },
  {
    address: 5,
    binary: "0000000001010", // Data: 10 in binary
    opcode: "000",
    operand: "0000001010",
    comment: "Data value: 10",
  },
  {
    address: 6,
    binary: "0000000010100", // Data: 20 in binary
    opcode: "000",
    operand: "0000010100",
    comment: "Data value: 20",
  },
  {
    address: 7,
    binary: "0000000000000", // Empty result location
    opcode: "000",
    operand: "0000000000",
    comment: "Result storage (initially 0)",
  },
  {
    address: 1001,
    binary: "0000000000000", // Saved PC location
    opcode: "000",
    operand: "0000000000",
    comment: "Interrupt: Saved PC location",
  },
  {
    address: 1002,
    binary: "1100000001111", // ADD from address 1003
    opcode: "110",
    operand: "0000001111",
    comment: "Interrupt handler: Increment counter",
  },
  {
    address: 1003,
    binary: "0000000000000", // Counter initialized to 0
    opcode: "000",
    operand: "0000000000",
    comment: "Interrupt counter (initially 0)",
  },
]

export function loadProgramIntoMemory(
  program: Instruction[],
): Record<number, string> {
  const memory: Record<number, string> = {}
  program.forEach((instruction) => {
    memory[instruction.address] = instruction.binary
  })
  return memory
}
