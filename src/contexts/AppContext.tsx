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

interface IAppContext {
    selectedAssetClass: string;
    setSelectedAssetClass: Dispatch<SetStateAction<string>>;
    selectedSymbol: string;
    setSelectedSymbol: Dispatch<SetStateAction<string>>;
    timezone: string;
    setTimezone: Dispatch<SetStateAction<string>>;
}

const AppContext = createContext({} as IAppContext);

export const AppProvider = ({children}: ContextProviderProps) => {
   
    const [ selectedAssetClass, setSelectedAssetClass ] = useState<string>('Stocks');
    const [ selectedSymbol, setSelectedSymbol ] = useState<string>('NVDA');
    const [ timezone, setTimezone ] = useState<string>('America/Los_Angeles');

    return (
        <AppContext.Provider
            value={{
                selectedAssetClass,
                setSelectedAssetClass,
                selectedSymbol,
                setSelectedSymbol,
                timezone,
                setTimezone
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
