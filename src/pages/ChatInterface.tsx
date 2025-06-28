// ============================================================================
// LIVE CHAT INTERFACE COMPONENT
// Connects to CaterBot Edge Functions with real-time features
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useSiteManagement, 
  useEquipment, 
  useChat, 
  useCostTracking,
  useQRScanner 
} from '../hooks/useSupabase';

// UI Components (assuming shadcn/ui or similar)
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

// Icons
import { 
  MessageCircle, 
  Send,
  Bot,
  User,
  QrCode,
  Wifi,
  WifiOff,
  Settings,
  DollarSign,
  CheckCircle,
  MapPin,
  Thermometer
} from 'lucide-react';

interface ChatInterfaceProps {}

const ChatInterface: React.FC<ChatInterfaceProps> = () => {
  // Get session ID from URL params
  const { sessionId } = useParams<{ sessionId?: string }>();
  
  // Live Supabase integration
  const { currentSite, sites } = useSiteManagement();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  
  const { equipment, loading: equipmentLoading } = useEquipment(currentSite || '');
  const { messages, sendMessage, sessionCost, loading: chatLoading } = useChat(currentSite || '', selectedEquipmentId || undefined);
  const costStats = useCostTracking(currentSite || '');
  const { handleQRCodeDetected, startScanning } = useQRScanner();
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select pizza station for demo
  useEffect(() => {
    if (equipment.length > 0 && !selectedEquipmentId) {
      const pizzaStation = equipment.find(eq => eq.name.includes('Pizza Station'));
      if (pizzaStation) {
        setSelectedEquipmentId(pizzaStation.id);
      } else {
        // Fallback to first equipment
        setSelectedEquipmentId(equipment[0].id);
      }
    }
  }, [equipment, selectedEquipmentId]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentEquipment = equipment.find(eq => eq.id === selectedEquipmentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || chatLoading || !currentSite) return;
    
    try {
      const response = await sendMessage(currentMessage, 'demo-user');
      setCurrentMessage('');
      
      // Handle special response types
      if (response.escalation_required) {
        console.log('Escalation required:', response);
      }
      
      if (response.safety_warning) {
        console.log('Safety warning:', response.safety_warning);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleQRScan = async (qrCode: string) => {
    if (!currentSite) return;
    
    const equipment = await handleQRCodeDetected(qrCode, currentSite);
    if (equipment) {
      setSelectedEquipmentId(equipment.id);
    }
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 text-gray-500 text-sm">
      <Bot className="w-4 h-4" />
      <span>CaterBot is thinking</span>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
    </div>
  );

  if (equipmentLoading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading TOCA equipment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header with Equipment Context */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {currentEquipment?.name || 'No Equipment Selected'}
                  </h1>
                  <p className="text-gray-600">
                    {currentEquipment ? `${currentEquipment.make} ${currentEquipment.model}` : 'Select equipment to start troubleshooting'}
                  </p>
                </div>
                
                {/* Connection Status */}
                <div className="flex items-center space-x-1">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    {isOnline ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
              
              {currentEquipment && (
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{currentEquipment.location}</span>
                  </div>
                  <Badge variant="outline" className={`${
                    currentEquipment.status === 'operational' ? 'text-green-700 border-green-300' :
                    currentEquipment.status === 'maintenance_required' ? 'text-orange-700 border-orange-300' :
                    'text-red-700 border-red-300'
                  }`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {currentEquipment.status.replace('_', ' ')}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={startScanning}
                    className="flex items-center space-x-1"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Scan QR</span>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Cost Savings Display */}
            <div className="text-right space-y-1">
              <div className="text-2xl font-bold text-green-600">£{costStats.totalSavings.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Monthly Savings</div>
              <div className="text-xs text-gray-500">Session: £{sessionCost.toFixed(3)}</div>
              <div className="text-xs text-blue-600">{sites.length} sites connected</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Equipment Selection if none selected */}
      {!currentEquipment && equipment.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Select Equipment</h3>
                <p className="text-sm text-orange-600">Choose equipment to start troubleshooting</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {equipment.slice(0, 4).map(eq => (
                  <Button
                    key={eq.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEquipmentId(eq.id)}
                    className="text-xs"
                  >
                    {eq.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold">Live Troubleshooting Session</h2>
                </div>
                <Badge variant="secondary">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Active
                  </span>
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0">
              <div className="h-full p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.length === 0 && currentEquipment && (
                    <div className="text-center text-gray-500 py-8">
                      <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg">Welcome to CaterBot!</p>
                      <p className="text-sm">I can see you've selected {currentEquipment.name}. How can I help troubleshoot today?</p>
                    </div>
                  )}
                  
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.user_message ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex space-x-3 max-w-[80%] ${message.user_message ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white">
                          {message.user_message ? (
                            <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-indigo-500 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        
                        <div className={`rounded-lg p-3 ${
                          message.user_message 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="whitespace-pre-wrap">
                            {message.user_message || message.ai_response}
                          </div>
                          
                          {message.confidence_score && (
                            <div className="mt-2 flex items-center space-x-2 text-xs opacity-75">
                              <span>Confidence: {(message.confidence_score * 100).toFixed(0)}%</span>
                              {message.cost_gbp && (
                                <span>• £{message.cost_gbp.toFixed(3)}</span>
                              )}
                              {message.response_type && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.response_type}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          <div className="text-xs opacity-60 mt-1">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="flex space-x-3 max-w-[80%]">
                        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="rounded-lg p-3 bg-gray-100">
                          <TypingIndicator />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={currentEquipment ? "Describe the issue you're experiencing..." : "Select equipment first to start troubleshooting..."}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={!currentEquipment || chatLoading || !isOnline}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || chatLoading || !currentEquipment || !isOnline}
                  className="px-4"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  {!isOnline ? 'Offline - Connect to internet' : 
                   !currentEquipment ? 'Select equipment to start' :
                   'Type your message and press Enter'}
                </span>
                <span>Powered by AI • £{sessionCost.toFixed(3)} session cost</span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Sidebar with Equipment Details */}
        <div className="space-y-4">
          {/* Equipment Status */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="font-semibold flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Equipment Status
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentEquipment ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="secondary" className="text-xs">
                        {currentEquipment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium">{currentEquipment.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Type</span>
                      <span className="font-medium">{currentEquipment.equipment_type}</span>
                    </div>
                    {currentEquipment.last_maintenance && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Service</span>
                        <span className="font-medium">
                          {new Date(currentEquipment.last_maintenance).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-gray-500 mb-1">Performance</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          currentEquipment.status === 'operational' ? 'bg-green-500' :
                          currentEquipment.status === 'maintenance_required' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: `${
                            currentEquipment.status === 'operational' ? 85 :
                            currentEquipment.status === 'maintenance_required' ? 60 : 30
                          }%` 
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {currentEquipment.status === 'operational' ? 'Running well' :
                       currentEquipment.status === 'maintenance_required' ? 'Needs attention' :
                       'Requires service'}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Select equipment to view status</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost Savings */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <h3 className="font-semibold text-green-800 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                ROI Tracking
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-green-700">£{costStats.totalSavings.toFixed(2)}</div>
                  <div className="text-sm text-green-600">This Month</div>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service calls avoided</span>
                    <span className="font-medium">{costStats.serviceCallsAvoided}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total sessions</span>
                    <span className="font-medium">{costStats.totalSessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total cost</span>
                    <span className="font-medium">£{costStats.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg per session</span>
                    <span className="font-medium">£{costStats.avgCostPerSession.toFixed(3)}</span>
                  </div>
                </div>
                
                <div className="border border-green-200 bg-green-50 rounded p-2">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <div className="text-green-800 text-xs">
                      ROI: {costStats.totalSavings > 0 ? 
                        `${((costStats.totalSavings - costStats.totalCost) / Math.max(costStats.totalCost, 1) * 100).toFixed(0)}% savings` :
                        'Building savings data...'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
