import { useRef, useEffect } from 'react';

// export function useWebSocket(onMessage: (msg: string) => void) {
//   const wsRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     const ws = new WebSocket("ws://localhost:8000/ws");
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("WebSocket connected");
//       ws.send("Hello server!");
//     };

//     ws.onmessage = (event) => {
//       onMessage(JSON.parse(event.data));
//     };

//     ws.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     return () => {
//       ws.close();
//     };

//   }, [onMessage]);
// }

export const useWebSocket = (onMessage: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Only initialize once
    ws.current = new WebSocket('ws://localhost:8000/ws');

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