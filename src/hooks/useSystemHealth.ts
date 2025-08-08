import { useState, useEffect, useCallback } from 'react';
import { propGuardAPI } from '@/services/api/propguard';

interface SystemHealth {
  propguard: any;
  llm: any;
  blockchain: any;
  xnode: any;
  pipeline: any;
}

export const useSystemHealth = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      const healthData = await propGuardAPI.checkSystemHealth();
      setHealth(healthData);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkHealth]);

  const getServiceStatus = (service: any) => {
    if (!service) return 'offline';
    return service.success ? 'online' : 'error';
  };

  return {
    health,
    isLoading,
    checkHealth,
    getServiceStatus
  };
};