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
                <button onClick={() => navigate('/modifier-vm')}>Modifier / Supprimer Scénarios</button>
            </div>
            <button
                className="add-button"
                onClick={() => setShowAddModal(true)}
                disabled={loading}
            >
                Ajouter un Scénario
            </button>

            {showAddModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Ajouter un Scénario</h2>
                        <input
                            type="text"
                            placeholder="Nom du scénario"
                            value={newScenarioName}
                            onChange={(e) => setNewScenarioName(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button onClick={addScenario} disabled={loading}>
                                Ajouter
                            </button>
                            <button onClick={() => setShowAddModal(false)} disabled={loading}>
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;