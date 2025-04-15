// filepath: c:\Users\Romain\Desktop\Cours\M1\CyberRange_2\Web\backend\src\routes\routes.js
const express = require('express');
const router = express.Router();

// Exemple de route GET
router.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = router;