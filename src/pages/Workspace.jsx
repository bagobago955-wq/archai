import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Cpu, MessageSquare, BrainCircuit, Play, Trash2, 
  Layers, BarChart2, Users, Bell, Menu, ChevronDown 
} from 'lucide-react';

export default function Workspace() {
  const [activeTab, setActiveTab] = useState('tutor');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya ArchAI Tutor. Ada yang ingin ditanyakan seputar siklus instruksi CPU atau kode Assembly?' }
  ]);
  const [simulationLogs, setSimulationLogs] = useState([]);
  const [debugLogs, setDebugLogs] = useState([]);
  const logsEndRef = useRef(null);
  const chatEndRef = useRef(null);

  // Auto-scroll ke log terbaru
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulationLogs, debugLogs]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Fungsi pengirim pesan ke AI
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error);

      setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Maaf, otak AI sedang mengalami gangguan koneksi.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // JEMBATAN KOMUNIKASI (BRIDGE) REACT <-> SVELTE IFRAME
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data?.type === 'ARKON_SIMULATION_RESULT') {
        setSimulationLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
          ...event.data.payload
        }]);
      }
      if (event.data?.type === 'ARKON_SIMULATION_LOG') {
        setDebugLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
          ...event.data.payload
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-muted overflow-hidden font-sans">
      
      {/* ========================================== */}
      {/* TOP NAVBAR FULL WIDTH                      */}
      {/* ========================================== */}
      <header className="flex items-center justify-between w-full h-[70px] px-6 bg-white border-b border-border shrink-0 z-40">
        
        {/* Kiri: Logo & Menu Navigasi */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-foreground">ArchAI</h1>
              <p className="text-[10px] text-secondary font-medium tracking-wide">WORKSPACE</p>
            </div>
          </div>

          {/* Garis Pemisah */}
          <div className="h-8 w-px bg-border hidden md:block"></div>

          {/* Menu Navigasi (Pindahan dari Sidebar) */}
          <nav className="hidden md:flex items-center gap-2">
            <button className="flex items-center rounded-xl px-4 py-2 gap-2 text-secondary hover:bg-gray-50 transition-all cursor-pointer">
              <BarChart2 className="w-[18px] h-[18px]" />
              <span className="font-medium text-sm">Analitik</span>
            </button>
            
            {/* Menu Aktif */}
            <button className="flex items-center rounded-xl px-4 py-2 gap-2 bg-primary/5 text-primary border border-primary/10 transition-all cursor-pointer shadow-sm">
              <Cpu className="w-[18px] h-[18px]" />
              <span className="font-bold text-sm">Visualizer</span>
            </button>

            <button className="flex items-center rounded-xl px-4 py-2 gap-2 text-secondary hover:bg-gray-50 transition-all cursor-pointer">
              <Users className="w-[18px] h-[18px]" />
              <span className="font-medium text-sm">Class Room</span>
            </button>
          </nav>
        </div>
        
        {/* Kanan: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-5">
          <button className="md:hidden p-2 text-secondary hover:bg-muted rounded-lg">
            <Menu className="w-6 h-6" />
          </button>

          {/* Run Button (Pindah ke Kanan) */}
          <button className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary-hover transition-all shadow-md shadow-primary/20 cursor-pointer">
            <Play size={16} className="fill-current" /> Jalankan
          </button>

          <button className="relative p-2 text-secondary hover:bg-muted rounded-full transition cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
          
          <div className="h-8 w-px bg-border hidden md:block mx-1"></div>

          {/* Profile Dropdown Minimalis */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition border border-transparent hover:border-border">
            <img src="https://ui-avatars.com/api/?name=Mahasiswa&background=165DFF&color=fff" alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm" />
            <div className="hidden md:block text-left">
              <p className="font-bold text-sm leading-tight text-foreground">Mahasiswa</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-secondary font-medium">Online</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-secondary hidden md:block" />
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. MAIN CONTENT AREA (PANEL BAWAH)         */}
      {/* ========================================== */}
      <main className="flex-1 flex gap-6 p-6 overflow-hidden min-w-0">
        
        {/* PANEL KIRI: AI TUTOR (PRODIFY CARD STYLE) */}
        <div className="w-[380px] bg-white border border-border rounded-3xl shadow-sm flex flex-col overflow-hidden shrink-0">
          
          {/* Header Panel AI */}
          <div className="px-5 py-4 border-b border-border bg-gray-50/50 flex flex-col gap-1 shrink-0">
             <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
               <MessageSquare size={16} className="text-primary" /> AI Tutor Assistant
             </h3>
             <p className="text-[10px] text-secondary">Dr. Supriyanto | Room: ITDP-2027</p>
          </div>

          {/* Tabs */}
          <div className="flex p-2 border-b border-border gap-1 shrink-0">
            <button onClick={() => setActiveTab('tutor')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'tutor' ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-gray-50'}`}>
              Chat
            </button>
            <button onClick={() => setActiveTab('summary')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'summary' ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-gray-50'}`}>
              Materi
            </button>
            <button onClick={() => setActiveTab('flashcard')} className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 rounded-xl transition-all ${activeTab === 'flashcard' ? 'bg-primary/10 text-primary' : 'text-secondary hover:bg-gray-50'}`}>
              Kuis
            </button>
          </div>

          {/* Chat & Logs Content */}
          <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4 custom-scrollbar">
            {activeTab === 'tutor' && (
              <>
                {/* Chat Bubbles Dynamic */}
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-muted border border-border text-foreground rounded-tl-sm'} px-4 py-3 rounded-2xl max-w-[90%] text-sm shadow-sm leading-relaxed whitespace-pre-wrap`}>
                      {msg.text.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted border border-border text-secondary px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm italic flex gap-1">
                      <span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.4s'}}>.</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />

                {/* Live Simulation Logs (Data dari Svelte) */}
                {simulationLogs.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-xs text-foreground flex items-center gap-2">
                        <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                        Live Execution State
                      </span>
                      <button onClick={() => { setSimulationLogs([]); setDebugLogs([]); }} className="text-[10px] text-secondary hover:text-red-500 transition flex items-center gap-1 bg-gray-50 hover:bg-red-50 px-2 py-1 rounded-lg cursor-pointer">
                        <Trash2 size={12} /> Bersihkan
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {simulationLogs.map((log, i) => (
                        <div key={i} className="bg-gray-50 border border-border p-3 rounded-xl shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${log.status === 'HALTED' ? 'bg-rose-100 text-rose-600' : log.status === 'STEP_EXECUTED' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-700'}`}>
                              {log.status}
                            </span>
                            <span className="text-[10px] text-secondary font-mono">{log.timestamp}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-white p-2 rounded-lg border border-border">
                            <div><span className="text-gray-400">PC:</span> <span className="font-bold text-indigo-600">{log.data?.pc ?? '-'}</span></div>
                            <div><span className="text-gray-400">ACC:</span> <span className="font-bold text-emerald-600">{log.data?.acc ?? '-'}</span></div>
                            {log.data?.instruction && (
                              <div className="col-span-2 pt-1 border-t border-gray-100 mt-1">
                                <span className="text-gray-400">Instruksi:</span> <span className="font-bold text-rose-500">{log.data.instruction}</span>
                              </div>
                            )}
                          </div>
                          {log.message && <p className="text-[10px] text-secondary mt-2 italic">{log.message}</p>}
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border shrink-0">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                placeholder="Ketik instruksi AI..." 
                className="w-full bg-muted border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner disabled:opacity-50" 
              />
              <button type="submit" disabled={isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer shadow-sm disabled:bg-gray-400">
                <Play size={14} className="ml-0.5 fill-current" />
              </button>
            </div>
          </form>
        </div>

        {/* PANEL KANAN: SVELTE CPU SIMULATOR */}
        <div className="flex-1 bg-foreground rounded-3xl shadow-xl overflow-hidden relative border border-gray-800">
          
          {/* Label Svelte dipindah ke Kanan Bawah */}
          <div className="absolute bottom-5 right-5 z-10 bg-black/60 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
            <Cpu className="text-primary w-4 h-4" />
            <span className="text-xs font-bold tracking-wide">CPU Virtual Engine</span>
          </div>
          
          <iframe 
            title="CPU Visual Simulator"
            src="/simulator/index.html" 
            className="w-full h-full border-none"
          />
        </div>

      </main>
    </div>
  );
}