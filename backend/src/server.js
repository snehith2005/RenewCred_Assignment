require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { adminRouter, publicRouter } = require('./routes/contentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN_ADMIN || 'http://localhost:3001',
  process.env.CLIENT_ORIGIN_PUBLIC || 'http://localhost:3000',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/content', adminRouter); // protected admin CMS routes
app.use('/api/v1/public', publicRouter); // open read-only routes for the public site

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`RenewCred backend listening on port ${PORT}`));
