import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Wrench, BarChart3, Smartphone, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Wrench className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CaterBot</h1>
            </div>
            <Link 
              to="/dashboard" 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Manager Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Equipment Assistant
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant troubleshooting help for restaurant equipment. 
            Scan QR codes, describe issues, and receive expert guidance 
            powered by AI.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/scan"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-3 transition-colors"
            >
              <QrCode className="w-6 h-6" />
              <span>Scan Equipment QR Code</span>
            </Link>
            
            <Link
              to="/equipment"
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center space-x-3 transition-colors"
            >
              <Wrench className="w-6 h-6" />
              <span>Browse Equipment</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Instant Help</h3>
            <p className="text-gray-600">
              Get immediate troubleshooting guidance without waiting for managers or technicians.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">QR Code Integration</h3>
            <p className="text-gray-600">
              Simply scan equipment QR codes to automatically identify and get contextual help.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cost Tracking</h3>
            <p className="text-gray-600">
              Track maintenance costs and equipment performance with detailed analytics.
            </p>
          </div>
        </div>

        {/* Mobile Installation CTA */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <h3 className="text-2xl font-bold text-gray-900">Install CaterBot App</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Install CaterBot as a mobile app for quick access on the kitchen floor.
          </p>
          <button
            onClick={() => {
              // PWA installation logic
              const deferredPrompt = (window as any).deferredPrompt;
              if (deferredPrompt) {
                deferredPrompt.prompt();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Add to Home Screen
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;