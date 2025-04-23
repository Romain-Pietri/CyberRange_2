import React, { useState, useEffect } from 'react';
import { getSessionCookie } from './utils/auth';
import './styles/SupprimerVM.css';
import { useNavigate } from 'react-router-dom';

const SupprimerVM = () => {
    const [scenarios, setScenarios] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newScenarioName, setNewScenarioName] = useState('');
    const navigate = useNavigate();

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
                body: JSON.stringify({ scenario }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchScenarios();
            } else {
                setError(data.message || 'Erreur lors de la suppression.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    const addScenario = async () => {
        if (!newScenarioName.trim()) {
            alert('Le nom du scénario ne peut pas être vide.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/cyberforge/create-scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getSessionCookie('session_token')}`,
                    
                },
                body: JSON.stringify({ scenarioName: newScenarioName }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchScenarios();
                setShowAddModal(false);
                setNewScenarioName('');
            } else {
                setError(data.message || 'Erreur lors de l\'ajout du scénario.');
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
            <h1>Supprimer les Scénarios</h1>
            {error && <p className="error">{error}</p>}
            <div className="scenario-list">
                <h2>Liste des scénarios</h2>
                <ul>
                    {scenarios.map((scenario) => (
                        <li key={scenario} className="scenario-item">
                            <span>{scenario}</span>
                            <div className="button-group">
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
            
            <button type="button" className="back-btn" onClick={() => navigate("/")}>
                Retour au menu
            </button>
        </div>
    );
};

export default SupprimerVM;