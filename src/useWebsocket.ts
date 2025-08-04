import { useRef, useEffect } from 'react';

export const useWebSocket = (onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Only initialize once
    ws.current = new WebSocket('ws://localhost:8000/ws/chart');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('WebSocket message parse error:', err);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    // Cleanup only on unmount
    return () => {
      ws.current?.close();
    };
  }, []); // <--- Important: empty dependency array

  return ws;
};