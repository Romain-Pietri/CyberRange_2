import React, { useState } from "react";
import "./styles/ModifierVM.css";

const ModifierVM = () => {
  const [nbAttack, setNbAttack] = useState(0);
  const [nbDefense, setNbDefense] = useState(0);
  const [siem, setSiem] = useState(false);
  const [machines, setMachines] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(null);
  const [networkMenuOpen, setNetworkMenuOpen] = useState(false);

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

  const toggleNetworkForMachine = (networkName) => {
    if (!currentMachine) return;
    const isSelected = currentMachine.networks.includes(networkName);
    const updatedNetworks = isSelected
      ? currentMachine.networks.filter((n) => n !== networkName)
      : [...currentMachine.networks, networkName];

    updateMachine("networks", updatedNetworks);
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

        <h1 className="title">Modification de Scenario</h1>
      </div>

      <div className="buttons-container">
        <button type="button" className="add-btn" onClick={addMachine}>
          + Ajouter une machine
        </button>
        <button type="button" className="add-btn" onClick={addNetwork}>
          + Ajouter un réseau
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
              <input
                type="text"
                value={currentMachine.openPort}
                onChange={(e) => updateMachine("openPort", e.target.value)}
              />
            </div>
            <div>
              <label>Réseaux associés:</label>
              {networks.map((net) => (
                <div key={net.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={currentMachine.networks.includes(net.name)}
                      onChange={() => toggleNetworkForMachine(net.name)}
                    />
                    {net.name}
                  </label>
                </div>
              ))}
            </div>
            <div>
              <label>Type d'installation:</label>
              <select
                value={currentMachine.installType}
                onChange={(e) => updateMachine("installType", e.target.value)}
              >
                <option>Serveur SSH</option>
                <option>FTP</option>
                <option>Autre</option>
              </select>
            </div>
            <button className="delete-btn" onClick={() => deleteMachine(currentMachine.id)}>
              Supprimer la machine
            </button>
          </div>
        </div>
      )}

      {networkMenuOpen && currentNetwork && (
        <div className="side-menu">
          <div className="side-menu-content">
            <h2 id="reseau">Réseau {currentNetwork.id}</h2>
            <div>
              <label>Nom:</label>
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
            <button className="delete-btn" onClick={() => deleteNetwork(currentNetwork.id)}>
              Supprimer le réseau
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModifierVM;
