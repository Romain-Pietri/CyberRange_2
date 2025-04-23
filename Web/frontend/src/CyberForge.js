import React, { useState } from 'react';
import './styles/CyberForge.css';

const CyberForge = () => {
    const [dockerCompose, setDockerCompose] = useState('');
    const [dockerfile, setDockerfile] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [imageName, setImageName] = useState('');
    const [ports, setPorts] = useState('');

    const handleAddService = () => {
        const newService = `
  ${serviceName}:
    image: ${imageName}
    ports:
      - "${ports}"
`;
        setDockerCompose((prev) => prev + newService);
        setServiceName('');
        setImageName('');
        setPorts('');
    };

    const handleGenerateDockerfile = () => {
        const baseDockerfile = `
# Dockerfile
FROM ${imageName}
EXPOSE ${ports.split(':')[0]}
CMD ["sh"]
`;
        setDockerfile(baseDockerfile);
    };

    return (
        <div className="cyberforge-container">
            <h1>CyberForge</h1>
            <p className="description">Créez vos fichiers Docker Compose et Dockerfile en no-code.</p>
            <div className="form-section">
                <h2>Ajouter un Service</h2>
                <input
                    type="text"
                    placeholder="Nom du service"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Nom de l'image"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Ports (ex: 8080:80)"
                    value={ports}
                    onChange={(e) => setPorts(e.target.value)}
                />
                <button onClick={handleAddService}>Ajouter au docker-compose</button>
                <button onClick={handleGenerateDockerfile}>Générer Dockerfile</button>
            </div>
            <div className="output-section">
                <h2>docker-compose.yml</h2>
                <pre>{dockerCompose || 'Aucun service ajouté.'}</pre>
                <h2>Dockerfile</h2>
                <pre>{dockerfile || 'Aucun Dockerfile généré.'}</pre>
            </div>
        </div>
    );
};

export default CyberForge;