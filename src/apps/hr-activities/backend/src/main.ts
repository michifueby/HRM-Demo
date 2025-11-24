// apps/hr-core/backend/src/main.ts   (same pattern for the other two)
import express from 'express';
import { join } from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from the Angular build
app.use(express.static(join(__dirname, '..', '..', 'frontend', 'dist', 'hr-activities', 'browser')));

// API: Dynamic server time
app.get('/api/time', (req, res) => {
  res.json({
    serverTime: new Date().toISOString(),
    app: 'HR Activities',
    version: '1.0.0'
  });
});

// SPA fallback – send index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', '..', 'frontend', 'dist', 'hr-activities', 'browser', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`HR Activities Backend + Frontend running on http://localhost:${PORT}`);
});
