# IAS Computer Simulator

An interactive web-based simulator for the **IAS (Institute for Advanced Study) Computer**, one of the first stored-program computers designed by John von Neumann in the 1940s. This educational tool provides a detailed, step-by-step visualization of how the IAS architecture executes machine code instructions.

![IAS Computer Simulator](https://img.shields.io/badge/React-19.1.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.14-cyan)

## 🎯 Features

### Core Functionality
- **Step-by-Step Execution**: Execute programs one micro-step at a time to understand each operation
- **Automatic Execution**: Run programs continuously with adjustable speed
- **Real-Time Visualization**: Watch data flow through buses and registers with visual highlighting
- **Bus Activity Monitoring**: See when Address, Data, and Control buses are active
- **ALU Visualization**: The Arithmetic Logic Unit glows when performing computations

### Architecture Components
- **CPU Registers**: PC, MAR, MBR, IR, AC, MQ with real-time updates
- **Memory**: 1000-word memory with 13-bit word width
- **System Buses**: Visual representation of Address, Data, and Control buses
- **Execution Phases**: Fetch, Decode, Execute cycle visualization

### Supported Instructions
- **LOAD** (001): Load value from memory into accumulator
- **STORE** (111): Store accumulator value to memory
- **ADD** (110): Add memory value to accumulator
- **SUB** (000): Subtract memory value from accumulator
- **MUL** (010): Multiply accumulator by memory value
- **DIV** (011): Divide accumulator by memory value
- **LDMQ** (100): Load MQ register from memory

### Additional Features
- **Bilingual Support**: Full English and Spanish translations
- **CSV Import**: Load programs from CSV files
- **Sample Programs**: Pre-loaded example programs
- **Execution Log**: Detailed terminal output with color-coded operations
- **Log Export**: Download execution logs as text files
- **Interrupt System**: Simulate hardware interrupts during execution

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kaladin4/ias_deploy.git
   cd ias
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📖 How to Use

### Loading a Program

**Option 1: Sample Program**
1. Click "Load Sample Program" button
2. The default multiplication program will be loaded into memory

**Option 2: CSV Import**
1. Prepare a CSV file with format: `address,instruction`
2. Click "Load from CSV"
3. Select your CSV file

**Option 3: Manual Entry**
1. Click on any memory cell
2. Enter a 13-bit binary instruction
3. Format: `[3-bit opcode][10-bit address]`

### Running the Program

**Step-by-Step Execution**
1. Click "Step" to execute one micro-step at a time
2. Watch registers highlight as they're updated
3. Observe bus activity in real-time
4. Read detailed logs in the terminal

**Automatic Execution**
1. Click "Start" to run continuously
2. Adjust execution speed in Settings tab
3. Click "Stop" to pause
4. Click "Reset" to clear and start over

### Understanding the Display

**Register Highlighting**
- **Yellow glow**: Register is currently being updated
- **No highlight**: Register is idle

**Bus Activity**
- **Green**: Bus is active and transferring data
- **Gray**: Bus is inactive

**ALU Status**
- **Glowing**: Performing arithmetic/logic operation
- **Dim**: Idle

**Terminal Colors**
- **Blue**: FETCH phase operations
- **Yellow**: DECODE phase operations
- **Green**: Instruction execution (LOAD, ADD, etc.)
- **Cyan**: Completion messages
- **Purple**: Interrupt handling

## 🏗️ Architecture Overview

### IAS Computer Specifications
- **Word Size**: 13 bits (3-bit opcode + 10-bit address)
- **Memory**: 1000 words
- **Registers**:
  - **PC** (Program Counter): 10 bits - Points to next instruction
  - **MAR** (Memory Address Register): 10 bits - Holds memory address
  - **MBR** (Memory Buffer Register): 13 bits - Holds data from/to memory
  - **IR** (Instruction Register): 3 bits - Holds current opcode
  - **AC** (Accumulator): 13 bits - Main arithmetic register
  - **MQ** (Multiplier-Quotient): 13 bits - Auxiliary register for MUL/DIV

### Execution Cycle

**1. FETCH Phase**
- PC → MAR (internal transfer, no buses)
- Memory[MAR] → MBR (all 3 buses active)

**2. DECODE Phase**
- MBR → IR (extract opcode, internal operation)
- MBR → MAR (extract address, internal operation)

**3. EXECUTE Phase**
- Varies by instruction
- Memory operations use all 3 buses
- ALU operations activate when AC/MQ is updated

### Bus System

**Address Bus**
- Carries memory addresses from MAR to memory
- Active during memory read/write operations

**Data Bus**
- Transfers data between memory and MBR
- Bidirectional (read and write)

**Control Bus**
- Carries control signals (READ/WRITE)
- Coordinates memory operations

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1**: UI framework
- **TypeScript 5.9.3**: Type-safe development
- **Vite 7.1.7**: Build tool and dev server
- **TailwindCSS 3.4.14**: Utility-first CSS framework

### UI Components
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Beautiful, customizable components
- **Lucide React**: Icon library
- **class-variance-authority**: Component variants

### Internationalization
- **i18next**: Translation framework
- **react-i18next**: React bindings for i18next

## 📁 Project Structure

```
ias/
├── src/
│   ├── components/          # React components
│   │   ├── cpu/            # CPU and register components
│   │   ├── memory/         # Memory display component
│   │   ├── terminal/       # Execution log terminal
│   │   ├── wire-architecture/ # Bus visualization
│   │   ├── execution-controls/ # Control buttons
│   │   ├── operations-table/   # Instruction reference
│   │   └── ui/             # Reusable UI components
│   ├── lib/                # Core logic
│   │   ├── execution.ts    # Instruction execution engine
│   │   ├── bus-activity.ts # Bus activity logic
│   │   ├── i18n.ts         # Translations
│   │   └── utils.ts        # Helper functions
│   ├── data/               # Sample programs
│   ├── App.tsx             # Main application
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── package.json            # Dependencies
```

## 🎓 Educational Use

This simulator is designed for:
- **Computer Architecture Courses**: Visualize von Neumann architecture
- **Assembly Language Learning**: Understand low-level programming
- **Historical Computing**: Explore early computer design
- **Self-Study**: Interactive learning tool for computer science students

### Learning Objectives
- Understand the fetch-decode-execute cycle
- Learn how registers and buses work together
- Visualize data flow in a stored-program computer
- Grasp the relationship between hardware and software
- Explore the foundations of modern computing

## 🌐 Language Support

The simulator supports:
- **English** (en)
- **Spanish** (es)

Switch languages in the Settings tab.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain existing code style
3. Add comments for complex logic
4. Test thoroughly before submitting
5. Update documentation as needed

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

- **John von Neumann**: For designing the IAS computer architecture
- **Institute**: To the Cujae and the profesor Joaquin Pina
## 📧 Contact

For questions, suggestions, or issues, please open an issue on GitHub.

---

**Built with ❤️ for computer science education**
