require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdf = require('pdf-parse');

// Tambahan modul untuk upload file
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// --- SETUP FOLDER UPLOAD LOKAL ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Buat folder 'uploads' jika belum ada
}

// Konfigurasi Multer (Penyimpanan File)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Tambahkan timestamp agar nama file unik (mencegah bentrok)
    cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
  }
});
const upload = multer({ storage: storage });

// Jadikan folder 'uploads' dapat diakses secara statis (agar bisa dibaca Mhs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// SETUP KONEKSI DATABASE
// ==========================================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => {
    console.log('✅ [ArchAI DB] PostgreSQL Connected!');
  })
  .catch(err => console.error('❌ [ArchAI DB] Connection Error:', err.stack));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 1. ROUTES AUTHENTICATION (USERS)
// ==========================================
app.post('/api/register', async (req, res) => {
  const { full_name, identifier_number, role, password } = req.body;
  try {
    if (!full_name || !identifier_number || !role || !password) {
      return res.status(400).json({ error: 'Semua field harus diisi!' });
    }
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await pool.query(
      `INSERT INTO users (full_name, identifier_number, role, password_hash) 
       VALUES ($1, $2, $3, $4) RETURNING id, full_name, role, identifier_number`,
      [full_name, identifier_number, role, password_hash]
    );
    res.status(201).json({ message: 'Registrasi berhasil!', user: newUser.rows[0] });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'NIM/NIP sudah terdaftar!' });
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { identifier_number, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE identifier_number = $1', [identifier_number]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'NIP/NIM atau Password salah!' });

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'NIP/NIM atau Password salah!' });

    delete user.password_hash;
    res.status(200).json({ message: 'Login berhasil!', user: user });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
});

// ==========================================
// 2. ROUTES MANAJEMEN ROOM & MATERI
// ==========================================
app.post('/api/rooms', async (req, res) => {
  const { dosen_id, course_name } = req.body;
  const room_code = `ITDP-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const result = await pool.query(
      'INSERT INTO rooms (dosen_id, room_code, course_name) VALUES ($1, $2, $3) RETURNING *',
      [dosen_id, room_code, course_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat room' });
  }
});

app.get('/api/rooms/dosen/:dosen_id', async (req, res) => {
  const { dosen_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM rooms WHERE dosen_id = $1 ORDER BY created_at DESC', [dosen_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil room' });
  }
});

app.post('/api/rooms/join', async (req, res) => {
  const { room_code, student_id } = req.body;
  try {
    const roomResult = await pool.query('SELECT id, course_name FROM rooms WHERE room_code = $1', [room_code]);
    if (roomResult.rows.length === 0) return res.status(404).json({ error: 'ID Room tidak ditemukan!' });
    
    const room_id = roomResult.rows[0].id;
    const memberCheck = await pool.query('SELECT * FROM class_members WHERE room_id = $1 AND student_id = $2', [room_id, student_id]);
    
    if (memberCheck.rows.length === 0) {
        await pool.query('INSERT INTO class_members (room_id, student_id) VALUES ($1, $2)', [room_id, student_id]);
    }
    res.status(200).json({ message: 'Berhasil bergabung', room_id: room_id, course_name: roomResult.rows[0].course_name });
  } catch (err) {
    res.status(500).json({ error: 'Gagal bergabung ke room' });
  }
});

app.get('/api/rooms/student/:student_id', async (req, res) => {
  const { student_id } = req.params;
  try {
    const query = `
      SELECT r.id, r.room_code, r.course_name, cm.joined_at 
      FROM rooms r JOIN class_members cm ON r.id = cm.room_id
      WHERE cm.student_id = $1 ORDER BY cm.joined_at DESC`;
    const result = await pool.query(query, [student_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil daftar kelas' });
  }
});

// --- ROUTE UPLOAD MATERI (MENGGUNAKAN MULTER) ---
app.post('/api/materials/upload', upload.single('file'), async (req, res) => {
  const { room_id, file_name } = req.body;
  
  // Memastikan ada file yang diunggah
  if (!req.file) return res.status(400).json({ error: 'Tidak ada file PDF yang diunggah.' });
  
  // Path tempat file disimpan
  const file_path = `/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      'INSERT INTO materials (room_id, file_name, file_type, file_path) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_id, file_name, 'pdf', file_path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan data materi ke database.' });
  }
});

app.get('/api/materials/:room_code', async (req, res) => {
  const { room_code } = req.params;
  try {
    const query = `
        SELECT m.* FROM materials m JOIN rooms r ON m.room_id = r.id
        WHERE r.room_code = $1 ORDER BY m.created_at ASC`;
    const result = await pool.query(query, [room_code]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil materi' });
  }
});

// Hapus Materi dari Database
app.delete('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM materials WHERE id = $1', [id]);
    res.status(200).json({ message: 'Materi berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus materi' });
  }
});

// Edit Nama/Deskripsi Materi
app.put('/api/materials/:id', async (req, res) => {
  const { id } = req.params;
  const { file_name } = req.body;
  try {
    const result = await pool.query(
      'UPDATE materials SET file_name = $1 WHERE id = $2 RETURNING *',
      [file_name, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengupdate materi' });
  }
});

// ==========================================
// 4. ROUTES ANALITIK & AI
// ==========================================

// Endpoint: Ekstrak PDF dan Minta Gemini Membuat Ringkasan (RAG)
app.post('/api/ai/summarize-pdf', async (req, res) => {
  const { file_path } = req.body;

  if (!file_path) {
    return res.status(400).json({ error: 'Path file tidak diberikan.' });
  }

  try {
    const fullPath = path.join(__dirname, file_path);
    const dataBuffer = fs.readFileSync(fullPath);
    const pdfData = await pdf(dataBuffer);
    const extractedText = pdfData.text;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Kamu adalah ArchAI Tutor, asisten dosen Arsitektur Komputer.
      Tugasmu adalah membaca teks mentah dari modul PDF berikut, dan membuatkan RINGKASAN MATERI yang terstruktur, mudah dipahami mahasiswa, menggunakan format Markdown (Heading, Bullet points, dll).

      Teks Materi PDF:
      """
      ${extractedText.substring(0, 30000)} 
      """
      
      Buat ringkasannya sekarang:
    `;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ 
      message: 'PDF berhasil dirangkum!', 
      summary: summary 
    });

  } catch (error) {
    console.error('PDF Extraction/AI Error:', error);
    res.status(500).json({ error: 'Gagal mengekstrak atau merangkum PDF.' });
  }
});

// Endpoint: AI Generator untuk Kode Assembly CPU Visual Simulator
app.post('/api/ai/generate-assembly', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt tidak boleh kosong.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // System prompt ketat agar AI hanya membalas dengan kode murni
    const systemInstruction = `
      Kamu adalah generator kode Assembly untuk CPU Visual Simulator edukasi.
      Berikan HANYA kode assembly murni berdasarkan permintaan user.
      JANGAN gunakan markdown block code (seperti \`\`\`assembly).
      JANGAN berikan penjelasan teks apa pun. HANYA KODE MURNI.
      
      Instruksi yang didukung biasanya seperti: LOAD, STORE, ADD, SUB, JUMP, HALT, dll.
      
      Permintaan: ${prompt}
    `;

    const result = await model.generateContent(systemInstruction);
    const assemblyCode = result.response.text().trim();

    res.json({ code: assemblyCode });

  } catch (error) {
    console.error('AI Assembly Generation Error:', error);
    res.status(500).json({ error: 'Gagal menghasilkan kode Assembly.' });
  }
});

// ==========================================
// 5. ROUTES ANALITIK KUIS (IRT)
// ==========================================

// Simpan hasil kuis mahasiswa dari AI Workspace
app.post('/api/analytics', async (req, res) => {
  const { room_id, student_id, score, ai_feedback } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO analytics (room_id, student_id, score, ai_feedback) VALUES ($1, $2, $3, $4) RETURNING *',
      [room_id, student_id, score, ai_feedback]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan analitik' });
  }
});

// Ambil data analitik untuk Dasbor Dosen
app.get('/api/analytics/:room_id', async (req, res) => {
  const { room_id } = req.params;
  try {
    const query = `
      SELECT a.*, u.full_name as student_name, u.identifier_number as nim 
      FROM analytics a 
      JOIN users u ON a.student_id = u.id 
      WHERE a.room_id = $1 
      ORDER BY a.created_at DESC
    `;
    const result = await pool.query(query, [room_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data analitik' });
  }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 [ArchAI Backend] Server berjalan di http://localhost:${PORT}`);
});