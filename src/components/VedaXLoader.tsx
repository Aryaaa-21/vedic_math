import React, { useEffect, useRef } from "react";

export default function VedaXLoader() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const parent: HTMLDivElement = container;

    const symbols = [
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "+", "−", "×", "÷", "π", "∞", "∑", "√"
    ];
    let baseAngle = 0;
    let isMounted = true;

    function spawn() {
      if (!isMounted) return;

      const el = document.createElement("div");
      el.className = "absolute font-bold text-center pointer-events-none select-none";
      el.style.color = "#5A2E1F";
      el.style.textShadow = "0 0 8px rgba(90, 46, 31, 0.15)";
      el.style.opacity = "0.95";
      el.style.transform = "translate(-50%, -50%)";
      el.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
      parent.appendChild(el);

      let angle = baseAngle;
      let radius = 0.5;

      function animate() {
        if (!isMounted || !parent.contains(el)) return;

        angle += 0.030;
        radius += 0.22;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        el.style.left = `calc(50% + ${x}px)`;
        el.style.top = `calc(50% + ${y}px)`;

        const size = 4 + (radius / 7.5);
        el.style.fontSize = `${size}px`;
        el.style.opacity = String(1 - (radius / 750));

        if (radius > 750) {
          if (parent.contains(el)) {
            parent.removeChild(el);
          }
          return;
        }

        requestAnimationFrame(animate);
      }

      animate();
      baseAngle += 0.045;
    }

    const intervalId = setInterval(spawn, 120);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      parent.innerHTML = "";
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#D8CCAA] overflow-hidden flex items-center justify-center select-none">
      {/* Center Glow */}
      <div
        className="absolute w-[80px] h-[80px] rounded-full filter blur-[18px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(90,46,31,0.2), transparent)"
        }}
      />

      {/* Math Spawner Area */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />

      {/* Loading Text */}
      <div
        className="absolute bottom-[70px] w-full text-center font-sans tracking-[5px] text-xs font-semibold pointer-events-none uppercase"
        style={{
          color: "#5A2E1F",
          opacity: 0.7
        }}
      >
        VEDAX LOADING...
      </div>
    </div>
  );
}
