import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import { Notifications } from './components/Notifications';
import './App.css';

function App() {
    const [connStatus, setConnStatus] = useState({ isConnected: false, status: '', heartbeats: [] });
    const [onDeviceReceived, setOnDeviceReceived] = useState(null);

    const registerDeviceHandler = useCallback((handler) => {
        setOnDeviceReceived(() => handler);
    }, []);

    return (
        <Router>
            <Notifications onDeviceReceived={onDeviceReceived || (() => {})} onStatusChange={setConnStatus} />
            <nav className="app-nav">
                <span className="app-nav-brand">🌿 Home</span>
                <div className="app-nav-status">
                    {connStatus.heartbeats.map(hb => (
                        <span key={hb.hostName} className={`hb-dot ${hb.isDead ? 'dead' : 'alive'}`} title={hb.hostName}>
                            <span className="hb-dot-circle" />
                            <span className="hb-dot-label">{hb.hostName.slice(0, 4)}</span>
                        </span>
                    ))}
                    <span className={`conn-dot ${connStatus.isConnected ? 'ok' : 'err'}`}
                          title={connStatus.isConnected ? 'Connected' : (connStatus.status || 'Disconnected')}>
                        <span className="conn-dot-circle" />
                        <span className="conn-dot-label">{connStatus.isConnected ? 'live' : (connStatus.status || 'off').slice(0, 4).toLowerCase()}</span>
                    </span>
                </div>
            </nav>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Home onRegisterDeviceHandler={registerDeviceHandler} />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;

