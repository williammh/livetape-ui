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
import Nvda20250815 from '../assets/2025-08-15-updates.csv?raw';

import { parseCSV, toLocalDateTimeStr, addToDate, toRfc3339Str } from '../util/misc';

interface IAppContext {
    assetClass: string;
    setAssetClass: Dispatch<SetStateAction<string>>;
    symbol: string;
    setSymbol: Dispatch<SetStateAction<string>>;
    commentList: {persona: string, text: string, timestamp: string}[];
    timezone: string;
    setTimezone: Dispatch<SetStateAction<string>>;
    openBarCallback: (callback: ((msg: any) => void) | null) => void;
    replayDate: string;
    setReplayDate: Dispatch<SetStateAction<string>>;
    priceRef: RefObject<number>;
    timestampRef: RefObject<string>;
}

const AppContext = createContext({} as IAppContext);

export const serverAddress = 'localhost:8000';


export const symbols = {
    'Stocks': ['NVDA', 'TSLA'],
    'Crypto': ['BTC', 'ETH'],
    'Futures': ['MNQU25', 'MESU25']
};

export const AppProvider = ({children}: {children: React.ReactNode}) => {
    // app settings
    const [ assetClass, setAssetClass ] = useState<string>('Stocks');
    const [ symbol, setSymbol ] = useState<string>('NVDA');
    const [ timezone, setTimezone ] = useState<string>('America/Los_Angeles');

    const [ replayDate, setReplayDate ] = useState<string>('');

    const replayIntervalRef = useRef<ReturnType<typeof setInterval>>(null);

    const timestampRef = useRef<string>('');
    const priceRef = useRef<number>(NaN);


    // bar data websocket connection
    const openBarcallBackRef = useRef<((msg: any) => void) | null>(null);
    const barWsRef = useRef<WebSocket | null>(null);


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
            console.log(`Stopping replay`);
            clearInterval(replayIntervalRef.current);
        }

    }, [replayDate])

    useEffect(() => {
        console.log("WS BAR SOCKET")

        // console.log(`Stopping replay`);
        // clearInterval(replayIntervalRef.current);

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

        return () => {
            barWs.close();
        };
    

    }, [symbol]);

    // comments websocket connection
    const [commentList, setCommentList] = useState<IAppContext['commentList']>([]);
    const commentWsRef = useRef<WebSocket | null>(null);
    useEffect(() => {
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
                setCommentList(parsedComments);
            } else if (data.data) {
                const parsedComment = JSON.parse(data.data);
                if ('timestamp' in parsedComment) {
                    console.log(parsedComment);
                    setCommentList((prev) => [...prev, parsedComment]);
                }
            }

        };

        commentWs.onclose = () => {
            console.log(`🔌 💬 ${symbol} Comment WebSocket disconnected`);
        };

        return () => {
            commentWs.close();
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
                commentList,
                timezone,
                setTimezone,
                openBarCallback: (callback) => { openBarcallBackRef.current = callback; },
                priceRef,
                timestampRef,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
