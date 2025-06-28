// Equipment Grid Component
import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteManagement, useEquipment } from '../hooks/useSupabase';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Settings, MapPin, QrCode } from 'lucide-react';

const EquipmentGrid: React.FC = () => {
  const { currentSite } = useSiteManagement();
  const { equipment, loading } = useEquipment(currentSite || '');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white">Loading TOCA equipment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Equipment Selection</h1>
              <p className="text-blue-200">Choose equipment to start troubleshooting</p>
            </div>
          </div>
          <div className="text-right text-white">
            <p className="text-sm">{equipment.length} Equipment Pieces</p>
            <p className="text-xs text-blue-200">TOCA Test Kitchen</p>
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((item) => (
            <Link key={item.id} to={`/chat?equipment=${item.id}`}>
              <Card className="hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.make} {item.model}
                      </p>
                    </div>
                    <Settings className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge 
                      variant={item.status === 'operational' ? 'default' : 'outline'}
                      className={item.status === 'operational' ? 'text-green-700 bg-green-100' : ''}
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-medium">{item.location}</span>
                    </div>
                  </div>

                  {/* Equipment Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="text-sm font-medium text-right max-w-32 truncate">
                      {item.equipment_type}
                    </span>
                  </div>

                  {/* QR Code */}
                  {item.serial_number && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-gray-600">QR Code</span>
                      <div className="flex items-center space-x-1">
                        <QrCode className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-mono">{item.serial_number}</span>
                      </div>
                    </div>
                  )}

                  {/* Last Maintenance */}
                  {item.last_maintenance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Service</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.last_maintenance).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Start CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/chat"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <span>Start Without Equipment Selection</span>
          </Link>
          <p className="text-blue-200 text-sm mt-2">
            You can select equipment during the chat session
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquipmentGrid;