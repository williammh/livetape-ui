import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type RefObject,
    type Dispatch,
    type SetStateAction
} from 'react';
// ?raw gets the text content
import Nvda20250815 from '../assets/NVDA.bars.2025-08-15.csv?raw';

import { parseCSV, addToDate, toRfc3339Str } from '../util/misc';

interface IAppContext {
    assetClass: 'Stocks' | 'Crypto' | 'Futures';
    setAssetClass: Dispatch<SetStateAction<string>>;
    symbol: string;
    setSymbol: Dispatch<SetStateAction<string>>;
    timezone: string;
    setTimezone: Dispatch<SetStateAction<string>>;
    openBarCallback: (callback: ((msg: any) => void) | null) => void;
    replayDate: string;
    setReplayDate: Dispatch<SetStateAction<string>>;
    messageListRef: RefObject<object[]>;
    positionsRef: RefObject<{[account: string]: {[id: string]: IPosition}}>;
    priceRef: RefObject<number>;
    timestampRef: RefObject<string>;
}

export interface IPosition {
  id: number;
  account: string;
  direction: string;
  quantity: number;
  symbol: string;
  averagePrice: number | string;
  openTimestamp: string;
  closeTimestamp?: string;
  pnl?: number | string;

}

const AppContext = createContext({} as IAppContext);

export const serverAddress = 'localhost:8001';

export const symbols = {
    'Stocks': ['NVDA', 'TSLA'],
    'Crypto': ['BTCUSD', 'ETHUSD'],
    'Futures': ['NQU25', 'ESU25']
};

export const symbolMap = {
    'NVDA': {
      name: 'NVIDIA Corporation',
      exchange: 'NASDAQ'
    },
    'TSLA': {
      name: 'Tesla, Inc.',
      exchange: 'NASDAQ'
    },
    'BTCUSD': {
      name: 'Bitcoin USD',
      exchange: 'Crypto'
    },
    'ETHUSD': {
      name: 'Ethereum USD',
      exchange: 'Crypto'
    },
    'NQU25': {
      name: 'E-Mini NASDAQ 100 Sep 2025',
      exchange: 'CME'
    },
    'ESU25': {
      name: 'E-Mini S&P 500 Sep 2025',
      exchange: 'CME'
    },
  }


export const AppProvider = ({children}: {children: React.ReactNode}) => {
    // app settings
    const [ assetClass, setAssetClass ] = useState<'Stocks' | 'Crypto' | 'Futures'>('Stocks');
    // const [ assetClass, setAssetClass ] = useState<string>('Futures');
    const [ symbol, setSymbol ] = useState<string>('NVDA');
    const [ replayDate, setReplayDate ] = useState<string>('');
    const [ timezone, setTimezone ] = useState<string>('America/Los_Angeles');
    
    // bar data websocket connection
    const openBarcallBackRef = useRef<((msg: any) => void) | null>(null);
    const barWsRef = useRef<WebSocket | null>(null);
    const commentWsRef = useRef<WebSocket | null>(null);
    const messageListRef = useRef<object[]>([]);
    const positionsRef = useRef<{[account: string]: {[id: string]: IPosition}}>({});
    const replayIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
    const timestampRef = useRef<string>('');
    const priceRef = useRef<number>(NaN);

    useEffect(() => {
        if (replayDate) {
            const rerunBars = parseCSV(Nvda20250815);

            const firstTimeStamp = rerunBars[0].timestamp;
            let firstDate = new Date(firstTimeStamp);
            firstDate = addToDate(firstDate, { minutes: -1 });

            let lastTimestamp = firstTimeStamp;
            let index = 0;
            const mockBarWebSocket = setInterval(() => {
                const currentTimestamp = rerunBars[index].timestamp;
                if (currentTimestamp !== lastTimestamp) {
                    const message = {
                        type: 'closed_bar',
                        data: rerunBars[index - 1]
                    }
                    openBarcallBackRef.current?.(message);
                    
                } else {
                    const message = {
                        type: 'open_bar',
                        data: rerunBars[index]
                    }
                    openBarcallBackRef.current?.(message);

                    const mockSystemTime = addToDate(firstDate, { seconds: index });
                    timestampRef.current = toRfc3339Str(mockSystemTime);
                    priceRef.current = rerunBars[index].close;

                }
                lastTimestamp = currentTimestamp;
                index++;
            }, 1000);

            replayIntervalRef.current = mockBarWebSocket;

            return () => {
                clearInterval(mockBarWebSocket);
            }

        } else {
            clearInterval(replayIntervalRef.current);
        }

    }, [replayDate])

    useEffect(() => {
        const barWs = new WebSocket(`ws://${serverAddress}/ws/bars/${symbol}`);
        barWsRef.current = barWs;

    
        barWs.onopen = () => {
            console.log(`🌐 📊 ${symbol} Bars WebSocket connected`);
        };

        barWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            openBarcallBackRef.current?.(data);
            timestampRef.current = data.system_time;
            priceRef.current = data.data.close;
        };

        barWs.onclose = () => {
            console.log(`🔌 📊 ${symbol} Bar WebSocket disconnected`);
        };


        const commentWs = new WebSocket(`ws://${serverAddress}/ws/comments/${symbol}`);
        commentWsRef.current = commentWs;

        commentWs.onopen = () => {
            console.log(`🌐 💬 ${symbol} Comment WebSocket connected`);
        };

        commentWs.onmessage = (event) => {
            const data: IAppContext['commentList'] = JSON.parse(event.data);
            // console.log(`💬 Comment Websocket received`);

            if (data.data instanceof Array) {
                const parsedComments = data.data.map(comment => JSON.parse(comment))
                console.log(parsedComments);
                messageListRef.current = [...parsedComments];

            } else if (data.data) {
                const parsedComment = JSON.parse(data.data);
                if ('timestamp' in parsedComment) {
                    console.log(parsedComment);
                    messageListRef.current = [...messageListRef.current, parsedComment];
                }
            }

        };

        commentWs.onclose = () => {
            console.log(`🔌 💬 ${symbol} Comment WebSocket disconnected`);
        };

        return () => {
            barWs.close();
            commentWs.close();
            messageListRef.current = [];

        };

    }, [symbol]);

    return (
        <AppContext.Provider
            value={{
                assetClass,
                setAssetClass,
                symbol,
                setSymbol,
                replayDate,
                setReplayDate,
                timezone,
                setTimezone,
                openBarCallback: (callback) => { openBarcallBackRef.current = callback; },
                messageListRef,
                positionsRef,
                priceRef,
                timestampRef,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
