import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [ip, setIp] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyMe, setApiKeyMe] = useState('');
  const [output, setOutput] = useState('> Menunggu input...');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const executeTrace = async (url: string) => {
    setIsLoading(true);
    setIsError(false);
    setOutput('> Tracing network data...');
    
    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || `HTTP Error! Status: ${res.status}`);
      }

      const terminalOutput = `
╔══════════════════════════════════════════╗
║        IP TRACER RESULT                 ║
╠══════════════════════════════════════════╣
║  IP Address  : ${data.ip.padEnd(25)} ║
║  City        : ${(data.city || 'N/A').padEnd(25)} ║
║  Region      : ${(data.region || 'N/A').padEnd(25)} ║
║  Country     : ${(data.country || 'N/A').padEnd(25)} ║
║  Latitude    : ${String(data.lat).padEnd(25)} ║
║  Longitude   : ${String(data.lon).padEnd(25)} ║
║  Timezone    : ${(data.timezone || 'N/A').padEnd(25)} ║
║  ISP         : ${(data.isp || 'N/A').padEnd(25)} ║
║  AS          : ${(data.as || 'N/A').padEnd(25)} ║
╚══════════════════════════════════════════╝
>_ Status: ${data.status ? 'Success' : 'Failed'}
      `.trim();
      
      setOutput(terminalOutput);
    } catch (error: any) {
      setIsError(true);
      setOutput(`> [ERROR] ${error.message || 'Terjadi kesalahan jaringan.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrace = () => {
    if (!ip || !apiKey) {
      setOutput('> [ERROR] Mohon isi IP Address dan API Key.');
      setIsError(true);
      return;
    }
    executeTrace(`/api/trace?ip=${encodeURIComponent(ip)}&apikey=${encodeURIComponent(apiKey)}`);
  };

  const handleTraceMe = () => {
    if (!apiKeyMe) {
      setOutput('> [ERROR] Mohon isi API Key.');
      setIsError(true);
      return;
    }
    executeTrace(`/api/trace-me?apikey=${encodeURIComponent(apiKeyMe)}`);
  };

  return (
    <div className="min-h-screen bg-cyber-bg text-white font-mono relative overflow-hidden">
      <Head>
        <title>IP-Tracer Web API | Cyberpunk Edition</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4"
              style={{ textShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}>
            IP-Tracer Web API
          </h1>
          <p className="text-lg text-cyan-200/80 tracking-widest uppercase">
            Rekayasa Digital &bull; Pelacakan Jaringan &bull; Cyberpunk
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <section className="bg-cyber-card backdrop-blur-md border border-cyber-border rounded-xl p-6 shadow-neon hover:shadow-neon-lg transition-shadow duration-300">
            <h2 className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-cyan-400">[</span> Trace IP Address <span className="text-cyan-400">]</span>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-cyan-300 mb-1">IP Target</label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="Masukkan IP Address target..."
                  className="w-full bg-gray-900/60 border border-cyan-500/50 rounded-lg p-3 text-cyan-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm text-cyan-300 mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Masukkan API Key..."
                  className="w-full bg-gray-900/60 border border-cyan-500/50 rounded-lg p-3 text-cyan-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition"
                />
              </div>
              <button
                onClick={handleTrace}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? 'Menelusuri...' : 'Eksekusi Trace'}
              </button>
            </div>
          </section>

          <section className="bg-cyber-card backdrop-blur-md rounded-xl p-6 transition-shadow duration-300" 
                   style={{ borderColor: 'rgba(168, 85, 247, 0.4)', borderWidth: '1px', boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)' }}>
            <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span className="text-purple-300">[</span> Trace My Network <span className="text-purple-300">]</span>
            </h2>
            <p className="text-gray-300 text-sm mb-6 border-l-2 border-purple-500 pl-3">
              Melacak detail jaringan, ISP, dan koordinat dari koneksi internet Anda saat ini.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-purple-300 mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKeyMe}
                  onChange={(e) => setApiKeyMe(e.target.value)}
                  placeholder="Masukkan API Key..."
                  className="w-full bg-gray-900/60 border border-purple-500/50 rounded-lg p-3 text-purple-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
                />
              </div>
              <button
                onClick={handleTraceMe}
                disabled={isLoading}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Melacak...' : 'Lacak Jaringan Saya'}
              </button>
            </div>
          </section>
        </div>

        <section className="mb-16">
          <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
            <span className="animate-pulse">&#9654;</span> Live Console Output
          </h3>
          <div className="bg-black border-2 border-green-500/60 rounded-xl p-1 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
            <div className="bg-gray-900/80 rounded-lg p-4 min-h-[250px] max-h-[500px] overflow-y-auto">
              <pre className={`font-mono text-sm leading-relaxed whitespace-pre-wrap break-words ${isError ? 'text-red-500' : 'text-green-500'}`}>
                <code>
                  {isLoading ? (
                    <span className="animate-pulse">&#9632;</span>
                  ) : (
                    output
                  )}
                </code>
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
            &mdash; API Documentation &mdash;
          </h3>
          <div className="overflow-x-auto border border-cyan-500/30 rounded-xl shadow-neon">
            <table className="w-full text-left text-sm">
              <thead className="bg-cyan-900/50 text-cyan-200 uppercase">
                <tr>
                  <th className="px-6 py-3">Endpoint</th>
                  <th className="px-6 py-3">Parameter Wajib</th>
                  <th className="px-6 py-3">Tipe</th>
                  <th className="px-6 py-3">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-800/50 text-gray-300">
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-bold text-cyan-400">/api/trace</td>
                  <td className="px-6 py-4"><span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs font-mono">ip</span>, <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs font-mono">apikey</span></td>
                  <td className="px-6 py-4">GET</td>
                  <td className="px-6 py-4">Melacak data geolokasi, ISP, dan AS dari IP target.</td>
                </tr>
                <tr className="hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-bold text-purple-400">/api/trace-me</td>
                  <td className="px-6 py-4"><span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs font-mono">apikey</span></td>
                  <td className="px-6 py-4">GET</td>
                  <td className="px-6 py-4">Mendeteksi dan melacak jaringan Anda sendiri secara otomatis.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-xs mt-4">
            * API Key wajib diisi: <span className="text-yellow-400 font-mono">Fyxzpedia</span>
          </p>
        </section>

        <footer className="mt-20 border-t border-gray-800 pt-8 text-center text-gray-600 text-xs">
          IP-Tracer Web &copy; {new Date().getFullYear()} &mdash; Built with Next.js & Tailwind. Inspired by Cyberpunk 2077.
        </footer>
      </main>
    </div>
  );
}
