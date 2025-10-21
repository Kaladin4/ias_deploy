import i18n from "i18next"
import { initReactI18next } from "react-i18next"

export const SUPPORTED_LANGUAGES = ["en", "es"] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

const DEFAULT_LANGUAGE: SupportedLanguage = "en"

let initialLanguage: SupportedLanguage = DEFAULT_LANGUAGE

if (typeof window !== "undefined") {
  const storedLanguage = window.localStorage.getItem("ias-language") as SupportedLanguage | null
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    initialLanguage = storedLanguage
  }
}

const resources = {
  en: {
    translation: {
      app: {
        tabs: {
          ias: "IAS",
          settings: "Settings",
          about: "About",
        },
        title: "IAS Computer Simulator",
        description:
          "Configure the IAS memory and registers, then step through the execution to observe how instructions move through the machine.",
      },
      executionControls: {
        title: "Execution Controls",
        description:
          "Begin the fetch-decode-execute simulation. Visualization steps will appear here in upcoming iterations.",
        buttons: {
          loadSample: "Load Sample Program",
          loadCSV: "Load CSV",
          step: "Step",
          run: "Run",
          stop: "Stop",
          reset: "Reset",
          triggerInterrupt: "Trigger Interrupt",
        },
        tooltip: {
          needsMemory: "Load a program or add memory content first",
          halted: "Execution halted",
        },
        info: {
          phase: "Phase",
          status: "Status",
          statusValue: {
            running: "Running",
            idle: "Idle",
            stepping: "Stepping",
          },
          pending: "Pending",
          resolved: "Resolved",
        },
      },
      executionPhases: {
        fetch: "Fetch",
        decode: "Decode",
        execute: "Execute",
        idle: "Idle",
        halted: "Halted",
      },
      executionStatus: {
        running: "Running",
        idle: "Idle",
        stepping: "Stepping",
      },
      executionSpeed: {
        title: "Execution Speed",
        description: "Adjust the delay between automatic execution steps.",
        sliderLabel: "Execution speed",
        delay: "{{seconds}}s delay",
        stepsPerSecond: "{{count}} steps/sec",
      },
      tips: {
        title: "Tips",
        description: "Helpful notes for configuring memory, interrupts, and logs.",
        items: [
          "Load the sample program to populate memory addresses required for the interrupt handler (1001–1003).",
          "Triggered interrupts are queued during the fetch phase and processed sequentially to preserve program flow.",
          "Execution logs persist until you reset the simulation. Use the download button in the IAS tab to archive them.",
        ],
      },
      language: {
        title: "Language",
        description: "Toggle the interface language.",
        options: {
          en: "English",
          es: "Español",
        },
      },
      about: {
        title: "About this project",
        description:
          "This simulator models a one-instruction-per-word IAS computer variant designed as an exercise for the Computer Architecture course at CUJAE.",
        howItWorks: {
          title: "How the simulator works",
          description:
            "Load a sample program or import a CSV to populate memory, then use the execution controls to advance through the fetch, decode, and execute phases while observing register updates, bus activity, and log messages in real time.",
        },
        designChoices: {
          title: "Why there is no IBR",
          description:
            "The classic IAS required an Instruction Buffer Register to hold the second instruction stored within the same 40-bit word. This exercise uses a one-instruction-per-word encoding, so each fetch delivers a complete instruction and the IBR is unnecessary, simplifying the datapath for educational clarity.",
        },
      },
      memory: {
        title: "Memory",
        description:
          "1000-word main memory. Enter instructions or data as {{wordWidth}}-bit binary words.",
        headers: {
          address: "Address",
          contents: "Contents ({{wordWidth}} bits)",
        },
      },
      cpu: {
        description: "Registers that orchestrate IAS fetch, decode, and execute.",
      },
      record: {
        bits: "{{count}} bits",
        binary: "Binary",
        ariaLabel: "{{label}} register value",
      },
      alu: {
        description: "Arithmetic Logic Unit",
      },
      operationsTable: {
        title: "ISA Ops",
        description: "Minimal IAS instruction set available in this simulator.",
        headers: {
          opcode: "Opcode",
          mnemonic: "Mnemonic",
        },
        operations: {
          load: "Load variants",
          mul: "AC,MQ ← AC × Mem(X)",
          div: "AC ← AC ÷ Mem(X); MQ ← AC % Mem(X)",
          ldmq: "MQ ← Mem(X)",
          add: "AC ← AC + Mem(X)",
          store: "Mem(X) ← AC",
          sub: "AC ← AC - Mem(X)",
        },
      },
      terminal: {
        title: "Execution Log",
        entries: "{{count}} entries",
        download: "Download",
      },
      buses: {
        title: "System Buses",
        description: "Visual representation of active data transfer pathways",
        labels: {
          address: "Address Bus",
          data: "Data Bus",
          control: "Control Bus",
        },
        status: {
          active: "ACTIVE",
          idle: "IDLE",
        },
        details: {
          address: "Carries memory addresses (10 bits)",
          data: "Transfers data and instructions (13 bits)",
          control: "Signals for read/write operations",
        },
        phase: "Current Phase:",
        phaseValues: {
          fetch: "Fetch",
          decode: "Decode",
          execute: "Execute",
          idle: "Idle",
          halted: "Halted",
        },
      },
      wireArchitecture: {
        address: "Address Bus",
        data: "Data Bus",
        control: "Control Bus",
      },
      logs: {
        sampleLoaded: "Sample program loaded into memory",
        csvLoaded: "CSV program loaded: {{count}} instructions from {{filename}}",
        csvError: "CSV Error{{line}}: {{error}}",
        interruptTriggered: "Interrupt {{id}} triggered",
        interruptHandled:
          "INTERRUPT {{id}}: Saved PC={{pc}} to memory[1001], executed instruction at memory[1002], counter at memory[1003] = {{counter}}",
        programCompleted: "Program completed. Total interruptions resolved: {{count}}",
      },
      execution: {
        logs: {
          fetch: {
            step1: "FETCH: PC contains {{pc}} (address {{address}})",
            step2: "  → Address {{address}} placed on address bus via MAR={{mar}}",
            step3: "  → Memory[{{address}}] accessed, instruction {{instruction}} retrieved",
            step4: "  → Instruction {{mbr}} loaded into MBR",
          },
          decode: {
            step1: "DECODE: Reading instruction from MBR={{mbr}}",
            step2: "  → Parsing instruction: opcode={{opcode}}, operand address={{address}}",
            step3: "  → Opcode {{ir}} loaded into IR",
            step4: "  → Operand address {{mar}} (decimal {{addressDec}}) loaded into MAR",
          },
          load: {
            step1: "LOAD: MAR set to {{mar}} (address {{addressDec}})",
            step2: "  → Reading from memory[{{addressDec}}]",
            step3: "  → Value {{value}} loaded into MBR={{mbr}}",
            step4: "  → MBR transferred to AC={{ac}}",
          },
          mul: {
            step1: "MUL: AC={{ac}} contains value {{acValue}}",
            step2: "  → Reading Memory[{{addressDec}}] = {{memValue}}",
            step3: "  → Computing {{acValue}} × {{memValue}} = {{result}}",
            step4: "  → Lower 13 bits ({{resultLow}}) stored in AC={{ac}}",
            step5: "  → Upper bits ({{resultHigh}}) stored in MQ={{mq}}",
          },
          div: {
            step1: "DIV: AC={{ac}} contains value {{acValue}}",
            step2: "  → Reading Memory[{{addressDec}}] = {{memValue}}",
            step3: "  → Computing {{acValue}} ÷ {{memValue}} = {{quotient}} R {{remainder}}",
            step4: "  → Quotient {{quotient}} stored in AC={{ac}}",
            step5: "  → Remainder {{remainder}} stored in MQ={{mq}}",
          },
          divideByZero: "DIV: Division by zero error",
          ldmq: {
            step1: "LDMQ: MAR set to {{mar}} (address {{addressDec}})",
            step2: "  → Reading from memory[{{addressDec}}]",
            step3: "  → Value {{value}} loaded into MBR={{mbr}}",
            step4: "  → MBR transferred to MQ={{mq}}",
          },
          add: {
            step1: "ADD: AC={{ac}} contains value {{acValue}}",
            step2: "  → Reading Memory[{{addressDec}}] = {{memValue}}",
            step3: "  → Computing {{acValue}} + {{memValue}} = {{result}}",
            step4: "  → Result {{result}} stored in AC={{ac}}",
          },
          store: {
            step1: "STORE: MAR set to {{mar}} (address {{addressDec}})",
            step2: "  → Reading AC={{ac}}",
            step3: "  → AC value transferred to MBR={{mbr}}",
            step4: "  → MBR written to Memory[{{addressDec}}]={{value}}",
          },
          sub: {
            step1: "SUB: AC={{ac}} contains value {{acValue}}",
            step2: "  → Reading Memory[{{addressDec}}] = {{memValue}}",
            step3: "  → Computing {{acValue}} - {{memValue}} = {{result}}",
            step4: "  → Result {{result}} stored in AC={{ac}}",
          },
          unknown: "UNKNOWN OPCODE: {{opcode}}",
          starting: "Starting execution...",
          halted: "Execution halted",
          pcIncrement: "  → PC incremented to {{pc}} (address {{nextPC}})",
        },
      },
    },
  },
  es: {
    translation: {
      app: {
        tabs: {
          ias: "IAS",
          settings: "Configuración",
          about: "Acerca de",
        },
        title: "Simulador de la Computadora IAS",
        description:
          "Configura la memoria y los registros de la IAS y da pasos por la ejecución para observar cómo las instrucciones se mueven por la máquina.",
      },
      executionControls: {
        title: "Controles de Ejecución",
        description:
          "Inicia la simulación de búsqueda-decodificación-ejecución. Los pasos de visualización aparecerán aquí en iteraciones futuras.",
        buttons: {
          loadSample: "Cargar programa de ejemplo",
          loadCSV: "Cargar CSV",
          step: "Paso",
          run: "Ejecutar",
          stop: "Detener",
          reset: "Restablecer",
          triggerInterrupt: "Disparar interrupción",
        },
        tooltip: {
          needsMemory: "Carga un programa o agrega contenido a la memoria primero",
          halted: "Ejecución detenida",
        },
        info: {
          phase: "Fase",
          status: "Estado",
          statusValue: {
            running: "En ejecución",
            idle: "Inactiva",
            stepping: "Paso a paso",
          },
          pending: "Pendientes",
          resolved: "Resueltas",
        },
      },
      executionPhases: {
        fetch: "Búsqueda",
        decode: "Decodificación",
        execute: "Ejecución",
        idle: "Inactiva",
        halted: "Detenida",
      },
      executionStatus: {
        running: "En ejecución",
        idle: "Inactiva",
        stepping: "Paso a paso",
      },
      executionSpeed: {
        title: "Velocidad de Ejecución",
        description: "Ajusta el intervalo entre los pasos automáticos de ejecución.",
        sliderLabel: "Velocidad de ejecución",
        delay: "{{seconds}}s de demora",
        stepsPerSecond: "{{count}} pasos/s",
      },
      tips: {
        title: "Consejos",
        description:
          "Notas útiles para configurar la memoria, las interrupciones y los registros.",
        items: [
          "Carga el programa de ejemplo para poblar las direcciones de memoria necesarias para el manejador de interrupciones (1001–1003).",
          "Las interrupciones activadas se encolan durante la fase de búsqueda y se procesan secuencialmente para preservar el flujo del programa.",
          "Los registros de ejecución persisten hasta que reinicies la simulación. Usa el botón de descarga en la pestaña IAS para archivarlos.",
        ],
      },
      language: {
        title: "Idioma",
        description: "Cambia el idioma de la interfaz.",
        options: {
          en: "Inglés",
          es: "Español",
        },
      },
      about: {
        title: "Acerca de este proyecto",
        description:
          "Esta simulación representa una variante de la computadora IAS de una instrucción por palabra, diseñada como un ejercicio para la asignatura Arquitectura de Computadoras de la CUJAE.",
        howItWorks: {
          title: "Cómo funciona el simulador",
          description:
            "Carga el programa de ejemplo o importa un CSV para poblar la memoria y luego utiliza los controles de ejecución para avanzar por las fases de búsqueda, decodificación y ejecución mientras observas en tiempo real los registros, la actividad de los buses y el registro de eventos.",
        },
        designChoices: {
          title: "Por qué no hay IBR",
          description:
            "La IAS clásica necesitaba un Instruction Buffer Register para retener la segunda instrucción almacenada en la misma palabra de 40 bits. Esta práctica utiliza una codificación de una instrucción por palabra, de modo que cada búsqueda entrega una instrucción completa y el IBR deja de ser necesario, simplificando el camino de datos para resaltar los conceptos clave.",
        },
      },
      memory: {
        title: "Memoria",
        description:
          "Memoria principal de 1000 palabras. Ingresa instrucciones o datos como palabras binarias de {{wordWidth}} bits.",
        headers: {
          address: "Dirección",
          contents: "Contenido ({{wordWidth}} bits)",
        },
      },
      cpu: {
        description: "Registros que orquestan las fases de búsqueda, decodificación y ejecución de la IAS.",
      },
      record: {
        bits: "{{count}} bits",
        binary: "Binario",
        ariaLabel: "Valor del registro {{label}}",
      },
      alu: {
        description: "Unidad Aritmético Lógica",
      },
      operationsTable: {
        title: "Ops ISA",
        description:
          "Conjunto mínimo de instrucciones IAS disponible en este simulador.",
        headers: {
          opcode: "Código",
          mnemonic: "Nemónico",
        },
        operations: {
          load: "Variantes de carga",
          mul: "AC,MQ ← AC × Mem(X)",
          div: "AC ← AC ÷ Mem(X); MQ ← AC % Mem(X)",
          ldmq: "MQ ← Mem(X)",
          add: "AC ← AC + Mem(X)",
          store: "Mem(X) ← AC",
          sub: "AC ← AC - Mem(X)",
        },
      },
      terminal: {
        title: "Registro de ejecución",
        entries: "{{count}} entradas",
        download: "Descargar",
      },
      buses: {
        title: "Buses del sistema",
        description: "Representación visual de las rutas activas de transferencia de datos",
        labels: {
          address: "Bus de direcciones",
          data: "Bus de datos",
          control: "Bus de control",
        },
        status: {
          active: "ACTIVO",
          idle: "INACTIVO",
        },
        details: {
          address: "Transporta direcciones de memoria (10 bits)",
          data: "Transfiere datos e instrucciones (13 bits)",
          control: "Señales para operaciones de lectura/escritura",
        },
        phase: "Fase actual:",
        phaseValues: {
          fetch: "Búsqueda",
          decode: "Decodificación",
          execute: "Ejecución",
          idle: "Inactiva",
          halted: "Detenida",
        },
      },
      wireArchitecture: {
        address: "Bus de direcciones",
        data: "Bus de datos",
        control: "Bus de control",
      },
      logs: {
        sampleLoaded: "Programa de ejemplo cargado en memoria",
        csvLoaded: "Programa CSV cargado: {{count}} instrucciones de {{filename}}",
        csvError: "Error CSV{{line}}: {{error}}",
        interruptTriggered: "Interrupción {{id}} activada",
        interruptHandled:
          "INTERRUPCIÓN {{id}}: PC={{pc}} guardado en memoria[1001], instrucción ejecutada en memoria[1002], contador en memoria[1003] = {{counter}}",
        programCompleted:
          "Programa completado. Total de interrupciones resueltas: {{count}}",
      },
      execution: {
        logs: {
          fetch: {
            step1: "BUSCA: PC contiene {{pc}} (dirección {{address}})",
            step2: "  → Dirección {{address}} colocada en bus de direcciones vía MAR={{mar}}",
            step3: "  → Memoria[{{address}}] accedida, instrucción {{instruction}} recuperada",
            step4: "  → Instrucción {{mbr}} cargada en MBR",
          },
          decode: {
            step1: "DECODE: Leyendo instrucción desde MBR={{mbr}}",
            step2: "  → Analizando instrucción: opcode={{opcode}}, dirección operando={{address}}",
            step3: "  → Opcode {{ir}} cargado en IR",
            step4: "  → Dirección operando {{mar}} (decimal {{addressDec}}) cargada en MAR",
          },
          load: {
            step1: "LOAD: MAR establecido a {{mar}} (dirección {{addressDec}})",
            step2: "  → Leyendo desde memoria[{{addressDec}}]",
            step3: "  → Valor {{value}} cargado en MBR={{mbr}}",
            step4: "  → MBR transferido a AC={{ac}}",
          },
          mul: {
            step1: "MUL: AC={{ac}} contiene valor {{acValue}}",
            step2: "  → Leyendo Memoria[{{addressDec}}] = {{memValue}}",
            step3: "  → Calculando {{acValue}} × {{memValue}} = {{result}}",
            step4: "  → 13 bits inferiores ({{resultLow}}) almacenados en AC={{ac}}",
            step5: "  → Bits superiores ({{resultHigh}}) almacenados en MQ={{mq}}",
          },
          div: {
            step1: "DIV: AC={{ac}} contiene valor {{acValue}}",
            step2: "  → Leyendo Memoria[{{addressDec}}] = {{memValue}}",
            step3: "  → Calculando {{acValue}} ÷ {{memValue}} = {{quotient}} R {{remainder}}",
            step4: "  → Cociente {{quotient}} almacenado en AC={{ac}}",
            step5: "  → Residuo {{remainder}} almacenado en MQ={{mq}}",
          },
          divideByZero: "DIV: Error de división por cero",
          ldmq: {
            step1: "LDMQ: MAR establecido a {{mar}} (dirección {{addressDec}})",
            step2: "  → Leyendo desde memoria[{{addressDec}}]",
            step3: "  → Valor {{value}} cargado en MBR={{mbr}}",
            step4: "  → MBR transferido a MQ={{mq}}",
          },
          add: {
            step1: "ADD: AC={{ac}} contiene valor {{acValue}}",
            step2: "  → Leyendo Memoria[{{addressDec}}] = {{memValue}}",
            step3: "  → Calculando {{acValue}} + {{memValue}} = {{result}}",
            step4: "  → Resultado {{result}} almacenado en AC={{ac}}",
          },
          store: {
            step1: "STORE: MAR establecido a {{mar}} (dirección {{addressDec}})",
            step2: "  → Leyendo AC={{ac}}",
            step3: "  → Valor de AC transferido a MBR={{mbr}}",
            step4: "  → MBR escrito en Memoria[{{addressDec}}]={{value}}",
          },
          sub: {
            step1: "SUB: AC={{ac}} contiene valor {{acValue}}",
            step2: "  → Leyendo Memoria[{{addressDec}}] = {{memValue}}",
            step3: "  → Calculando {{acValue}} - {{memValue}} = {{result}}",
            step4: "  → Resultado {{result}} almacenado en AC={{ac}}",
          },
          unknown: "OPCODE DESCONOCIDO: {{opcode}}",
          starting: "Iniciando ejecución...",
          halted: "Ejecución detenida",
          pcIncrement: "  → PC incrementado a {{pc}} (dirección {{nextPC}})",
        },
      },
    },
  },
} as const

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
})

if (typeof window !== "undefined") {
  i18n.on("languageChanged", (language) => {
    const normalized = (language?.split?.("-")?.[0] ?? DEFAULT_LANGUAGE) as SupportedLanguage
    if (SUPPORTED_LANGUAGES.includes(normalized)) {
      window.localStorage.setItem("ias-language", normalized)
    }
  })
}

export default i18n
