import { useEffect, useRef, useState } from 'react';
import type { WebSocketMessage } from '@/lib/types';

export function useWebSocket(onMessage?: (message: WebSocketMessage) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setError(null);
        console.log('WebSocket connected');
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketMessage;
          onMessage?.(data);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error');
      };

      socket.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
      };

    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to connect');
    }

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [onMessage]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, error, sendMessage };
}
