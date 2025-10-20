/**
 * CSV parser for loading programs into IAS memory
 * Expected format: Address,Value
 * Address: 0-999 (addresses 1000-1003 are reserved for interrupts)
 * Value: 13-bit binary string
 */

export interface CSVParseResult {
  success: boolean
  memory?: Record<number, string>
  error?: string
  lineNumber?: number
}

const WORD_WIDTH = 13
const MAX_USER_ADDRESS = 999
const RESERVED_START = 1000

export function parseCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.trim().split('\n')
  
  if (lines.length === 0) {
    return { success: false, error: 'CSV file is empty' }
  }

  const memory: Record<number, string> = {}
  
  // Check if first line is a header
  let startIndex = 0
  const firstLine = lines[0].trim().toLowerCase()
  if (firstLine.includes('address') && firstLine.includes('value')) {
    startIndex = 1
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines
    if (!line) continue

    const parts = line.split(',').map(part => part.trim())
    
    if (parts.length !== 2) {
      return {
        success: false,
        error: `Invalid format at line ${i + 1}. Expected: Address,Value`,
        lineNumber: i + 1,
      }
    }

    const [addressStr, valueStr] = parts

    // Parse address
    const address = parseInt(addressStr, 10)
    if (isNaN(address)) {
      return {
        success: false,
        error: `Invalid address at line ${i + 1}: "${addressStr}" is not a number`,
        lineNumber: i + 1,
      }
    }

    // Validate address range (0-999 only, 1000-1003 are reserved)
    if (address < 0 || address > MAX_USER_ADDRESS) {
      return {
        success: false,
        error: `Invalid address at line ${i + 1}: ${address}. Must be between 0 and ${MAX_USER_ADDRESS} (addresses ${RESERVED_START}-1003 are reserved for interrupts)`,
        lineNumber: i + 1,
      }
    }

    // Validate binary value
    if (!/^[01]+$/.test(valueStr)) {
      return {
        success: false,
        error: `Invalid binary value at line ${i + 1}: "${valueStr}". Must contain only 0s and 1s`,
        lineNumber: i + 1,
      }
    }

    // Validate binary width
    if (valueStr.length > WORD_WIDTH) {
      return {
        success: false,
        error: `Binary value too long at line ${i + 1}: "${valueStr}" is ${valueStr.length} bits. Maximum is ${WORD_WIDTH} bits`,
        lineNumber: i + 1,
      }
    }

    // Pad to correct width
    const paddedValue = valueStr.padStart(WORD_WIDTH, '0')
    memory[address] = paddedValue
  }

  if (Object.keys(memory).length === 0) {
    return {
      success: false,
      error: 'No valid data found in CSV file',
    }
  }

  return {
    success: true,
    memory,
  }
}
