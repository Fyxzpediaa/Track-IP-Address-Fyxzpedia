import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

/* ============================================================
   PARTICLE BACKGROUND - ANIMASI PARTIKEL CYBERPUNK
   ============================================================ */
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number; 
      size: number; opacity: number; hue: number; life: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      hue: Math.random() * 60 + 185,
      life: Math.random() * 300 + 100,
    });

    for (let i = 0; i < 60; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[i] = createParticle();
          return;
        }

        // Glow effect
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 90%, 65%, ${p.opacity})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 90%, 65%, 0)`);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.opacity + 0.2})`;
        ctx.fill();

        // Connections
        particles.forEach((p2, j) => {
          if (i >= j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

/* ============================================================
   DASHBOARD OUTPUT - TAMPILAN VISUAL KEREN DENGAN MAPS LINK
   ============================================================ */
const DashboardOutput = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const mapsUrl = data?.lat && data?.lon 
    ? `https://www.google.com/maps?q=${data.lat},${data.lon}`
    : '#';

  if (isLoading) {
    return (
      <div className="bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-8 shadow-2xl shadow-black/50">
        <div className="text-center space-y-6 animate-pulse">
          <div className="w-20 h-20 mx-auto rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <div className="space-y-3">
            <div className="h-4 bg-gray-800 rounded w-3/4 mx-auto" />
            <div className="h-3 bg-gray-800 rounded w-1/2 mx-auto" />
          </div>
          <p className="text-cyan-400/60 font-mono text-sm">Analyzing network packets...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const infoCards = [
    { 
      id: 'ip', 
      icon: '🌐', 
      label: 'IP Address', 
      value: data.ip || 'N/A',
      color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20',
      textColor: 'text-cyan-400',
      bgGlow: 'shadow-cyan-500/10'
    },
    { 
      id: 'location', 
      icon: '📍', 
      label: 'Location', 
      value: `${data.city || 'N/A'}, ${data.region || 'N/A'}`,
      sub: data.country || 'N/A',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
      textColor: 'text-purple-400',
      bgGlow: 'shadow-purple-500/10'
    },
    { 
      id: 'isp', 
      icon: '🔌', 
      label: 'ISP Provider', 
      value: data.isp || 'N/A',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
      textColor: 'text-emerald-400',
      bgGlow: 'shadow-emerald-500/10'
    },
    { 
      id: 'as', 
      icon: '🔢', 
      label: 'AS Number', 
      value: data.as || 'N/A',
      color: 'from-orange-500/10 to-amber-500/10 border-orange-500/20',
      textColor: 'text-orange-400',
      bgGlow: 'shadow-orange-500/10'
    },
    { 
      id: 'timezone', 
      icon: '🕐', 
      label: 'Timezone', 
      value: data.timezone || 'N/A',
      color: 'from-indigo-500/10 to-blue-500/10 border-indigo-500/20',
      textColor: 'text-indigo-400',
      bgGlow: 'shadow-indigo-500/10'
    },
    { 
      id: 'coordinates', 
      icon: '🎯', 
      label: 'Coordinates', 
      value: data.lat && data.lon ? `${data.lat}, ${data.lon}` : 'N/A',
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/20',
      textColor: 'text-rose-400',
      bgGlow: 'shadow-rose-500/10'
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Status */}
      <div className="flex items-center justify-between bg-[#0a0e17] border border-white/[0.06] rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse delay-75 shadow-lg shadow-green-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-300 animate-pulse delay-150 shadow-lg shadow-green-300/50" />
          </div>
          <span className="text-sm font-semibold text-green-400">TRACE SUCCESSFUL</span>
          <span className="text-xs text-gray-600 font-mono">• {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Response Time:</span>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
            {Math.floor(Math.random() * 100 + 30)}ms
          </span>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infoCards.map((card) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              relative bg-[#0a0e17] border rounded-2xl p-5
              transition-all duration-500 cursor-default
              ${card.color}
              ${hoveredCard === card.id ? `scale-[1.03] shadow-2xl ${card.bgGlow} -translate-y-1` : 'shadow-lg'}
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs font-mono ${card.textColor} opacity-60`}>
                {card.id.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{card.label}</p>
            <p className={`text-lg font-bold ${card.textColor} break-all`}>{card.value}</p>
            {card.sub && (
              <p className="text-sm text-gray-500 mt-1">{card.sub}</p>
            )}
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none ${
              hoveredCard === card.id ? 'opacity-100' : ''
            }`}
            style={{
              background: `radial-gradient(circle at 50% 0%, ${card.textColor.replace('text-', '')}15, transparent 70%)`
            }}
            />
          </div>
        ))}
      </div>

      {/* Google Maps Link - BIG CTA */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden bg-gradient-to-r from-[#0a0e17] to-[#0d1117] border-2 border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-500 shadow-2xl shadow-cyan-500/5 hover:shadow-cyan-500/20"
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 group-hover:via-cyan-500/10 transition-all duration-700" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-yellow-500/20 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#EA4335" d="M12 0C7.31 0 3.46 3.85 3.46 8.54 3.46 13.23 12 24 12 24s8.54-10.77 8.54-15.46C20.54 3.85 16.69 0 12 0z"/>
                <circle cx="12" cy="8.5" r="3" fill="#4285F4"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Open in Google Maps
              </h3>
              <p className="text-sm text-gray-400 font-mono">
                {data.lat || '??'}, {data.lon || '??'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-gray-500 group-hover:text-cyan-400 transition-colors">
              View Location
            </span>
            <svg className="w-6 h-6 text-gray-500 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
        
        {/* Pin drop animation */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="text-2xl animate-bounce">📍</span>
        </div>
      </a>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => window.open(mapsUrl, '_blank')}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Google Maps
        </button>
        <button
          onClick={() => {
            const text = `📍 IP: ${data.ip}\n🏙️ City: ${data.city}\n🌍 Country: ${data.country}\n📡 ISP: ${data.isp}\n🗺️ Maps: ${mapsUrl}`;
            navigator.clipboard.writeText(text);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy Info
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   TERMINAL OUTPUT - TAMPILAN TERMINAL HACKER
   ============================================================ */
const TerminalOutput = ({ output, isLoading, isError, data }: { 
  output: string; 
  isLoading: boolean; 
  isError: boolean;
  data: any;
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const mapsUrl = data?.lat && data?.lon 
    ? `https://www.google.com/maps?q=${data.lat},${data.lon}`
    : null;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isLoading]);

  return (
    <div className="bg-[#0a0a0a] border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 font-mono">
      {/* Terminal Title Bar */}
      <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-lg shadow-red-500/30" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e] shadow-lg shadow-yellow-500/30" />
            <div className="w-3 h-3 rounded-full bg-[#28c840] shadow-lg shadow-green-500/30" />
          </div>
          <span className="text-xs text-gray-600 ml-3">
            root@ip-tracer:~/
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-700">
            {isLoading ? 'EXECUTING...' : isError ? 'ERROR' : data ? 'SUCCESS' : 'IDLE'}
          </span>
          <span className="text-[10px] text-gray-600">
            bash 5.1
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="p-5 min-h-[350px] max-h-[550px] overflow-y-auto custom-scrollbar"
        style={{
          background: 'linear-gradient(to bottom, #0a0a0a 0%, #050505 100%)',
        }}
      >
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-green-500">$</span>
              <span className="text-gray-400">./trace-execute --target </span>
              <span className="text-cyan-400 animate-pulse">████████████</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">></span>
              <span className="text-gray-600 animate-pulse">Initializing network scan...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">></span>
              <span className="text-gray-600 animate-pulse delay-100">Resolving hostname...</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">></span>
              <span className="text-gray-600 animate-pulse delay-200">Querying geolocation database...</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-yellow-500">[wait]</span>
              <span className="text-yellow-400/60 animate-pulse">█</span>
            </div>
          </div>
        ) : (
          <pre className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isError ? 'text-red-400' : 'text-green-400'
          }`}>
            <code>{output || '$ _'}</code>
          </pre>
        )}

        {/* Maps link di terminal */}
        {!isLoading && mapsUrl && (
          <div className="mt-4 pt-4 border-t border-gray-800/50">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-green-500">$</span>
              <span>open maps:</span>
              <a 
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline decoration-dotted underline-offset-4 transition-colors"
              >
                {mapsUrl}
              </a>
              <span className="text-yellow-500 animate-pulse ml-1">← click</span>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="bg-[#1a1a1a]/50 px-4 py-2 border-t border-gray-800/50 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2 text-gray-600">
          <span className={`w-1.5 h-1.5 rounded-full ${
            isLoading ? 'bg-yellow-500 animate-pulse' : 
            isError ? 'bg-red-500' : 
            data ? 'bg-green-500 animate-pulse' : 
            'bg-gray-700'
          }`} />
          <span>{isLoading ? 'processing...' : isError ? 'exit code: 1' : data ? 'exit code: 0' : 'ready'}</span>
        </div>
        <span className="text-gray-700">TTY: pts/0</span>
      </div>
    </div>
  );
};

/* ============================================================
   GLOW BUTTON COMPONENT
   ============================================================ */
const GlowButton = ({ 
  children, 
  onClick, 
  variant = 'cyan',
  loading = false,
  icon = null
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  variant?: 'cyan' | 'purple' | 'green';
  loading?: boolean;
  icon?: React.ReactNode;
}) => {
  const variants = {
    cyan: {
      bg: 'from-cyan-600 via-cyan-500 to-blue-600',
      shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]',
      ring: 'ring-cyan-400/20',
    },
    purple: {
      bg: 'from-purple-600 via-purple-500 to-violet-600',
      shadow: 'shadow-[0_0_30px_rgba(147,51,234,0.4)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(147,51,234,0.6)]',
      ring: 'ring-purple-400/20',
    },
    green: {
      bg: 'from-emerald-600 via-emerald-500 to-teal-600',
      shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]',
      ring: 'ring-emerald-400/20',
    },
  };

  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        relative w-full font-bold py-4 px-8 rounded-2xl text-white
        bg-gradient-to-r ${v.bg}
        ${v.shadow} ${v.hoverShadow}
        transition-all duration-500
        hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        overflow-hidden group
        ring-1 ${v.ring}
      `}
    >
      {/* Shine effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
      
      {/* Top highlight */}
      <span className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <span className="relative flex items-center justify-center gap-3 text-base">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="animate-pulse">Executing...</span>
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </span>
    </button>
  );
};

/* ============================================================
   STATS BADGE
   ============================================================ */
const StatsBadge = ({ icon, label, value, color = 'cyan' }: { 
  icon: string; 
  label: string; 
  value: string;
  color?: 'cyan' | 'purple' | 'green';
}) => {
  const colors = {
    cyan: 'hover:border-cyan-500/30 hover:shadow-cyan-500/5',
    purple: 'hover:border-purple-500/30 hover:shadow-purple-500/5',
    green: 'hover:border-emerald-500/30 hover:shadow-emerald-500/5',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] ${colors[color]} transition-all duration-300 group cursor-default`}>
      <span className="text-lg group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <div>
        <div className="text-[10px] text-gray-600 uppercase tracking-wider">{label}</div>
        <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{value}</div>
      </div>
    </div>
  );
};

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function Home() {
  const [ip, setIp] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyMe, setApiKeyMe] = useState('');
  const [output, setOutput] = useState('');
  const [traceData, setTraceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activeTrace, setActiveTrace] = useState<'custom' | 'me'>('custom');
  const [outputMode, setOutputMode] = useState<'dashboard' | 'terminal'>('dashboard');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const executeTrace = useCallback(async (url: string, type: 'custom' | 'me') => {
    setIsLoading(true);
    setIsError(false);
    setTraceData(null);
    setActiveTrace(type);
    
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || `HTTP Error! Status: ${res.status}`);
      }

      setTraceData(data);
      
      // Generate terminal output
      const mapsUrl = data.lat && data.lon ? `https://www.google.com/maps?q=${data.lat},${data.lon}` : 'N/A';
      const terminalText = `
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ██╗██████╗    ████████╗██████╗  █████╗  ██████╗███████╗
║   ██║██╔══██╗   ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝
║   ██║██████╔╝█████╗██║   ██████╔╝███████║██║     █████╗  
║   ██║██╔═══╝ ╚════╝██║   ██╔══██╗██╔══██║██║     ██╔══╝  
║   ██║██║           ██║   ██║  ██║██║  ██║╚██████╗███████╗
║   ╚═╝╚═╝           ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  📡  Target IP     : ${data.ip.padEnd(35)}║
║  🏙️   City          : ${(data.city || 'N/A').padEnd(35)}║
║  🗺️   Region        : ${(data.region || 'N/A').padEnd(35)}║
║  🌍  Country       : ${(data.country || 'N/A').padEnd(35)}║
║  📍  Latitude      : ${String(data.lat || 'N/A').padEnd(35)}║
║  📍  Longitude     : ${String(data.lon || 'N/A').padEnd(35)}║
║  🕐  Timezone      : ${(data.timezone || 'N/A').padEnd(35)}║
║  🌐  ISP           : ${(data.isp || 'N/A').padEnd(35)}║
║  🔢  AS Number     : ${(data.as || 'N/A').padEnd(35)}║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  🗺️   Google Maps   : ${mapsUrl.substring(0, 42).padEnd(42)}║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

$ Status: ✅ SUCCESS | Time: ${new Date().toLocaleTimeString()}
$ Response: ${Math.floor(Math.random() * 80 + 20)}ms | Exit Code: 0
$ Maps: ${mapsUrl}
`.trim();
      
      setOutput(terminalText);
    } catch (error: any) {
      setIsError(true);
      setTraceData(null);
      setOutput(`$ ❌ ERROR: ${error.message || 'Connection failed'}\n$ Exit Code: 1\n$ Time: ${new Date().toLocaleTimeString()}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTrace = () => {
    if (!ip || !apiKey) {
      setIsError(true);
      setOutput('$ ⚠️  WARNING: Missing required parameters\n$ Usage: IP Address and API Key are required\n$ Exit Code: 2');
      setTraceData(null);
      return;
    }
    executeTrace(`/api/trace?ip=${encodeURIComponent(ip)}&apikey=${encodeURIComponent(apiKey)}`, 'custom');
  };

  const handleTraceMe = () => {
    if (!apiKeyMe) {
      setIsError(true);
      setOutput('$ ⚠️  WARNING: API Key is required\n$ Exit Code: 2');
      setTraceData(null);
      return;
    }
    executeTrace(`/api/trace-me?apikey=${encodeURIComponent(apiKeyMe)}`, 'me');
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white font-sans relative overflow-x-hidden">
      <Head>
        <title>IP-Tracer Pro | Advanced Network Intelligence Platform</title>
        <meta name="description" content="Enterprise-grade IP tracking and network intelligence platform with real-time geolocation, ISP mapping, and comprehensive analytics." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>" />
      </Head>

      <ParticleBackground />

      {/* ==================== NAVIGATION ==================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#06080d]/95 backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl shadow-black/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <svg className="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  IP-Tracer
                </span>
                <span className="text-[10px] text-gray-500 ml-2 font-mono uppercase tracking-[0.2em]">Pro v2.1</span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { label: 'Dashboard', href: '#', active: true },
                { label: 'API Docs', href: '#docs' },
                { label: 'Status', href: '#status' },
                { label: 'GitHub', href: 'https://github.com' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${
                    item.active 
                      ? 'text-cyan-400 bg-cyan-500/10 font-medium' 
                      : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="relative z-10 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ==================== HERO SECTION ==================== */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-cyan-500/[0.07] border border-cyan-500/20 rounded-full text-xs text-cyan-400 mb-8 font-mono tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              NETWORK INTELLIGENCE PLATFORM — ENTERPRISE GRADE
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              <span className="bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent">
                Advanced IP
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Tracking System
              </span>
            </h1>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              Enterprise-grade network intelligence with real-time geolocation, 
              ISP mapping, and comprehensive analytics dashboard.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
              <StatsBadge icon="🌍" label="Coverage" value="195+ Countries" color="cyan" />
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-800 to-transparent hidden sm:block" />
              <StatsBadge icon="⚡" label="Uptime" value="99.99% SLA" color="green" />
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-800 to-transparent hidden sm:block" />
              <StatsBadge icon="🔒" label="Security" value="256-bit SSL" color="purple" />
            </div>
          </div>

          {/* ==================== TRACE CARDS GRID ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10">
            
            {/* ==================== CARD 1: TRACE CUSTOM IP ==================== */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-gradient-to-br from-[#0b0f1a] to-[#080c15] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 hover:border-cyan-500/15 transition-all duration-700">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Trace IP Address</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Custom target investigation</p>
                  </div>
                  {activeTrace === 'custom' && traceData && (
                    <span className="ml-auto px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-green-400" />
                      Active
                    </span>
                  )}
                </div>

                {/* Input Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-2.5 uppercase tracking-[0.15em]">
                      <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                      Target IP / Domain
                    </label>
                    <div className="relative group/input">
                      <input
                        type="text"
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        placeholder="192.168.1.1 or example.com"
                        className="w-full bg-[#060910] border border-white/[0.06] rounded-2xl py-4 pl-5 pr-14 text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/30 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500 font-mono text-sm group-hover/input:border-white/[0.1]"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-700 group-hover/input:text-cyan-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-2.5 uppercase tracking-[0.15em]">
                      <span className="w-1 h-1 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                      API Key
                    </label>
                    <div className="relative group/input">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-[#060910] border border-white/[0.06] rounded-2xl py-4 pl-5 pr-14 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-500/30 focus:ring-4 focus:ring-yellow-500/5 transition-all duration-500 font-mono text-sm group-hover/input:border-white/[0.1]"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-700 group-hover/input:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <GlowButton 
                    onClick={handleTrace} 
                    variant="cyan" 
                    loading={isLoading && activeTrace === 'custom'}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    }
                  >
                    Execute Trace
                  </GlowButton>
                </div>
              </div>
            </div>

            {/* ==================== CARD 2: TRACE MY NETWORK ==================== */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-violet-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-gradient-to-br from-[#0b0f1a] to-[#080c15] border border-white/[0.06] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 hover:border-purple-500/15 transition-all duration-700">
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/20 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Trace My Network</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Auto-detect your connection</p>
                  </div>
                  {activeTrace === 'me' && traceData && (
                    <span className="ml-auto px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-purple-400" />
                      Active
                    </span>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 mb-6">
                  {[
                    'Automatic IP Detection',
                    'ISP & Network Analysis',
                    'Geolocation Coordinates',
                    'Timezone & AS Number',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-500 group/item hover:text-gray-300 transition-colors duration-300">
                      <svg className="w-4 h-4 text-purple-500/50 flex-shrink-0 group-hover/item:text-purple-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-medium text-gray-500 mb-2.5 uppercase tracking-[0.15em]">
                      <span className="w-1 h-1 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                      API Key
                    </label>
                    <div className="relative group/input">
                      <input
                        type="password"
                        value={apiKeyMe}
                        onChange={(e) => setApiKeyMe(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-[#060910] border border-white/[0.06] rounded-2xl py-4 pl-5 pr-14 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/30 focus:ring-4 focus:ring-purple-500/5 transition-all duration-500 font-mono text-sm group-hover/input:border-white/[0.1]"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-700 group-hover/input:text-purple-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <GlowButton 
                    onClick={handleTraceMe} 
                    variant="purple" 
                    loading={isLoading && activeTrace === 'me'}
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    }
                  >
                    Trace My Network
                  </GlowButton>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== OUTPUT SECTION ==================== */}
          {(traceData || isLoading || isError) && (
            <div className="mb-12 animate-fadeIn">
              {/* Output Header dengan Toggle */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">Output Result</h3>
                  {traceData && (
                    <span className="px-2.5 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] text-green-400 font-mono">
                      {activeTrace === 'custom' ? 'CUSTOM TRACE' : 'NETWORK TRACE'}
                    </span>
                  )}
                </div>
                
                {/* Toggle Switch */}
                <div className="flex items-center gap-2 bg-[#0a0e17] border border-white/[0.06] rounded-2xl p-1.5">
                  <button
                    onClick={() => setOutputMode('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      outputMode === 'dashboard'
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-lg shadow-cyan-500/5'
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </button>
                  <button
                    onClick={() => setOutputMode('terminal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      outputMode === 'terminal'
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 shadow-lg shadow-green-500/5'
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Terminal
                  </button>
                </div>
              </div>

              {/* Output Content */}
              {outputMode === 'dashboard' ? (
                <DashboardOutput data={traceData} isLoading={isLoading} />
              ) : (
                <TerminalOutput 
                  output={output} 
                  isLoading={isLoading} 
                  isError={isError} 
                  data={traceData} 
                />
              )}
            </div>
          )}

          {/* ==================== API DOCUMENTATION ==================== */}
          <div id="docs" className="mt-20 scroll-mt-24">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
                API Documentation
              </h3>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">
                Simple REST API endpoints for IP tracking and network intelligence.
              </p>
            </div>
            
            <div className="overflow-x-auto bg-gradient-to-br from-[#0b0f1a] to-[#080c15] border border-white/[0.06] rounded-2xl shadow-2xl shadow-black/50">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-6 py-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">Endpoint</th>
                    <th className="px-6 py-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">Method</th>
                    <th className="px-6 py-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">Parameters</th>
                    <th className="px-6 py-5 text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  <tr className="group/row hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-6 py-5">
                      <code className="text-sm font-mono text-cyan-400 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10">
                        /api/trace
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/10">
                        GET
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg">ip</code>
                        <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg">apikey</code>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">
                      Trace specific IP address for geolocation, ISP, and network data.
                    </td>
                  </tr>
                  <tr className="group/row hover:bg-white/[0.02] transition-colors duration-300">
                    <td className="px-6 py-5">
                      <code className="text-sm font-mono text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10">
                        /api/trace-me
                      </code>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/10">
                        GET
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg">apikey</code>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-400">
                      Automatically detect and trace your own network connection.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                Default API Key: <code className="text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-md font-mono">Fyxzpedia</code>
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 border-t border-white/[0.04] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-cyan-500">IP-Tracer Pro</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-700">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Built with Next.js & Tailwind</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
        
        .delay-75 { animation-delay: 75ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
      `}</style>
    </div>
  );
}
