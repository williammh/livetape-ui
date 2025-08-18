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
import myDataCsv from '../2025-08-15.csv?raw'; // ?raw gives you the text content
import { parseCSV  } from '../util/misc';


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
    setMessage: Dispatch<SetStateAction<any>>;
    setSelectedSymbol: Dispatch<SetStateAction<any>>;

}

const BarContext = createContext({} as IBarWebSocketContext);

export const BarProvider = ({children}: ContextProviderProps) => {
    const [message, setMessage] = useState({} as IBarWebSocketContext['message']);
    const barWsRef = useRef<WebSocket | null>(null);

    const [selectedSymbol, setSelectedSymbol] = useState<string>('');

    useEffect(() => {
        console.log(`selected Symbol ${selectedSymbol}`);
        const barWs = new WebSocket(`ws://${serverAddress}/ws/bars/${selectedSymbol}`);
        barWsRef.current = barWs;

        barWs.onopen = () => {
            console.log(`🌐 📊 ${selectedSymbol} Bars WebSocket connected`);
        };

        barWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessage(data);
        };

        barWs.onclose = () => {
            console.log(`🔌 📊 ${selectedSymbol} Bar WebSocket disconnected`);
        };

        return () => {
            barWs.close();
        };

    }, [selectedSymbol]);


    // useEffect(() => {
    //     const data = parseCSV(myDataCsv);
    //     // console.log(data);

    //     let index = 0;
    //     const mockBarWebSocket = setInterval(() => {
    //         console.log(data[index]);
    //         index++;
    //     }, 1000);

    //     return () => {
    //         clearInterval(mockBarWebSocket);
    //     }

    //   }, []);

    
    return (
        <BarContext.Provider value={{ message, setSelectedSymbol: setSelectedSymbol }}>
            {children}
        </BarContext.Provider>
    );
};

export const useBarContext = () => useContext(BarContext);
