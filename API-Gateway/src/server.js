require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

app.use(express.json());

//const authMiddleware = require('./middleware/authMiddleware'); // You need to create this middleware

app.use('/api/blockchain', blockchainRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
