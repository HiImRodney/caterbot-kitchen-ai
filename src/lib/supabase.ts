import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Chat API integration
export const sendChatMessage = async (
  message: string, 
  equipmentContext?: any,
  userId: string = 'test-user',
  siteId: string = 'TOCA-TEST-001'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('master-chat', {
      body: {
        message,
        equipment_context: equipmentContext,
        user_id: userId,
        site_id: siteId
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
};