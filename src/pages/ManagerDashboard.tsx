import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Users, Wrench, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalEquipment: number;
  activeChats: number;
  costsSaved: number;
  maintenanceAlerts: number;
}

const ManagerDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    activeChats: 0,
    costsSaved: 0,
    maintenanceAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch equipment count
      const { count: equipmentCount } = await supabase
        .from('site_equipment')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', 'TOCA-TEST-001');

      // Fetch chat logs for analysis
      const { count: chatCount } = await supabase
        .from('chat_logs')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', 'TOCA-TEST-001')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      // Calculate maintenance alerts
      const { count: alertCount } = await supabase
        .from('site_equipment')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', 'TOCA-TEST-001')
        .eq('current_status', 'maintenance_required');

      setStats({
        totalEquipment: equipmentCount || 0,
        activeChats: chatCount || 0,
        costsSaved: 1247.50, // Mock data - would be calculated from real cost savings
        maintenanceAlerts: alertCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
              <p className="text-gray-600">TOCA Test Site - Equipment Overview</p>
            </div>
            <Link 
              to="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEquipment}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeChats}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Costs Saved</p>
                <p className="text-2xl font-bold text-gray-900">£{stats.costsSaved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Maintenance Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maintenanceAlerts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Staff member resolved dishwasher issue</span>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">New chat session started for oven</span>
                  <span className="text-xs text-gray-400">5 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Maintenance alert: Fridge temperature</span>
                  <span className="text-xs text-gray-400">12 min ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Equipment Status</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Operational</span>
                  <span className="text-sm font-medium text-green-600">{stats.totalEquipment - stats.maintenanceAlerts} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maintenance Required</span>
                  <span className="text-sm font-medium text-yellow-600">{stats.maintenanceAlerts} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Out of Service</span>
                  <span className="text-sm font-medium text-red-600">0 units</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;