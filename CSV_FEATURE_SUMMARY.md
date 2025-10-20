# CSV Upload Feature - Implementation Summary

## Overview
The IAS simulator now supports loading custom programs via CSV file upload. Users can create their own programs and execute them without modifying the codebase.

## Key Features

### ✅ CSV File Upload
- **Upload Button**: New "Load CSV" button in Execution Controls (with upload icon)
- **File Validation**: Comprehensive validation of CSV format and content
- **Error Reporting**: Detailed error messages with line numbers in execution log
- **Bilingual Support**: Full English and Spanish translations

### ✅ Address Protection
- **User Range**: Addresses 0-999 are available for user programs
- **Reserved Range**: Addresses 1000-1003 are protected for interrupt handling:
  - `1001`: Saved Program Counter
  - `1002`: Interrupt handler instruction
  - `1003`: Interrupt counter
- **Validation**: CSV parser rejects any attempt to write to reserved addresses

### ✅ Format Flexibility
- **Header Detection**: Automatically detects and skips header row
- **No Header Support**: Works with or without "Address,Value" header
- **Binary Padding**: Automatically pads binary values shorter than 13 bits
- **Sparse Addresses**: Supports non-sequential memory addresses

### ✅ Robust Error Handling
Validates and reports errors for:
- Invalid address range (must be 0-999)
- Non-numeric addresses
- Negative addresses
- Non-binary values (must contain only 0s and 1s)
- Binary values exceeding 13 bits
- Incorrect CSV format (must have exactly 2 columns)
- Empty files

## Files Modified

1. **`src/lib/csv-parser.ts`** (NEW)
   - CSV parsing logic
   - Validation rules
   - Error handling with line numbers

2. **`src/components/execution-controls/execution-controls.tsx`**
   - Added file input element
   - Added "Load CSV" button with Upload icon
   - File change handler

3. **`src/App.tsx`**
   - `handleLoadCSV` function
   - CSV file reading and parsing
   - Memory injection logic
   - Error logging

4. **`src/lib/i18n.ts`**
   - Added `loadCSV` button translation
   - Added `csvLoaded` success message
   - Added `csvError` error message
   - Both English and Spanish translations

## Test Files Created

### Valid Test Cases (7 files)
1. `01-basic-load-add-store.csv` - Basic arithmetic
2. `02-multiplication.csv` - MUL operation
3. `03-division.csv` - DIV operation
4. `04-subtraction.csv` - SUB operation
5. `05-max-address-999.csv` - Boundary testing
6. `06-no-header.csv` - Headerless CSV
7. `07-sparse-addresses.csv` - Non-sequential addresses

### Error Test Cases (5 files)
1. `ERROR-invalid-address-1000.csv` - Reserved address violation
2. `ERROR-invalid-binary.csv` - Non-binary characters
3. `ERROR-too-long.csv` - Exceeds 13 bits
4. `ERROR-invalid-format.csv` - Wrong column count
5. `ERROR-negative-address.csv` - Negative address

## Documentation Created

1. **`CSV_FORMAT.md`** - User guide for CSV format
2. **`sample-program.csv`** - Example CSV file
3. **`test-csv/README.md`** - Test file documentation
4. **`CSV_FEATURE_SUMMARY.md`** - This file

## Usage

1. Create a CSV file with two columns: Address, Value
2. Address must be 0-999 (1000-1003 are reserved)
3. Value must be a 13-bit binary string (or shorter, will be padded)
4. Click "Load CSV" button in Execution Controls
5. Select your CSV file
6. Check execution log for success/error messages
7. Execute program using Step/Run buttons

## Example CSV

```csv
Address,Value
0,0010000000101
1,1100000000110
2,1110000000111
5,0000000001010
6,0000000010100
7,0000000000000
```

## Backward Compatibility

- ✅ Sample program button still works
- ✅ Manual memory editing still works
- ✅ Interrupt handling (1000-1003) remains intact
- ✅ All existing features unchanged

## Linter Status

- ✅ `src/App.tsx` - No linter errors
- ✅ `src/lib/csv-parser.ts` - No linter errors
- ✅ `src/components/execution-controls/execution-controls.tsx` - No linter errors
- ⚠️ Pre-existing errors in `src/components/cpu/cpu.tsx` (unrelated to this feature)
