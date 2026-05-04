import { useState, useEffect, useRef } from 'react';
import { 
  Layers, Plus, Users, BarChart2, ChevronRight, ChevronDown, 
  FileText, Upload, Edit3, Trash2, ArrowLeft, BrainCircuit, 
  Lightbulb, Loader2, Pencil
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function LecturerDashboard() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [view, setView] = useState('rooms');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [roomMaterials, setRoomMaterials] = useState([]); 
  const [analyticsData, setAnalyticsData] = useState([]);
  
  const [activeTopicForUpload, setActiveTopicForUpload] = useState(null);

  // STATE TOPIK DINAMIS (Mulai dari 2 topik)
  const [topics, setTopics] = useState([
    { id: 1, title: 'Topic 1' },
    { id: 2, title: 'Topic 2' }
  ]);

  const fileInputRef = useRef(null);
  const dosenId = localStorage.getItem('user_id');
  const dosenName = localStorage.getItem('user_name') || 'Dosen Pengampu';

  useEffect(() => {
    if (!dosenId) navigate('/login');
    else fetchRooms();
  }, [dosenId, navigate]);

  // Efek untuk meregenerasi topik jika ada materi di topik > 2 saat refresh
  useEffect(() => {
    if (roomMaterials.length > 0) {
      const maxTopicId = Math.max(...roomMaterials.map(m => parseMaterialData(m.file_name).topic || 1));
      if (maxTopicId > topics.length) {
        const newTopics = [...topics];
        for (let i = topics.length + 1; i <= maxTopicId; i++) {
          if (!newTopics.find(t => t.id === i)) {
            newTopics.push({ id: i, title: `Topic ${i}` });
          }
        }
        setTopics(newTopics);
      }
    }
  }, [roomMaterials]);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/rooms/dosen/${dosenId}`);
      if (res.ok) setRooms(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    const roomName = prompt("Masukkan Nama Kelas:");
    if (!roomName) return;
    try {
      const response = await fetch('http://localhost:3000/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dosen_id: dosenId, course_name: roomName })
      });
      if (response.ok) {
        const newRoom = await response.json();
        setRooms([newRoom, ...rooms]); 
      }
    } catch (error) {
      alert("Gagal membuat kelas.");
    }
  };

  const openRoom = async (room) => {
    setActiveRoom(room);
    setView('course_edit');
    fetchRoomMaterials(room.room_code);
    fetchAnalytics(room.id);
  };

  const fetchRoomMaterials = async (roomCode) => {
    try {
      const res = await fetch(`http://localhost:3000/api/materials/${roomCode}`);
      if (res.ok) setRoomMaterials(await res.json());
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnalytics = async (roomId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/analytics/${roomId}`);
      if (res.ok) setAnalyticsData(await res.json());
    } catch (error) {
      console.error("Gagal menarik data analitik:", error);
    }
  };

  // --- LOGIKA TOPIK ---
  const handleAddTopic = () => {
    const newId = topics.length > 0 ? Math.max(...topics.map(t => t.id)) + 1 : 1;
    const customTitle = prompt("Masukkan Nama Topik Baru:", `Topic ${newId}`);
    if (customTitle) {
      setTopics([...topics, { id: newId, title: customTitle }]);
    }
  };

  const handleEditTopicName = (id, currentTitle) => {
    const newTitle = prompt("Edit Nama Topik:", currentTitle);
    if (newTitle) {
      setTopics(topics.map(t => t.id === id ? { ...t, title: newTitle } : t));
    }
  };

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Yakin ingin menghapus topik ini? SEMUA MATERI di dalamnya akan ikut terhapus permanen!")) return;
    
    // Cari materi yang ada di topik ini
    const materialsToDelete = roomMaterials.filter(mat => parseMaterialData(mat.file_name).topic === topicId);
    
    try {
      // Hapus dari database (jika ada isinya)
      if (materialsToDelete.length > 0) {
        await Promise.all(materialsToDelete.map(mat => 
          fetch(`http://localhost:3000/api/materials/${mat.id}`, { method: 'DELETE' })
        ));
      }
      // Hapus dari state UI
      setRoomMaterials(roomMaterials.filter(mat => parseMaterialData(mat.file_name).topic !== topicId));
      setTopics(topics.filter(t => t.id !== topicId));
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus topik.");
    }
  };

  // --- LOGIKA MATERI (FILE) ---
  const triggerFileUpload = (topicId) => {
    setActiveTopicForUpload(topicId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Hanya PDF yang diperbolehkan.');
      return;
    }

    let fileName = prompt("Masukkan Judul Materi:", file.name.replace('.pdf', ''));
    if (!fileName) fileName = file.name;
    let fileDesc = prompt("Masukkan deskripsi (Opsional):", "Silakan unduh dan pelajari modul berikut.");

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', activeRoom.id);
    formData.append('file_name', JSON.stringify({ title: fileName, desc: fileDesc, topic: activeTopicForUpload }));

    try {
      const response = await fetch('http://localhost:3000/api/materials/upload', {
        method: 'POST',
        body: formData 
      });
      if (response.ok) {
        const newMaterial = await response.json();
        setRoomMaterials([...roomMaterials, newMaterial]);
        e.target.value = ''; 
      }
    } catch (error) {
      alert("Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
      setActiveTopicForUpload(null);
    }
  };

  const handleEditMaterial = async (mat) => {
    const matData = parseMaterialData(mat.file_name);
    const newTitle = prompt("Edit Judul Materi:", matData.title);
    if (newTitle === null) return; 
    const newDesc = prompt("Edit Deskripsi Materi:", matData.desc);
    if (newDesc === null) return;

    const updatedFileNameJson = JSON.stringify({ title: newTitle, desc: newDesc, topic: matData.topic });

    try {
      const response = await fetch(`http://localhost:3000/api/materials/${mat.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: updatedFileNameJson })
      });
      if (response.ok) {
        setRoomMaterials(roomMaterials.map(m => m.id === mat.id ? { ...m, file_name: updatedFileNameJson } : m));
      } else {
        alert("Gagal menyimpan perubahan.");
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
    }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Hapus PDF ini?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/materials/${id}`, { method: 'DELETE' });
      if (response.ok) setRoomMaterials(roomMaterials.filter(mat => mat.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const parseMaterialData = (rawName) => {
    try {
      return JSON.parse(rawName);
    } catch (e) {
      return { title: rawName, desc: "", topic: 1 };
    }
  };

  return (
    <div className="flex h-screen bg-muted overflow-hidden font-sans">
      <aside className="hidden lg:flex flex-col w-[260px] h-full bg-white border-r border-border shrink-0 z-40">
        <div className="flex items-center gap-3 h-[70px] px-6 border-b border-border shrink-0">
          <div className="w-9 h-9 bg-foreground rounded-xl flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-foreground">ArchAI</h1>
            <p className="text-[10px] text-[#2467ce] font-bold tracking-wide">LECTURER PANEL</p>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 mt-2 px-2">Manajemen</p>
          <button onClick={() => setView('rooms')} className={`flex items-center rounded-xl p-3 gap-3 transition-all ${view === 'rooms' ? 'bg-[#2467ce]/10 border-l-4 border-[#2467ce] text-[#2467ce]' : 'bg-white text-secondary hover:bg-muted'}`}>
            <Layers className="w-5 h-5" />
            <span className="font-bold text-sm">Daftar Kelas</span>
          </button>
          {activeRoom && (
            <>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-2 mt-4 px-2">Kelas Aktif: <br/><span className="text-[#2467ce] truncate block w-full">{activeRoom.course_name}</span></p>
              <button onClick={() => setView('course_edit')} className={`flex items-center rounded-xl p-3 gap-3 transition-all ${view === 'course_edit' ? 'bg-[#2467ce]/10 border-l-4 border-[#2467ce] text-[#2467ce]' : 'bg-white text-secondary hover:bg-muted'}`}>
                <Edit3 className="w-5 h-5" />
                <span className="font-bold text-sm">Edit Materi</span>
              </button>
              <button onClick={() => setView('analytics')} className={`flex items-center rounded-xl p-3 gap-3 transition-all ${view === 'analytics' ? 'bg-[#2467ce]/10 border-l-4 border-[#2467ce] text-[#2467ce]' : 'bg-white text-secondary hover:bg-muted'}`}>
                <BarChart2 className="w-5 h-5" />
                <span className="font-bold text-sm">Analitik IRT AI</span>
              </button>
            </>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        <header className="flex items-center justify-between w-full h-[70px] px-6 bg-white border-b border-border shrink-0 z-30">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-lg text-foreground">Dashboard Dosen</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <img src={`https://ui-avatars.com/api/?name=${dosenName}&background=080C1A&color=fff`} alt="Profile" className="w-9 h-9 rounded-full shadow-sm" />
              <div className="hidden md:block text-left">
                <p className="font-bold text-sm leading-tight text-foreground">{dosenName}</p>
                <p className="text-[10px] text-secondary font-medium">Dosen Pengampu</p>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar">
          {view === 'rooms' && (
            <div className="p-8 max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-foreground">Daftar Kelas Anda</h2>
                  <p className="text-secondary text-sm">Kelola materi dan pantau analitik mahasiswa per kelas.</p>
                </div>
                <button onClick={handleCreateRoom} className="flex items-center gap-2 bg-[#2467ce] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#1a4f9e] transition-all shadow-md">
                  <Plus size={18} /> Buat Room Baru
                </button>
              </div>
              {isLoading ? (
                 <div className="text-center py-10 text-secondary flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2467ce] mb-3" />
                    Memuat daftar kelas...
                 </div>
              ) : rooms.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-300 rounded-3xl">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Layers size={32} className="text-gray-400" /></div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Belum Ada Kelas</h3>
                  <button onClick={handleCreateRoom} className="flex items-center gap-2 bg-[#2467ce] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a4f9e] transition-all shadow-lg mt-4">
                    <Plus size={18} /> Buat Room Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <div key={room.id} onClick={() => openRoom(room)} className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-[#2467ce]/30 transition-all cursor-pointer group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-[#2467ce]/10 text-[#2467ce] rounded-xl flex items-center justify-center"><Users size={24} /></div>
                        <span className="bg-gray-100 text-foreground text-[10px] font-black px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-wider">ID: {room.room_code}</span>
                      </div>
                      <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-[#2467ce] transition-colors">{room.course_name}</h3>
                      <div className="mt-auto border-t border-border pt-4 flex justify-between items-center text-sm font-semibold text-[#2467ce]">
                        Kelola Kelas <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'course_edit' && activeRoom && (
            <div className="pb-32">
              <div className="bg-[#0B2F6D] text-white w-full pt-10 pb-20 px-8 shadow-inner relative overflow-hidden">
                <div className="max-w-5xl mx-auto relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => setView('rooms')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"><ArrowLeft size={16} /></button>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest">MODE EDIT DOSEN</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2 tracking-wide">{activeRoom.course_name}</h1>
                  <p className="text-blue-200 text-sm font-medium">Room ID: {activeRoom.room_code} (Bagikan ID ini ke mahasiswa)</p>
                </div>
              </div>

              <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-6 p-8">
                  
                  <input type="file" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

                  {isUploading && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-[#2467ce]">
                      <Loader2 className="animate-spin" size={20} /> <span className="font-bold text-sm">Mengunggah dan memproses dokumen...</span>
                    </div>
                  )}

                  {topics.map(topic => {
                    const topicMaterials = roomMaterials.filter(mat => parseMaterialData(mat.file_name).topic === topic.id);

                    return (
                      <div key={topic.id} className="mb-8">
                        {/* Topic Header */}
                        <div className="flex items-center justify-between border-l-4 border-rose-600 pl-4 py-3 bg-[#f8f9fa] mb-4 group">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium text-gray-800">{topic.title}</h3>
                            <button onClick={() => handleEditTopicName(topic.id, topic.title)} className="p-1 text-gray-400 hover:text-[#2467ce] transition-colors" title="Edit Nama Topik">
                              <Pencil size={14} />
                            </button>
                          </div>
                          <button onClick={() => handleDeleteTopic(topic.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors mr-2 opacity-0 group-hover:opacity-100" title="Hapus Topik dan Isinya">
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Materials List */}
                        <div className="pl-6 pr-4 space-y-4 mb-4">
                          {topicMaterials.map(mat => {
                            const matData = parseMaterialData(mat.file_name);
                            return (
                              <div key={mat.id} className="flex items-start justify-between group py-2 border-b border-gray-50 last:border-0">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                                  <div>
                                    <p className="text-[#d92231] font-medium">{matData.title}</p>
                                    {matData.desc && (
                                      <p className="text-sm text-gray-600 mt-1 leading-relaxed pr-8">{matData.desc}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  <button onClick={() => handleEditMaterial(mat)} className="p-1.5 text-gray-400 hover:text-[#2467ce] hover:bg-blue-50 rounded-md transition-colors" title="Edit Judul & Deskripsi">
                                    <Pencil size={16} />
                                  </button>
                                  <button onClick={() => handleDeleteMaterial(mat.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Hapus PDF">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add Resource Button */}
                        <div className="pl-6">
                          <button 
                            onClick={() => triggerFileUpload(topic.id)}
                            className="flex items-center gap-1.5 text-sm font-semibold text-[#0f6c44] hover:text-[#0a4a2e] transition-colors"
                          >
                            <Plus size={16} /> Add a resource
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* TOMBOL TAMBAH TOPIK DI BAGIAN BAWAH */}
                  <div className="mt-12 relative flex items-center justify-center">
                    <div className="absolute w-full h-px bg-gray-200"></div>
                    <button 
                      onClick={handleAddTopic}
                      className="relative z-10 bg-white border-2 border-dashed border-gray-300 text-gray-400 hover:text-[#2467ce] hover:border-[#2467ce] rounded-full p-2 transition-colors"
                      title="Tambah Topik Baru"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}

          {view === 'analytics' && activeRoom && (
            <div className="p-8 max-w-6xl mx-auto pb-20">
               <div className="flex items-center gap-3 mb-6">
                <button onClick={() => setView('rooms')} className="p-2 bg-white border border-border hover:bg-gray-50 rounded-lg transition"><ArrowLeft size={16} /></button>
                <div>
                  <h2 className="text-2xl font-black text-foreground">Analitik IRT Kelas: {activeRoom.course_name}</h2>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 mb-8 flex gap-5 items-start shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"><BrainCircuit size={24} /></div>
                <div>
                  <h3 className="font-black text-emerald-800 text-lg mb-1 flex items-center gap-2"><Lightbulb size={18} /> AI Teaching Recommendations</h3>
                  <p className="text-emerald-700 text-sm leading-relaxed mb-1">
                    Berdasarkan analisis hasil kuis, AI Tutor akan mendeteksi topik mana yang paling sulit dipahami oleh mahasiswa.
                  </p>
                </div>
              </div>

              {/* Tabel Hasil Kuis Mahasiswa */}
              <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-gray-50">
                  <h3 className="font-bold text-gray-800">Riwayat Kuis Mahasiswa</h3>
                </div>
                
                {analyticsData.length === 0 ? (
                  <div className="p-10 text-center text-gray-500">
                    Belum ada data kuis yang diselesaikan oleh mahasiswa di kelas ini.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                          <th className="p-4 border-b border-gray-100 font-semibold">Nama Mahasiswa</th>
                          <th className="p-4 border-b border-gray-100 font-semibold">NIM</th>
                          <th className="p-4 border-b border-gray-100 font-semibold text-center">Skor AI</th>
                          <th className="p-4 border-b border-gray-100 font-semibold">Evaluasi AI</th>
                          <th className="p-4 border-b border-gray-100 font-semibold text-right">Waktu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.map((data) => (
                          <tr key={data.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="p-4 border-b border-gray-50 font-medium text-gray-800">{data.student_name}</td>
                            <td className="p-4 border-b border-gray-50 text-gray-600 text-sm">{data.nim}</td>
                            <td className="p-4 border-b border-gray-50 text-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${data.score >= 80 ? 'bg-emerald-100 text-emerald-700' : data.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {data.score}
                              </span>
                            </td>
                            <td className="p-4 border-b border-gray-50 text-gray-600 text-sm max-w-xs truncate" title={data.ai_feedback}>
                              {data.ai_feedback}
                            </td>
                            <td className="p-4 border-b border-gray-50 text-gray-500 text-xs text-right whitespace-nowrap">
                              {new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}