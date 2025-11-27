import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. ENABLE CORS
// This allows your CloudFront Frontend to talk to this Beanstalk Backend
app.use(cors());

// 2. HEALTH CHECK
// AWS Load Balancer pings this to see if the app is alive.
app.get('/', (req, res) => {
  res.send('HR Core Backend is running!');
});

app.get('/api/time', (req, res) => {
  res.json({
    serverTime: new Date().toISOString(),
    app: 'HR Activities',
    version: '1.0.0'
  });
});

// 4. (Optional) 404 Handler
// Since this is just an API, we return JSON 404, not index.html
app.get('*', (req, res) => {
  res.status(404).json({ message: 'API Route not found' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
