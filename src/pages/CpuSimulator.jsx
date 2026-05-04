import { useState, useRef, useEffect } from 'react';
import { Play, Bot, Wand2, TerminalSquare, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function CpuSimulator() {
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya asisten ArchAI. Beri tahu saya program apa yang ingin Anda buat, misalnya "Buatkan kode untuk menjumlahkan 5 dan 10".' }
  ]);
  
  const chatEndRef = useRef(null);
  
  // Referensi untuk menargetkan Iframe Svelte
  const simulatorRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { sender: 'user', text: userMessage }]);
    setChatInput('');
    setIsGenerating(true);

    try {
      // 1. Minta AI menghasilkan kode Assembly
      const response = await fetch('http://localhost:3000/api/ai/generate-assembly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage })
      });

      const data = await response.json();

      if (response.ok) {
        const assemblyCode = data.code;
        
        // 2. Beri tahu pengguna bahwa kode sedang diinjeksi
        setChatHistory(prev => [...prev, { 
          sender: 'ai', 
          text: `Berikut adalah kodenya. Saya sedang mengirimkannya langsung ke memori RAM Simulator Anda!\n\n${assemblyCode}` 
        }]);

        // 3. JEMBATAN AJAIB: Tembakkan kode ke Iframe Svelte!
        if (simulatorRef.current && simulatorRef.current.contentWindow) {
          simulatorRef.current.contentWindow.postMessage(
            { 
              type: 'LOAD_CODE', 
              code: assemblyCode 
            }, 
            '*' 
          );
        }

      } else {
        setChatHistory(prev => [...prev, { sender: 'ai', text: `Gagal membuat kode: ${data.error}` }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Terjadi kesalahan saat menghubungi otak AI.' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-muted">
      {/* Navbar tetap di atas */}
      <Navbar />
      
      {/* 
        PERBAIKAN LAYOUT: 
        Menambahkan `pt-[90px]` (padding-top 90px) agar konten tidak tertutup Navbar. 
        Nilai 90px biasanya cukup aman untuk tinggi Navbar standar. 
      */}
      <div className="flex flex-1 overflow-hidden p-6 pt-[90px] pb-6 gap-6 max-w-[1600px] mx-auto w-full relative z-0">
        
        {/* IFRAME SVELTE (Visualizer) */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-border overflow-hidden flex flex-col relative h-full">
          <div className="h-12 bg-gray-50 border-b border-border flex items-center px-4 gap-2 shrink-0">
            <TerminalSquare className="w-5 h-5 text-primary" />
            <span className="font-bold text-sm text-foreground">Interactive CPU Environment</span>
          </div>
          
          <iframe 
            ref={simulatorRef}
            src="/simulator/index.html" 
            className="w-full h-full border-none flex-1"
            title="CPU Visual Simulator"
          />
        </div>

        {/* AI ASSISTANT PANEL */}
        <div className="w-[380px] bg-white rounded-3xl shadow-sm border border-border flex flex-col overflow-hidden shrink-0 h-full">
          <div className="p-5 border-b border-border bg-[#EFF2F7]/50 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 text-white">
              <Bot size={22} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">ArchAI Code Generator</h3>
              <p className="text-[10px] text-primary font-bold tracking-wide">CONNECTED TO SIMULATOR</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4 custom-scrollbar">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm shadow-md' : 'bg-muted border border-border text-foreground rounded-tl-sm'} px-4 py-3 rounded-2xl max-w-[90%] text-sm shadow-sm leading-relaxed whitespace-pre-wrap font-mono`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-muted border border-border text-secondary px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Menganalisis dan menulis kode...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border shrink-0">
            <div className="relative">
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                disabled={isGenerating}
                placeholder="Buatkan program untuk..." 
                className="w-full bg-muted border border-border rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner disabled:opacity-50" 
              />
              <button 
                type="submit" 
                disabled={isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Wand2 size={16} />
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}