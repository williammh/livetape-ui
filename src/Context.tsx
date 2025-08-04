import React, {
	useState,
	type Dispatch,
	type SetStateAction,
    type JSX,
	useEffect
} from 'react';

const AppContext = React.createContext({} as IAppContext);

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

interface IAppContext {
	dateTime: any;
	setDateTime: Dispatch<SetStateAction<any>>
}

const ContextProvider = (props: ContextProviderProps): JSX.Element => {
	const [dateTime, setDateTime] = useState(null);

	// console.log(dateTime);

	return (
		<AppContext.Provider value={{dateTime, setDateTime}}>
			{props.children}
		</AppContext.Provider>
	)
}

export {ContextProvider, AppContext}