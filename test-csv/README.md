# CSV Test Files for IAS Simulator

This directory contains test CSV files to validate the CSV upload feature.

## Valid Test Files

### 01-basic-load-add-store.csv
**Purpose**: Basic arithmetic operations  
**Program**: 
- LOAD value 10 from address 5
- ADD value 20 from address 6
- STORE result (30) to address 7

**Expected Result**: AC = 30, Memory[7] = 30

---

### 02-multiplication.csv
**Purpose**: Test multiplication operation  
**Program**:
- LOAD 5 into AC (from address 10)
- LOAD 3 into MQ (from address 11)
- MUL AC × Memory[11] (5 × 3 = 15)
- STORE result to address 12

**Expected Result**: AC = 15, Memory[12] = 15

---

### 03-division.csv
**Purpose**: Test division operation  
**Program**:
- LOAD 40 into AC (from address 10)
- DIV AC ÷ Memory[11] (40 ÷ 5 = 8 R 0)
- STORE quotient to address 12
- STORE remainder (MQ) to address 13

**Expected Result**: AC = 8, MQ = 0, Memory[12] = 8

---

### 04-subtraction.csv
**Purpose**: Test subtraction operation  
**Program**:
- LOAD 100 into AC (from address 5)
- SUB 20 from AC (from address 6)
- STORE result (80) to address 7

**Expected Result**: AC = 80, Memory[7] = 80

---

### 05-max-address-999.csv
**Purpose**: Test maximum allowed address (999)  
**Program**:
- Uses addresses at the boundary (997, 998, 999)
- Verifies that address 999 is accepted (1000+ are reserved)

**Expected Result**: Program loads successfully

---

### 06-no-header.csv
**Purpose**: Test CSV without header row  
**Program**: Same as basic-load-add-store but without "Address,Value" header  
**Features**:
- Tests auto-detection of headerless CSV
- Tests automatic padding of short binary values

**Expected Result**: Program loads successfully, values padded to 13 bits

---

### 07-sparse-addresses.csv
**Purpose**: Test non-sequential memory addresses  
**Program**: Uses addresses 0, 10, 20, 30, 100, 200  
**Features**: Verifies that memory addresses don't need to be sequential

**Expected Result**: Program loads successfully with gaps in memory

---

## Error Test Files

These files should **fail** to load and display appropriate error messages:

### ERROR-invalid-address-1000.csv
**Error Type**: Address out of range  
**Expected Error**: "Invalid address at line 2: 1000. Must be between 0 and 999 (addresses 1000-1003 are reserved for interrupts)"

---

### ERROR-invalid-binary.csv
**Error Type**: Non-binary characters  
**Expected Error**: "Invalid binary value at line 2: '123456789ABCD'. Must contain only 0s and 1s"

---

### ERROR-too-long.csv
**Error Type**: Binary value exceeds 13 bits  
**Expected Error**: "Binary value too long at line 1: '00100000001011111' is 17 bits. Maximum is 13 bits"

---

### ERROR-invalid-format.csv
**Error Type**: Wrong number of columns  
**Expected Error**: "Invalid format at line 1. Expected: Address,Value"

---

### ERROR-negative-address.csv
**Error Type**: Negative address  
**Expected Error**: "Invalid address at line 1: -5. Must be between 0 and 999"

---

## Testing Instructions

1. **Valid Files**: Load each valid CSV file and verify:
   - File loads without errors
   - Execution log shows success message
   - Program can be executed with Step/Run buttons
   - Results match expected outcomes

2. **Error Files**: Load each error CSV file and verify:
   - File fails to load
   - Execution log shows appropriate error message
   - Error message includes line number (when applicable)
   - Memory is not modified

3. **Reserved Address Protection**: 
   - Verify that addresses 1000-1003 cannot be loaded via CSV
   - Verify that interrupt functionality still works after loading CSV programs
   - Load sample program to populate interrupt handlers (1001-1003)
   - Trigger interrupts during CSV program execution

## Test Checklist

- [ ] All valid files load successfully
- [ ] All error files fail with correct error messages
- [ ] Binary values are correctly padded to 13 bits
- [ ] Header row is correctly detected and skipped
- [ ] Headerless CSV files work correctly
- [ ] Sparse addresses work (non-sequential)
- [ ] Maximum address (999) is accepted
- [ ] Reserved addresses (1000-1003) are rejected
- [ ] Execution log shows filename and instruction count
- [ ] Same file can be loaded multiple times
- [ ] CSV loading resets PC to 0
- [ ] Interrupt handlers remain intact after CSV load
