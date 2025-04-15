const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

// Simuler une base de données d'utilisateurs
const users = [
    {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('password', 10), // Mot de passe haché
    },
];

// Contrôleur pour la connexion
exports.login = (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
    }

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Identifiant ou mot de passe incorrect.' });
    }

    // Générer un token JWT
    const token = generateToken({ id: user.id, username: user.username });

    res.json({ message: 'Connexion réussie.', token });
};