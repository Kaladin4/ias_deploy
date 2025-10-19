# IAS Computer Bus System

## Overview

The bus system visualizes the three main communication pathways in the IAS computer architecture:

1. **Address Bus** (Blue) - 10 bits
2. **Data Bus** (Green) - 13 bits  
3. **Control Bus** (Amber) - Control signals

## Bus Activity by Execution Phase

### FETCH Phase
- **Address Bus**: ✅ ACTIVE - PC provides memory address via MAR
- **Data Bus**: ✅ ACTIVE - Instruction transferred from Memory to MBR
- **Control Bus**: ✅ ACTIVE - READ signal sent to memory

**What happens**: The Program Counter (PC) value is placed on the address bus to specify which memory location to read. The instruction at that location travels back on the data bus into the Memory Buffer Register (MBR).

### DECODE Phase
- **Address Bus**: ✅ ACTIVE - Operand address extracted and placed in MAR
- **Data Bus**: ❌ IDLE - Internal register operations only
- **Control Bus**: ✅ ACTIVE - Control signals for internal routing

**What happens**: The instruction in MBR is parsed. The opcode (3 bits) goes to the Instruction Register (IR), and the address (10 bits) goes to the Memory Address Register (MAR). This is all internal, so no data bus activity.

### EXECUTE Phase
- **Address Bus**: ✅ ACTIVE - MAR provides operand memory address
- **Data Bus**: ✅ ACTIVE - Data transferred between memory and registers
- **Control Bus**: ✅ ACTIVE - READ or WRITE signal depending on operation

**What happens**: The actual operation is performed. For most operations (LOAD, ADD, SUB, MUL, DIV, LDMQ), data is read from memory. For STORE operations, data is written to memory.

### IDLE/HALTED Phase
- **Address Bus**: ❌ IDLE
- **Data Bus**: ❌ IDLE
- **Control Bus**: ❌ IDLE

**What happens**: No execution in progress.

## Visual Indicators

### Active State
- Bright colored gradient (blue/green/amber)
- Pulsing animation
- Shimmer effect moving across the bus
- Status badge shows "ACTIVE"

### Idle State
- Dark gray color
- No animation
- Status badge shows "IDLE"

## Implementation Details

### Files Created
1. **`/src/components/buses/buses.tsx`** - Main bus visualization component
2. **`/src/lib/bus-activity.ts`** - Logic for determining bus activity
3. **`/src/index.css`** - Added shimmer animation

### How It Works

The `getBusActivity()` function in `bus-activity.ts` determines which buses should be active based on:
- Current execution phase (fetch/decode/execute)
- Current opcode (for execute phase specifics)

The Buses component receives this activity state and renders:
- Color-coded bus bars with animations
- Status badges (ACTIVE/IDLE)
- Descriptive text for each bus
- Current phase indicator

## Future Enhancements

Possible improvements:
- Show actual data values flowing on the buses
- Directional arrows indicating data flow direction
- Timing diagrams showing bus activity over time
- Detailed tooltips explaining what's on each bus
- Bus contention visualization for advanced scenarios
