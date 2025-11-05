import React, { useState, useEffect } from "react";
import {
  Power,
  Lightbulb,
  Zap,
  Battery,
  Droplets,
  BookOpen,
  AlertCircle,
  PlayCircle,
  Settings,
} from "lucide-react";

const AECTSimulator = () => {
  // Main system states
  const [ignitionOn, setIgnitionOn] = useState(false);
  const [mode, setMode] = useState("system"); // 'system' or 'individual'
  const [activeTab, setActiveTab] = useState("simulator");

  // Lighting system states
  const [headlights, setHeadlights] = useState("off"); // 'off', 'low', 'high'
  const [leftIndicator, setLeftIndicator] = useState(false);
  const [rightIndicator, setRightIndicator] = useState(false);
  const [brakeLight, setBrakeLight] = useState(false);
  const [hazardLights, setHazardLights] = useState(false);

  // Wiper system states
  const [wiperSpeed, setWiperSpeed] = useState("off"); // 'off', 'intermittent', 'low', 'high'
  const [wiperPosition, setWiperPosition] = useState(0);

  // Charging system states
  const [batteryLevel, setBatteryLevel] = useState(75);
  const [charging, setCharging] = useState(false);

  // Indicator blinking effect
  const [indicatorBlink, setIndicatorBlink] = useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIndicatorBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Wiper animation
  useEffect(() => {
    if (wiperSpeed === "off") return;

    const speeds = {
      intermittent: 2000,
      low: 1000,
      high: 500,
    };

    const interval = setInterval(() => {
      setWiperPosition((prev) => (prev + 1) % 100);
    }, speeds[wiperSpeed] / 100);

    return () => clearInterval(interval);
  }, [wiperSpeed]);

  // Charging simulation
  useEffect(() => {
    if (!charging || batteryLevel >= 100) return;

    const chargeInterval = setInterval(() => {
      setBatteryLevel((prev) => Math.min(prev + 0.5, 100));
    }, 1000);

    return () => clearInterval(chargeInterval);
  }, [charging, batteryLevel]);

  // Battery drain simulation
  useEffect(() => {
    const isAnySystemActive = headlights !== "off" || leftIndicator || rightIndicator || brakeLight || wiperSpeed !== "off" || hazardLights;
    if (charging || !isAnySystemActive || batteryLevel <= 0) return;

    const drainInterval = setInterval(() => {
      setBatteryLevel((prev) => Math.max(prev - 0.1, 0));
    }, 1000);

    return () => clearInterval(drainInterval);
  }, [charging, headlights, leftIndicator, rightIndicator, brakeLight, wiperSpeed, hazardLights, batteryLevel]);

  // System mode dependencies
  const canOperateSystem = (system) => {
    if (mode === "individual") return true;
    return ignitionOn;
  };

  const handleIgnitionToggle = () => {
    const newState = !ignitionOn;
    setIgnitionOn(newState);

    if (!newState && mode === "system") {
      // Turn off all systems when ignition is off in system mode
      setHeadlights("off");
      setLeftIndicator(false);
      setRightIndicator(false);
      setHazardLights(false);
      setWiperSpeed("off");
      setCharging(false);
    }
  };

  const handleHeadlightToggle = () => {
    if (!canOperateSystem("headlights")) return;

    const cycle = { off: "low", low: "high", high: "off" };
    setHeadlights((prev) => cycle[prev]);
  };

  const handleWiperToggle = () => {
    if (!canOperateSystem("wiper")) return;

    const cycle = {
      off: "intermittent",
      intermittent: "low",
      low: "high",
      high: "off",
    };
    setWiperSpeed((prev) => cycle[prev]);
  };

  const handleChargingToggle = () => {
    if (!canOperateSystem("charging")) return;
    setCharging((prev) => !prev);
  };

  const handleLeftIndicatorToggle = () => {
    if (!canOperateSystem("indicators") || hazardLights) return;
    const newState = !leftIndicator;
    setLeftIndicator(newState);
    if (newState) setRightIndicator(false);
  };

  const handleRightIndicatorToggle = () => {
    if (!canOperateSystem("indicators") || hazardLights) return;
    const newState = !rightIndicator;
    setRightIndicator(newState);
    if (newState) setLeftIndicator(false);
  };

  const handleHazardToggle = () => {
    if (!canOperateSystem("indicators")) return;
    const newState = !hazardLights;
    setHazardLights(newState);
    if (newState) {
      setLeftIndicator(true);
      setRightIndicator(true);
    } else {
      setLeftIndicator(false);
      setRightIndicator(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-cyan-400">
            Automotive Electric Circuit Trainer
          </h1>
          <p className="text-gray-400">Interactive Simulation Platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-gray-800/50 p-1 rounded-lg backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "simulator"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <PlayCircle className="inline mr-2" size={20} />
            Simulator
          </button>
          <button
            onClick={() => setActiveTab("instructions")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "instructions"
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            <BookOpen className="inline mr-2" size={20} />
            Instructions
          </button>
        </div>

        {activeTab === "simulator" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-4">
              {/* Mode Selection */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Settings className="mr-2" size={20} />
                  Operation Mode
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMode("system")}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      mode === "system"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    System Mode
                  </button>
                  <button
                    onClick={() => setMode("individual")}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      mode === "individual"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Individual Circuit Mode
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  {mode === "system"
                    ? "Circuits require ignition to be ON"
                    : "Test each circuit independently"}
                </p>
              </div>

              {/* Ignition Control */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Power className="mr-2" size={20} />
                  Ignition System
                </h3>
                <button
                  onClick={handleIgnitionToggle}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-all transform active:scale-95 ${
                    ignitionOn
                      ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/50"
                      : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/50"
                  }`}
                >
                  {ignitionOn ? "IGNITION ON" : "PUSH TO START"}
                </button>
              </div>

              {/* Lighting Controls */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Lightbulb className="mr-2" size={20} />
                  Lighting System
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleHeadlightToggle}
                    disabled={!canOperateSystem("headlights")}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      !canOperateSystem("headlights")
                        ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                        : headlights === "off"
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : headlights === "low"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg"
                        : "bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/50"
                    }`}
                  >
                    Headlights: {headlights.toUpperCase()}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleLeftIndicatorToggle}
                      disabled={!canOperateSystem("indicators") || hazardLights}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        !canOperateSystem("indicators") || hazardLights
                          ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                          : leftIndicator
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      ← Left
                    </button>
                    <button
                      onClick={handleRightIndicatorToggle}
                      disabled={!canOperateSystem("indicators") || hazardLights}
                      className={`py-3 rounded-lg font-medium transition-all ${
                        !canOperateSystem("indicators") || hazardLights
                          ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                          : rightIndicator
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-gray-700 hover:bg-gray-600 text-white"
                      }`}
                    >
                      Right →
                    </button>
                  </div>

                  <button
                    onClick={handleHazardToggle}
                    disabled={!canOperateSystem("indicators")}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      !canOperateSystem("indicators")
                        ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                        : hazardLights
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    Hazard Lights
                  </button>

                  <button
                    onClick={() =>
                      canOperateSystem("brake") && setBrakeLight(!brakeLight)
                    }
                    disabled={!canOperateSystem("brake")}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      !canOperateSystem("brake")
                        ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                        : brakeLight
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    Brake Light
                  </button>
                </div>
              </div>

              {/* Wiper Controls */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Droplets className="mr-2" size={20} />
                  Wiper System
                </h3>
                <button
                  onClick={handleWiperToggle}
                  disabled={!canOperateSystem("wiper")}
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    !canOperateSystem("wiper")
                      ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                      : wiperSpeed === "off"
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  }`}
                >
                  Speed: {wiperSpeed.toUpperCase()}
                </button>
              </div>

              {/* Charging Controls */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Battery className="mr-2" size={20} />
                  Charging System
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={handleChargingToggle}
                    disabled={!canOperateSystem("charging")}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      !canOperateSystem("charging")
                        ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                        : charging
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {charging ? "Charging Active" : "Start Charging"}
                  </button>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Battery Level</span>
                      <span className="font-bold">
                        {batteryLevel.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          batteryLevel > 75
                            ? "bg-green-500"
                            : batteryLevel > 50
                            ? "bg-yellow-500"
                            : batteryLevel > 25
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${batteryLevel}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Circuit Board */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 h-full">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Zap className="mr-2" size={24} />
                  Circuit Visualization
                </h3>

                {/* Circuit Board Display */}
                <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-lg p-8 border-2 border-gray-700 min-h-[600px] relative">
                  {/* Headlights */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-8">
                    <div className="text-center">
                      <div
                        className={`w-20 h-20 rounded-lg border-4 transition-all ${
                          headlights === "high"
                            ? "bg-yellow-300 border-yellow-400 shadow-2xl shadow-yellow-400/80"
                            : headlights === "low"
                            ? "bg-yellow-500 border-yellow-600 shadow-xl shadow-yellow-500/60"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      >
                        <Lightbulb className="w-full h-full p-4" />
                      </div>
                      <p className="text-xs mt-2 text-gray-400">
                        Left Headlight
                      </p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-20 h-20 rounded-lg border-4 transition-all ${
                          headlights === "high"
                            ? "bg-yellow-300 border-yellow-400 shadow-2xl shadow-yellow-400/80"
                            : headlights === "low"
                            ? "bg-yellow-500 border-yellow-600 shadow-xl shadow-yellow-500/60"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      >
                        <Lightbulb className="w-full h-full p-4" />
                      </div>
                      <p className="text-xs mt-2 text-gray-400">
                        Right Headlight
                      </p>
                    </div>
                  </div>

                  {/* Turn Indicators - Front */}
                  <div className="absolute top-32 left-8">
                    <div
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        leftIndicator && indicatorBlink
                          ? "bg-orange-500 border-orange-600 shadow-xl shadow-orange-500/80"
                          : "bg-gray-700 border-gray-600"
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-400 text-center">L</p>
                  </div>

                  <div className="absolute top-32 right-8">
                    <div
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        rightIndicator && indicatorBlink
                          ? "bg-orange-500 border-orange-600 shadow-xl shadow-orange-500/80"
                          : "bg-gray-700 border-gray-600"
                      }`}
                    />
                    <p className="text-xs mt-1 text-gray-400 text-center">R</p>
                  </div>

                  {/* Wiper Display */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-48 h-32 bg-blue-900/30 rounded-lg border-2 border-blue-700/50 overflow-hidden">
                      <div
                        className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-400 origin-bottom transition-transform duration-100"
                        style={{
                          transform: `translateX(-50%) rotate(${
                            -45 + wiperPosition * 0.9
                          }deg)`,
                          opacity: wiperSpeed === "off" ? 0.3 : 1,
                        }}
                      />
                      <p className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                        Wiper: {wiperSpeed.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Taillights and Indicators - Rear */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8">
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 rounded-lg border-4 transition-all ${
                          brakeLight
                            ? "bg-red-500 border-red-600 shadow-xl shadow-red-500/80"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      />
                      <div
                        className={`w-12 h-12 rounded-full border-4 transition-all mt-2 ${
                          leftIndicator && indicatorBlink
                            ? "bg-orange-500 border-orange-600 shadow-xl shadow-orange-500/80"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      />
                      <p className="text-xs mt-2 text-gray-400">Left Rear</p>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-16 h-16 rounded-lg border-4 transition-all ${
                          brakeLight
                            ? "bg-red-500 border-red-600 shadow-xl shadow-red-500/80"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      />
                      <div
                        className={`w-12 h-12 rounded-full border-4 transition-all mt-2 ${
                          rightIndicator && indicatorBlink
                            ? "bg-orange-500 border-orange-600 shadow-xl shadow-orange-500/80"
                            : "bg-gray-700 border-gray-600"
                        }`}
                      />
                      <p className="text-xs mt-2 text-gray-400">Right Rear</p>
                    </div>
                  </div>

                  {/* System Status Indicator */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        ignitionOn
                          ? "bg-green-600/20 border border-green-600"
                          : "bg-red-600/20 border border-red-600"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          ignitionOn ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-medium">
                        {ignitionOn ? "System Active" : "System Off"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Instructions Tab */
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-6">
              Instructions & Documentation
            </h2>

            <div className="space-y-8">
              {/* Overview */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Overview
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  The Automotive Electric Circuit Trainer (AECT) is an
                  interactive simulation platform designed to teach automotive
                  electrical systems. This simulator allows you to explore and
                  understand how various electrical circuits in modern vehicles
                  operate, including lighting, ignition, wiper, and charging
                  systems.
                </p>
              </section>

              {/* Operation Modes */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Operation Modes
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">
                      System Mode
                    </h4>
                    <p className="text-gray-300">
                      Simulates real-world vehicle behavior. All electrical
                      systems require the ignition to be ON before they can
                      operate. This mode demonstrates circuit dependencies and
                      power management in actual vehicles.
                    </p>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-400 mb-2">
                      Individual Circuit Mode
                    </h4>
                    <p className="text-gray-300">
                      Allows independent testing of each circuit without
                      ignition requirements. Perfect for focused learning and
                      understanding individual system behaviors without
                      dependencies.
                    </p>
                  </div>
                </div>
              </section>

              {/* Circuit Systems */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Circuit Systems
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <Power className="mr-2" size={18} />
                      Ignition System
                    </h4>
                    <p className="text-gray-300 mb-2">
                      The ignition system controls power distribution to all
                      other electrical systems. In system mode, it must be
                      activated before any other circuits can operate.
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Exercise:</strong> Toggle the ignition and observe
                      how it affects other systems in System Mode vs Individual
                      Circuit Mode.
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <Lightbulb className="mr-2" size={18} />
                      Lighting System
                    </h4>
                    <p className="text-gray-300 mb-2">
                    Controls headlights (low/high beam), turn indicators, hazard lights, and
                    brake lights. Headlights cycle through OFF → LOW BEAM →
                    HIGH BEAM. Turn indicators are mutually exclusive (only one direction at a time) and flash at 500ms intervals.
                    Hazard lights make both turn signals blink together for emergency situations.
                    </p>
                    <p className="text-sm text-gray-400">
                    <strong>Exercise:</strong> Activate headlights and cycle
                    through beam settings. Test turn indicators (note only one direction can be active) and hazard lights. Observe
                    the blinking patterns. Press the brake light button to
                    simulate braking.
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <Droplets className="mr-2" size={18} />
                      Wiper System
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Simulates windshield wiper operation with four speed
                      settings: OFF, INTERMITTENT (slow sweep), LOW (moderate
                      speed), and HIGH (fast sweep). The wiper blade animation
                      speed increases with each setting.
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Exercise:</strong> Cycle through all wiper speeds
                      and observe the animation speed changes. Note how
                      intermittent mode provides periodic wiping for light rain
                      conditions.
                    </p>
                  </div>

                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-400 mb-2 flex items-center">
                      <Battery className="mr-2" size={18} />
                      Charging System
                    </h4>
                    <p className="text-gray-300 mb-2">
                      Demonstrates how the alternator charges the battery while
                      the engine runs. When activated, the battery level
                      increases at 0.5% per second, simulating the charging
                      process. The battery indicator changes color based on
                      charge level.
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Exercise:</strong> Activate charging and monitor
                      the battery level increase. Observe the color changes: Red
                      (&lt;25%), Orange (25-50%), Yellow (50-75%), Green
                      (&gt;75%).
                    </p>
                  </div>
                </div>
              </section>

              {/* Practical Exercises */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Practical Exercises
                </h3>

                <div className="space-y-3">
                  <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Exercise 1: Starting Sequence
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                      <li>Ensure you're in System Mode</li>
                      <li>Attempt to turn on headlights (should not work)</li>
                      <li>Activate ignition by pressing "PUSH TO START"</li>
                      <li>Now turn on headlights (should work)</li>
                      <li>
                        Observe how system dependencies work in real vehicles
                      </li>
                    </ol>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Exercise 2: Night Driving Simulation
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                      <li>Turn on ignition</li>
                      <li>Activate headlights (low beam)</li>
                      <li>Switch to high beam for better visibility</li>
                      <li>Activate left turn indicator to simulate turning</li>
                      <li>Press brake light to simulate slowing down</li>
                      <li>Deactivate turn indicator after "turn"</li>
                    </ol>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Exercise 3: Individual Circuit Testing
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                      <li>Switch to Individual Circuit Mode</li>
                      <li>Test each circuit independently without ignition</li>
                      <li>
                        Experiment with wiper speeds and observe timing
                        differences
                      </li>
                      <li>
                        Activate charging system and monitor battery level
                        changes
                      </li>
                      <li>
                        Compare behavior with System Mode to understand
                        dependencies
                      </li>
                    </ol>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">
                      Exercise 4: Complete System Test
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-gray-300 text-sm">
                      <li>Start in System Mode with ignition OFF</li>
                      <li>Activate ignition system</li>
                      <li>
                        Turn on all lighting systems (headlights, indicators,
                        brake lights)
                      </li>
                      <li>Activate wiper system at high speed</li>
                      <li>Start charging system</li>
                      <li>Observe all systems running simultaneously</li>
                      <li>
                        Turn off ignition and note that all systems deactivate
                      </li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Learning Objectives */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Learning Objectives
                </h3>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Understand the role of the ignition system in vehicle
                        electrical architecture
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Learn how different lighting circuits operate and their
                        safety purposes
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Comprehend the functionality of auxiliary systems like
                        wipers
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Understand battery charging systems and energy
                        management
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Recognize circuit dependencies and system integration in
                        vehicles
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>
                        Develop troubleshooting skills for automotive electrical
                        systems
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Safety & Best Practices */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Circuit Behavior Notes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                    <AlertCircle
                      className="text-yellow-400 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <p className="text-gray-300 text-sm">
                        <strong>System Mode Dependencies:</strong> In real
                        vehicles, most electrical systems rely on the ignition
                        being active. This prevents battery drain when the
                        vehicle is off and ensures proper power management.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                    <AlertCircle
                      className="text-yellow-400 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <p className="text-gray-300 text-sm">
                        <strong>Turn Signal Timing:</strong> The 500ms blink
                        interval (2 blinks per second) is standard in automotive
                        design for optimal visibility and driver awareness.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-700 p-3 rounded-lg">
                    <AlertCircle
                      className="text-yellow-400 shrink-0 mt-1"
                      size={20}
                    />
                    <div>
                      <p className="text-gray-300 text-sm">
                        <strong>Charging System:</strong> The simulated charging
                        rate is accelerated for demonstration purposes. In
                        actual vehicles, charging rates depend on alternator
                        output, battery condition, and electrical load.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Getting Started */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Getting Started
                </h3>
                <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                  <ol className="list-decimal list-inside space-y-2 text-gray-300">
                    <li>
                      Select your preferred operation mode (System or Individual
                      Circuit)
                    </li>
                    <li>
                      If in System Mode, start by activating the ignition system
                    </li>
                    <li>
                      Explore each circuit system using the control panel on the
                      left
                    </li>
                    <li>
                      Observe real-time visual feedback on the circuit board
                    </li>
                    <li>
                      Complete the practical exercises to reinforce your
                      learning
                    </li>
                    <li>
                      Switch between modes to understand system dependencies
                    </li>
                  </ol>
                </div>
              </section>

              {/* Additional Resources */}
              <section>
                <h3 className="text-xl font-semibold mb-3 text-blue-400">
                  Additional Information
                </h3>
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-gray-300 mb-3">
                    This simulator is designed as an educational tool for
                    engineering students at Bowen University and other
                    institutions. It provides a safe, controlled environment to
                    learn about automotive electrical systems without the need
                    for physical vehicle access.
                  </p>
                  <p className="text-gray-300">
                    For more advanced topics such as fault diagnosis, circuit
                    troubleshooting scenarios, and performance assessments,
                    additional features will be added in future updates.
                  </p>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Automotive Electric Circuit Trainer Simulator v1.0</p>
          <p>Developed for Engineering Education | Bowen University</p>
        </div>
      </div>
    </div>
  );
};

export default AECTSimulator;
