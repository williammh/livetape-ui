import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction
} from 'react';

interface ContextProviderProps {
  children: React.ReactNode
}

interface IWebSocketContext {
    message: {
        type: string;
        data: {
            open: number;
            high: number; 
            low: number;
            close: number;
        };
    };
    setMessage?: Dispatch<SetStateAction<any>>;
}

const WebSocketContext = createContext({} as IWebSocketContext);

export const WebSocketProvider = ({children}: ContextProviderProps) => {
    const [message, setMessage] = useState({} as IWebSocketContext['message']);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/ws/chart');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ message }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSharedWebSocket = () => useContext(WebSocketContext);

// import { useRef, useEffect } from 'react';

// export const useWebSocket = (onMessage: (data: any) => void) => {
//   const ws = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // Only initialize once
//     ws.current = new WebSocket('ws://localhost:8000/ws/chart');

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       } catch (err) {
//         console.error('WebSocket message parse error:', err);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     ws.current.onerror = (err) => {
//       console.error('WebSocket error:', err);
//     };

//     // Cleanup only on unmount
//     return () => {
//       ws.current?.close();
//     };
//   }, []); // <--- Important: empty dependency array

//   return ws;
// };