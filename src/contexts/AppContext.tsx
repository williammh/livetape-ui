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

import { parseCSV, addToDate, toRfc3339Str, fetchTimeout } from '../util/misc';

const endpoints = {
  local: 'localhost:8000',
  dev: 'localhost:8001',
  prod: 'api.livetape.ai'
}

export const serverAddress = endpoints.dev;

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
  initialBars: IBar[];
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

const replayBarsMap = {
  'NVDA': {
    '2025-08-15': barsNvda_2025_08_15,
    '2025-08-22': barsNvda_2025_08_22,
  }
}

const replayOrdersMap = {
  'NVDA': {
    '2025-08-15': ordersNvda_2025_08_15,
    '2025-08-22': ordersNvda_2025_08_22,
  }
}

const replayCommentsMap = {
  'NVDA': {
    '2025-08-15': commentsNvda_2025_08_15,
    '2025-08-22': commentsNvda_2025_08_22,
  }
}

const replayPositionsMap = {
  'NVDA': {
    '2025-08-15': positionsNvda_2025_08_15,
    '2025-08-22': positionsNvda_2025_08_22,
  }
}

const systemMessage = (pos) => ({
  persona: 'system',
  text: `${pos.account[0].toUpperCase()}${pos.account.slice(1)} enters ${pos.direction.toUpperCase()} ${pos.quantity} ${pos.symbol} at ${pos.averagePrice} USD`,
  timestamp: pos.openTimestamp
})

export const AppProvider = ({children}: {children: React.ReactNode}) => {

  // app settings
  const [ assetClass, setAssetClass ] = useState<'Stocks' | 'Crypto' | 'Futures'>('Stocks');
  // const [ assetClass, setAssetClass ] = useState<string>('Futures');
  const [ symbol, setSymbol ] = useState<string>('NVDA');
  const [ replayDate, setReplayDate ] = useState<string>('');
  const [ timezone, setTimezone ] = useState<string>('America/New_York');

  const [ initialBars, setInitialBars ] = useState<IBar[]>([]);
  
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
    
    const getServerStatus = async () => {
      try {
        const res = await fetchTimeout(`http://${serverAddress}/`, pingIntervalSeconds);

        const resJson = await res.json();
      
        if (resJson === true) {
            isServerOnlineRef.current = true;
        }
      } catch (error) {
        console.log(`Error fetching server status: ${error}`);
       
        isServerOnlineRef.current = false;
      }
    };

    getServerStatus();
    
    const pingInterval = setInterval(async () => {
      await getServerStatus();
    }, pingIntervalSeconds * 1000);

    return () => {
      clearInterval(pingInterval);
    };

  }, []);
  

  useEffect(() => {
    if (replayDate) {
      console.log(`Replay starting at: ${replayDate}`);
      const replayDateStr = replayDate.slice(0, 10);
      const bars = parseCSV(replayBarsMap[symbol][replayDateStr]);
      const orders = replayOrdersMap[symbol][replayDateStr];
      const positions = replayPositionsMap[symbol][replayDateStr];
      const comments = replayCommentsMap[symbol][replayDateStr];  

      const firstBarCloseTime = new Date(bars[0].timestamp);
      const firstBarOpenTime = addToDate(firstBarCloseTime, { minutes: -1});
      const replayStartTimestamp = replayDate;

      const initBars: IBar[] = [];

      let idx = 0;
      while (bars[idx].timestamp <= replayStartTimestamp) {
        const currentBar = bars[idx];
        if (bars[idx + 1].timestamp !== currentBar.timestamp) {
          initBars.push(currentBar as IBar);
        }
        idx++;
      }
      
      setInitialBars(initBars);
      
      const initialComments = [];
      const replayComments = [];

      for (let comment of comments) {
        if (comment.timestamp <= replayStartTimestamp) {
          initialComments.push(comment);
        } else {
          replayComments.push(comment);
        }
      }

      const initialPositions: IPosition[] = [];
      const replayPositions: IPosition[] = [];

      for (let pos of positions) {
        if (pos.openTimestamp <= replayStartTimestamp) {
          initialPositions.push(pos);
          if (!(pos.account in positionsRef.current)) {
            positionsRef.current[pos.account] = {};
          }
          positionsRef.current[pos.account][pos.id] = pos;
        } else {
          replayPositions.push(pos);
        }
      }

      initialComments.push(...initialPositions.map(pos => systemMessage(pos)));
      initialComments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      messageListRef.current = initialComments;

      let replayBarCloseTimestamp = bars[idx].timestamp;
      const mockBarWebSocket = setInterval(() => {
        const now = addToDate(firstBarOpenTime, {seconds: idx + 1});
        timestampRef.current = toRfc3339Str(now);
        priceRef.current = parseFloat(bars[idx].close);

        // replay bars
        const mockBarMessage = replayBarCloseTimestamp !== bars[idx].timestamp ? {
          type: 'closed_bar',
          data: bars[idx - 1]
        } : {
          type: 'open_bar',
          data: bars[idx]
        }
        openBarcallBackRef.current?.(mockBarMessage);

        // replay comments
        if (timestampRef.current >= replayComments[0]?.timestamp) {
          const comment = replayComments.shift();
          messageListRef.current.push(comment)
        }
        
        // replay orders
        for (let order of orders) {
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
            if (!(pos.id in positionsRef.current[pos.account])) {
              messageListRef.current.push(systemMessage(pos));
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


          } else if (positionsRef.current[pos.account] && timestampRef.current > pos.closeTimestamp) {
            const openPositions = {...positionsRef.current[pos.account]};
            Reflect.deleteProperty(openPositions, pos.id);
            positionsRef.current[pos.account] = openPositions;
          }
        }


        replayBarCloseTimestamp = bars[idx].timestamp;
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

      if (initialBars.length === 0) {
        const getclosedBars = async () => {
          console.log("Fetching closed bars");
          try {
            const res = await fetchTimeout(`http://${serverAddress}/closed_bars/${symbol}`, 5);
            const closedBars = await res.json();
            console.log(`closedBars: ${symbol}`);
            console.log(closedBars);
            setInitialBars(closedBars);
            
          } catch (error) {
            console.log("Error fetching closed bars:", error);
            setAssetClass('Stocks');
            setSymbol('NVDA');
            setReplayDate('2025-08-22T13:45:00Z');
          }
        };

        getclosedBars();

      }

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
      };

  }, [symbol, initialBars]);

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
              initialBars,
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
