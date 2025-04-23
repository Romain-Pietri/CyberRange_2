const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const gestionVMRoutes = require('./routes/gestionVM');
const cyberForgeRoutes = require('./routes/CyberForge');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Utilisez express.json() pour gérer les requêtes JSON
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gestionVM', gestionVMRoutes);
app.use('/api/cyberforge', cyberForgeRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});