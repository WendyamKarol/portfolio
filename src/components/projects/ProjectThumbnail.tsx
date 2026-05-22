function AiPortfolioThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="ap-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f0f14" />
          <stop offset="100%" stopColor="#141428" />
        </linearGradient>
        <linearGradient id="ap-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#ap-bg)" />
      <rect width="400" height="220" fill="url(#ap-glow)" />
      {/* Browser chrome */}
      <rect x="30" y="18" width="340" height="184" rx="8" fill="#1a1a2e" stroke="#2a2a4a" strokeWidth="1" />
      <rect x="30" y="18" width="340" height="26" rx="8" fill="#1e1e35" />
      <rect x="30" y="36" width="340" height="8" fill="#1e1e35" />
      <circle cx="50" cy="31" r="5" fill="#ff5f57" />
      <circle cx="66" cy="31" r="5" fill="#febc2e" />
      <circle cx="82" cy="31" r="5" fill="#28c840" />
      <rect x="100" y="25" width="180" height="12" rx="6" fill="#252540" />
      {/* Chat bubbles */}
      <rect x="50" y="58" width="140" height="22" rx="11" fill="#6366f1" opacity="0.9" />
      <rect x="54" y="63" width="90" height="6" rx="3" fill="white" opacity="0.7" />
      <rect x="54" y="72" width="60" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="200" y="88" width="130" height="22" rx="11" fill="#1e293b" opacity="0.9" />
      <rect x="204" y="93" width="80" height="6" rx="3" fill="#94a3b8" opacity="0.8" />
      <rect x="204" y="102" width="50" height="4" rx="2" fill="#94a3b8" opacity="0.4" />
      <rect x="50" y="118" width="160" height="22" rx="11" fill="#6366f1" opacity="0.85" />
      <rect x="54" y="123" width="100" height="6" rx="3" fill="white" opacity="0.7" />
      <rect x="54" y="132" width="70" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="190" y="148" width="150" height="22" rx="11" fill="#1e293b" opacity="0.9" />
      <rect x="194" y="153" width="90" height="6" rx="3" fill="#94a3b8" opacity="0.8" />
      {/* Sparkle */}
      <g transform="translate(350, 35)" opacity="0.8">
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#a5b4fc" strokeWidth="1.5" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#a5b4fc" strokeWidth="1.5" />
        <line x1="-5" y1="-5" x2="5" y2="5" stroke="#a5b4fc" strokeWidth="1" />
        <line x1="5" y1="-5" x2="-5" y2="5" stroke="#a5b4fc" strokeWidth="1" />
      </g>
      {/* Bottom input bar */}
      <rect x="50" y="180" width="280" height="14" rx="7" fill="#1e1e35" stroke="#2a2a4a" strokeWidth="1" />
      <rect x="56" y="184" width="100" height="6" rx="3" fill="#2a2a4a" />
    </svg>
  );
}

function SmartTrainingThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="st-bar1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="st-bar2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="#f8f9fc" />
      {/* Grid lines */}
      {[50, 100, 150, 200, 250, 300, 350].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="200" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {[60, 100, 140, 180].map((y) => (
        <line key={y} x1="30" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* Person icon */}
      <circle cx="55" cy="38" r="10" fill="#6366f1" opacity="0.15" />
      <circle cx="55" cy="34" r="6" fill="#6366f1" opacity="0.6" />
      <path d="M43 52 Q55 44 67 52" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Label */}
      <rect x="80" y="28" width="80" height="12" rx="2" fill="#e0e7ff" />
      <rect x="82" y="31" width="50" height="6" rx="1" fill="#6366f1" opacity="0.5" />
      <rect x="180" y="28" width="60" height="12" rx="2" fill="#f1f5f9" />
      <rect x="182" y="31" width="36" height="6" rx="1" fill="#94a3b8" opacity="0.5" />
      {/* Skill bars */}
      {[
        { y: 70, width: 220, label: "Python / ML" },
        { y: 98, width: 180, label: "LangChain" },
        { y: 126, width: 260, label: "RAG Systems" },
        { y: 154, width: 140, label: "FastAPI" },
        { y: 182, width: 200, label: "FAISS" },
      ].map(({ y, width }, i) => (
        <g key={i}>
          <rect x="30" y={y} width={width} height="18" rx="4" fill={i % 2 === 0 ? "url(#st-bar1)" : "url(#st-bar2)"} opacity="0.85" />
          <rect x="30" y={y} width={width} height="18" rx="4" fill="white" opacity="0.08" />
        </g>
      ))}
      {/* Score badge */}
      <rect x="300" y="60" width="70" height="40" rx="8" fill="#6366f1" opacity="0.1" stroke="#6366f1" strokeWidth="1" strokeOpacity="0.3" />
      <text x="335" y="82" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#6366f1" opacity="0.9">94%</text>
      <text x="335" y="94" textAnchor="middle" fontSize="7" fill="#6366f1" opacity="0.6">match</text>
    </svg>
  );
}

function IntelligentDocumentThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <linearGradient id="id-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111318" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>
        <linearGradient id="id-beam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0" />
          <stop offset="40%" stopColor="#a855f7" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#c084fc" stopOpacity="1" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill="url(#id-bg)" />
      {/* Stacked documents */}
      <rect x="85" y="50" width="180" height="130" rx="6" fill="#1e1b2e" stroke="#3b2d5a" strokeWidth="1.5" />
      <rect x="92" y="58" width="8" height="8" rx="1" fill="#7c3aed" opacity="0.7" />
      {[72, 82, 92, 102, 112, 122, 132].map((y) => (
        <rect key={y} x="106" y={y} width={y % 20 === 12 ? 100 : 130} height="5" rx="2" fill="#3b2d5a" opacity="0.8" />
      ))}
      <rect x="92" y="148" width="60" height="18" rx="3" fill="#7c3aed" opacity="0.3" />
      <rect x="94" y="152" width="40" height="6" rx="1" fill="#a855f7" opacity="0.5" />
      {/* Doc 2 (behind, offset) */}
      <rect x="100" y="42" width="180" height="130" rx="6" fill="#17142a" stroke="#2d2050" strokeWidth="1" opacity="0.7" />
      {/* Doc 3 (furthest back) */}
      <rect x="115" y="34" width="180" height="130" rx="6" fill="#13101f" stroke="#231a3d" strokeWidth="1" opacity="0.5" />
      {/* Scan beam */}
      <rect x="30" y="108" width="340" height="4" rx="2" fill="url(#id-beam)" opacity="0.85" />
      <rect x="30" y="108" width="340" height="4" rx="2" fill="url(#id-beam)" opacity="0.4" transform="translate(0 4)" />
      {/* Neural dots */}
      {[
        [40, 190], [80, 200], [120, 188], [160, 205], [200, 192],
        [240, 200], [280, 188], [320, 202], [360, 190]
      ].map(([x, y], i, arr) => (
        <g key={i}>
          {i < arr.length - 1 && (
            <line x1={x} y1={y} x2={arr[i+1][0]} y2={arr[i+1][1]}
              stroke="#7c3aed" strokeWidth="1" opacity="0.3" />
          )}
          <circle cx={x} cy={y} r="3" fill="#a855f7" opacity="0.6" />
        </g>
      ))}
    </svg>
  );
}

function AstroControlThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="ac-glow" cx="60%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#080c1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#080c1a" />
      {/* Dot grid */}
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 14 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={20 + col * 27} cy={18 + row * 27}
            r="1" fill="#1e3a5f" opacity="0.6" />
        ))
      )}
      <rect width="400" height="220" fill="url(#ac-glow)" />
      {/* Orbital rings */}
      <ellipse cx="270" cy="110" rx="100" ry="55" stroke="#1e3a5f" strokeWidth="1.5" fill="none" />
      <ellipse cx="270" cy="110" rx="70" ry="38" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.4" />
      <ellipse cx="270" cy="110" rx="40" ry="22" stroke="#1e3a5f" strokeWidth="1" fill="none" />
      {/* Satellite/robot */}
      <rect x="255" y="100" width="30" height="20" rx="3" fill="#1e3a5f" stroke="#f59e0b" strokeWidth="1" />
      <rect x="240" y="107" width="15" height="6" rx="1" fill="#f59e0b" opacity="0.7" />
      <rect x="285" y="107" width="15" height="6" rx="1" fill="#f59e0b" opacity="0.7" />
      <line x1="270" y1="100" x2="270" y2="92" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="270" cy="90" r="2" fill="#f59e0b" />
      {/* Orbit dot */}
      <circle cx="370" cy="110" r="5" fill="#f59e0b" opacity="0.8" />
      <circle cx="200" cy="72" r="4" fill="#60a5fa" opacity="0.6" />
      {/* Status bars left */}
      <rect x="20" y="50" width="90" height="120" rx="6" fill="#0d1b35" stroke="#1e3a5f" strokeWidth="1" />
      <text x="65" y="68" textAnchor="middle" fontSize="7" fill="#94a3b8" fontFamily="monospace">MISSION</text>
      {[
        { y: 78, w: 60, label: "PWR", color: "#22c55e" },
        { y: 96, w: 45, label: "COM", color: "#f59e0b" },
        { y: 114, w: 70, label: "NAV", color: "#3b82f6" },
        { y: 132, w: 30, label: "SYS", color: "#ef4444" },
      ].map(({ y, w, label, color }, i) => (
        <g key={i}>
          <text x="28" y={y + 9} fontSize="6" fill="#64748b" fontFamily="monospace">{label}</text>
          <rect x="46" y={y} width="55" height="8" rx="2" fill="#1e3a5f" />
          <rect x="46" y={y} width={w * 55 / 70} height="8" rx="2" fill={color} opacity="0.8" />
        </g>
      ))}
    </svg>
  );
}

function ProtectoCycleThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="pc-led-front" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pc-led-rear" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="220" fill="#0e1117" />
      {/* Road */}
      <rect x="0" y="160" width="400" height="60" fill="#151b25" />
      <rect x="0" y="158" width="400" height="4" fill="#1e293b" />
      {[30, 100, 170, 240, 310, 380].map((x) => (
        <rect key={x} x={x} y="183" width="50" height="4" rx="2" fill="#334155" opacity="0.6" />
      ))}
      {/* Bike wheels */}
      <circle cx="130" cy="152" r="42" stroke="#334155" strokeWidth="5" fill="none" />
      <circle cx="130" cy="152" r="42" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="130" cy="152" r="6" fill="#4ade80" opacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line key={angle}
          x1={130 + 6 * Math.cos(angle * Math.PI / 180)}
          y1={152 + 6 * Math.sin(angle * Math.PI / 180)}
          x2={130 + 38 * Math.cos(angle * Math.PI / 180)}
          y2={152 + 38 * Math.sin(angle * Math.PI / 180)}
          stroke="#334155" strokeWidth="2" />
      ))}
      <circle cx="270" cy="152" r="42" stroke="#334155" strokeWidth="5" fill="none" />
      <circle cx="270" cy="152" r="42" stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="270" cy="152" r="6" fill="#4ade80" opacity="0.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line key={angle}
          x1={270 + 6 * Math.cos(angle * Math.PI / 180)}
          y1={152 + 6 * Math.sin(angle * Math.PI / 180)}
          x2={270 + 38 * Math.cos(angle * Math.PI / 180)}
          y2={152 + 38 * Math.sin(angle * Math.PI / 180)}
          stroke="#334155" strokeWidth="2" />
      ))}
      {/* Frame */}
      <line x1="130" y1="152" x2="200" y2="100" stroke="#475569" strokeWidth="4" />
      <line x1="200" y1="100" x2="270" y2="152" stroke="#475569" strokeWidth="4" />
      <line x1="200" y1="100" x2="190" y2="152" stroke="#475569" strokeWidth="3" />
      <line x1="190" y1="152" x2="130" y2="152" stroke="#475569" strokeWidth="3" />
      <line x1="200" y1="100" x2="200" y2="80" stroke="#475569" strokeWidth="3" />
      <rect x="185" y="72" width="30" height="8" rx="4" fill="#64748b" />
      {/* LED front glow */}
      <circle cx="88" cy="150" r="25" fill="url(#pc-led-front)" opacity="0.6" />
      <circle cx="88" cy="150" r="6" fill="#4ade80" />
      {/* LED rear glow */}
      <circle cx="312" cy="150" r="20" fill="url(#pc-led-rear)" opacity="0.5" />
      <circle cx="312" cy="150" r="5" fill="#ef4444" />
      {/* Sensor waves */}
      {[1, 2, 3].map((i) => (
        <path key={i}
          d={`M ${312 + i * 12} ${140 - i * 5} Q ${320 + i * 14} 150 ${312 + i * 12} ${160 + i * 5}`}
          stroke="#ef4444" strokeWidth="1" fill="none" opacity={0.5 - i * 0.12} />
      ))}
    </svg>
  );
}

function ElizaChatbotThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="400" height="220" fill="#0a0a0a" />
      {/* Scan lines */}
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x="0" y={i * 10} width="400" height="1" fill="#00ff88" opacity="0.04" />
      ))}
      {/* Terminal header */}
      <rect x="0" y="0" width="400" height="28" fill="#111" />
      <circle cx="18" cy="14" r="5" fill="#ff5f57" />
      <circle cx="34" cy="14" r="5" fill="#febc2e" />
      <circle cx="50" cy="14" r="5" fill="#28c840" />
      <text x="200" y="18" textAnchor="middle" fontSize="9" fill="#555" fontFamily="monospace">eliza — lisp</text>
      {/* Dialog lines */}
      {[
        { y: 48, prefix: "> ", text: "Tell me about your problem.", color: "#00ff88" },
        { y: 68, prefix: "  ", text: "I feel anxious about the future.", color: "#888" },
        { y: 88, prefix: "> ", text: "Why do you feel anxious?", color: "#00ff88" },
        { y: 108, prefix: "  ", text: "I don't know. It just happens.", color: "#888" },
        { y: 128, prefix: "> ", text: "Does that happen often?", color: "#00ff88" },
        { y: 148, prefix: "  ", text: "Yes, mostly at night.", color: "#888" },
        { y: 168, prefix: "> ", text: "I see. Tell me more.", color: "#00ff88" },
      ].map(({ y, prefix, text, color }, i) => (
        <text key={i} x="24" y={y} fontSize="10" fill={color} fontFamily="monospace" opacity="0.85">
          {prefix}{text}
        </text>
      ))}
      {/* Blinking cursor */}
      <rect x="24" y="185" width="8" height="12" rx="1" fill="#00ff88" opacity="0.9" />
      <text x="36" y="196" fontSize="10" fill="#00ff88" fontFamily="monospace" opacity="0.5">_</text>
      {/* CRT vignette */}
      <radialGradient id="el-vignette" cx="50%" cy="50%" r="70%">
        <stop offset="60%" stopColor="#0a0a0a" stopOpacity="0" />
        <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.5" />
      </radialGradient>
      <rect width="400" height="220" fill="url(#el-vignette)" />
    </svg>
  );
}

function MetroFlowThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="400" height="220" fill="#fafafa" />
      {/* Metro lines */}
      {/* Blue line */}
      <polyline points="20,80 100,80 180,140 280,140 380,100"
        stroke="#3b82f6" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Red line */}
      <polyline points="20,140 80,140 180,80 260,80 380,160"
        stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Green line */}
      <polyline points="20,110 360,110"
        stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Orange line */}
      <polyline points="100,20 140,80 200,110 260,140 300,200"
        stroke="#f97316" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* Station dots */}
      {[
        [100, 80, "#3b82f6"], [180, 140, "#3b82f6"], [280, 140, "#3b82f6"],
        [180, 80, "#ef4444"], [260, 80, "#ef4444"], [80, 140, "#ef4444"],
        [140, 110, "#22c55e"], [200, 110, "#22c55e"], [260, 110, "#22c55e"],
        [140, 80, "#f97316"], [200, 110, "#f97316"], [260, 140, "#f97316"],
        // Interchange stations (white center)
        [180, 80, "white"], [200, 110, "white"], [260, 140, "white"],
      ].map(([cx, cy, fill], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={fill === "white" ? 5 : 7}
          fill={fill as string} stroke="white" strokeWidth={fill === "white" ? 0 : 3} />
      ))}
      {/* M logo */}
      <rect x="340" y="18" width="46" height="26" rx="5" fill="#1e293b" />
      <text x="363" y="36" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" fontFamily="sans-serif">M</text>
      {/* Labels */}
      <text x="20" y="210" fontSize="7" fill="#94a3b8" fontFamily="sans-serif">Route Optimizer · Java · TDD</text>
    </svg>
  );
}

function SmartBeverageThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="400" height="220" fill="#f7f8fa" />
      {/* Grid */}
      {[60, 120, 180, 240, 300].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="200" stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {[60, 100, 140, 180].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      {/* DB cylinders */}
      {[60, 180, 300].map((cx, i) => {
        const colors = ["#3b82f6", "#6366f1", "#0ea5e9"];
        const c = colors[i];
        return (
          <g key={i}>
            <ellipse cx={cx} cy="85" rx="38" ry="10" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5" strokeOpacity="0.5" />
            <rect x={cx - 38} y="85" width="76" height="55" fill={c} opacity="0.08" stroke={c} strokeWidth="1.5" strokeOpacity="0.3" />
            <ellipse cx={cx} cy="140" rx="38" ry="10" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5" strokeOpacity="0.5" />
            <ellipse cx={cx} cy="85" rx="38" ry="10" fill={c} opacity="0.2" />
            <text x={cx} y="115" textAnchor="middle" fontSize="8" fill={c} fontFamily="monospace" opacity="0.8">
              {["products", "orders", "regions"][i]}
            </text>
          </g>
        );
      })}
      {/* Arrows between DBs */}
      <line x1="102" y1="112" x2="138" y2="112" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="222" y1="112" x2="258" y2="112" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#64748b" />
        </marker>
      </defs>
      {/* Table preview */}
      <rect x="30" y="160" width="340" height="46" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="30" y="160" width="340" height="14" rx="4" fill="#e0e7ff" />
      <rect x="30" y="174" width="340" height="0" fill="none" />
      {["ID", "Product", "Region", "Volume", "Status"].map((h, i) => (
        <text key={h} x={46 + i * 65} y="170" fontSize="7" fill="#6366f1" fontFamily="monospace" fontWeight="bold">{h}</text>
      ))}
      {[0, 1].map((row) =>
        ["001", "Bière Blonde", "West Africa", "1200L", "Active"].map((val, col) => (
          <text key={`${row}-${col}`} x={46 + col * 65} y={182 + row * 12}
            fontSize="7" fill="#64748b" fontFamily="monospace" opacity={row === 0 ? 0.9 : 0.5}>{val}</text>
        ))
      )}
    </svg>
  );
}

function BookShopThumbnail() {
  return (
    <svg viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="400" height="220" fill="#fdf8f0" />
      {/* Shelf */}
      <rect x="20" y="155" width="360" height="10" rx="2" fill="#a16207" opacity="0.5" />
      <rect x="20" y="162" width="360" height="6" rx="2" fill="#92400e" opacity="0.3" />
      {/* Books */}
      {[
        { x: 32, w: 28, h: 80, color: "#dc2626", title: "C++" },
        { x: 64, w: 22, h: 95, color: "#0f766e", title: "SQL" },
        { x: 90, w: 32, h: 70, color: "#7c3aed", title: "OOP" },
        { x: 126, w: 18, h: 88, color: "#1d4ed8", title: "DB" },
        { x: 148, w: 26, h: 78, color: "#b45309", title: "STL" },
        { x: 178, w: 30, h: 92, color: "#065f46", title: "MVC" },
        { x: 212, w: 20, h: 66, color: "#9f1239", title: "UML" },
        { x: 236, w: 34, h: 85, color: "#1e3a8a", title: "API" },
        { x: 274, w: 22, h: 73, color: "#6b21a8", title: "QRY" },
        { x: 300, w: 28, h: 90, color: "#166534", title: "ORM" },
        { x: 332, w: 24, h: 77, color: "#7f1d1d", title: "IDX" },
        { x: 360, w: 20, h: 82, color: "#134e4a", title: "TRG" },
      ].map(({ x, w, h, color, title }, i) => (
        <g key={i}>
          <rect x={x} y={155 - h} width={w} height={h} rx="2" fill={color} opacity="0.85" />
          <rect x={x} y={155 - h} width={w} height={h} rx="2" fill="white" opacity="0.06" />
          <rect x={x + 2} y={155 - h + 4} width={w - 4} height="2" rx="1" fill="white" opacity="0.2" />
          <text
            x={x + w / 2} y={155 - h / 2 + 3}
            textAnchor="middle" fontSize="7" fill="white" fontFamily="monospace"
            transform={`rotate(-90, ${x + w / 2}, ${155 - h / 2 + 3})`}
            opacity="0.7"
          >{title}</text>
        </g>
      ))}
      {/* Magnifier */}
      <circle cx="320" cy="80" r="28" stroke="#f59e0b" strokeWidth="3" fill="#fef3c7" fillOpacity="0.4" />
      <circle cx="320" cy="80" r="28" stroke="#f59e0b" strokeWidth="3" fill="none" />
      <line x1="340" y1="100" x2="360" y2="120" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
      <text x="320" y="84" textAnchor="middle" fontSize="16" fill="#92400e" opacity="0.6">?</text>
    </svg>
  );
}

const THUMBNAIL_MAP: Record<string, () => React.JSX.Element> = {
  "AIPortfolio": AiPortfolioThumbnail,
  "Smart Training Advisor": SmartTrainingThumbnail,
  "Intelligent Document Analysis": IntelligentDocumentThumbnail,
  "AstroControl": AstroControlThumbnail,
  "Protecto-Cycle": ProtectoCycleThumbnail,
  "Eliza Chatbot": ElizaChatbotThumbnail,
  "MetroFlow": MetroFlowThumbnail,
  "Smart Beverage Distribution Database System": SmartBeverageThumbnail,
  "BookShop Management System": BookShopThumbnail,
};

export function hasThumbnail(title: string): boolean {
  return title in THUMBNAIL_MAP;
}

export default function ProjectThumbnail({ title }: { title: string }) {
  const Component = THUMBNAIL_MAP[title];
  if (!Component) return null;
  return <Component />;
}
