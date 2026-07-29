import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

/* ============================================================
   CANVAS PARTICLE SYSTEM - PROFESSIONAL BACKGROUND
   ============================================================ */
const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number; y: number; ox: number; oy: number;
      size: number; speed: number; opacity: number;
      angle: number; color: string;
    }> = [];

    const colors = [
      'rgba(6, 182, 212, OPACITY)',
      'rgba(59, 130, 246, OPACITY)',
      'rgba(139, 92, 246, OPACITY)',
      'rgba(16, 185, 129, OPACITY)',
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    });

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        ox: Math.random() * canvas.width,
        oy: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.1,
        angle: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.angle += p.speed * 0.01;
        p.x = p.ox + Math.cos(p.angle) * 40;
        p.y = p.oy + Math.sin(p.angle) * 40;

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          p.x += dx * 0.005;
          p.y += dy * 0.005;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('OPACITY', String(p.opacity));
        ctx.fill();

        particles.forEach((p2, j) => {
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
          
          if (pdist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.04 * (1 - pdist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

/* ============================================================
   ICON COMPONENTS - SVG PROFESSIONAL
   ============================================================ */
const Icons = {
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.3-4.3"/>
    </svg>
  ),
  Network: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945"/>
      <path d="M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 1 0 4 0 2 2 0 0 1 2-2h1.064"/>
      <path d="M15 20.488V18a2 2 0 0 1 2-2h3.064"/>
    </svg>
  ),
  Key: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z"/>
    </svg>
  ),
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Terminal: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"/>
      <line x1="12" y1="19" x2="20" y2="19"/>
    </svg>
  ),
  Copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Map: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

/* ============================================================
   TOAST NOTIFICATION SYSTEM
   ============================================================ */
const Toast = ({ message, show }: { message: string; show: boolean }) => (
  <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ${
    show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
  }`}>
    <div className="flex items-center gap-3 bg-[#0f1729] border border-emerald-500/30 rounded-2xl px-5 py-3.5 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Icons.Check />
      </div>
      <div>
        <p className="text-sm font-medium text-emerald-400">Copied to clipboard</p>
        <p className="text-xs text-gray-500 mt-0.5 font-mono truncate max-w-[200px]">{message}</p>
      </div>
    </div>
  </div>
);

/* ============================================================
   COPY BUTTON COMPONENT
   ============================================================ */
const CopyButton = ({ text, label }: { text: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 ${
        copied
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          : 'bg-white/[0.04] text-gray-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-gray-200 hover:border-white/[0.15]'
      }`}
    >
      {copied ? <Icons.Check /> : <Icons.Copy />}
      {copied ? 'Copied' : label || 'Copy'}
    </button>
  );
};

/* ============================================================
   CODE BLOCK COMPONENT
   ============================================================ */
const CodeBlock = ({ code, language = 'bash', label }: { code: string; language?: string; label?: string }) => (
  <div className="relative group bg-[#0a0d15] border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-[#0d1020]/50">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        {label && (
          <span className="text-xs text-gray-600 font-mono">{label}</span>
        )}
      </div>
      <CopyButton text={code} />
    </div>
    <pre className="p-5 overflow-x-auto">
      <code className="text-sm font-mono text-gray-300 leading-relaxed">{code}</code>
    </pre>
  </div>
);

/* ============================================================
   TUTORIAL STEP COMPONENT
   ============================================================ */
const TutorialStep = ({ number, title, description, code, curlExample }: {
  number: number;
  title: string;
  description: string;
  code?: string;
  curlExample?: string;
}) => (
  <div className="group relative">
    <div className="absolute -left-3 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm shadow-lg shadow-cyan-500/5">
        {number}
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">{description}</p>
        </div>
        
        {code && <CodeBlock code={code} label="javascript" />}
        
        {curlExample && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600 uppercase tracking-wider font-medium">cURL Example</p>
            <CodeBlock code={curlExample} label="terminal" />
          </div>
        )}
      </div>
    </div>
  </div>
);

/* ============================================================
   DASHBOARD OUTPUT - TAMPILAN KARTU INFORMASI
   ============================================================ */
const DashboardOutput = ({ data, isLoading }: { data: any; isLoading: boolean }) => {
  const mapsUrl = data?.lat && data?.lon 
    ? `https://www.google.com/maps?q=${data.lat},${data.lon}`
    : '#';

  if (isLoading) {
    return (
      <div className="bg-[#0a0f18] border border-white/[0.06] rounded-3xl p-10 shadow-2xl shadow-black/50">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/10 border-b-blue-500 animate-spin animation-delay-500" style={{ animationDuration: '1.5s' }} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-cyan-400 font-medium text-sm">Processing Request</p>
            <p className="text-gray-600 text-xs font-mono">Querying network intelligence database...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { key: 'ip', label: 'IP Address', value: data.ip, icon: <Icons.Network />, color: 'cyan' },
    { key: 'location', label: 'Location', value: `${data.city}, ${data.region}`, sub: data.country, icon: <Icons.Globe />, color: 'purple' },
    { key: 'isp', label: 'ISP Provider', value: data.isp, icon: <Icons.Shield />, color: 'emerald' },
    { key: 'as', label: 'AS Number', value: data.as, icon: <Icons.Key />, color: 'amber' },
    { key: 'timezone', label: 'Timezone', value: data.timezone, icon: <Icons.Clock />, color: 'indigo' },
    { key: 'coordinates', label: 'Coordinates', value: `${data.lat}, ${data.lon}`, icon: <Icons.Map />, color: 'rose' },
  ];

  const colorMap: Record<string, string> = {
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    indigo: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
    rose: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Status Bar */}
      <div className="flex items-center justify-between bg-[#0a0f18] border border-white/[0.06] rounded-2xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '100ms' }} />
          </div>
          <span className="text-sm font-semibold text-emerald-400">Trace Successful</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1.5">
            <Icons.Clock />
            {new Date().toLocaleTimeString()}
          </span>
          <span className="w-px h-4 bg-white/[0.06]" />
          <span className="font-mono text-cyan-400">{Math.floor(Math.random() * 80 + 20)}ms</span>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.key}
            className="group/card bg-[#0a0f18] border border-white/[0.05] rounded-2xl p-5 hover:bg-[#0d1220] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/30 cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl border ${colorMap[card.color]} flex items-center justify-center`}>
                {card.icon}
              </div>
              <CopyButton text={card.value} />
            </div>
            <p className="text-xs text-gray-600 uppercase tracking-wider font-medium mb-1">{card.label}</p>
            <p className="text-base font-semibold text-gray-200 group-hover/card:text-white transition-colors break-all">{card.value}</p>
            {card.sub && (
              <p className="text-sm text-gray-600 mt-1">{card.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Google Maps CTA */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group/maps block relative overflow-hidden bg-gradient-to-r from-[#0a0f18] to-[#0d1321] border-2 border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/50 transition-all duration-500 shadow-xl hover:shadow-cyan-500/10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/3 to-blue-500/0 opacity-0 group-hover/maps:opacity-100 transition-opacity duration-700" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/10 to-yellow-500/10 border border-red-500/20 flex items-center justify-center group-hover/maps:scale-110 transition-transform duration-500">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path fill="#EA4335" d="M12 0C7.31 0 3.46 3.85 3.46 8.54 3.46 13.23 12 24 12 24s8.54-10.77 8.54-15.46C20.54 3.85 16.69 0 12 0z"/>
                <circle cx="12" cy="8.5" r="3" fill="#4285F4"/>
              </svg>
            </div>
            <div>
              <h4 className="text-base font-semibold text-white group-hover/maps:text-cyan-300 transition-colors">View Location on Google Maps</h4>
              <p className="text-sm text-gray-500 font-mono mt-0.5">{data.lat}, {data.lon}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 group-hover/maps:text-cyan-400 transition-colors">
            <span className="hidden sm:inline text-sm">Open Maps</span>
            <Icons.ArrowRight />
          </div>
        </div>
      </a>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
        >
          <Icons.Map />
          Open in Google Maps
        </a>
        <button
          onClick={() => {
            const text = `IP: ${data.ip}\nLocation: ${data.city}, ${data.region}, ${data.country}\nISP: ${data.isp}\nAS: ${data.as}\nCoordinates: ${data.lat}, ${data.lon}\nMaps: ${mapsUrl}`;
            navigator.clipboard.writeText(text);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-300"
        >
          <Icons.Copy />
          Copy All Info
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   TERMINAL OUTPUT
   ============================================================ */
const TerminalOutput = ({ output, isLoading, isError, data }: {
  output: string; isLoading: boolean; isError: boolean; data: any;
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const mapsUrl = data?.lat && data?.lon ? `https://www.google.com/maps?q=${data.lat},${data.lon}` : null;

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output, isLoading]);

  return (
    <div className="bg-[#050508] border border-gray-800/30 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 font-mono">
      <div className="bg-[#0f0f14] px-5 py-3 flex items-center justify-between border-b border-gray-800/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-gray-700">root@ip-tracer — bash</span>
        </div>
        <div className="flex items-center gap-3">
          <CopyButton text={output} />
          <span className={`text-[10px] font-medium ${
            isLoading ? 'text-yellow-500' : isError ? 'text-red-500' : data ? 'text-emerald-500' : 'text-gray-700'
          }`}>
            {isLoading ? 'EXECUTING' : isError ? 'ERROR' : data ? 'SUCCESS' : 'IDLE'}
          </span>
        </div>
      </div>

      <div
        ref={terminalRef}
        className="p-6 min-h-[350px] max-h-[550px] overflow-y-auto custom-scrollbar"
        style={{ background: 'linear-gradient(180deg, #050508 0%, #030305 100%)' }}
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500">$</span>
              <span className="text-gray-400">./ip-tracer --execute</span>
            </div>
            <div className="space-y-2 pl-4">
              {['Initializing network scan...', 'Resolving target hostname...', 'Querying geolocation database...', 'Fetching ISP records...'].map((line, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-600">
                  <span className="text-emerald-600">|</span>
                  <span className="animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <pre className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isError ? 'text-red-400' : 'text-emerald-400'
          }`}>
            <code>{output || '$ _'}</code>
          </pre>
        )}

        {!isLoading && mapsUrl && (
          <div className="mt-5 pt-4 border-t border-gray-800/30">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-emerald-500">$</span>
              <span>open maps:</span>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline decoration-dotted underline-offset-4 transition-colors"
              >
                {mapsUrl}
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="bg-[#0f0f14]/50 px-5 py-2.5 border-t border-gray-800/30 flex items-center justify-between text-[10px] text-gray-700">
        <span>TTY: pts/0</span>
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

/* ============================================================
   GLOW BUTTON
   ============================================================ */
const GlowButton = ({ children, onClick, variant = 'cyan', loading = false, icon }: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'cyan' | 'purple' | 'emerald';
  loading?: boolean;
  icon?: React.ReactNode;
}) => {
  const variants = {
    cyan: {
      bg: 'from-cyan-600 to-blue-700',
      shadow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]',
    },
    purple: {
      bg: 'from-purple-600 to-violet-700',
      shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(139,92,246,0.5)]',
    },
    emerald: {
      bg: 'from-emerald-600 to-teal-700',
      shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
      hoverShadow: 'hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]',
    },
  };

  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`relative w-full font-semibold py-4 px-8 rounded-2xl text-white bg-gradient-to-r ${v.bg} ${v.shadow} ${v.hoverShadow} transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group`}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
      <span className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="relative flex items-center justify-center gap-3">
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="animate-pulse">Processing...</span>
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
   STAT CARD
   ============================================================ */
const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex items-center gap-4 px-5 py-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 group cursor-default">
    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all duration-500">
      {icon}
    </div>
    <div>
      <div className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors">{value}</div>
      <div className="text-xs text-gray-600 mt-0.5">{label}</div>
    </div>
  </div>
);

/* ============================================================
   MAIN APPLICATION
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
  const [toast, setToast] = useState({ show: false, message: '' });
  const [activeSection, setActiveSection] = useState('tracer');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 2500);
  };

  const executeTrace = useCallback(async (url: string, type: 'custom' | 'me') => {
    setIsLoading(true);
    setIsError(false);
    setTraceData(null);
    setActiveTrace(type);
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data.status) throw new Error(data.message || `HTTP ${res.status}`);

      setTraceData(data);
      
      const mapsUrl = data.lat && data.lon ? `https://www.google.com/maps?q=${data.lat},${data.lon}` : 'N/A';
      const terminalText = `
  ██╗██████╗    ████████╗██████╗  █████╗  ██████╗███████╗
  ██║██╔══██╗   ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██╔════╝
  ██║██████╔╝█████╗██║   ██████╔╝███████║██║     █████╗  
  ██║██╔═══╝ ╚════╝██║   ██╔══██╗██╔══██║██║     ██╔══╝  
  ██║██║           ██║   ██║  ██║██║  ██║╚██████╗███████╗
  ╚═╝╚═╝           ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚══════╝

  TARGET IP      : ${data.ip}
  CITY           : ${data.city || 'N/A'}
  REGION         : ${data.region || 'N/A'}
  COUNTRY        : ${data.country || 'N/A'}
  LATITUDE       : ${data.lat || 'N/A'}
  LONGITUDE      : ${data.lon || 'N/A'}
  TIMEZONE       : ${data.timezone || 'N/A'}
  ISP            : ${data.isp || 'N/A'}
  AS NUMBER      : ${data.as || 'N/A'}
  ──────────────────────────────────────
  GOOGLE MAPS    : ${mapsUrl}
  ──────────────────────────────────────
  STATUS         : SUCCESS
  RESPONSE TIME  : ${Math.floor(Math.random() * 80 + 20)}ms

  $ _`.trim();
      
      setOutput(terminalText);
    } catch (error: any) {
      setIsError(true);
      setTraceData(null);
      setOutput(`$ ERROR: ${error.message}\n$ EXIT CODE: 1`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleTrace = () => {
    if (!ip || !apiKey) {
      setIsError(true);
      setOutput('$ ERROR: Missing required parameters\n$ USAGE: IP Address and API Key are required');
      setTraceData(null);
      return;
    }
    executeTrace(`/api/trace?ip=${encodeURIComponent(ip)}&apikey=${encodeURIComponent(apiKey)}`, 'custom');
  };

  const handleTraceMe = () => {
    if (!apiKeyMe) {
      setIsError(true);
      setOutput('$ ERROR: API Key is required');
      setTraceData(null);
      return;
    }
    executeTrace(`/api/trace-me?apikey=${encodeURIComponent(apiKeyMe)}`, 'me');
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-white font-sans relative overflow-x-hidden selection:bg-cyan-500/30">
      <Head>
        <title>IP-Tracer Pro — Advanced Network Intelligence Platform</title>
        <meta name="description" content="Enterprise-grade IP tracking and network intelligence with real-time geolocation, ISP mapping, and comprehensive analytics." />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌐</text></svg>" />
      </Head>

      <ParticleSystem />
      <Toast message={toast.message} show={toast.show} />

      {/* ==================== NAVIGATION ==================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#06080d]/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-2xl shadow-black/50' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Icons.Network />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:block">
                IP-Tracer Pro
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1 bg-white/[0.02] border border-white/[0.04] rounded-2xl p-1">
              {[
                { id: 'tracer', label: 'Tracer' },
                { id: 'docs', label: 'Documentation' },
                { id: 'tutorial', label: 'Tutorial' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-cyan-500/15 text-cyan-400 shadow-lg shadow-cyan-500/5'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/15 rounded-full text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API v2.1
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="relative z-10 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ==================== HERO ==================== */}
          <div className="text-center mb-16" id="tracer">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-cyan-500/[0.05] border border-cyan-500/15 rounded-full text-[12px] text-cyan-400 mb-8 font-medium tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              ENTERPRISE NETWORK INTELLIGENCE
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-none tracking-tight">
              <span className="text-white">Advanced IP</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Tracking System
              </span>
            </h1>
            
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Real-time geolocation, ISP intelligence, and comprehensive network analytics 
              powered by enterprise-grade infrastructure.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <StatCard icon={<Icons.Globe />} value="195+" label="Countries" />
              <StatCard icon={<Icons.Zap />} value="99.99%" label="Uptime SLA" />
              <StatCard icon={<Icons.Shield />} value="256-bit" label="SSL Security" />
            </div>
          </div>

          {/* ==================== TRACE CARDS ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
            
            {/* Trace Custom IP */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/3 to-blue-500/3 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-[#0a0e18] border border-white/[0.05] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 hover:border-cyan-500/12 transition-all duration-700">
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/15 flex items-center justify-center shadow-lg shadow-cyan-500/5">
                    <Icons.Search />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Trace IP Address</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Investigate specific target</p>
                  </div>
                  {activeTrace === 'custom' && traceData && (
                    <span className="ml-auto px-3 py-1 bg-emerald-500/8 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wider">
                      Target IP / Domain
                    </label>
                    <input
                      type="text"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      placeholder="192.168.1.1 or example.com"
                      className="w-full bg-[#050810] border border-white/[0.05] rounded-2xl py-4 px-5 text-white placeholder-gray-700 focus:outline-none focus:border-cyan-500/25 focus:ring-4 focus:ring-cyan-500/5 transition-all duration-500 font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wider">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full bg-[#050810] border border-white/[0.05] rounded-2xl py-4 px-5 text-white placeholder-gray-700 focus:outline-none focus:border-yellow-500/25 focus:ring-4 focus:ring-yellow-500/5 transition-all duration-500 font-mono text-sm"
                    />
                  </div>

                  <GlowButton onClick={handleTrace} variant="cyan" loading={isLoading && activeTrace === 'custom'} icon={<Icons.Search />}>
                    Execute Trace
                  </GlowButton>
                </div>
              </div>
            </div>

            {/* Trace My Network */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/3 to-violet-500/3 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-[#0a0e18] border border-white/[0.05] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 hover:border-purple-500/12 transition-all duration-700">
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/15 flex items-center justify-center shadow-lg shadow-purple-500/5">
                    <Icons.Network />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Trace My Network</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Auto-detect your connection</p>
                  </div>
                  {activeTrace === 'me' && traceData && (
                    <span className="ml-auto px-3 py-1 bg-purple-500/8 border border-purple-500/20 rounded-full text-[10px] text-purple-400 font-medium uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {['Automatic IP Detection', 'ISP & Network Analysis', 'Geolocation Coordinates'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                      <Icons.Check />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2.5 uppercase tracking-wider">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={apiKeyMe}
                      onChange={(e) => setApiKeyMe(e.target.value)}
                      placeholder="Enter your API key"
                      className="w-full bg-[#050810] border border-white/[0.05] rounded-2xl py-4 px-5 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/25 focus:ring-4 focus:ring-purple-500/5 transition-all duration-500 font-mono text-sm"
                    />
                  </div>

                  <GlowButton onClick={handleTraceMe} variant="purple" loading={isLoading && activeTrace === 'me'} icon={<Icons.Zap />}>
                    Trace My Network
                  </GlowButton>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== OUTPUT SECTION ==================== */}
          {(traceData || isLoading || isError) && (
            <div className="mb-16 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white">Output</h3>
                  {traceData && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/8 border border-emerald-500/15 rounded-full text-[10px] text-emerald-400 font-mono uppercase">
                      {activeTrace === 'custom' ? 'Custom Trace' : 'Network Trace'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#0a0e18] border border-white/[0.04] rounded-2xl p-1.5">
                  <button
                    onClick={() => setOutputMode('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      outputMode === 'dashboard'
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Icons.Search />
                    Dashboard
                  </button>
                  <button
                    onClick={() => setOutputMode('terminal')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      outputMode === 'terminal'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'text-gray-600 hover:text-gray-400'
                    }`}
                  >
                    <Icons.Terminal />
                    Terminal
                  </button>
                </div>
              </div>

              {outputMode === 'dashboard' ? (
                <DashboardOutput data={traceData} isLoading={isLoading} />
              ) : (
                <TerminalOutput output={output} isLoading={isLoading} isError={isError} data={traceData} />
              )}
            </div>
          )}

          {/* ==================== DOCUMENTATION ==================== */}
          <div id="docs" className="scroll-mt-28 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                API Documentation
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Simple and powerful REST API endpoints for IP intelligence.
              </p>
            </div>

            {/* Endpoints Table */}
            <div className="bg-[#0a0e18] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl shadow-black/50 mb-8">
              <div className="px-6 py-5 border-b border-white/[0.04]">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Available Endpoints</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.03]">
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    <tr className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400 font-medium">GET</span>
                      </td>
                      <td className="px-6 py-5">
                        <code className="text-sm font-mono text-cyan-400 bg-cyan-500/5 px-3 py-1.5 rounded-lg border border-cyan-500/10">/api/trace</code>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10">ip</code>
                          <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10">apikey</code>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">Trace specific IP for geolocation data</td>
                      <td className="px-6 py-5">
                        <CopyButton text="/api/trace?ip=8.8.8.8&apikey=Fyxzpedia" label="Copy URL" />
                      </td>
                    </tr>
                    <tr className="group/row hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400 font-medium">GET</span>
                      </td>
                      <td className="px-6 py-5">
                        <code className="text-sm font-mono text-purple-400 bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/10">/api/trace-me</code>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5">
                          <code className="text-xs font-mono text-yellow-400 bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/10">apikey</code>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">Auto-detect and trace your network</td>
                      <td className="px-6 py-5">
                        <CopyButton text="/api/trace-me?apikey=Fyxzpedia" label="Copy URL" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Key Info */}
            <div className="bg-[#0a0e18] border border-yellow-500/10 rounded-2xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/8 border border-yellow-500/15 flex items-center justify-center">
                  <Icons.Key />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-400">Default API Key</p>
                  <p className="text-xs text-gray-500 mt-0.5">Use this key for all API requests</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <code className="text-sm font-mono text-yellow-400 bg-yellow-500/5 px-4 py-2 rounded-xl border border-yellow-500/15">Fyxzpedia</code>
                <CopyButton text="Fyxzpedia" />
              </div>
            </div>
          </div>

          {/* ==================== TUTORIAL ==================== */}
          <div id="tutorial" className="scroll-mt-28 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
                Quick Start Tutorial
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Get started with IP-Tracer API in minutes.
              </p>
            </div>

            <div className="space-y-12">
              <TutorialStep
                number={1}
                title="Trace a Specific IP Address"
                description="Send a GET request to the trace endpoint with the target IP and your API key. The API will return comprehensive geolocation data including city, region, country, coordinates, timezone, ISP, and AS number."
                curlExample={`curl -X GET "https://your-domain.vercel.app/api/trace?ip=8.8.8.8&apikey=Fyxzpedia"`}
                code={`// JavaScript Fetch Example
const response = await fetch(
  '/api/trace?ip=8.8.8.8&apikey=Fyxzpedia'
);
const data = await response.json();

console.log(data);
// {
//   "status": true,
//   "ip": "8.8.8.8",
//   "city": "Mountain View",
//   "region": "California",
//   "country": "United States",
//   "lat": 37.4056,
//   "lon": -122.0775,
//   "timezone": "America/Los_Angeles",
//   "isp": "Google LLC",
//   "as": "AS15169 Google LLC"
// }`}
              />

              <TutorialStep
                number={2}
                title="Trace Your Own Network"
                description="Use the trace-me endpoint to automatically detect and trace your current network connection. No need to know your IP address — the API detects it from request headers."
                curlExample={`curl -X GET "https://your-domain.vercel.app/api/trace-me?apikey=Fyxzpedia"`}
                code={`// JavaScript Fetch Example
const response = await fetch(
  '/api/trace-me?apikey=Fyxzpedia'
);
const data = await response.json();

console.log(\`Your IP: \${data.ip}\`);
console.log(\`Location: \${data.city}, \${data.country}\`);
console.log(\`ISP: \${data.isp}\`);`}
              />

              <TutorialStep
                number={3}
                title="Error Handling"
                description="The API returns clear error messages with appropriate HTTP status codes. Always check the status field and handle errors gracefully in your application."
                curlExample={`# Invalid API Key
curl -X GET "https://your-domain.vercel.app/api/trace?ip=8.8.8.8&apikey=wrong"

# Response: 401 Unauthorized
# {"status": false, "message": "Invalid API Key"}`}
                code={`// Error Handling Example
try {
  const response = await fetch(
    '/api/trace?ip=8.8.8.8&apikey=Fyxzpedia'
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  const data = await response.json();
  
  if (data.status) {
    // Success - use data
    displayResult(data);
  }
} catch (error) {
  console.error('Trace failed:', error.message);
}`}
              />
            </div>
          </div>

        </div>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative z-10 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="text-cyan-500 font-medium">IP-Tracer Pro</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>Privacy Policy</span>
              <span className="w-1 h-1 rounded-full bg-gray-800" />
              <span>Terms of Service</span>
              <span className="w-1 h-1 rounded-full bg-gray-800" />
              <span>Built with Next.js</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #050508;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
}
