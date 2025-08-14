import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction
} from 'react';

interface IAppContext {
    assetClass: string;
    setAssetClass: Dispatch<SetStateAction<string>>;
    symbol: string;
    setSymbol: Dispatch<SetStateAction<string>>;
    timezone: string;
    setTimezone: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext({} as IAppContext);

export const serverAddress = 'localhost:8000';

export const symbols = {
    'Stocks': ['NVDA', 'TLSA'],
    'Crypto': ['BTC', 'ETH'],
    'Futures': ['MESU25', 'MNQU25']
};

export const AppProvider = ({children}: {children: React.ReactNode}) => {
   
    const [ assetClass, setAssetClass ] = useState<string>('Stocks');
    const [ symbol, setSymbol ] = useState<string>('NVDA');
    const [ timezone, setTimezone ] = useState<string>('America/Los_Angeles');

    return (
        <AppContext.Provider
            value={{
                assetClass,
                setAssetClass,
                symbol,
                setSymbol,
                timezone,
                setTimezone
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
