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
  message: string
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
 */
export function executeFetch(state: ExecutionState): ExecutionStep {
  const pc = binaryToDecimal(state.registers.PC)
  const instruction = state.memory[pc] || "0000000000000"

  const newRegisters = { ...state.registers }
  newRegisters.MAR = state.registers.PC
  newRegisters.MBR = instruction

  return {
    registers: newRegisters,
    memory: state.memory,
    phase: "decode",
    message: i18n.t("execution.logs.fetch", { address: pc }),
  }
}

/**
 * Decode phase: Parse instruction from MBR, extract opcode into IR
 */
export function executeDecode(state: ExecutionState): ExecutionStep {
  const instruction = state.registers.MBR
  const { opcode, address } = parseInstruction(instruction)

  const newRegisters = { ...state.registers }
  newRegisters.IR = opcode
  newRegisters.MAR = address

  return {
    registers: newRegisters,
    memory: state.memory,
    phase: "execute",
    message: i18n.t("execution.logs.decode", {
      opcode,
      address: binaryToDecimal(address),
    }),
  }
}

/**
 * Execute phase: Perform the operation based on opcode in IR
 */
export function executeInstruction(state: ExecutionState): ExecutionStep {
  const opcode = state.registers.IR
  const address = state.registers.MAR
  const memoryAddress = binaryToDecimal(address)
  const newRegisters = { ...state.registers }
  const newMemory = [...state.memory]
  let message = ""

  switch (opcode) {
    case "001": // LOAD
      newRegisters.MAR = address
      newRegisters.MBR = state.memory[memoryAddress] || "0000000000000"
      newRegisters.AC = newRegisters.MBR
      message = i18n.t("execution.logs.load", {
        address: memoryAddress,
        value: newRegisters.AC,
      })
      break

    case "010": // MUL
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = acValue * memValue
        // For simplicity, store result in AC (13 bits max)
        newRegisters.AC = decimalToBinary(result & 0x1fff, 13)
        newRegisters.MQ = decimalToBinary((result >> 13) & 0x1fff, 13)
        message = i18n.t("execution.logs.mul", {
          address: memoryAddress,
          result,
        })
      }
      break

    case "011": // DIV
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        if (memValue === 0) {
          message = i18n.t("execution.logs.divideByZero")
        } else {
          const quotient = Math.floor(acValue / memValue)
          const remainder = acValue % memValue
          newRegisters.AC = decimalToBinary(quotient & 0x1fff, 13)
          newRegisters.MQ = decimalToBinary(remainder & 0x1fff, 13)
          message = i18n.t("execution.logs.div", {
            address: memoryAddress,
            quotient,
            remainder,
          })
        }
      }
      break

    case "100": // LDMQ
      newRegisters.MAR = address
      newRegisters.MBR = state.memory[memoryAddress] || "0000000000000"
      newRegisters.MQ = newRegisters.MBR
      message = i18n.t("execution.logs.ldmq", {
        address: memoryAddress,
        value: newRegisters.MQ,
      })
      break

    case "110": // ADD
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = (acValue + memValue) & 0x1fff // 13-bit overflow wrap
        newRegisters.AC = decimalToBinary(result, 13)
        message = i18n.t("execution.logs.add", {
          address: memoryAddress,
          result,
        })
      }
      break

    case "111": // ST (STORE)
      newRegisters.MAR = address
      newRegisters.MBR = state.registers.AC
      newMemory[memoryAddress] = state.registers.AC
      message = i18n.t("execution.logs.store", {
        address: memoryAddress,
        value: state.registers.AC,
      })
      break

    case "000": // SUB
      {
        const acValue = binaryToDecimal(state.registers.AC)
        const memValue = binaryToDecimal(
          state.memory[memoryAddress] || "0000000000000",
        )
        const result = (acValue - memValue) & 0x1fff // 13-bit overflow wrap
        newRegisters.AC = decimalToBinary(result, 13)
        message = i18n.t("execution.logs.sub", {
          address: memoryAddress,
          result,
        })
      }
      break

    case "101": // HALT
      message = i18n.t("execution.logs.halted")
      return {
        registers: newRegisters,
        memory: newMemory,
        phase: "halted",
        message,
      }

    default:
      message = i18n.t("execution.logs.unknown", { opcode })
  }

  // Increment PC for next instruction
  const nextPC = (binaryToDecimal(state.registers.PC) + 1) % 1000
  newRegisters.PC = decimalToBinary(nextPC, 10)

  return {
    registers: newRegisters,
    memory: newMemory,
    phase: "fetch",
    message,
  }
}

/**
 * Execute one complete cycle (fetch -> decode -> execute)
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
        message: i18n.t("execution.logs.starting"),
      }
    case "halted":
      return {
        registers: state.registers,
        memory: state.memory,
        phase: "halted",
        message: i18n.t("execution.logs.halted"),
      }
  }
}
