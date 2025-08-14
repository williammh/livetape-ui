import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction
} from 'react';
import { serverAddress } from './AppContext';

interface ContextProviderProps {
  children: React.ReactNode
}

interface IBarWebSocketContext {
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

const BarContext = createContext({} as IBarWebSocketContext);

export const BarProvider = ({children}: ContextProviderProps) => {
    const [message, setMessage] = useState({} as IBarWebSocketContext['message']);
    const barWsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const barWs = new WebSocket(`ws://${serverAddress}/ws/bars/MNQU25`);
        barWsRef.current = barWs;

        barWs.onopen = () => {
            console.log('📊 Bar WebSocket connected');
        };

        barWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data);
        };

        barWs.onclose = () => {
            console.log('📊 Bar WebSocket disconnected');
        };

        return () => {
            barWs.close();
        };
    }, []);

    return (
        <BarContext.Provider value={{ message }}>
            {children}
        </BarContext.Provider>
    );
};

export const useBarContext = () => useContext(BarContext);
