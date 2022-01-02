import { Server } from "socket.io"
export default class SocketServer {
    constructor(server_) {
        this.io = new Server(server_, { cors: { origin: '*' } })

        this.io.on('connection', socket => {
            socket.on('game-new-session', () => {
                this.hostID = socket.id
                socket.join(this.hostID)
                this.io.to(this.hostID).emit('game-new-session-created', this.hostID)
            })
            
            socket.on('game-new-state-server', (gameState) => {
                this.io.to(gameState.host.id).emit('game-new-state-client', gameState)
            })

            socket.on('game-join', (data) => {
                this.io.to(data.hostID).emit('game-join-asked', data)
            })

            socket.on('game-join-rejected-server', (data) => {
                this.io.to(data.clientID).emit('game-join-rejected-client')
            })

            socket.on('game-join-accepted-server', (gameState) => {
                this.io.to(gameState.client.id).emit('game-room-invite', gameState)
            })
            
            socket.on('game-room-join', (gameState => {
                this.hostID = gameState.host.id
                socket.join(this.hostID)
                this.io.to(this.hostID).emit('game-join-accepted-client', gameState)
            }))

            socket.on('disconnect', () => {
                this.io.to(this.hostID).emit('game-canceled')
            })
        })
    }
}
