import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react';
import { serverAddress } from './AppContext';

interface ContextProviderProps {
  children: React.ReactNode
}

interface ICommentWebSocket {
    commentList: Array<{persona: string, text: string, timestamp: string}>,
    setSelectedSymbol: Dispatch<SetStateAction<any>>;
}

const CommentContext = createContext({} as ICommentWebSocket);

export const CommentProvider = ({children}: ContextProviderProps) => {
    const [commentList, setCommentList] = useState<Array<ICommentWebSocket['commentList']>>([]);
    const commentWsRef = useRef<WebSocket | null>(null);

    const [selectedSymbol, setSelectedSymbol] = useState<string>('');

    useEffect(() => {
        const commentWs = new WebSocket(`ws://${serverAddress}/ws/comments/${selectedSymbol}`);
        commentWsRef.current = commentWs;

        commentWs.onopen = () => {
            console.log(`🌐 💬 ${selectedSymbol} Comment WebSocket connected`);
        };

        commentWs.onmessage = (event) => {
            const data: ICommentWebSocket['commentList'] = JSON.parse(event.data);
            // console.log(`💬 Comment Websocket received`);

            if (data.data instanceof Array) {
                const parsedComments = data.data.map(comment => JSON.parse(comment))
                console.log(parsedComments);
                setCommentList(parsedComments);
            } else if (data.data) {
                const parsedComment = JSON.parse(data.data);
                if ('timestamp' in parsedComment) {
                    console.log(parsedComment);
                    setCommentList((prev) => [...prev, parsedComment]);
                }
            }

        };

        commentWs.onclose = () => {
            console.log(`🔌 💬 ${selectedSymbol} Comment WebSocket disconnected`);
        };

        return () => {
            commentWs.close();
        };

    }, [selectedSymbol]);

    return (
        <CommentContext.Provider value={{ commentList, setSelectedSymbol }}>
            {children}
        </CommentContext.Provider>
    );
};

export const useCommentContext = () => useContext(CommentContext);
