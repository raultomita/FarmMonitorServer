import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3 main-nav">
            <div className="navbar navbar-inverse">
              <div className="navbar-header">
                <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <span className="navbar-brand">Farm Monitor</span>
              </div>
              <div className="navbar-collapse collapse">
                <ul className="nav navbar-nav">
                  <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                      <span className="glyphicon glyphicon-home"></span> Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>
                      <span className="glyphicon glyphicon-cog"></span> Admin
                    </NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-9 col-sm-offset-3 body-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
