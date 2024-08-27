// socketContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define la interfaz para el contexto
interface SocketContextProps {
    socket: Socket | null;
}

// Crea el contexto de Socket
const SocketContext = createContext<SocketContextProps>({ socket: null });

// Hook personalizado para usar el contexto de Socket
export const useSocket = () => useContext(SocketContext);

// Proveedor de contexto de Socket
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        // Conecta al servidor Socket.IO
        const socketConnection = io('http://localhost:3001');

        // Muestra mensajes en la consola para verificar la conexión
        socketConnection.on('connect', () => {
            console.log('Socket.IO client connected');
        });

        socketConnection.on('disconnect', () => {
            console.log('Socket.IO client disconnected');
        });

        // Establece el socket en el estado
        setSocket(socketConnection);

        // Desconecta el socket al desmontar el componente
        return () => {
            socketConnection.disconnect();
            console.log('Socket.IO client disconnected from provider');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
