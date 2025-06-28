// CaterBot Landing Page - Mobile-Optimized for Kitchen Staff
// Beautiful gradient design with large touch targets

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { QrCode, Search, Wrench, BarChart3, Clock, Shield, DollarSign } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleQuickScan = () => {
    navigate('/scan');
  };

  const handleBrowseEquipment = () => {
    navigate('/equipment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wrench size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CaterBot</h1>
                <p className="text-sm text-blue-200">Equipment Assistant</p>
              </div>
            </div>
            
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-blue-200">{user.siteName}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
            Kitchen Equipment Help
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get instant troubleshooting help for any equipment issue. No more waiting for managers or engineers.
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* QR Scanner Card */}
          <button
            onClick={handleQuickScan}
            className="group relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-left overflow-hidden hover:from-blue-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-300"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                <QrCode size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Scan Equipment</h3>
              <p className="text-blue-100 text-lg mb-4">
                Point your camera at any QR code to get instant equipment context and start troubleshooting.
              </p>
              
              <div className="flex items-center text-blue-200 font-semibold">
                <span>Tap to scan</span>
                <QrCode size={20} className="ml-2" />
              </div>
            </div>
          </button>

          {/* Browse Equipment Card */}
          <button
            onClick={handleBrowseEquipment}
            className="group relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-left overflow-hidden hover:from-purple-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-300"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                <Search size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Browse Equipment</h3>
              <p className="text-purple-100 text-lg mb-4">
                View all kitchen equipment by category and select what you need help with.
              </p>
              
              <div className="flex items-center text-purple-200 font-semibold">
                <span>Browse all equipment</span>
                <Search size={20} className="ml-2" />
              </div>
            </div>
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Clock size={24} className="text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Help</h3>
            <p className="text-blue-100">Get immediate troubleshooting steps without waiting for managers or engineers.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
              <Shield size={24} className="text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Safety First</h3>
            <p className="text-blue-100">Built-in safety protocols ensure you always follow proper procedures.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <DollarSign size={24} className="text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cost Savings</h3>
            <p className="text-blue-100">Reduce expensive service callouts by solving issues in-house.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
          <h3 className="text-2xl font-bold mb-6">Restaurant Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">75%</div>
              <div className="text-blue-100">Reduction in service callouts</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">£2,400</div>
              <div className="text-blue-100">Average monthly savings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">< 3min</div>
              <div className="text-blue-100">Average resolution time</div>
            </div>
          </div>
        </div>

        {/* Emergency Note */}
        <div className="mt-8 bg-red-500/20 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Emergency Situations</h4>
              <p className="text-red-200">
                For gas leaks, electrical hazards, or emergency situations, always prioritize safety first. 
                Follow emergency procedures and contact qualified professionals immediately.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-blue-200">
          <p>CaterBot - AI-Powered Kitchen Equipment Assistant</p>
          <p className="text-sm mt-2">Helping restaurant teams stay operational 24/7</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;