// import { useRef, useEffect } from 'react';

// export const useWebSocket = (onMessage: (data: any) => void) => {
//   const ws = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     // Only initialize once
//     ws.current = new WebSocket('ws://localhost:8000/ws/chart');

//     ws.current.onopen = () => {
//       console.log('WebSocket connected');
//     };

//     ws.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       } catch (err) {
//         console.error('WebSocket message parse error:', err);
//       }
//     };

//     ws.current.onclose = () => {
//       console.log('WebSocket disconnected');
//     };

//     ws.current.onerror = (err) => {
//       console.error('WebSocket error:', err);
//     };

//     // Cleanup only on unmount
//     return () => {
//       ws.current?.close();
//     };
//   }, []); // <--- Important: empty dependency array

//   return ws;
// };

// export const useCommentWebsocket = (onMessage: (data: any) => void) => {
//   const commentWs = useRef<WebSocket | null>(null);

//   useEffect(() => {
//     commentWs.current = new WebSocket('ws://localhost:8000/ws/comment');

//     commentWs.current.onopen = () => {
//       console.log('💬 Comments WebSocket connected');
//     };

//     commentWs.current.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       } catch (err) {
//         console.error('💬 Comments WebSocket message parse error:', err);
//       }
//     };

//     commentWs.current.onclose = () => {
//       console.log('💬 Comments WebSocket disconnected');
//     };

//     commentWs.current.onerror = (err) => {
//       console.error('💬 Comments WebSocket error:', err);
//     };

//     // Cleanup only on unmount
//     return () => {
//       commentWs.current?.close();
//     };
//   }, []); // <--- Important: empty dependency array

//   return commentWs;
// };