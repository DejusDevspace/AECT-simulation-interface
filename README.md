# Automotive Electric Circuit Trainer (AECT) Simulator

An interactive web-based simulation platform designed to teach automotive electrical systems and circuit behavior.

## Features

- **Dual Operation Modes**:
  - System Mode: Realistic vehicle behavior requiring ignition activation
  - Individual Circuit Mode: Independent testing of each electrical system

- **Electrical Systems Simulation**:
  - Ignition system with power distribution control
  - Lighting system (headlights, turn indicators, hazard lights, brake lights)
  - Windshield wiper system with multiple speed settings
  - Battery charging system with real-time level monitoring
  - Battery drain simulation when systems are active without charging

- **Interactive Visual Interface**:
  - Real-time circuit board visualization
  - Animated components (blinkers, wipers)
  - System status indicators

- **Educational Content**:
  - Built-in instructions and documentation
  - Practical exercises for learning objectives
  - Safety notes and best practices

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
```

## Usage

1. Select operation mode (System or Individual Circuit)
2. In System Mode, activate ignition to enable circuits
3. Explore each electrical system using the control panel
4. Observe real-time visual feedback on the circuit board
5. Complete practical exercises to reinforce learning

## Educational Purpose

This simulator is designed for engineering students at Bowen University and other institutions to learn about automotive electrical systems in a safe, controlled environment without requiring physical vehicle access.

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Lucide React (icons)

## License

Developed for educational purposes at Bowen University.
