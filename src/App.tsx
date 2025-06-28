import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EquipmentProvider } from './contexts/EquipmentContext';
import LandingPage from './pages/LandingPage';
import EquipmentGrid from './pages/EquipmentGrid';
import ChatInterface from './pages/ChatInterface';
import ManagerDashboard from './pages/ManagerDashboard';
import QRScanner from './components/QRScanner';

const App: React.FC = () => {
  return (
    <EquipmentProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Landing & Navigation */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Equipment Selection Flow */}
            <Route path="/equipment" element={<EquipmentGrid />} />
            <Route path="/scan" element={<QRScanner />} />
            
            {/* Chat Interface */}
            <Route path="/chat/:sessionId" element={<ChatInterface />} />
            
            {/* Manager Dashboard */}
            <Route path="/dashboard/*" element={<ManagerDashboard />} />
          </Routes>
        </div>
      </Router>
    </EquipmentProvider>
  );
};

export default App;