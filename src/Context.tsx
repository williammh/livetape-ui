import React, {
	useState,
	type Dispatch,
	type SetStateAction,
    type JSX
} from 'react';

const BarsContext = React.createContext({} as IBarsContext);

interface ContextProviderProps {
  children: React.ReactNode
}

interface IBar {
	open: number;
	high: number;
	low: number;
	close: number;
	totalVolume: number;
	TimeStamp: string;
}

interface IBarsContext {
	bars: IBar[];
	setBars: Dispatch<SetStateAction<IBar[]>>
}

export const getBars = async () => {
	const response = await fetch("http://localhost:8000/bars");
	return await response.json();
}

const BarsContextProvider = (props: ContextProviderProps): JSX.Element => {

	const [bars, getBars] = useState([] as IBar[]);

	return (
		<BarsContext.Provider value={{bars: bars, setBars: getBars}}>
			{props.children}
		</BarsContext.Provider>
	)
}

export {BarsContextProvider, BarsContext}