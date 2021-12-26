import { assetsMiddleware, prerenderedMiddleware, kitMiddleware } from '../../dist/middlewares.js'
import SocketServer from './socket.js'
import polka from 'polka'

const app = polka()
app.all('*', assetsMiddleware, prerenderedMiddleware, kitMiddleware)

const PORT = 3030
app.listen(PORT, () => {
    console.log(`> Running on localhost:${PORT}`)
})

new SocketServer(app.server)
