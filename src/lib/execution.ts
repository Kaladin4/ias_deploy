/**
 * IAS Computer Execution Engine
 * Implements fetch-decode-execute cycle for simplified IAS architecture
 */

import i18n from "./i18n"

export type RegisterKey = "PC" | "MAR" | "MBR" | "IR" | "AC" | "MQ"

export type ExecutionState = {
  registers: Record<RegisterKey, string>
  memory: string[]
  phase: "fetch" | "decode" | "execute" | "idle" | "halted"
  microStep: number
  currentInstruction: {
    opcode: string
    address: string
  } | null
  log: string[]
}

export type ExecutionStep = {
  registers: Record<RegisterKey, string>
  memory: string[]
  phase: "fetch" | "decode" | "execute" | "idle" | "halted"
  microStep: number
  message: string
  detailedLogs?: string[]
}

/**
 * Parse a 13-bit instruction into opcode (3 bits) and address (10 bits)
 */
export function parseInstruction(instruction: string): {
  opcode: string
  address: string
} {
  if (instruction.length !== 13) {
    throw new Error(`Invalid instruction length: ${instruction.length}`)
  }
  return {
    opcode: instruction.slice(0, 3),
    address: instruction.slice(3, 13),
  }
}

/**
 * Convert binary string to decimal number
 */
export function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2)
}

/**
 * Convert decimal number to binary string with padding
 */
export function decimalToBinary(decimal: number, bits: number): string {
  return decimal.toString(2).padStart(bits, "0")
}

/**
 * Fetch phase: Load instruction from memory into MBR
 * Micro-steps:
 * 0: PC → MAR (address placed on bus)
 * 1: Memory[MAR] → MBR (instruction retrieved)
 */
export function executeFetch(state: ExecutionState): ExecutionStep {
  const pc = binaryToDecimal(state.registers.PC)
  const newRegisters = { ...state.registers }
  
  switch (state.microStep) {
    case 0: {
      // Step 1: Load PC into MAR
      newRegisters.MAR = state.registers.PC
      return {
        registers: newRegisters,
        memory: state.memory,
        phase: "fetch",
        microStep: 1,
        message: i18n.t("execution.logs.fetch.step1", { pc: state.registers.PC, address: pc }),
        detailedLogs: [
          i18n.t("execution.logs.fetch.step1", { pc: state.registers.PC, address: pc }),
          i18n.t("execution.logs.fetch.step2", { mar: newRegisters.MAR, address: pc }),
        ],
      }
    }
    case 1: {
      // Step 2: Load instruction from memory into MBR
      const instruction = state.memory[pc] || "0000000000000"
      newRegisters.MBR = instruction
      return {
        registers: newRegisters,
        memory: state.memory,
        phase: "decode",
        microStep: 0,
        message: i18n.t("execution.logs.fetch.step3", { address: pc, instruction }),
        detailedLogs: [
          i18n.t("execution.logs.fetch.step3", { address: pc, instruction }),
          i18n.t("execution.logs.fetch.step4", { mbr: instruction }),
        ],
      }
    }
    default:
      return {
        registers: state.registers,
        memory: state.memory,
        phase: "fetch",
        microStep: 0,
        message: "Error: Invalid fetch micro-step",
      }
  }
}

/**
 * Decode phase: Parse instruction from MBR, extract opcode into IR
 * Micro-steps:
 * 0: Parse MBR → IR (opcode extracted)
 * 1: Parse MBR → MAR (operand address extracted)
 */
export function executeDecode(state: ExecutionState): ExecutionStep {
  const instruction = state.registers.MBR
  const { opcode, address } = parseInstruction(instruction)
  const newRegisters = { ...state.registers }

  switch (state.microStep) {
    case 0: {
      // Step 1: Extract opcode and load into IR
      newRegisters.IR = opcode
      return {
        registers: newRegisters,
        memory: state.memory,
        phase: "decode",
        microStep: 1,
        message: i18n.t("execution.logs.decode.step1", { mbr: instruction }),
        detailedLogs: [
          i18n.t("execution.logs.decode.step1", { mbr: instruction }),
          i18n.t("execution.logs.decode.step2", { opcode, address }),
          i18n.t("execution.logs.decode.step3", { ir: opcode }),
        ],
      }
    }
    case 1: {
      // Step 2: Extract operand address and load into MAR
      newRegisters.MAR = address
      return {
        registers: newRegisters,
        memory: state.memory,
        phase: "execute",
        microStep: 0,
        message: i18n.t("execution.logs.decode.step4", { mar: address, addressDec: binaryToDecimal(address) }),
        detailedLogs: [
          i18n.t("execution.logs.decode.step4", { mar: address, addressDec: binaryToDecimal(address) }),
        ],
      }
    }
    default:
      return {
        registers: state.registers,
        memory: state.memory,
        phase: "decode",
        microStep: 0,
        message: "Error: Invalid decode micro-step",
      }
  }
}

/**
 * Execute phase: Perform the operation based on opcode in IR
 * Each instruction has its own micro-steps for register transfers
 */
export function executeInstruction(state: ExecutionState): ExecutionStep {
  const opcode = state.registers.IR
  const address = state.registers.MAR
  const memoryAddress = binaryToDecimal(address)
  const newRegisters = { ...state.registers }
  const newMemory = [...state.memory]

  switch (opcode) {
    case "001": // LOAD - 3 micro-steps
      switch (state.microStep) {
        case 0: {
          // Step 1: MAR already has address (from decode), read memory
          return {
            registers: newRegisters,
            memory: state.memory,
            phase: "execute",
            microStep: 1,
            message: i18n.t("execution.logs.load.step1", { mar: address, addressDec: memoryAddress }),
            detailedLogs: [
              i18n.t("execution.logs.load.step1", { mar: address, addressDec: memoryAddress }),
              i18n.t("execution.logs.load.step2", { addressDec: memoryAddress }),
            ],
          }
        }
        case 1: {
          // Step 2: Load value from memory into MBR
          newRegisters.MBR = state.memory[memoryAddress] || "0000000000000"
          return {
            registers: newRegisters,
            memory: state.memory,
            phase: "execute",
            microStep: 2,
            message: i18n.t("execution.logs.load.step3", { mbr: newRegisters.MBR, value: newRegisters.MBR }),
            detailedLogs: [
              i18n.t("execution.logs.load.step3", { mbr: newRegisters.MBR, value: newRegisters.MBR }),
            ],
          }
        }
        case 2: {
          // Step 3: Transfer MBR to AC
          newRegisters.AC = state.registers.MBR
          // Increment PC for next instruction
          const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
          newRegisters.PC = decimalToBinary(nextPC, 10)
          return {
            registers: newRegisters,
            memory: state.memory,
            phase: "fetch",
            microStep: 0,
            message: i18n.t("execution.logs.load.step4", { ac: newRegisters.AC }),
            detailedLogs: [
              i18n.t("execution.logs.load.step4", { ac: newRegisters.AC }),
              i18n.t("execution.logs.pcIncrement", { pc: newRegisters.PC, nextPC }),
            ],
          }
        }
        default:
          return {
            registers: state.registers,
            memory: state.memory,
            phase: "execute",
            microStep: 0,
            message: "Error: Invalid LOAD micro-step",
          }
      }
      break

    case "010": // MUL - 3 micro-steps
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = acValue * memValue
        
        switch (state.microStep) {
          case 0: {
            // Step 1: Read AC value
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "execute",
              microStep: 1,
              message: i18n.t("execution.logs.mul.step1", { ac: state.registers.AC, acValue }),
              detailedLogs: [
                i18n.t("execution.logs.mul.step1", { ac: state.registers.AC, acValue }),
                i18n.t("execution.logs.mul.step2", { addressDec: memoryAddress, memValue }),
              ],
            }
          }
          case 1: {
            // Step 2: Perform multiplication, store in AC
            newRegisters.AC = decimalToBinary(result & 0x1fff, 13)
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "execute",
              microStep: 2,
              message: i18n.t("execution.logs.mul.step3", { acValue, memValue, result }),
              detailedLogs: [
                i18n.t("execution.logs.mul.step3", { acValue, memValue, result }),
                i18n.t("execution.logs.mul.step4", { ac: newRegisters.AC, resultLow: result & 0x1fff }),
              ],
            }
          }
          case 2: {
            // Step 3: Store upper bits in MQ
            newRegisters.MQ = decimalToBinary((result >> 13) & 0x1fff, 13)
            const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
            newRegisters.PC = decimalToBinary(nextPC, 10)
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "fetch",
              microStep: 0,
              message: i18n.t("execution.logs.mul.step5", { mq: newRegisters.MQ, resultHigh: (result >> 13) & 0x1fff }),
              detailedLogs: [
                i18n.t("execution.logs.mul.step5", { mq: newRegisters.MQ, resultHigh: (result >> 13) & 0x1fff }),
                i18n.t("execution.logs.pcIncrement", { pc: newRegisters.PC, nextPC }),
              ],
            }
          }
          default:
            return {
              registers: state.registers,
              memory: state.memory,
              phase: "execute",
              microStep: 0,
              message: "Error: Invalid MUL micro-step",
            }
        }
      }
      break

    case "011": // DIV - Similar to MUL
    case "100": // LDMQ - Similar to LOAD
    case "110": // ADD - 2 micro-steps
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = (acValue + memValue) & 0x1fff
        
        switch (state.microStep) {
          case 0: {
            // Step 1: Read AC and memory value
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "execute",
              microStep: 1,
              message: i18n.t("execution.logs.add.step1", { ac: state.registers.AC, acValue }),
              detailedLogs: [
                i18n.t("execution.logs.add.step1", { ac: state.registers.AC, acValue }),
                i18n.t("execution.logs.add.step2", { addressDec: memoryAddress, memValue }),
              ],
            }
          }
          case 1: {
            // Step 2: Perform addition and store result
            newRegisters.AC = decimalToBinary(result, 13)
            const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
            newRegisters.PC = decimalToBinary(nextPC, 10)
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "fetch",
              microStep: 0,
              message: i18n.t("execution.logs.add.step3", { acValue, memValue, result }),
              detailedLogs: [
                i18n.t("execution.logs.add.step3", { acValue, memValue, result }),
                i18n.t("execution.logs.add.step4", { ac: newRegisters.AC, result }),
                i18n.t("execution.logs.pcIncrement", { pc: newRegisters.PC, nextPC }),
              ],
            }
          }
          default:
            return {
              registers: state.registers,
              memory: state.memory,
              phase: "execute",
              microStep: 0,
              message: "Error: Invalid ADD micro-step",
            }
        }
      }
      break

    case "111": // STORE - 3 micro-steps
      switch (state.microStep) {
        case 0: {
          // Step 1: MAR already set, read AC
          return {
            registers: newRegisters,
            memory: state.memory,
            phase: "execute",
            microStep: 1,
            message: i18n.t("execution.logs.store.step1", { mar: address, addressDec: memoryAddress }),
            detailedLogs: [
              i18n.t("execution.logs.store.step1", { mar: address, addressDec: memoryAddress }),
              i18n.t("execution.logs.store.step2", { ac: state.registers.AC }),
            ],
          }
        }
        case 1: {
          // Step 2: Transfer AC to MBR
          newRegisters.MBR = state.registers.AC
          return {
            registers: newRegisters,
            memory: state.memory,
            phase: "execute",
            microStep: 2,
            message: i18n.t("execution.logs.store.step3", { mbr: state.registers.AC }),
            detailedLogs: [
              i18n.t("execution.logs.store.step3", { mbr: state.registers.AC }),
            ],
          }
        }
        case 2: {
          // Step 3: Write MBR to memory
          newMemory[memoryAddress] = state.registers.MBR
          const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
          newRegisters.PC = decimalToBinary(nextPC, 10)
          return {
            registers: newRegisters,
            memory: newMemory,
            phase: "fetch",
            microStep: 0,
            message: i18n.t("execution.logs.store.step4", { addressDec: memoryAddress, value: state.registers.MBR }),
            detailedLogs: [
              i18n.t("execution.logs.store.step4", { addressDec: memoryAddress, value: state.registers.MBR }),
              i18n.t("execution.logs.pcIncrement", { pc: newRegisters.PC, nextPC }),
            ],
          }
        }
        default:
          return {
            registers: state.registers,
            memory: state.memory,
            phase: "execute",
            microStep: 0,
            message: "Error: Invalid STORE micro-step",
          }
      }
      break

    case "000": // SUB - Similar to ADD
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = (acValue - memValue) & 0x1fff
        
        switch (state.microStep) {
          case 0: {
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "execute",
              microStep: 1,
              message: i18n.t("execution.logs.sub.step1", { ac: state.registers.AC, acValue }),
              detailedLogs: [
                i18n.t("execution.logs.sub.step1", { ac: state.registers.AC, acValue }),
                i18n.t("execution.logs.sub.step2", { addressDec: memoryAddress, memValue }),
              ],
            }
          }
          case 1: {
            newRegisters.AC = decimalToBinary(result, 13)
            const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
            newRegisters.PC = decimalToBinary(nextPC, 10)
            return {
              registers: newRegisters,
              memory: state.memory,
              phase: "fetch",
              microStep: 0,
              message: i18n.t("execution.logs.sub.step3", { acValue, memValue, result }),
              detailedLogs: [
                i18n.t("execution.logs.sub.step3", { acValue, memValue, result }),
                i18n.t("execution.logs.sub.step4", { ac: newRegisters.AC, result }),
                i18n.t("execution.logs.pcIncrement", { pc: newRegisters.PC, nextPC }),
              ],
            }
          }
          default:
            return {
              registers: state.registers,
              memory: state.memory,
              phase: "execute",
              microStep: 0,
              message: "Error: Invalid SUB micro-step",
            }
        }
      }
      break

    case "101": // HALT
      return {
        registers: newRegisters,
        memory: newMemory,
        phase: "halted",
        microStep: 0,
        message: i18n.t("execution.logs.halted"),
        detailedLogs: [i18n.t("execution.logs.halted")],
      }

    default:
      return {
        registers: newRegisters,
        memory: newMemory,
        phase: "fetch",
        microStep: 0,
        message: i18n.t("execution.logs.unknown", { opcode }),
        detailedLogs: [i18n.t("execution.logs.unknown", { opcode })],
      }
  }
}

/**
 * Execute one micro-step of the current phase
 */
export function executeStep(state: ExecutionState): ExecutionStep {
  switch (state.phase) {
    case "fetch":
      return executeFetch(state)
    case "decode":
      return executeDecode(state)
    case "execute":
      return executeInstruction(state)
    case "idle":
      return {
        registers: state.registers,
        memory: state.memory,
        phase: "fetch",
        microStep: 0,
        message: i18n.t("execution.logs.starting"),
      }
    case "halted":
      return {
        registers: state.registers,
        memory: state.memory,
        phase: "halted",
        microStep: 0,
        message: i18n.t("execution.logs.halted"),
      }
  }
}
