import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import PrimaryDashboard from './pages/PrimaryDashboard';
import SecondaryDashboard from './pages/SecondaryDashboard';

function App() {
  const [currentView, setCurrentView] = useState('primary'); // 'primary' or 'secondary'

  return (
    <Router>
      <AuthProvider currentView={currentView}>
        {/* View Switcher for Presentation */}
        <div className="view-switcher">
          <button
            className={`view-switcher-btn ${currentView === 'primary' ? 'active' : ''}`}
            onClick={() => setCurrentView('primary')}
          >
            👨‍👩‍👧 Admin View
          </button>
          <button
            className={`view-switcher-btn ${currentView === 'secondary' ? 'active' : ''}`}
            onClick={() => setCurrentView('secondary')}
          >
            👤 Member View
          </button>
        </div>

        <Routes>
          <Route
            path="/"
            element={currentView === 'primary' ? <PrimaryDashboard /> : <SecondaryDashboard />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
