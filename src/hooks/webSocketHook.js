// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';

// https://stackoverflow.com/questions/12487828/what-does-websocket-is-closed-before-the-connection-is-established-mean
// Strict mode loads this twice causing to unmount 
const useWebSocket = (url, documentId) => {
  const [payload, setPayload] = useState([]);
  const ws = useRef(null);

  useEffect(() => {

    console.log("Entered into useEffect", documentId)
    ws.current = new WebSocket(url);


    ws.current.onopen = () => {
      console.log('Connected to WebSocket server');
      ws.current.send(JSON.stringify({ action: 'monitor', documentId }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data)
      setPayload((prev) => [...prev, data]);
    };

    ws.current.onerror = (error) => {
      console.log(error)
    }

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.close();
        }
        
    };
  }, [url, documentId]);

  return payload;
};

export default useWebSocket;
