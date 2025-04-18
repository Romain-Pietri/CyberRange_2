import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./styles/ModifierVM.css";

const ModifierVM = ({ existingScenario }) => {
  const [nbAttack, setNbAttack] = useState(0);
  const [nbDefense, setNbDefense] = useState(0);
  const [siem, setSiem] = useState(false);
  const [machines, setMachines] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);
  const [readme, setReadme] = useState({ name: "README.md", content: "" });
const [showReadmeEditor, setShowReadmeEditor] = useState(false);

  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.scenario) {
      const { dockerComposeJson, filesJson, scenarioName } = location.state.scenario;

      try {
        const parsedCompose = dockerComposeJson;
        const services = parsedCompose.services || {};
        const allNetworks = parsedCompose.networks || {};

        // Filtres pour ne pas afficher certaines machines
        const excludedMachines = ["kali_red", "kali_blue", "guacd", "postgres", "guacamole", "filebeat", "logstash", "elasticsearch", "kibana", "suricata", "zeek", "attacker", "defender"];
        const filteredServices = Object.entries(services).filter(
          ([name]) => !excludedMachines.some(ex => name.toLowerCase().startsWith(ex))
        );

        // Filtres pour ne pas afficher certains réseaux
        const filteredNetworks = Object.entries(allNetworks).filter(
          ([name]) => name !== "guacnetwork_compose"
        );

        const machinesFormatted = filteredServices.map(([name, config], index) => {
          const envVars = config.environment || {};
          const envMap = typeof envVars === "object" ? envVars : {};

          return {
            id: index + 1,
            name,
            os: config.image || (config.build && config.build.dockerfile) || "",
            username: envMap.USERNAME || "",
            password: envMap.PASSWORD || "",
            networks: config.networks || [],
            openPort: (config.ports && config.ports.join(', ')) || "",
            installType: envMap.INSTALL_TYPE || "Serveur SSH",
            role: envMap.ROLE || "none",
          };
        });

        // Compte les kali_red et kali_blue même si elles sont exclues de l'affichage
        const allServiceNames = Object.keys(services);
        const nbAttack = allServiceNames.filter(name => name.toLowerCase().startsWith("kali_red")).length;
        const nbDefense = allServiceNames.filter(name => name.toLowerCase().startsWith("kali_blue")).length;

        // Détection de SIEM via la présence de kibana
        const siem = allServiceNames.some(name => name.toLowerCase().includes("kibana"));



        const networksFormatted = filteredNetworks.map(([name], index) => ({
          id: index + 1,
          name,
          subnetMask: "255.255.255.0",
        }));

        setMachines(machinesFormatted);
        setNetworks(networksFormatted);
        setNbAttack(nbAttack);
        setNbDefense(nbDefense);
        setSiem(siem);
      } catch (error) {
        console.error("Erreur lors du traitement du scénario :", error);
      }
      console.log("Scénario reçu :", location.state.scenario);
      console.log("dockerComposeJson :", dockerComposeJson);

      const readmeFile = filesJson.find(
        (file) => file.name.toLowerCase().includes("readme")
      );
      
      if (readmeFile) {
        setReadme({
          name: readmeFile.name,
          content: readmeFile.content
        });
      }
      
      
    }
  }, [location.state]);

  const addMachine = () => {
    const newMachine = {
      id: machines.length + 1,
      name: "Machine " + (machines.length + 1),
      os: "",
      username: "",
      password: "",
      networks: [],
      openPort: "",
      installType: "Serveur SSH",
    };
    setMachines([...machines, newMachine]);
  };

  const addNetwork = () => {
    const newNetwork = {
      id: networks.length + 1,
      name: "Réseau " + (networks.length + 1),
      subnetMask: "255.255.255.0",
    };
    setNetworks([...networks, newNetwork]);
  };

  const addReadme = () => {
    const newReadme = {
      id: readme.length + 1,
      name: "README.md",
      content: "",
    };
    setReadme(newReadme);
  };

  const openMachineMenu = (machine) => {
    setCurrentMachine(machine);
    setMenuOpen(true);
    setNetworkMenuOpen(false);
  };

  const openNetworkMenu = (network) => {
    setCurrentNetwork(network);
    setNetworkMenuOpen(true);
    setMenuOpen(false);
  };

  const openReadmeEditor = () => {
    setShowReadmeEditor(true); // Afficher l'éditeur
    setCurrentMachine(null); // Fermer les autres menus si ouverts
    setNetworkMenuOpen(false); // Fermer le menu réseau si ouvert
  };
  

  const closeMenu = () => {
    setMenuOpen(false);
    setCurrentMachine(null);
    setNetworkMenuOpen(false);
    setCurrentNetwork(null);
  };

  const deleteMachine = (id) => {
    setMachines(machines.filter((machine) => machine.id !== id));
    if (currentMachine && currentMachine.id === id) {
      closeMenu();
    }
  };

  const deleteNetwork = (id) => {
    setNetworks(networks.filter((network) => network.id !== id));
    if (currentNetwork && currentNetwork.id === id) {
      closeMenu();
    }
  };

  const updateMachine = (key, value) => {
    setMachines((prev) =>
      prev.map((machine) =>
        machine.id === currentMachine.id ? { ...machine, [key]: value } : machine
      )
    );
    setCurrentMachine((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const updateNetwork = (key, value) => {
    setNetworks((prev) =>
      prev.map((network) =>
        network.id === currentNetwork.id ? { ...network, [key]: value } : network
      )
    );
    setCurrentNetwork((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const osOptions = ["Kali", "Ubuntu", "Debian", "Alpine", "CentOS"];

  const addPort = () => {
    if (currentMachine) {
      const ports = currentMachine.openPort ? currentMachine.openPort.split(", ") : [];
      ports.push("");
      updateMachine("openPort", ports.join(", "));
    }
  };

  const removePort = (index) => {
    if (currentMachine) {
      const ports = currentMachine.openPort ? currentMachine.openPort.split(", ") : [];
      ports.splice(index, 1);
      updateMachine("openPort", ports.join(", "));
    }
  };

  const updatePort = (index, value) => {
    if (currentMachine) {
      const ports = currentMachine.openPort ? currentMachine.openPort.split(", ") : [];
      ports[index] = value;
      updateMachine("openPort", ports.join(", "));
    }
  };

  return (
    <>
      <div className="top-bar">
        <div className="menu-icon" onClick={closeMenu}>
          &#9776;
        </div>

        <div className="form-group">
          <label>Nombre Attaquants:</label>
          <input
            type="number"
            min="0"
            value={nbAttack}
            onChange={(e) => setNbAttack(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nombre Défenseurs:</label>
          <input
            type="number"
            min="0"
            value={nbDefense}
            onChange={(e) => setNbDefense(e.target.value)}
          />
        </div>

        <div className="form-group checkbox">
          <label>
            SIEM
            <input
              type="checkbox"
              checked={siem}
              onChange={(e) => setSiem(e.target.checked)}
            />
          </label>
        </div>

        <h1 className="title">Modification de Scenario :</h1>
        <p className="scenario-name">{location.state?.scenario?.scenarioName}</p>
      </div>

      <div className="buttons-container">
      <button type="button" className="back-btn" onClick={() => navigate("/")}>
        Retour au menu
      </button>

        <button type="button" className="add-btn" onClick={addMachine}>
          + Ajouter une machine
        </button>
        <button type="button" className="add-btn" onClick={addNetwork}>
          + Ajouter un réseau
        </button>
        <button type="button" className="add-btn" onClick={addReadme}>
          + Ajouter / reset un README
        </button>

      </div>

      <div className="creation-container">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className="machine-icon"
            onClick={() => openMachineMenu(machine)}
          >
            🖥️
            <span className="machine-name">{machine.name}</span>
            <span className="machine-networks">
              {machine.networks && machine.networks.join(", ")}
            </span>
          </div>
        ))}
      </div>

      {/* Affichage des read me */}
      <div className="readme-container">
        {readme.name && (
          <div
            className="readme-icon"
            onClick={() => openReadmeEditor()}
          >
            📄
            <span className="readme-name">{readme.name}</span>
          </div>
        )}
      </div>



      <div className="network-grid">
        {networks.map((network) => (
          <div
            key={network.id}
            className="network-icon"
            onClick={() => openNetworkMenu(network)}
          >
            🌐
            <span className="network-name">{network.name}</span>
          </div>
        ))}
      </div>

      {/* Menu pour le README */}
      {showReadmeEditor && (
        <div className="side-menu">
          <div className="side-menu-content">
            <h2>README</h2>
            <div>
              <label>Nom du fichier :</label>
              <input
                type="text"
                value={readme.name}
                onChange={(e) => setReadme({ ...readme, name: e.target.value })}
              />
            </div>

            <div>
              <label>Contenu :</label>
              <div></div>
              <textarea
                rows="30"
                cols="35"
                value={readme.content}
                onChange={(e) => setReadme({ ...readme, content: e.target.value })}
              />
            </div>
            
            <button type="button" onClick={() => {
              setReadme({ name: "", content: "" });  // Réinitialise le readme
              setShowReadmeEditor(false);
            }}>
              Supprimer le README
            </button>
            <button type="button" onClick={() => setShowReadmeEditor(false)}>
              Fermer le menu
            </button>
          </div>
        </div>
      )}


      {/* Menu pour la machine */}
      {menuOpen && currentMachine && (
        <div className="side-menu">
          <div className="side-menu-content">
            <h2 id="machine">Machine {currentMachine.id}</h2>
            <div>
              <label>Nom:</label>
              <input
                type="text"
                value={currentMachine.name}
                onChange={(e) => updateMachine("name", e.target.value)}
              />
            </div>
            <div>
              <label>OS:</label>
              <select
                value={currentMachine.os}
                onChange={(e) => updateMachine("os", e.target.value)}
              >
                <option value="">Choisir un OS</option>
                {osOptions.map((os) => (
                  <option key={os} value={os}>{os}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Identifiant:</label>
              <input
                type="text"
                value={currentMachine.username}
                onChange={(e) => updateMachine("username", e.target.value)}
              />
            </div>
            <div>
              <label>Mot de passe:</label>
              <input
                type="password"
                value={currentMachine.password}
                onChange={(e) => updateMachine("password", e.target.value)}
              />
            </div>
            <div>
              <label>Ports ouverts:</label>
              <button type="button" onClick={addPort}>
                + Ajouter un port
              </button>
              {currentMachine.openPort.split(", ").map((port, index) => (
                <div key={index} className="port-container">
                  <input
                    type="text"
                    value={port}
                    onChange={(e) => updatePort(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-port-btn"
                    onClick={() => removePort(index)}
                  >
                    &#10006;
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label>Réseaux:</label>
              {networks.map((network) => (
                <div key={network.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={currentMachine.networks.includes(network.name)}
                      onChange={() => toggleNetworkForMachine(network.name)}
                    />
                    {network.name}
                  </label>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => deleteMachine(currentMachine.id)}>
              Supprimer cette machine
            </button>
            <button type="button" onClick={closeMenu}>
              Fermer le menu
            </button>
          </div>
        </div>
      )}

      {/* Menu pour le réseau */}
      {networkMenuOpen && currentNetwork && (
        <div className="side-menu">
          <div className="side-menu-content">
            <h2 id="machine">Réseau {currentNetwork.id}</h2>
            <div>
              <label id="machine">Nom:</label>
              <input
                type="text"
                value={currentNetwork.name}
                onChange={(e) => updateNetwork("name", e.target.value)}
              />
            </div>
            <div>
              <label>Masque de sous-réseau:</label>
              <input
                type="text"
                value={currentNetwork.subnetMask}
                onChange={(e) => updateNetwork("subnetMask", e.target.value)}
              />
            </div>
            <button type="button" onClick={() => deleteNetwork(currentNetwork.id)}>
              Supprimer ce réseau
            </button>
            <button type="button" onClick={closeMenu}>
              Fermer le menu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModifierVM;
