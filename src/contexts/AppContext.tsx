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
import barsNvda_2025_08_15 from '../assets/NVDA.bars.2025-08-15.csv?raw';
import barsNvda_2025_08_22 from '../assets/NVDA.bars.2025-08-22.csv?raw';

import ordersNvda_2025_08_15 from '../assets/NVDA.2025-08-15.orders.json';
import ordersNvda_2025_08_22 from '../assets/NVDA.2025-08-22.orders.json';

import commentsNvda_2025_08_15 from '../assets/NVDA.2025-08-15.comments.json';
import commentsNvda_2025_08_22 from '../assets/NVDA.2025-08-22.comments.json';

import positionsNvda_2025_08_15 from '../assets/NVDA.2025-08-15.positions.json';
import positionsNvda_2025_08_22 from '../assets/NVDA.2025-08-22.positions.json';

import { parseCSV, addToDate, toRfc3339Str } from '../util/misc';

export const serverAddress = 'localhost:8001';

export interface IBar {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: string;
  totalvolume: number;
  barstatus?: string;
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

export interface IOrder {
  id: number;
  action: string;
  type: string;
  quantity: number;
  symbol: string;
  price: number;
  status: string;
  openTimestamp: string;
  closeTimestamp: string;
}


interface IAppContext {
  isServerOnlineRef: RefObject<boolean>;
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
  ordersRef: RefObject<{[account: string]: {[id: string]: IOrder}}>
  priceRef: RefObject<number>;
  timestampRef: RefObject<string>;
}

const AppContext = createContext({} as IAppContext);

export const symbols = {
    'Stocks': ['NVDA', 'TSLA', 'AMZN', 'AAPL', 'AMD', 'GOOGL', 'META', 'MSFT'],
    'Crypto': ['BTCUSD', 'ETHUSD'],
    'Futures': ['NQU25', 'ESU25'],
    'Forex': []
};

export const symbolMap = {
    'NVDA': {
      name: 'Nvidia Corporation',
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

const replayBarsDateMap = {
  'NVDA': {
    '2025-08-15': barsNvda_2025_08_15,
    '2025-08-22': barsNvda_2025_08_22,
  }
}

const replayOrdersDateMap = {
  'NVDA': {
    '2025-08-15': ordersNvda_2025_08_15,
    '2025-08-22': ordersNvda_2025_08_22,
  }
}

export const replayCommentsDateMap = {
  'NVDA': {
    '2025-08-15': commentsNvda_2025_08_15,
    '2025-08-22': commentsNvda_2025_08_22,
  }
}

export const replayPositionsDateMap = {
  'NVDA': {
    '2025-08-15': positionsNvda_2025_08_15,
    '2025-08-22': positionsNvda_2025_08_22,
  }
}

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  
  // app settings
  const [ assetClass, setAssetClass ] = useState<'Stocks' | 'Crypto' | 'Futures'>('Stocks');
  // const [ assetClass, setAssetClass ] = useState<string>('Futures');
  const [ symbol, setSymbol ] = useState<string>('NVDA');
  const [ replayDate, setReplayDate ] = useState<string>('');
  const [ timezone, setTimezone ] = useState<string>('America/New_York');

  // const [ initialBars, setInitialBars ] = useState<IBar[]>([]);

  
  // bar data websocket connection
  const openBarcallBackRef = useRef<((msg: any) => void) | null>(null);
  const barWsRef = useRef<WebSocket | null>(null);
  const commentWsRef = useRef<WebSocket | null>(null);
  const messageListRef = useRef<object[]>([]);
  const positionsRef = useRef<{[account: string]: {[id: string]: IPosition}}>({});
  const ordersRef = useRef<{[account: string]: {[id: string]: IOrder}}>({});

  const replayIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const timestampRef = useRef<string>('');
  const priceRef = useRef<number>(NaN);

  const isServerOnlineRef = useRef<boolean>(false);
  
  useEffect(() => {
    const pingIntervalSeconds = 5;

    // JS has no built in fetch with timeout
    const fetchTimeout = async (url: string, timeout: number) => {
      const controller = new AbortController();
      const id = setTimeout(() => {
        controller.abort();
      }, timeout * 1000);
      try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
      } finally {
        clearTimeout(id);
      }
    };
    
    const getServerStatus = async () => {
      try {
        const res = await fetchTimeout(`http://${serverAddress}/`, pingIntervalSeconds);
        const resJson = await res.json();
      
        if (resJson === true) {
            isServerOnlineRef.current = true;
        } else {
            isServerOnlineRef.current = false;
        }
      } catch (error) {
        console.log(error);
        isServerOnlineRef.current = false;
      }
    };

    setTimeout(async () => {
      await getServerStatus();
    }, 0);
    
    const pingInterval = setInterval(async () => {
      await getServerStatus();
    }, pingIntervalSeconds * 1000);

    return () => {
      clearInterval(pingInterval);
    };

  }, []);
  

  useEffect(() => {
      if (replayDate) {
          
          const replayBars = parseCSV(replayBarsDateMap[symbol][replayDate]);
          const replayOrders = replayOrdersDateMap[symbol][replayDate];
          const replayPositions = replayPositionsDateMap[symbol][replayDate];



          let startDate = new Date(replayBars[0].timestamp);
          startDate = addToDate(startDate, { minutes: -1 });
          // startDate = addToDate(startDate, { minutes: 15 });

          // const startTimestamp = toRfc3339Str(startDate)

          // const barsBeforeStartTime: IBar[] = [];
          // let curBar = {};
          // let idx = 0;
          // while (replayBars[idx].timestamp <= startTimestamp) {
          //   if ('timestamp' in curBar && replayBars[idx].timestamp !== curBar.timestamp) {
          //     barsBeforeStartTime.push(curBar as IBar);
          //     curBar = {};
          //   }
          //   curBar = replayBars[idx];
          //   idx++;
          // }
          
          // console.log("INIT");
          // console.log(barsBeforeStartTime);
          // setInitialBars(barsBeforeStartTime);

        
          idx = 0;
          let replayBarCloseTimestamp = replayBars[0].timestamp;

          const mockBarWebSocket = setInterval(() => {
            const now = addToDate(startDate, {seconds: idx});
            timestampRef.current = toRfc3339Str(now);
            priceRef.current = parseFloat(replayBars[idx].close);

            // replay bars
            const mockBarMessage = replayBarCloseTimestamp !== replayBars[idx].timestamp ? {
              type: 'closed_bar',
              data: replayBars[idx - 1]
            } : {
              type: 'open_bar',
              data: replayBars[idx]
            }
            openBarcallBackRef.current?.(mockBarMessage);

            // replay orders
            for (let order of replayOrders) {
                const isOrderOpened = timestampRef.current >= order.openTimestamp;
                if (isOrderOpened) {
                    if (!(order.account in ordersRef.current)) {
                        ordersRef.current[order.account] = {};
                    }
                    ordersRef.current[order.account][order.id] = order;
                }
            }

            // replay positions      
            for (let pos of replayPositions) {
              if (
                (timestampRef.current >= pos.openTimestamp) &&
                (timestampRef.current < pos.closeTimestamp)
              ) {
                if (!(pos.account in positionsRef.current)) {
                  positionsRef.current[pos.account] = {};
                }
                const openedPosition: IPosition = { 
                  id: pos.id,
                  account: pos.account,
                  direction: pos.direction,
                  quantity: pos.quantity,
                  symbol: pos.symbol,
                  averagePrice: parseFloat(pos.averagePrice),
                  openTimestamp: pos.openTimestamp,
                  closeTimestamp: pos.closeTimestamp,
                }
                positionsRef.current[pos.account][pos.id] = openedPosition;
              } else if (timestampRef.current > pos.closeTimestamp && pos.id in positionsRef.current[pos.account]) {
                const openPositions = {...positionsRef.current[pos.account]};
                Reflect.deleteProperty(openPositions, pos.id);
                positionsRef.current[pos.account] = openPositions;
              }
            }


            replayBarCloseTimestamp = replayBars[idx].timestamp;
            idx++;

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
              ordersRef,
              positionsRef,
              priceRef,
              timestampRef,
              isServerOnlineRef,
          }}
      >
          {children}
      </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
