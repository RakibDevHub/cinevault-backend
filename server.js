const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); // Cloudflare + Google

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Mount routes
app.use('/api/v1/movies', movieRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});