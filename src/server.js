import { assetsMiddleware, prerenderedMiddleware, kitMiddleware } from '../dist/middlewares.js'
import { Server } from "socket.io"
import polka from 'polka'
const app = polka()

app.get('/no-svelte', (req, res) => {
	res.end('This is not Svelte!')
})

app.all('*', assetsMiddleware, prerenderedMiddleware, kitMiddleware)

const PORT = 3030
app.listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`)
})

const io = new Server(app.server, { cors: { origin: '*' } })
io.on('connection', socket => {
    socket.on('message', (message) => {
        console.log('server on message', message)
        io.emit('message', { message: `?test as response&& ${message.data}` })
    })

    socket.on("disconnect", (reason) => {
        console.log('disconnect', reason)
    })
})
