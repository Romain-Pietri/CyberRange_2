import React, { useState } from 'react';
import { setSessionCookie } from './utils/auth';
import './styles/Login.css'; // Import du fichier CSS

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Simuler une requête API
      const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
          console.log('Token reçu :', data.token); // Vérifiez ici
          setSessionCookie('session_token', data.token, 1); // Stocke le token
          onLogin();
      } else {
          setError(data.message || 'Erreur lors de la connexion.');
      }
  };

    return (
        <div className="login-container">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Identifiant :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit">Se connecter</button>
            </form>
        </div>
    );
};

export default Login;