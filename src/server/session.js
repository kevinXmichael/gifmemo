export default class Session {
    constructor(hostID, clients = new Set(), gameState = {}) {
        this.hostID = hostID
        this.clients = clients
        this.gameState = gameState
    }
}
