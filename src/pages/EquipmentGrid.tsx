import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, QrCode } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Equipment {
  id: string;
  qr_code: string;
  equipment_name: string;
  equipment_type: string;
  location_name: string;
  status: string;
}

const EquipmentGrid: React.FC = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const { data, error } = await supabase
        .from('site_equipment')
        .select(`
          id,
          qr_code,
          internal_name,
          equipment_catalog (equipment_type_id),
          equipment_locations (location_name),
          current_status
        `)
        .eq('site_id', 'TOCA-TEST-001');

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        qr_code: item.qr_code,
        equipment_name: item.internal_name || 'Unknown Equipment',
        equipment_type: item.equipment_catalog?.equipment_type_id || 'Unknown',
        location_name: item.equipment_locations?.location_name || 'Unknown',
        status: item.current_status
      })) || [];

      setEquipment(formattedData);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.equipment_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.equipment_type === selectedType;
    return matchesSearch && matchesType;
  });

  const equipmentTypes = [...new Set(equipment.map(item => item.equipment_type))];

  const handleEquipmentSelect = (selectedEquipment: Equipment) => {
    // Create new chat session with equipment context
    const sessionId = `chat_${Date.now()}`;
    navigate(`/chat/${sessionId}`, {
      state: {
        equipment_context: {
          equipment_id: selectedEquipment.id,
          equipment_type: selectedEquipment.equipment_type,
          equipment_name: selectedEquipment.equipment_name,
          location: selectedEquipment.location_name,
          qr_code: selectedEquipment.qr_code
        }
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'maintenance_required': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Select Equipment</h1>
            <Link 
              to="/scan"
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              onClick={() => handleEquipmentSelect(item)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border hover:border-blue-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.equipment_name}
                    </h3>
                    <p className="text-sm text-gray-600">{item.equipment_type}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{item.location_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>QR Code:</span>
                    <span className="font-mono text-xs">{item.qr_code}</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Get Help
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No equipment found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EquipmentGrid;