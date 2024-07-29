import { createServer } from 'http';
import { Server } from 'socket.io';

let count = 0;
let gameStates = {};

let httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'  // Ajusta el origen según donde esté alojado tu cliente React
    }
});

io.on('connection', (socket) => {
    count++;
    console.log("connected: ", count);

    // Emitir el conteo inicial y notificar a todos los clientes conectados
    io.emit("count", count);

    // Manejar desconexiones
    socket.on('disconnect', () => {
        count--;
        console.log("disconnected: ", count);
        io.emit("count", count);  // Notificar a todos los clientes sobre el cambio en el conteo
    });

    // Escuchar cambios de estado de checkbox genéricos
    socket.on("checkboxChange", ({ id, isChecked }) => {
        console.log(`Received checkboxChange event for game ${id} with isChecked: ${isChecked}`);
        gameStates[id] = isChecked;
        console.log("Game states:", gameStates);
        io.emit("checkboxChange", { id, isChecked });  // Emitir el cambio a todos los clientes conectados
    });

    // Manejar eventos específicos para el proveedor 68
    socket.on("checkboxChange68", ({ id, isChecked }) => {
        console.log(`Received checkboxChange event for game ${id} with isChecked: ${isChecked}`);
        if (id === 68) {
            gameStates[id] = isChecked;
            console.log("Game states:", gameStates);
            io.emit("checkboxChange", { id, isChecked });  // Emitir el cambio a todos los clientes conectados
        }
    });

    // Manejar eventos específicos para el proveedor 29
    socket.on("checkboxChange29", ({ id, isChecked }) => {
        console.log(`Received checkboxChange event for game ${id} with isChecked: ${isChecked}`);
        if (id === 29) {
            gameStates[id] = isChecked;
            console.log("Game states:", gameStates);
            io.emit("checkboxChange", { id, isChecked });  // Emitir el cambio a todos los clientes conectados
        }
    });

    // Enviar el estado inicial de todos los juegos al cliente que se conecta
    socket.emit("initialGameStates", gameStates);
});

httpServer.listen(3001, () => {
    console.log("Listening on port 3001");
});
