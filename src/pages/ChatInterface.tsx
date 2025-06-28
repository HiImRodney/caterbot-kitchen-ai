// Chat Interface Component - AI-Powered Equipment Troubleshooting
// Real-time messaging with equipment context and cost tracking

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Shield, 
  Clock,
  DollarSign,
  Wrench,
  CheckCircle,
  Copy,
  MoreVertical
} from 'lucide-react';
import { useEquipment } from '../contexts/EquipmentContext';
import { useUser } from '../contexts/UserContext';
import { sendChatMessage } from '../App';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  responseType?: 'pattern_match' | 'ai_escalation' | 'safety_escalation';
  cost?: number;
  metadata?: {
    tokensUsed?: number;
    model?: string;
    containsSafetyEscalation?: boolean;
  };
}

interface SessionStats {
  messageCount: number;
  totalCost: number;
  sessionDuration: number;
  responseTypes: {
    pattern_match: number;
    ai_escalation: number;
    safety_escalation: number;
  };
}

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentEquipment } = useEquipment();
  const { user } = useUser();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    messageCount: 0,
    totalCost: 0,
    sessionDuration: 0,
    responseTypes: { pattern_match: 0, ai_escalation: 0, safety_escalation: 0 }
  });
  const [sessionStartTime] = useState(new Date());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update session duration every second
  useEffect(() => {
    const interval = setInterval(() => {
      const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
      setSessionStats(prev => ({ ...prev, sessionDuration: duration }));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  // Initialize chat with equipment context
  useEffect(() => {
    if (currentEquipment) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: `🔧 **Equipment Context Loaded**\n\n**${currentEquipment.custom_name}**\n${currentEquipment.equipment_type} • ${currentEquipment.location}\n\nI'm ready to help you troubleshoot this equipment. What issue are you experiencing?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else {
      // General chat without specific equipment
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'system',
        content: `👋 **Welcome to CaterBot**\n\nI'm here to help with kitchen equipment issues. You can:\n\n• Describe any equipment problem\n• Ask for troubleshooting steps\n• Get safety guidance\n\nWhat can I help you with today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [currentEquipment]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to our master-chat API
      const response = await sendChatMessage(inputMessage.trim(), currentEquipment);

      if (response.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: response.response || response.ai_response || 'I apologize, but I encountered an issue processing your request.',
          timestamp: new Date(),
          responseType: response.response_type,
          cost: response.cost_gbp || response.estimated_cost_gbp || 0,
          metadata: {
            tokensUsed: response.response_metadata?.tokens_used?.total,
            model: response.response_metadata?.model,
            containsSafetyEscalation: response.response_metadata?.contains_safety_escalation || response.escalation_required
          }
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update session stats
        setSessionStats(prev => ({
          messageCount: prev.messageCount + 1,
          totalCost: prev.totalCost + (assistantMessage.cost || 0),
          sessionDuration: prev.sessionDuration,
          responseTypes: {
            ...prev.responseTypes,
            [response.response_type]: prev.responseTypes[response.response_type] + 1
          }
        }));

      } else {
        throw new Error(response.error || 'Failed to get response');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Connection Error**\n\nI'm having trouble connecting to the troubleshooting system. Please check your internet connection and try again.\n\n*If the problem persists, you can try:*\n• Refreshing the page\n• Using the equipment manual\n• Contacting your manager`,
        timestamp: new Date(),
        responseType: 'pattern_match'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getResponseTypeColor = (type?: string) => {
    const colors = {
      'pattern_match': 'text-green-400 bg-green-500/20',
      'ai_escalation': 'text-blue-400 bg-blue-500/20',
      'safety_escalation': 'text-red-400 bg-red-500/20'
    };
    return colors[type as keyof typeof colors] || 'text-gray-400 bg-gray-500/20';
  };

  const getResponseTypeLabel = (type?: string) => {
    const labels = {
      'pattern_match': 'Pattern Match',
      'ai_escalation': 'AI Response',
      'safety_escalation': 'Safety Alert'
    };
    return labels[type as keyof typeof labels] || 'System';
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const quickResponses = [
    "Equipment is not working at all",
    "Temperature issues",
    "Strange noises or vibrations", 
    "Electrical problems",
    "Cleaning and maintenance help",
    "Safety concern"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white flex flex-col">
      {/* Header with Equipment Context */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          {/* Top Row - Navigation and Session Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              
              <div>
                <h1 className="text-lg font-bold">Equipment Assistant</h1>
                {currentEquipment && (
                  <p className="text-sm text-blue-200">{currentEquipment.custom_name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-400">
                <Clock size={16} />
                <span>{formatDuration(sessionStats.sessionDuration)}</span>
              </div>
              
              <div className="flex items-center gap-1 text-blue-400">
                <DollarSign size={16} />
                <span>£{sessionStats.totalCost.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Equipment Context Bar */}
          {currentEquipment && (
            <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Wrench size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">{currentEquipment.custom_name}</p>
                  <p className="text-sm text-blue-200">
                    {currentEquipment.manufacturer} • {currentEquipment.location}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-gray-400">QR Code</p>
                <p className="text-sm font-mono text-blue-300">{currentEquipment.qr_code}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-4xl mx-auto w-full">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar */}
              {message.type !== 'user' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'system' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                }`}>
                  {message.type === 'system' ? (
                    <Wrench size={16} className="text-purple-400" />
                  ) : (
                    <Bot size={16} className="text-blue-400" />
                  )}
                </div>
              )}

              {/* Message Content */}
              <div className={`max-w-2xl ${message.type === 'user' ? 'order-1' : ''}`}>
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white ml-auto'
                    : message.type === 'system'
                    ? 'bg-purple-600/20 border border-purple-500/30'
                    : 'bg-white/10 border border-white/20'
                }`}>
                  {/* Message Header */}
                  {message.type === 'assistant' && message.responseType && (
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResponseTypeColor(message.responseType)}`}>
                        {getResponseTypeLabel(message.responseType)}
                      </span>
                      
                      {message.cost && message.cost > 0 && (
                        <span className="text-xs text-gray-400">
                          £{message.cost.toFixed(4)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Safety Alert Banner */}
                  {message.metadata?.containsSafetyEscalation && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-3 flex items-center gap-2">
                      <Shield size={16} className="text-red-400" />
                      <span className="text-sm font-medium text-red-300">Safety Protocol Activated</span>
                    </div>
                  )}

                  {/* Message Text */}
                  <div className="prose prose-invert max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <p key={index} className={`${index > 0 ? 'mt-2' : ''} ${
                        line.startsWith('**') ? 'font-semibold' : ''
                      }`}>
                        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                      </p>
                    ))}
                  </div>

                  {/* Message Actions */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    
                    <button
                      onClick={() => copyMessage(message.content)}
                      className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
                      title="Copy message"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* User Avatar */}
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Bot size={16} className="text-blue-400" />
              </div>
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4 max-w-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-400">Analyzing your issue...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Response Buttons */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 max-w-4xl mx-auto w-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickResponses.map((response) => (
                <button
                  key={response}
                  onClick={() => setInputMessage(response)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-blue-200 transition-colors border border-white/20"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe the equipment issue..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  disabled={isLoading}
                />
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white transition-colors flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>

            {/* Session Stats */}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <div className="flex gap-4">
                <span>{sessionStats.messageCount} messages</span>
                <span>Pattern: {sessionStats.responseTypes.pattern_match}</span>
                <span>AI: {sessionStats.responseTypes.ai_escalation}</span>
                <span>Safety: {sessionStats.responseTypes.safety_escalation}</span>
              </div>
              
              <div>
                Total cost: £{sessionStats.totalCost.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatInterface;