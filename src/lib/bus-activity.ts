/**
 * Determines which buses are active based on highlighted registers
 */

export type BusActivity = {
  dataBus: boolean
  addressBus: boolean
  controlBus: boolean
}

export type ExecutionPhase = "fetch" | "decode" | "execute" | "idle" | "halted"
export type RegisterKey = "PC" | "MAR" | "MBR" | "IR" | "AC" | "MQ"

/**
 * Calculate bus activity based on which registers are currently highlighted
 * 
 * Bus activity rules based on register operations:
 * - PC highlighted: No buses (just showing PC is ready)
 * - MAR highlighted: No buses (internal register operation)
 * - MBR highlighted (from memory): ALL 3 buses (reading from memory to CPU)
 * - IR highlighted: No buses (internal operation from MBR)
 * - AC highlighted: No buses (internal ALU operation)
 * - MQ highlighted: No buses (internal operation)
 * 
 * Special cases:
 * - When reading from memory to MBR: All 3 buses (Address + Data + Control)
 * - When writing to memory from MBR: All 3 buses (Address + Data + Control)
 */
export function getBusActivity(
  highlightedRegisters: RegisterKey[] = [],
  isActuallyExecuting: boolean = false
): BusActivity {
  // If not actually executing, show no activity
  if (!isActuallyExecuting || highlightedRegisters.length === 0) {
    return {
      addressBus: false,
      dataBus: false,
      controlBus: false,
    }
  }

  // Determine bus activity based on which register is highlighted
  const highlighted = highlightedRegisters[0] // Use first highlighted register
  
  switch (highlighted) {
    case "PC":
    case "MAR":
      // PC or MAR highlighted: No buses (internal register operations)
      return {
        addressBus: false,
        dataBus: false,
        controlBus: false,
      }
    
    case "MBR":
      // MBR highlighted: All 3 buses (reading from/writing to memory)
      // Address bus: MAR provides the memory address
      // Data bus: Data being transferred
      // Control bus: READ/WRITE signals
      return {
        addressBus: true,
        dataBus: true,
        controlBus: true,
      }
    
    case "IR":
    case "AC":
    case "MQ":
      // Internal operations: No external buses
      return {
        addressBus: false,
        dataBus: false,
        controlBus: false,
      }
    
    default:
      return {
        addressBus: false,
        dataBus: false,
        controlBus: false,
      }
  }
}

/**
 * Get a human-readable description of what's happening on each bus
 */
export function getBusDescription(phase: ExecutionPhase): {
  address: string
  data: string
  control: string
} {
  switch (phase) {
    case "fetch":
      return {
        address: "PC → MAR → Memory Address",
        data: "Memory → MBR (Instruction)",
        control: "READ signal active",
      }
    
    case "decode":
      return {
        address: "Instruction Address → MAR",
        data: "No external transfer",
        control: "Decode control signals",
      }
    
    case "execute":
      return {
        address: "MAR → Memory Address",
        data: "Memory ↔ Registers",
        control: "READ/WRITE signals",
      }
    
    case "idle":
      return {
        address: "Waiting for execution",
        data: "Waiting for execution",
        control: "Waiting for execution",
      }
    
    case "halted":
      return {
        address: "Execution stopped",
        data: "Execution stopped",
        control: "Execution stopped",
      }
  }
}
