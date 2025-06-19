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

interface IBarsContext {
	bars: object;
	setBars: Dispatch<SetStateAction<Array<any>>>
}

export const getBars = async () => {
	const response = await fetch("http://localhost:8000/bars");
	return await response.json();
}

const BarsContextProvider = (props: ContextProviderProps): JSX.Element => {

	const [bars, getBars] = useState([] as Array<any>);

	return (
		<BarsContext.Provider value={{bars: bars, setBars: getBars}}>
			{props.children}
		</BarsContext.Provider>
	)
}

export {BarsContextProvider, BarsContext}