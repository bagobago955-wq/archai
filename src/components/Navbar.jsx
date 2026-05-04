import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-border fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none text-foreground">ArchAI</h1>
            <p className="text-[10px] text-secondary font-medium tracking-wide">WORKSPACE</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="text-sm font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-hover transition-all shadow-md shadow-primary/20">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}