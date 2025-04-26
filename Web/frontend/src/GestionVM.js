import React, { useState, useEffect } from 'react';
import { getSessionCookie } from './utils/auth';
import './styles/GestionVM.css';
import { useNavigate } from 'react-router-dom';

const GestionVM = () => {
    const [scenarios, setScenarios] = useState([]);
    const [runningScenarios, setRunningScenarios] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Vérifie les scénarios en cours d'exécution
    const fetchRunningScenarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/gestionVM/isRunning', {
                headers: { Authorization: `Bearer ${getSessionCookie('session_token')}` },
            });
            const data = await response.json();
            if (response.ok) {
                setRunningScenarios(data);
            } else {
                setError(data.message || 'Erreur lors de la vérification des scénarios en cours.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        }
    };

    // Récupère la liste des scénarios
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

    // Démarre un scénario
    const startScenario = async (scenario) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/gestionVM/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getSessionCookie('session_token')}`,
                },
                body: JSON.stringify({ scenario }),
            });
            const data = await response.json();
            if (response.ok) {
                setRunningScenarios((prev) => ({ ...prev, [scenario]: 1 }));
                alert(data.message);
                window.open('http://localhost:8080/guacamole/#/', '_blank');
            } else {
                setError(data.message || 'Erreur lors du démarrage du scénario.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    // Arrête un scénario
    const stopScenario = async (scenario) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/gestionVM/stop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getSessionCookie('session_token')}`,
                },
                body: JSON.stringify({ scenario }),
            });
            const data = await response.json();
            if (response.ok) {
                setRunningScenarios((prev) => ({ ...prev, [scenario]: 0 }));
                alert(data.message);
            } else {
                setError(data.message || 'Erreur lors de l\'arrêt du scénario.');
            }
        } catch (err) {
            setError('Erreur réseau.');
        } finally {
            setLoading(false);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        fetchRunningScenarios();
        fetchScenarios();
    }, []);

    return (
        <div className="gestion-vm-container">
            <h1>Gestion des Machines Virtuelles</h1>
            {error && <p className="error">{error}</p>}
            <div className="scenario-list">
                <h2>Liste des scénarios</h2>
                <ul>
                    {scenarios.map((scenario) => (
                        <li key={scenario} className="scenario-item">
                            <span>{scenario}</span>
                            {runningScenarios[scenario] === 1 ? (
                                <button
                                    className="stop-button"
                                    onClick={() => stopScenario(scenario)}
                                    disabled={loading}
                                >
                                    {loading ? 'Arrêt en cours...' : 'Arrêter'}
                                </button>
                            ) : (
                                <button
                                    className="start-button"
                                    onClick={() => startScenario(scenario)}
                                    disabled={loading}
                                >
                                    {loading ? 'Démarrage...' : 'Démarrer'}
                                </button>
                            )}
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

export default GestionVM;