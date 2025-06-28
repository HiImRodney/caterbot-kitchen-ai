// Landing Page Component
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, MessageCircle, BarChart3, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🤖 CaterBot
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            AI-Powered Kitchen Equipment Assistant
          </p>
          <p className="text-blue-200">
            Troubleshoot equipment instantly • Save on service calls • Keep kitchen running
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/chat"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition-colors group"
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Start Troubleshooting</h3>
            <p className="text-blue-100 text-sm">Get instant AI help with equipment issues</p>
          </Link>

          <Link
            to="/equipment"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-6 transition-colors group"
          >
            <QrCode className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">Scan Equipment</h3>
            <p className="text-indigo-100 text-sm">QR scan for instant equipment context</p>
          </Link>

          <div className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 transition-colors group cursor-pointer">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold mb-2">View Savings</h3>
            <p className="text-green-100 text-sm">Track ROI and cost reductions</p>
          </div>
        </div>

        {/* TOCA Demo Status */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h3 className="text-white text-lg font-semibold mb-3">🍕 TOCA Test Kitchen - Demo Ready</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-green-500/20 rounded p-3">
              <span className="text-green-300">✅ 22 Equipment Pieces Loaded</span>
            </div>
            <div className="bg-blue-500/20 rounded p-3">
              <span className="text-blue-300">✅ AI Pipeline Active (£0.006 avg cost)</span>
            </div>
            <div className="bg-purple-500/20 rounded p-3">
              <span className="text-purple-300">✅ Real-time Cost Tracking</span>
            </div>
            <div className="bg-orange-500/20 rounded p-3">
              <span className="text-orange-300">✅ 60% Pattern Matching (Free)</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          to="/chat"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          <span>Start TOCA Demo</span>
          <ArrowRight className="w-5 h-5" />
        </Link>

        {/* Footer */}
        <div className="mt-12 text-blue-200 text-sm">
          <p>Connected to: ypmrqzxipboumkjttkmt.supabase.co</p>
          <p>Status: Live Production Environment</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;