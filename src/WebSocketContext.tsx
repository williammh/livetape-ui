// import {
//     createContext,
//     useContext,
//     useEffect,
//     useRef,
//     useState,
//     type Dispatch,
//     type SetStateAction
// } from 'react';

// interface ContextProviderProps {
//   children: React.ReactNode
// }

// interface IBarWebSocketContext {
//     message: {
//         type: string;
//         data: {
//             open: number;
//             high: number; 
//             low: number;
//             close: number;
//         };
//     };
//     setMessage?: Dispatch<SetStateAction<any>>;
// }

// const BarWebSocketContext = createContext({} as IBarWebSocketContext);

// export const BarWebSocketProvider = ({children}: ContextProviderProps) => {
//     const [message, setMessage] = useState({} as IBarWebSocketContext['message']);
//     const wsRef = useRef<WebSocket | null>(null);

//     useEffect(() => {
//         const ws = new WebSocket('ws://localhost:8000/ws/chart');
//         wsRef.current = ws;

//         ws.onopen = () => {
//             console.log('WebSocket connected');
//         };

//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setMessage(data);
//         };

//         ws.onclose = () => {
//             console.log('WebSocket disconnected');
//         };

//         return () => {
//             ws.close();
//         };
//     }, []);

//     return (
//         <BarWebSocketContext.Provider value={{ message }}>
//             {children}
//         </BarWebSocketContext.Provider>
//     );
// };

// export const useBarWebSocket = () => useContext(BarWebSocketContext);
