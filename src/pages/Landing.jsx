import { BrainCircuit, Cpu, BarChart2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <section className="w-full max-w-5xl text-center flex flex-col items-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          LIDM 2027 - ITDP Division
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight mb-6 max-w-4xl tracking-tight">
          Transforming Abstract Architecture into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Interactive Intelligence</span>
        </h1>
        <p className="text-base md:text-lg text-secondary mb-10 max-w-2xl leading-relaxed">
          ArchAI adalah "Otak Kedua" yang memadukan Generative AI (RAG) dengan CPU Visual Simulator. Mengubah materi kuliah pasif menjadi pengalaman belajar interaktif dalam hitungan detik.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="flex items-center gap-2 bg-foreground text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl hover:-translate-y-1">
            Mulai Belajar <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group">
          <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors mb-6">
            <BrainCircuit size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">AI Tutor 24/7 & RAG</h3>
          <p className="text-secondary text-sm leading-relaxed">
            Ringkasan otomatis, Smart Flashcards, dan interaksi cerdas berbasis dokumen materi dosen (PDF/Video) tanpa halusinasi.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mb-6">
            <Cpu size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Live CPU Visualizer</h3>
          <p className="text-secondary text-sm leading-relaxed">
            AI menerjemahkan konsep teori menjadi simulasi Assembly interaktif. Visualisasi ALU, RAM, dan Control Unit secara real-time.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group">
          <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors mb-6">
            <BarChart2 size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">Lecturer Analytics</h3>
          <p className="text-secondary text-sm leading-relaxed">
            Dashboard dosen dengan Heatmap Kebingungan, mendeteksi materi yang paling sulit dipahami kelas secara otomatis.
          </p>
        </div>
      </section>
    </div>
  );
}