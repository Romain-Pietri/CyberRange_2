import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/GestionVM.css';

const ChoixScenario = () => {
    const [scenarios, setScenarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScenarios = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/gestionVM/list');
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

    const handleEdit = async (scenarioName) => {
        try {
            const response = await fetch('http://localhost:3000/api/cyberforge/get-scenario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenarioName }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de la récupération du scénario.');
            }

            const scenarioData = await response.json();

            navigate('/modifier-vm', { state: { scenario: scenarioData } });
        } catch (err) {
            alert('Erreur réseau : ' + err.message);
        }
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
