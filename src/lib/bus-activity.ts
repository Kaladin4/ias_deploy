/**
 * Determines which buses are active during each execution phase
 */

export type BusActivity = {
  dataBus: boolean
  addressBus: boolean
  controlBus: boolean
}

export type ExecutionPhase = "fetch" | "decode" | "execute" | "idle" | "halted"

/**
 * Calculate bus activity based on execution phase
 * 
 * FETCH phase:
 * - Address Bus: Active (PC → MAR → Memory)
 * - Data Bus: Active (Memory → MBR)
 * - Control Bus: Active (READ signal)
 * 
 * DECODE phase:
 * - Address Bus: Active (extracting address from instruction)
 * - Data Bus: Idle (internal register operations)
 * - Control Bus: Active (control signals for decoding)
 * 
 * EXECUTE phase:
 * - Address Bus: Active (accessing operand memory location)
 * - Data Bus: Active (reading/writing data)
 * - Control Bus: Active (READ/WRITE signals)
 */
export function getBusActivity(
  phase: ExecutionPhase,
  opcode?: string
): BusActivity {
  switch (phase) {
    case "fetch":
      // Fetching instruction from memory
      return {
        addressBus: true,  // PC provides address
        dataBus: true,     // Instruction transferred to MBR
        controlBus: true,  // READ control signal
      }
    
    case "decode":
      // Decoding instruction (internal operations)
      return {
        addressBus: true,  // Address extracted and placed in MAR
        dataBus: false,    // No external data transfer
        controlBus: true,  // Control signals for internal routing
      }
    
    case "execute":
      // Executing instruction - depends on operation type
      // Most operations involve memory access
      if (opcode === "IR") {
        // If we don't have the opcode, assume memory access
        return {
          addressBus: true,
          dataBus: true,
          controlBus: true,
        }
      }
      
      // All our operations involve memory access
      return {
        addressBus: true,  // MAR provides memory address
        dataBus: true,     // Data transfer to/from memory
        controlBus: true,  // READ or WRITE signal
      }
    
    case "idle":
    case "halted":
      // No bus activity
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
