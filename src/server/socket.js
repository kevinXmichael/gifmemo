import { Server } from "socket.io"

export default class SocketServer {
    constructor(server_) {
        console.log('Starting SocketServer...')
        const io = new Server(server_, { cors: { origin: '*' } })
        io.on('connection', socket => {
            socket.on('game-new-session', () => {
                const hostID = socket.id
                socket.join(hostID)
                io.to(hostID).emit('game-new-session-created', hostID)
            })

            socket.on('game-join', (data) => {
                io.to(data.hostID).emit('game-join-asked', data)
            })

            socket.on('game-join-rejected-server', (data) => {
                io.to(data.clientID).emit('game-join-rejected-client')
            })

            socket.on('game-join-accepted-server', (gameState) => {
                socket.join(gameState.host.id)
                io.to(gameState.client.id).emit('game-join-accepted-client', gameState)
            })

            socket.on("disconnect", () => {
                io.to(socket.id).emit('disconnected')
            })
        })
    }
}
