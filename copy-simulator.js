import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lokasi folder public dari proyek Svelte Anda
const source = path.join(__dirname, 'cpu-visual-simulator', 'public');
// Lokasi folder tujuan di dalam public React
const destination = path.join(__dirname, 'public', 'simulator');

try {
  // Melakukan penyalinan folder secara rekursif
  fs.cpSync(source, destination, { recursive: true, force: true });
  console.log('✅ [ArchAI Build] Berhasil menyalin CPU Simulator Svelte ke folder public React!');
} catch (err) {
  console.error('❌ [ArchAI Build] Gagal menyalin simulator:', err);
}