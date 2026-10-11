import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint for Cloud Run
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', app: 'medicare' });
});

// Direct download route for the Android APK file
app.get('/medicare.apk', (req, res) => {
  const apkPath = path.join(__dirname, 'public', 'medicare.apk');
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename="medicare.apk"');
  res.sendFile(apkPath);
});

// Serve compiled static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Client-side SPA routing fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`MediCare production server running on http://0.0.0.0:${PORT}`);
});
