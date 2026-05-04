import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Layers, Users, Play, 
  Bell, ChevronDown, Wand2, FileText, Bot, ArrowLeft, DoorOpen,
  ChevronRight, CheckSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClassroomWorkspace() {
  const navigate = useNavigate();
  const [roomState, setRoomState] = useState('dashboard'); 
  const [roomIdInput, setRoomIdInput] = useState('');
  
  // STATE PENTING: Menyimpan ID relasional (UUID) untuk dikirim ke tabel analytics
  const [activeRoomId, setActiveRoomId] = useState(null);
  
  const [joinedRooms, setJoinedRooms] = useState([]); 
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activeTool, setActiveTool] = useState('notes'); 
  const [notesContent, setNotesContent] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Halo! Saya ArchAI Tutor di Class Room Anda. Saya siap membantu merangkum materi ini, membuatkan kuis, atau menjelaskan bagian yang sulit.' }
  ]);
  const chatEndRef = useRef(null);

  const studentId = localStorage.getItem('user_id');
  const studentName = localStorage.getItem('user_name') || 'Mahasiswa';

  const parseMaterialData = (rawName) => {
    try {
      return JSON.parse(rawName);
    } catch {
      return { title: rawName, desc: "", topic: 1 };
    }
  };

  // Generate topics dynamically from available modules
  const topics = useMemo(() => {
    if (availableModules.length === 0) return [];
    
    const topicIds = [...new Set(availableModules.map(mod => parseMaterialData(mod.file_name).topic || 1))];
    return topicIds.sort().map(id => ({ id, title: `Topic ${id}` }));
  }, [availableModules]);

  const fetchJoinedRooms = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/rooms/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setJoinedRooms(data);
      }
    } catch (error) {
      console.error("Gagal memuat daftar kelas:", error);
    }
  }, [studentId]);

  const fetchModules = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/materials/${roomIdInput}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableModules(data);
      } else setAvailableModules([]);
    } catch (error) {
      console.error("Gagal mengambil modul dari database:", error);
      setAvailableModules([]);
    }
  }, [roomIdInput]);

  useEffect(() => {
    if (!studentId) {
      navigate('/login');
    } else {
      fetchJoinedRooms();
    }
  }, [studentId, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    if (roomState === 'course') fetchModules();
  }, [roomState, roomIdInput, fetchModules]);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomIdInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/rooms/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_code: roomIdInput.toUpperCase(),
          student_id: studentId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setRoomIdInput(roomIdInput.toUpperCase());
        setActiveRoomId(data.room_id); // Simpan ID Relasional untuk Analytics
        await fetchJoinedRooms(); 
        setRoomState('course'); 
      } else {
        alert(data.error || "Gagal bergabung ke kelas.");
      }
    } catch {
      alert("Gagal terhubung ke server backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const openCourse = (room) => {
    setRoomIdInput(room.room_code);
    setActiveRoomId(room.id); // Simpan ID Relasional untuk Analytics
    setRoomState('course');
  };

  const openModuleWorkspace = async (moduleData) => {
    setRoomState('workspace');
    setActiveTool('notes');
    setNotesContent(`Mengekstrak dan menganalisis modul "${moduleData.title}" menggunakan AI...\nMohon tunggu sebentar, ini memakan waktu beberapa detik ⏳`);

    try {
      const response = await fetch('http://localhost:3000/api/ai/summarize-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: moduleData.file_path })
      });

      const data = await response.json();

      if (response.ok) {
        setNotesContent(data.summary);
        setChatHistory([
          { sender: 'ai', text: `Saya telah selesai membaca modul "${moduleData.title}". Ada bagian konsep yang ingin didiskusikan lebih lanjut atau ingin saya buatkan kuis latihan?` }
        ]);
      } else {
        setNotesContent(`Gagal merangkum materi: ${data.error}`);
      }
    } catch {
      setNotesContent("Terjadi kesalahan jaringan saat mencoba menghubungi AI.");
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Tentu, saya mencatat pemahaman Anda. Jika sudah siap, klik tombol Generate Kuis di bawah layar notes untuk menguji kemampuan Anda.' }]);
    }, 1200);
  };

  // --- FUNGSI TAHAP 5: PENGIRIMAN ANALITIK IRT ---
  const submitQuizToAnalytics = async () => {
    if (!activeRoomId) return;

    const mockScore = Math.floor(Math.random() * 41) + 60; // Nilai 60 - 100
    let feedback = "";
    
    if (mockScore >= 85) feedback = "Sangat baik. Memahami konsep instruksi mesin dengan cepat dan tepat.";
    else if (mockScore >= 70) feedback = "Cukup baik, namun masih perlu penguatan pada logika memory addressing.";
    else feedback = "Mahasiswa masih kebingungan membedakan fase FETCH dan EXECUTE. Perlu remedial materi.";

    try {
      const response = await fetch('http://localhost:3000/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: activeRoomId,
          student_id: studentId,
          score: mockScore,
          ai_feedback: feedback
        })
      });

      if (response.ok) {
        alert(`Kuis Selesai! Skor Anda: ${mockScore}\nData evaluasi telah dikirim ke Dasbor Analitik Dosen.`);
        setActiveTool('notes');
        setNotesContent("--- HASIL KUIS TERSIMPAN ---\n\nTerus semangat belajar dan ulangi materi yang dirasa masih kurang!");
      } else {
        alert("Gagal mengirim data ke server.");
      }
    } catch (error) {
      console.error("Error saving analytics:", error);
      alert("Terjadi kesalahan jaringan.");
    }
  };


  return (
    <div className="flex flex-col h-screen bg-muted overflow-hidden font-sans">
      <header className="flex items-center justify-between w-full h-[70px] px-6 bg-white border-b border-border shrink-0 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none text-foreground">ArchAI</h1>
              <p className="text-[10px] text-secondary font-medium tracking-wide">CLASS ROOM</p>
            </div>
          </div>
          <div className="h-8 w-px bg-border hidden md:block"></div>
          <Link to="/cpu-simulator" className="hidden md:flex items-center gap-2 text-secondary hover:text-primary transition-colors font-semibold text-sm hover:bg-primary/5 px-4 py-2 rounded-xl">
            <ArrowLeft size={16} /> Kembali ke Simulator
          </Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          <button className="relative p-2 text-secondary hover:bg-muted rounded-full transition cursor-pointer">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-border hidden md:block mx-1"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition border border-transparent hover:border-border">
            <img src={`https://ui-avatars.com/api/?name=${studentName}&background=165DFF&color=fff`} alt="Profile" className="w-9 h-9 rounded-full object-cover shadow-sm" />
            <div className="hidden md:block text-left">
              <p className="font-bold text-sm leading-tight text-foreground">{studentName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] text-secondary font-medium">Online</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-secondary hidden md:block" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        
        {roomState === 'dashboard' && (
          <div className="w-full h-full overflow-y-auto bg-gray-50 p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Kelas Anda</h2>
                  <p className="text-secondary text-sm">Pilih kelas untuk mulai belajar atau gabung kelas baru.</p>
                </div>
                
                <form onSubmit={handleJoinRoom} className="flex gap-2 w-full md:w-auto">
                  <input 
                    type="text" 
                    required 
                    value={roomIdInput} 
                    onChange={e => setRoomIdInput(e.target.value)} 
                    placeholder="Kode Room (ITDP-...)" 
                    className="bg-white border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-48 uppercase" 
                  />
                  <button type="submit" disabled={isLoading} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-hover transition-all shadow-md shadow-primary/20 shrink-0 disabled:opacity-50">
                    Gabung
                  </button>
                </form>
              </div>

              {isLoading && joinedRooms.length === 0 ? (
                <div className="text-center py-10 text-secondary">Memuat daftar kelas Anda...</div>
              ) : joinedRooms.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <DoorOpen size={40} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Kelas</h3>
                  <p className="text-secondary text-sm mb-6 text-center max-w-sm">Masukkan ID Room yang diberikan Dosen Anda pada kolom di atas untuk bergabung.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedRooms.map(room => (
                    <div key={room.id} onClick={() => openCourse(room)} className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                          <Users size={24} />
                        </div>
                        <span className="bg-gray-100 text-foreground text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-wider">
                          ID: {room.room_code}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{room.course_name}</h3>
                      <p className="text-sm text-secondary mb-6">Akses materi dan AI Tutor</p>
                      <div className="mt-auto border-t border-border pt-4 flex justify-between items-center text-sm font-semibold text-primary">
                        Masuk Kelas <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {roomState === 'course' && (
          <div className="w-full h-full overflow-y-auto bg-gray-50 pb-20 custom-scrollbar">
            <div className="bg-[#0B2F6D] text-white w-full pt-12 pb-24 px-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10"><Layers size={200} className="-mt-10 -mr-10" /></div>
              <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <button onClick={() => setRoomState('dashboard')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"><ArrowLeft size={16} /></button>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest">KEMBALI KE DASBOR</span>
                </div>
                <h1 className="text-3xl font-bold mb-3 tracking-wide">Class Room ({roomIdInput.toUpperCase()})</h1>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-14 relative z-20">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6 p-8">
                
                {isLoading ? (
                  <div className="text-center py-10 text-secondary">Memuat materi dari database...</div>
                ) : availableModules.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FileText className="text-gray-400 mx-auto mb-4" size={24} />
                    <h3 className="text-lg font-bold text-gray-700">Belum Ada Materi</h3>
                    <p className="text-sm text-gray-500 mt-2">Dosen belum menambahkan aktivitas di kelas ini.</p>
                  </div>
                ) : (
                  topics.map(topic => {
                    const topicModules = availableModules.filter(mod => parseMaterialData(mod.file_name).topic === topic.id);
                    
                    return (
                      <div key={topic.id} className="mb-8">
                        <div className="flex items-center justify-between border-l-4 border-primary pl-4 py-3 bg-[#f8f9fa] mb-4">
                          <h3 className="text-lg font-medium text-gray-800">{topic.title}</h3>
                        </div>

                        <div className="pl-6 pr-4 space-y-4 mb-4">
                          {topicModules.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Belum ada materi di topik ini.</p>
                          ) : (
                            topicModules.map(module => {
                              const matData = parseMaterialData(module.file_name);
                              return (
                                <div key={module.id} className="flex flex-col group py-2 border-b border-gray-50 last:border-0">
                                  <div className="flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                                    <div>
                                      <div 
                                        onClick={() => openModuleWorkspace({ ...matData, file_path: module.file_path })}
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <p className="text-[#d92231] font-medium hover:underline">{matData.title}</p>
                                        <span className="text-[10px] bg-rose-100 text-rose-600 px-2 py-0.5 rounded font-bold">PDF</span>
                                      </div>
                                      {matData.desc && (
                                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed pr-8">{matData.desc}</p>
                                      )}
                                      <p className="text-xs text-secondary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Klik judul untuk membuka AI Workspace</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* SATU BLOK WORKSPACE YANG SUDAH DIRAPIKAN */}
        {roomState === 'workspace' && (
          <div className="w-full h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden bg-muted">
            <div className="flex-1 bg-white border border-border rounded-3xl shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-3 border-b border-border bg-gray-50 flex items-center justify-between gap-1 shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setRoomState('course')} className="p-1.5 text-secondary hover:bg-gray-200 rounded-lg transition mr-2"><ArrowLeft size={18} /></button>
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-black text-sm text-foreground uppercase tracking-wider">{activeTool === 'quiz' ? 'AI Interactive Quiz' : 'AI Workspace'}</h3>
                </div>
              </div>
              
              <div className="flex-1 p-1 bg-white">
                <textarea 
                  value={notesContent} 
                  onChange={(e) => setNotesContent(e.target.value)} 
                  className={`w-full h-full p-6 text-sm leading-relaxed text-gray-800 outline-none resize-none custom-scrollbar ${activeTool === 'quiz' ? 'font-sans bg-emerald-50/30' : 'font-mono'}`}
                  placeholder="Ketik ringkasan materi..." 
                />
              </div>
              
              <div className="px-3 py-2 border-t border-border bg-gray-50 flex items-center gap-2 shrink-0">
                {activeTool === 'quiz' ? (
                   <button 
                     onClick={submitQuizToAnalytics} 
                     className="text-xs font-bold px-4 py-2 flex items-center gap-2 rounded-lg transition bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                   >
                     <CheckSquare size={14} /> Selesai & Kirim Nilai ke Dosen
                   </button>
                ) : (
                  <button 
                    onClick={() => {
                      setActiveTool('quiz');
                      setNotesContent("--- KUIS INTERAKTIF AI ---\n\n1. Apa yang terjadi pada Program Counter (PC) setelah fase FETCH instruksi selesai dilakukan?\n\n[Ketik jawaban Anda di sini atau diskusikan dengan AI di panel samping...]");
                    }} 
                    className="text-xs font-bold px-4 py-2 flex items-center gap-2 rounded-lg transition text-secondary hover:bg-gray-100"
                  >
                    <Wand2 size={14} /> Generate Kuis IRT
                  </button>
                )}
              </div>
            </div>

            <div className="w-[360px] bg-white border border-border rounded-3xl shadow-sm flex flex-col overflow-hidden shrink-0">
              <div className="px-5 py-4 border-b border-border bg-[#EFF2F7]/50 flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 text-white"><Bot size={22} /></div>
                  <div>
                      <h3 className="font-bold text-sm text-foreground">AI Class Assistant</h3>
                      <p className="text-[10px] text-emerald-600 font-medium">Data Kuis akan tersimpan ke Analitik</p>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 bg-white space-y-4 custom-scrollbar">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-sm shadow-md' : 'bg-muted border border-border text-foreground rounded-tl-sm'} px-4 py-3 rounded-2xl max-w-[90%] text-sm shadow-sm leading-relaxed whitespace-pre-wrap`}>{msg.text}</div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-border shrink-0">
                <div className="relative">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Tanya AI..." className="w-full bg-muted border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary shadow-inner" />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition cursor-pointer shadow-sm"><Play size={14} className="ml-0.5 fill-current" /></button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}