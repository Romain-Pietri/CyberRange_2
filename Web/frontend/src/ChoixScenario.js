import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSessionCookie } from './utils/auth';
import './styles/GestionVM.css';

const ChoixScenario = () => {
    const [scenarios, setScenarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/gestionVM/list', {
                    headers: { Authorization: `Bearer ${getSessionCookie('session_token')}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setScenarios(data);
                } else {
                    alert(data.message || 'Erreur lors de la récupération des scénarios.');
                }
            } catch (err) {
                alert('Erreur réseau.');
            }
        };
        fetchScenarios();
    }, []);

    const handleEdit = (scenarioName) => {
        navigate(`/edition-scenario/${scenarioName}`);
    };

    const filteredScenarios = scenarios.filter(s =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="gestion-vm-container">
            <h1>Modifier un Scénario</h1>
            
            <div className="scenario-list">
                <ul>
                    {filteredScenarios.map((scenario) => (
                        <li key={scenario} className="scenario-item">
                            <span>{scenario}</span>
                            <button
                                className="start-button"
                                onClick={() => handleEdit(scenario)}
                            >
                                Modifier
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ChoixScenario;
