// ============================================================================
// SUPABASE INTEGRATION HOOKS
// Live integration with CaterBot Edge Functions and Database
// ============================================================================

import { useState, useEffect } from 'react';
import { supabase } from '../App';

// ============================================================================
// TYPES
// ============================================================================

interface Equipment {
  id: string;
  site_id: string;
  name: string;
  equipment_type: string;
  location: string;
  make: string;
  model: string;
  serial_number?: string;
  status: 'operational' | 'maintenance_required' | 'out_of_service' | 'under_repair';
  last_maintenance?: string;
  quirks?: Record<string, any>;
}

interface ChatMessage {
  id: string;
  site_id: string;
  user_id?: string;
  equipment_id?: string;
  user_message: string;
  ai_response?: string;
  response_type: 'pattern' | 'cached' | 'ai' | 'escalation';
  confidence_score?: number;
  tokens_used?: number;
  cost_gbp?: number;
  issue_resolved?: boolean;
  user_satisfaction?: number;
  escalated_to_human?: boolean;
  created_at: string;
}

interface ChatResponse {
  success: boolean;
  response: string;
  response_type: 'pattern' | 'cached' | 'ai' | 'escalation';
  confidence_score: number;
  cost_gbp: number;
  equipment_context?: Equipment;
  follow_up_actions?: string[];
  escalation_required?: boolean;
  safety_warning?: string;
}

// ============================================================================
// SITE MANAGEMENT HOOK
// ============================================================================

export const useSiteManagement = () => {
  const [currentSite, setCurrentSite] = useState<string | null>(null);
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .order('business_name');

        if (error) throw error;
        setSites(data || []);

        // Auto-select TOCA test site
        const tocaSite = data?.find(site => site.business_name.includes('TOCA'));
        if (tocaSite && !currentSite) {
          setCurrentSite(tocaSite.id);
        }
      } catch (err) {
        console.error('Failed to fetch sites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [currentSite]);

  return { currentSite, setCurrentSite, sites, loading };
};

// ============================================================================
// EQUIPMENT HOOK
// ============================================================================

export const useEquipment = (siteId: string) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!siteId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .eq('site_id', siteId)
          .order('location', { ascending: true });

        if (error) throw error;
        setEquipment(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch equipment');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [siteId]);

  const findEquipmentByQR = async (qrCode: string): Promise<Equipment | null> => {
    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('serial_number', qrCode)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Equipment lookup failed:', err);
      return null;
    }
  };

  return { equipment, loading, error, findEquipmentByQR };
};

// ============================================================================
// CHAT HOOK - CONNECTS TO LIVE EDGE FUNCTIONS
// ============================================================================

export const useChat = (siteId: string, equipmentId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionCost, setSessionCost] = useState(0);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!siteId) return;
      
      try {
        let query = supabase
          .from('chat_logs')
          .select('*')
          .eq('site_id', siteId)
          .order('created_at', { ascending: true });

        if (equipmentId) {
          query = query.eq('equipment_id', equipmentId);
        }

        const { data, error } = await query.limit(50); // Last 50 messages
        if (error) throw error;

        setMessages(data || []);
        
        // Calculate session cost
        const totalCost = data?.reduce((sum, msg) => sum + (msg.cost_gbp || 0), 0) || 0;
        setSessionCost(totalCost);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };

    loadChatHistory();
  }, [siteId, equipmentId]);

  // Send message to live master-chat Edge Function
  const sendMessage = async (
    message: string, 
    userId: string = 'demo-user'
  ): Promise<ChatResponse> => {
    try {
      setLoading(true);

      // Call live master-chat Edge Function
      const { data, error } = await supabase.functions.invoke('master-chat', {
        body: {
          message,
          user_id: userId,
          site_id: siteId,
          equipment_id: equipmentId
        }
      });

      if (error) throw error;

      // Refresh chat history to get the logged messages
      setTimeout(() => {
        loadChatHistory();
      }, 1000);

      return data;
    } catch (err) {
      console.error('Chat error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Real-time chat updates
  useEffect(() => {
    if (!siteId) return;

    const channel = supabase
      .channel(`chat_${siteId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_logs',
          filter: `site_id=eq.${siteId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
          
          // Update session cost
          if (newMessage.cost_gbp) {
            setSessionCost(prev => prev + newMessage.cost_gbp!);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [siteId]);

  const loadChatHistory = async () => {
    if (!siteId) return;
    
    try {
      let query = supabase
        .from('chat_logs')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: true });

      if (equipmentId) {
        query = query.eq('equipment_id', equipmentId);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;

      setMessages(data || []);
      
      const totalCost = data?.reduce((sum, msg) => sum + (msg.cost_gbp || 0), 0) || 0;
      setSessionCost(totalCost);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  return { messages, loading, sessionCost, sendMessage };
};

// ============================================================================
// COST TRACKING HOOK
// ============================================================================

export const useCostTracking = (siteId: string) => {
  const [monthlyStats, setMonthlyStats] = useState({
    totalCost: 0,
    totalSavings: 0,
    totalSessions: 0,
    avgCostPerSession: 0,
    serviceCallsAvoided: 0
  });

  useEffect(() => {
    const fetchCostStats = async () => {
      if (!siteId) return;
      
      try {
        // Get current month's chat logs
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
          .from('chat_logs')
          .select('cost_gbp, issue_resolved, escalated_to_human')
          .eq('site_id', siteId)
          .gte('created_at', startOfMonth.toISOString());

        if (error) throw error;

        const totalCost = data?.reduce((sum, log) => sum + (log.cost_gbp || 0), 0) || 0;
        const resolvedSessions = data?.filter(log => log.issue_resolved && !log.escalated_to_human).length || 0;
        const totalSessions = data?.length || 0;

        // Estimate savings (£75 average service call cost)
        const estimatedSavings = resolvedSessions * 75;

        setMonthlyStats({
          totalCost,
          totalSavings: estimatedSavings,
          totalSessions,
          avgCostPerSession: totalSessions > 0 ? totalCost / totalSessions : 0,
          serviceCallsAvoided: resolvedSessions
        });
      } catch (err) {
        console.error('Failed to fetch cost stats:', err);
      }
    };

    fetchCostStats();
  }, [siteId]);

  return monthlyStats;
};

// ============================================================================
// QR SCANNER HOOK
// ============================================================================

export const useQRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);

  const startScanning = () => setIsScanning(true);
  const stopScanning = () => setIsScanning(false);

  const handleQRCodeDetected = async (qrCode: string, siteId: string) => {
    try {
      setLastScannedCode(qrCode);
      setIsScanning(false);

      // Use live equipment-context Edge Function
      const { data, error } = await supabase.functions.invoke('equipment-context', {
        body: { qr_code: qrCode, site_id: siteId }
      });

      if (error) throw error;
      return data.equipment as Equipment;
    } catch (err) {
      console.error('QR code lookup failed:', err);
      return null;
    }
  };

  return {
    isScanning,
    lastScannedCode,
    startScanning,
    stopScanning,
    handleQRCodeDetected
  };
};

// ============================================================================
// EQUIPMENT STATUS HOOK
// ============================================================================

export const useEquipmentStatus = (siteId: string) => {
  const [equipmentStatuses, setEquipmentStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!siteId) return;

    // Subscribe to equipment status changes
    const channel = supabase
      .channel(`equipment_status_${siteId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'equipment',
          filter: `site_id=eq.${siteId}`
        },
        (payload) => {
          const equipment = payload.new as Equipment;
          setEquipmentStatuses(prev => ({
            ...prev,
            [equipment.id]: equipment.status
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [siteId]);

  const updateEquipmentStatus = async (equipmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', equipmentId);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update equipment status:', err);
      throw err;
    }
  };

  return { equipmentStatuses, updateEquipmentStatus };
};
