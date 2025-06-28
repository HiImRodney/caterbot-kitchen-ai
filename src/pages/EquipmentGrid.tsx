// Equipment Grid Component - Interactive Equipment Browser
// Beautiful card-based interface for selecting kitchen equipment

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ArrowLeft, 
  Snowflake, 
  Flame, 
  Droplets, 
  Settings,
  ChefHat,
  Coffee,
  Refrigerator,
  Utensils
} from 'lucide-react';
import { useEquipment, Equipment } from '../contexts/EquipmentContext';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../App';

const EquipmentGrid: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentEquipment } = useEquipment();
  const { user } = useUser();
  
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Load equipment data
  useEffect(() => {
    const loadEquipment = async () => {
      try {
        setLoading(true);
        
        // Fetch equipment from Supabase with proper joins
        const { data, error } = await supabase
          .from('site_equipment')
          .select(`
            id,
            qr_code,
            custom_name,
            location_description,
            current_status,
            equipment_catalog (
              equipment_type,
              display_name,
              manufacturer,
              category
            ),
            equipment_locations (
              location_name
            )
          `)
          .eq('site_id', user?.siteId || 'TOCA-TEST-001')
          .not('qr_code', 'is', null);

        if (error) throw error;

        // Transform data for our component
        const transformedEquipment: Equipment[] = data?.map(item => ({
          id: item.id,
          qr_code: item.qr_code,
          custom_name: item.custom_name,
          equipment_type: item.equipment_catalog?.display_name || 'Unknown',
          manufacturer: item.equipment_catalog?.manufacturer || 'Unknown',
          model: item.equipment_catalog?.equipment_type || 'Unknown',
          location: item.equipment_locations?.location_name || item.location_description || 'Unknown',
          status: item.current_status || 'operational',
          category: item.equipment_catalog?.category || 'general',
          site_name: user?.siteName || 'Unknown Site'
        })) || [];

        setEquipment(transformedEquipment);
        setFilteredEquipment(transformedEquipment);
      } catch (error) {
        console.error('Error loading equipment:', error);
        // Fallback to mock data for demo
        setEquipment(mockEquipmentData);
        setFilteredEquipment(mockEquipmentData);
      } finally {
        setLoading(false);
      }
    };

    loadEquipment();
  }, [user?.siteId, user?.siteName]);

  // Filter equipment based on search and category
  useEffect(() => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.custom_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredEquipment(filtered);
  }, [searchTerm, selectedCategory, equipment]);

  const handleEquipmentSelect = (selectedEquipment: Equipment) => {
    setCurrentEquipment(selectedEquipment);
    // Navigate to chat with equipment context
    navigate(`/chat?equipment=${selectedEquipment.id}`);
  };

  const getEquipmentIcon = (category: string) => {
    const iconMap = {
      'refrigeration': Snowflake,
      'cooking': Flame,
      'warewashing': Droplets,
      'ice_production': Coffee,
      'preparation': ChefHat,
      'general': Settings
    };
    
    const IconComponent = iconMap[category as keyof typeof iconMap] || Settings;
    return <IconComponent size={24} />;
  };

  const getStatusColor = (status: string) => {
    const statusMap = {
      'operational': 'text-green-400 bg-green-500/20',
      'maintenance_due': 'text-yellow-400 bg-yellow-500/20',
      'needs_attention': 'text-orange-400 bg-orange-500/20',
      'out_of_service': 'text-red-400 bg-red-500/20'
    };
    
    return statusMap[status as keyof typeof statusMap] || 'text-gray-400 bg-gray-500/20';
  };

  const categories = [
    { value: 'all', label: 'All Equipment', icon: Settings },
    { value: 'refrigeration', label: 'Refrigeration', icon: Snowflake },
    { value: 'cooking', label: 'Cooking', icon: Flame },
    { value: 'warewashing', label: 'Warewashing', icon: Droplets },
    { value: 'ice_production', label: 'Ice Production', icon: Coffee },
    { value: 'preparation', label: 'Preparation', icon: ChefHat }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-xl">Loading equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div>
              <h1 className="text-xl font-bold">Kitchen Equipment</h1>
              <p className="text-sm text-blue-200">{filteredEquipment.length} pieces available</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search equipment by name, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.value;
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'
                  }`}
                >
                  <IconComponent size={16} />
                  <span className="hidden sm:inline">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <button
              key={item.id}
              onClick={() => handleEquipmentSelect(item)}
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-left hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {/* Equipment Icon and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                  {getEquipmentIcon(item.category)}
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* Equipment Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {item.custom_name}
                </h3>
                
                <p className="text-sm text-blue-200">
                  {item.equipment_type}
                </p>
                
                <p className="text-sm text-gray-300">
                  {item.manufacturer} • {item.location}
                </p>
                
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-400 font-mono">
                    {item.qr_code}
                  </span>
                  
                  <span className="text-xs text-blue-300 font-medium">
                    Tap for help →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredEquipment.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No equipment found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Try adjusting your search terms or category filter to find the equipment you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Quick Actions Footer */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Can't find your equipment?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/scan')}
              className="flex items-center gap-3 p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                <Search size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">Scan QR Code</h4>
                <p className="text-sm text-blue-200">Use camera to identify equipment</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/chat')}
              className="flex items-center gap-3 p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl hover:bg-purple-600/30 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-500/30 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium">General Help</h4>
                <p className="text-sm text-purple-200">Ask about any equipment issue</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

// Mock data for development/demo purposes
const mockEquipmentData: Equipment[] = [
  {
    id: '1',
    qr_code: 'TOCA-CK-CHILL-01',
    custom_name: 'Williams Reach-In Chiller #1',
    equipment_type: 'Reach-In Chiller',
    manufacturer: 'Williams',
    model: 'R280-SA',
    location: 'Cold Kitchen',
    status: 'operational',
    category: 'refrigeration',
    site_name: 'TOCA Test Restaurant'
  },
  {
    id: '2',
    qr_code: 'TOCA-HK-RANGE-01',
    custom_name: 'Falcon 6-Burner Range',
    equipment_type: '6-Burner Range + Oven',
    manufacturer: 'Falcon',
    model: 'G3101',
    location: 'Hot Kitchen',
    status: 'operational',
    category: 'cooking',
    site_name: 'TOCA Test Restaurant'
  },
  {
    id: '3',
    qr_code: 'TOCA-WU-DISH-01',
    custom_name: 'Hobart Dishwasher',
    equipment_type: 'Under Counter Dishwasher',
    manufacturer: 'Hobart',
    model: 'ECOMAX-502',
    location: 'Wash-Up Area',
    status: 'maintenance_due',
    category: 'warewashing',
    site_name: 'TOCA Test Restaurant'
  },
  {
    id: '4',
    qr_code: 'TOCA-ICE-CUBE-01',
    custom_name: 'Hoshizaki Cube Ice Maker',
    equipment_type: 'Cube Ice Maker',
    manufacturer: 'Hoshizaki',
    model: 'IM-100CNE',
    location: 'Ice Station',
    status: 'operational',
    category: 'ice_production',
    site_name: 'TOCA Test Restaurant'
  },
  {
    id: '5',
    qr_code: 'TOCA-HK-FRYER-01',
    custom_name: 'Falcon Twin Basket Fryer',
    equipment_type: 'Twin Basket Fryer',
    manufacturer: 'Falcon',
    model: 'G1838',
    location: 'Hot Kitchen',
    status: 'needs_attention',
    category: 'cooking',
    site_name: 'TOCA Test Restaurant'
  },
  {
    id: '6',
    qr_code: 'TOCA-BAR-BOTTLE-01',
    custom_name: 'Gamko Bottle Chiller',
    equipment_type: 'Back Bar Bottle Chiller',
    manufacturer: 'Gamko',
    model: 'MG2-250G',
    location: 'Service Bar',
    status: 'operational',
    category: 'refrigeration',
    site_name: 'TOCA Test Restaurant'
  }
];

export default EquipmentGrid;