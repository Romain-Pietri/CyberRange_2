import React, { useState, useEffect } from 'react';
import { getSessionCookie } from './utils/auth';
import './styles/ModifierVM.css';

const ModifierVM = () => {
    const [scenarios, setScenarios] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Récupération des scénarios
    const fetchScenarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/gestionVM/list', {
                headers: { Authorization: `Bearer ${getSessionCookie('session_token')}` },
            });
            const data = await response.json();
            if (response.ok) {
                setScenarios(data);
            } else {
                setError(data.message || 'Erreur lors de la récupération des scénarios.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        }
    };

    const deleteScenario = async (scenario) => {
        const confirmDelete = window.confirm(`Êtes-vous sûr de vouloir supprimer le scénario "${scenario}" ?`);
        if (!confirmDelete) return;
    
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/gestionVM/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getSessionCookie('session_token')}`,
                },
                body: JSON.stringify({ scenario }), // Envoi du nom du dossier à supprimer
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message); // Affiche un message de succès
                fetchScenarios(); // Recharge la liste des scénarios
            } else {
                setError(data.message || 'Erreur lors de la suppression.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchScenarios();
    }, []);

    return (
        <div className="gestion-vm-container">
            <h1>Modifier les Scénarios</h1>
            {error && <p className="error">{error}</p>}
            <div className="scenario-list">
                <h2>Liste des scénarios</h2>
                <ul>
                    {scenarios.map((scenario) => (
                        <li key={scenario} className="scenario-item">
                            <span>{scenario}</span>
                            <div className="button-group">
                                <button
                                    className="edit-button"
                                    onClick={() => alert(`Modifier "${scenario}" (fonction non implémentée)`)}
                                    disabled={loading}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => deleteScenario(scenario)}
                                    disabled={loading}
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ModifierVM;
