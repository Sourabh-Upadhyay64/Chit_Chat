import { useEffect, useCallback } from 'react';

// Simulates real-time sync between tabs using localStorage events
export const useRealtime = (channel: string, onMessage: (data: any) => void) => {
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `realtime_${channel}` && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing realtime message:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [channel, onMessage]);

  const broadcast = useCallback(
    (data: any) => {
      const message = JSON.stringify({ ...data, timestamp: Date.now() });
      localStorage.setItem(`realtime_${channel}`, message);
      
      // Trigger event for same tab
      onMessage(JSON.parse(message));
    },
    [channel, onMessage]
  );

  return { broadcast };
};