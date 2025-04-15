import React, { useEffect } from 'react';
import { getSessionCookie, deleteSessionCookie } from './utils/auth';
import './styles/Menu.css';

const Menu = ({ onLogout }) => {
    useEffect(() => {
        // Vérifie si le token existe
        const token = getSessionCookie('session_token');
        console.log(token)
        if (!token) {
            alert('Session expirée ou invalide. Veuillez vous reconnecter.');
            onLogout();
        }
    }, [onLogout]);

    const handleLogout = () => {
        deleteSessionCookie('session_token');
        onLogout();
    };

    return (
        <div className="menu-container">
            <h1>Menu Principal</h1>
            <div className="menu-buttons">
                <button onClick={() => alert('Option 1 sélectionnée')}>Option 1</button>
                <button onClick={() => alert('Option 2 sélectionnée')}>Option 2</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
};

export default Menu;