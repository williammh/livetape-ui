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

interface ICommentWebSocket {
    message: {
        persona: string;
        text: string;
        timestamp: string;
    };
    setMessage?: Dispatch<SetStateAction<any>>;
}

const CommentContext = createContext({} as ICommentWebSocket);

export const CommentProvider = ({children}: ContextProviderProps) => {
    const [message, setMessage] = useState({} as ICommentWebSocket['message']);
    const commentWsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const commentWs = new WebSocket('ws://localhost:8000/ws/comment');
        commentWsRef.current = commentWs;

        commentWs.onopen = () => {
            console.log('💬 Comment WebSocket connected');
        };

        commentWs.onmessage = (event) => {
            const data: ICommentWebSocket['message'] = JSON.parse(event.data);
            console.log(`💬 Comment Websocket received`);
            console.log(data);
            setMessage(data);
        };

        commentWs.onclose = () => {
            console.log('💬 Comment WebSocket disconnected');
        };

        return () => {
            commentWs.close();
        };
    }, []);

    return (
        <CommentContext.Provider value={{ message }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useCommentContext = () => useContext(CommentContext);
