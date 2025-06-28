// CaterBot React Application - Main Entry Point
// Complete frontend implementation for kitchen equipment troubleshooting

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Core Components
import LandingPage from './pages/LandingPage';
import EquipmentGrid from './pages/EquipmentGrid';
import ChatInterface from './pages/ChatInterface';
import QRScanner from './components/QRScanner';

// Context Providers
import { EquipmentProvider } from './contexts/EquipmentContext';
import { UserProvider } from './contexts/UserContext';

// Supabase Configuration - LIVE PRODUCTION ENDPOINTS
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ypmrqzxipboumkjttkmt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbXJxenhpcGJvdW1ranR0a210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTQ2OTYsImV4cCI6MjA2NDE5MDY5Nn0.ApokykL_o8k1P_g8vwlRnr-cmOxceKX_LBreQJZg7n8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Main App Component
const App: React.FC = () => {
  return (
    <UserProvider>
      <EquipmentProvider>
        <Router>
          <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <Routes>
              {/* Landing & Navigation */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Equipment Selection Flow */}
              <Route path="/equipment" element={<EquipmentGrid />} />
              <Route path="/scan" element={<QRScanner />} />
              
              {/* Chat Interface */}
              <Route path="/chat/:sessionId?" element={<ChatInterface />} />
            </Routes>
          </div>
        </Router>
      </EquipmentProvider>
    </UserProvider>
  );
};

// ============================================================================
// API UTILITIES
// ============================================================================

// Chat API integration
export const sendChatMessage = async (message: string, equipmentContext?: any) => {
  try {
    const { data, error } = await supabase.functions.invoke('master-chat', {
      body: {
        message,
        equipment_context: equipmentContext,
        user_id: 'test-user',
        site_id: 'TOCA-TEST-001'
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};

// QR Scanner API integration
export const scanQRCode = async (qrCode: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('qr-scanner', {
      body: { qr_code: qrCode }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('QR Scanner API error:', error);
    throw error;
  }
};

// Equipment context retrieval
export const getEquipmentContext = async (qrCode: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('equipment-context', {
      body: { qr_code: qrCode }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Equipment context API error:', error);
    throw error;
  }
};

export default App;