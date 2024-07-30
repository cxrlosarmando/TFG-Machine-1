// socket.mjs
import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: "*", // Permitir todas las orígenes (ajusta esto según tus necesidades de seguridad)
  },
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado', socket.id);

  // Escuchar cambios en el estado de los juegos
  socket.on('changeGameStatus', (updatedGame) => {
    console.log('Estado del juego actualizado:', updatedGame);

    // Emitir el cambio a todos los clientes conectados
    io.emit('checkboxChange', updatedGame);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado', socket.id);
  });
});

console.log('Socket.IO server running on port 3001');
