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
    'Stocks': ['NVDA', 'TSLA'],
    'Crypto': ['BTC', 'ETH'],
    'Futures': ['MNQU25', 'MESU25']
};

export const AppProvider = ({children}: {children: React.ReactNode}) => {
   
    const [ assetClass, setAssetClass ] = useState<string>('Futures');
    const [ symbol, setSymbol ] = useState<string>('MNQU25');
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
