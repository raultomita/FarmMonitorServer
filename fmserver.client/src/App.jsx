import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './App.css';

function App() {
    return (
        <Router>
            <nav className="app-nav">
                <span className="app-nav-brand">🌿 FarmMonitor</span>
                <div className="app-nav-links">
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'app-nav-link active' : 'app-nav-link'}>Home</NavLink>
                    <NavLink to="/admin" className={({ isActive }) => isActive ? 'app-nav-link active' : 'app-nav-link'}>Admin</NavLink>
                </div>
            </nav>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;

