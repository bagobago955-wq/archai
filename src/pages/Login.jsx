import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Briefcase, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('mahasiswa'); 
  const [formData, setFormData] = useState({ identifier_number: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Menembak API Login di Backend
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier_number: formData.identifier_number,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 2. SANGAT PENTING: Simpan data sesi ke localStorage agar tidak ditendang!
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_name', data.user.full_name);
        localStorage.setItem('user_role', data.user.role);

        // 3. Arahkan berdasarkan role asli dari database (bukan sekadar toggle UI)
        if (data.user.role === 'mahasiswa') {
          navigate('/workspace');
        } else if (data.user.role === 'dosen') {
          navigate('/lecturer-dashboard');
        } else {
          alert('Role tidak dikenali.');
        }
      } else {
        alert(data.error || 'Login gagal.');
      }
    } catch (error) {
      alert("Gagal terhubung ke server backend. Pastikan server Node.js menyala.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-12 bg-primary rounded-xl flex items-center justify-center mb-5 shadow-md shadow-primary/30">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-secondary text-sm mt-1 text-center px-4">Sign in to your ArchAI Workspace</p>
        </div>

        {/* --- PENGALIH PERAN (ROLE TOGGLE) UI --- */}
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

        <form onSubmit={handleLogin} className="space-y-5">
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
                placeholder={role === 'mahasiswa' ? 'Masukkan NIM Anda' : 'Masukkan NIP Anda'} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-foreground">Password</label>
              <Link to="#" className="text-xs text-primary font-semibold hover:underline">Lupa Password?</Link>
            </div>
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
            className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover transition-all mt-8 cursor-pointer shadow-lg shadow-primary/30 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoading ? 'Memeriksa Kredensial...' : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-sm text-secondary">Belum punya akun? 
            <Link to="/register" className="text-primary font-bold hover:underline ml-1">Daftar di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}