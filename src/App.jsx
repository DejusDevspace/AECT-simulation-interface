import React, { useState, useEffect } from "react";
import AECTSimulator from "./components/AECTSimulator";
import { AlertCircle, X } from "lucide-react";

function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <>
      {isMobile && showWarning && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-900/95 border-b-2 border-yellow-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <AlertCircle className="text-yellow-400 shrink-0 mt-1" size={24} />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-100 mb-1">
                Best Experience on Desktop
              </h3>
              <p className="text-yellow-200 text-sm">
                This interface is optimized for desktop and larger screens. For the best experience and full functionality, please open this on a PC or larger device.
              </p>
            </div>
            <button
              onClick={() => setShowWarning(false)}
              className="text-yellow-400 hover:text-yellow-300 shrink-0"
              aria-label="Dismiss warning"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      <div className={isMobile && showWarning ? "pt-28" : ""}>
        <AECTSimulator />
      </div>
    </>
  );
}

export default App;
