import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionCookie, deleteSessionCookie } from './utils/auth';
import './styles/Menu.css';

const Menu = ({ onLogout }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newScenarioName, setNewScenarioName] = useState('');

    useEffect(() => {
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

    const addScenario = async () => {
        if (!newScenarioName.trim()) {
            alert('Le nom du scénario ne peut pas être vide.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://10.224.0.53:3000/api/cyberforge/create-scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenarioName: newScenarioName }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                setShowAddModal(false);
                setNewScenarioName('');
                navigate('/');
            } else {
                alert(data.message || 'Erreur lors de l\'ajout du scénario.');
            }
        } catch (err) {
            alert('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="menu-container">
            <h1>Menu Principal</h1>
            <div className="menu-buttons">
                <button onClick={() => navigate('/gestion-vm')}>Gestion Machines Virtuelles</button>
                <button onClick={() => navigate('/supprimer-vm')}>Supprimer Scénarios</button>
                <button onClick={() => navigate('/choix-scenario')}>Modifier Scénarios</button>
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
