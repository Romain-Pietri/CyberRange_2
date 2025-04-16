import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Menu from './Menu';
import GestionVM from './GestionVM';
import ModifierVM from './ModifierVM';
import CyberForge from './CyberForge';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                {!isAuthenticated ? (
                    <Route path="*" element={<Login onLogin={handleLogin} />} />
                ) : (
                    <>
                        <Route path="/" element={<Menu onLogout={handleLogout} />} />
                        <Route path="/gestion-vm" element={<GestionVM />} />
                        <Route path="/modifier-vm" element={<ModifierVM />} />
                        <Route path="/cyber-forge" element={<CyberForge />} />
                        {/* Ajoutez d'autres routes ici si nécessaire */}
                    </>
                )}
            </Routes>
        </Router>
    );
};

export default App;