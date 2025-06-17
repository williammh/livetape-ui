import React, {
	useState,
	type Dispatch,
	type SetStateAction,
    type JSX
} from 'react';
// import { IPlayerSearchResult } from '../Types/types';

const SymbolsContext = React.createContext({} as IAllSymbolsContext);

interface ContextProviderProps {
  children: React.ReactNode
}

interface IAllSymbolsContext {
	allSymbols: object;
	setAllSymbols: Dispatch<SetStateAction<Array<any>>>
}

export const getSymbols = async () => {
	const response = await fetch("http://localhost:8000");
	return await response.json();
}

const SymbolsContextProvider = (props: ContextProviderProps): JSX.Element => {

	const [allSymbols, setAllSymbols] = useState([] as Array<any>);

	return (
		<SymbolsContext.Provider value={{allSymbols, setAllSymbols}}>
			{props.children}
		</SymbolsContext.Provider>
	)
}

export {SymbolsContextProvider, SymbolsContext}