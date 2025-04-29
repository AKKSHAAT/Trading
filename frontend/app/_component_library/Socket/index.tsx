import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null); 

  useEffect(() => {
    const socketInstance = io('http://localhost:8000', {
      withCredentials: true,
    });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
