import { assetsMiddleware, prerenderedMiddleware, kitMiddleware } from '../../dist/middlewares.js'
import { Server } from "socket.io"
import polka from 'polka'

const app = polka()
app.all('*', assetsMiddleware, prerenderedMiddleware, kitMiddleware)

const PORT = 3030
app.listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`)
})

const io = new Server(app.server, { cors: { origin: '*' } })
io.on('connection', socket => {
    socket.on('game-new-session', () => {
        const hostID = socket.id
        socket.join(hostID)
        io.to(hostID).emit('game-new-session-created', hostID)
    })

    socket.on('game-join', (data) => {
        io.to(data.hostID).emit('game-join-asked', data.clientID)
    })

    socket.on('game-join-rejected-server', (clientID) => {
        io.to(clientID).emit('game-join-rejected-client')
    })

    socket.on('game-join-accepted-server', (gameState) => {
        socket.join(gameState.host.id)
        io.to(gameState.client.id).emit('game-join-accepted-client', gameState)
    })
})
