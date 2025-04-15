import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionCookie, deleteSessionCookie } from './utils/auth';
import './styles/Menu.css';

const Menu = ({ onLogout }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Vérifie si le token existe
        const token = getSessionCookie('session_token');
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
                <button onClick={() => navigate('/gestion-vm')}>Gestion Machines Virtuelles</button>
                <button onClick={() => alert('Option 2 sélectionnée')}>Gestion Scénario</button>
            </div>
            <button className="logout-button" onClick={handleLogout}>
                Déconnexion
            </button>
        </div>
    );
};

export default Menu;