import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('mahasiswa');
  const [isLoading, setIsLoading] = useState(false);
  
  // State untuk menampung input form
  const [formData, setFormData] = useState({
    full_name: '',
    identifier_number: '',
    password: ''
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Menembak API Registrasi di Backend
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          identifier_number: formData.identifier_number,
          password: formData.password,
          role: role // 'mahasiswa' atau 'dosen'
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registrasi berhasil! Silakan Login.');
        navigate('/login'); // Lempar ke halaman login setelah sukses
      } else {
        // Tampilkan pesan error dari backend (misal: NIM sudah terdaftar)
        alert(data.error || 'Gagal melakukan registrasi.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server backend. Pastikan server berjalan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center p-4 bg-muted">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
          <p className="text-secondary text-sm mt-1">Join the ArchAI Ecosystem</p>
        </div>

        {/* Role Toggle */}
        <div className="flex p-1.5 bg-muted border border-border rounded-2xl mb-8">
          <button 
            type="button"
            onClick={() => setRole('mahasiswa')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'mahasiswa' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
          >
            <GraduationCap size={18} /> Mahasiswa
          </button>
          <button 
            type="button"
            onClick={() => setRole('dosen')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl transition-all ${role === 'dosen' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-foreground'}`}
          >
            <Briefcase size={18} /> Dosen
          </button>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="text" 
                required 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-muted focus:bg-white text-sm font-medium" 
                placeholder="Contoh: Muhammad Nouval" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">
              {role === 'mahasiswa' ? 'NIM (Nomor Induk Mahasiswa)' : 'NIP (Nomor Induk Pegawai)'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="text" 
                required 
                onChange={(e) => setFormData({...formData, identifier_number: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-muted focus:bg-white text-sm font-medium" 
                placeholder={role === 'mahasiswa' ? 'Masukkan NIM' : 'Masukkan NIP'} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
              <input 
                type="password" 
                required 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-muted focus:bg-white text-sm font-medium" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 bg-foreground text-white rounded-2xl font-bold hover:bg-gray-800 transition-all mt-8 cursor-pointer shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? 'Mendaftarkan...' : 'Register Now'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-sm text-secondary">Sudah punya akun? 
            <Link to="/login" className="text-primary font-bold hover:underline ml-1">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}