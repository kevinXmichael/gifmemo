import { assetsMiddleware, prerenderedMiddleware, kitMiddleware } from '../../dist/middlewares.js'
import { Server } from "socket.io"
import polka from 'polka'
import Session from './session.js'

const app = polka()
app.all('*', assetsMiddleware, prerenderedMiddleware, kitMiddleware)

const PORT = 3030
app.listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`)
})

const sessions = []

const io = new Server(app.server, { cors: { origin: '*' } })
io.on('connection', socket => {
    socket.on('game-new-session', (gameState) => {
        const hostID = socket.id
        sessions.push(new Session(hostID, undefined, gameState))
        socket.join(hostID)
        io.to(hostID).emit('game-new-session-created', hostID)
    })

    socket.on('game-join', (data) => {
        const clientID = data.clientID
        const hostID = data.hostID
        const session = getSession(hostID)
        if (session) {
            socket.join(hostID)
            session.clients.add(clientID)
            io.to(clientID).emit('game-joined', { clientID, hostID })
        } else {
            io.to(clientID).emit('game-join-failed', { clientID, hostID })
        }
    })

    socket.on('game-state-update', (data) => {
        const hostID = data.hostID
        const session = getSession(hostID)
        if (session && session.gameState) {
            session.gameState = data.gameState
            io.to(hostID).emit('game-state-updated', { gameState: session.gameState })
        }
    })

    for (const event in ['disconnect', 'disconnected', 'host-disconnected', 'game-canceled']) {
        socket.on(event, (hostID) => {
            deleteSession(hostID)
        })
    }
})

function getSession(hostID = false) {
    const indexOfSession = sessions.findIndex(session => session.hostID === hostID)
    return indexOfSession >= 0 ? sessions[indexOfSession] : false
}

function deleteSession(hostID = false) {
    io.to(hostID).emit('host-disconnected', { hostID })

    const indexOfSession = sessions.findIndex(session => session.hostID === hostID)
    if (indexOfSession >= 0) {
        sessions.splice(indexOfSession, 1)
    }
}
