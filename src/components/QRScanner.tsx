import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, Search, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useEquipment } from '../contexts/EquipmentContext';
import { Link } from 'react-router-dom';

const QRScanner: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentEquipment } = useEquipment();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleEquipmentFound = async (qrCode: string) => {
    try {
      // Fetch equipment details from database
      const { data: equipment, error } = await supabase
        .from('site_equipment')
        .select(`
          id,
          qr_code,
          internal_name,
          equipment_catalog (equipment_type_id),
          equipment_locations (location_name),
          current_status
        `)
        .eq('qr_code', qrCode)
        .eq('site_id', 'TOCA-TEST-001')
        .single();

      if (error || !equipment) {
        setError(`Equipment not found for QR code: ${qrCode}`);
        return;
      }

      // Set equipment context
      const equipmentContext = {
        equipment_id: equipment.id,
        equipment_type: equipment.equipment_catalog?.equipment_type_id || 'Unknown',
        equipment_name: equipment.internal_name || 'Unknown Equipment',
        location: equipment.equipment_locations?.location_name || 'Unknown',
        qr_code: equipment.qr_code,
        status: equipment.current_status
      };

      setCurrentEquipment(equipmentContext);
      stopCamera();

      // Navigate to chat interface
      const sessionId = `chat_${Date.now()}`;
      navigate(`/chat/${sessionId}`, {
        state: { equipment_context: equipmentContext }
      });

    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Failed to fetch equipment details. Please try again.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleEquipmentFound(manualCode.trim());
    }
  };

  // Mock QR detection for demo purposes
  const simulateQRDetection = () => {
    // Simulate finding a QR code after 2 seconds
    setTimeout(() => {
      handleEquipmentFound('TOCA-CK-CHILL-01');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scan Equipment QR Code</h1>
              <p className="text-gray-600">Point your camera at the equipment QR code</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Camera View */}
          <div className="relative aspect-video bg-gray-900">
            {isScanning ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
                  </div>
                </div>
                {/* Demo button for testing */}
                <button
                  onClick={simulateQRDetection}
                  className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Simulate QR Detection
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white">
                  <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-4">Camera not active</p>
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                  >
                    Start Camera
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-red-700">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            )}

            {/* Manual Entry */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Manual QR Code Entry
              </h3>
              <form onSubmit={handleManualSubmit} className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter QR code manually (e.g., TOCA-CK-CHILL-01)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Find</span>
                </button>
              </form>
              
              {/* Test QR Codes */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Test QR codes you can try:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'TOCA-CK-CHILL-01',
                    'TOCA-HK-RANGE-01', 
                    'TOCA-WU-DISH-01',
                    'TOCA-ICE-CUBE-01'
                  ].map((code) => (
                    <button
                      key={code}
                      onClick={() => setManualCode(code)}
                      className="text-left px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Camera Controls */}
            <div className="flex space-x-4">
              {isScanning ? (
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Stop Camera
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Camera
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QRScanner;