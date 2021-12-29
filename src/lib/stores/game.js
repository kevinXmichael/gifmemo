import { writable } from 'svelte/store'
import { fetchGifs } from '@/lib/stores/gifs'

import { io } from 'socket.io-client'
export const socket = io('ws://localhost:3030', { autoConnect: false })

export const MAX_CLICKS_ON_GIFS = 2
export const STD_TIME_OUT = 2000
const defaultGameInfoLocal = {
	isClient: false,
	isHost: false,
	isGuest: false,
	gameInitialized: false
}

export const gameNetworkStatus = writable(false)
export const gameInfoLocal = writable(defaultGameInfoLocal)
export const gameState = writable({})

export const resetFoundGifs = () => gameState.update(gameState => {
	gameState.gifs.found = []
	return gameState
})

export const resetMatchedGifs = () => gameState.update(gameState => {
	gameState.gifs.matched = []
	return gameState
})

export async function initGame(username1 = false, username2 = false, guestIDs = new Set()) {
	const allGifs = await fetchGifs()
	gameState.set({
		host: {
			active: true,
			username: username1,
			id: false,
			score: 0
		},
		client: {
			active: false,
			username: username2,
			id: false,
			score: 0
		},
		guestIDs,
		gifs: {
			all: allGifs,
			found: [],
			matched: []
		}
	})
	return true
}

/** Restarts the game and keeps usernames */
export function restartGame() {
	return initGame(gameState.host.username, gameState.client.username, gameState.guestIDs)
}

export function endGame() {
	// TODO: end game here? gameInitialized.gameInitialized = false ?
}

export function updateGame(newGameState) {
	if (newGameState) {
		gameState.set(newGameState)
		return true
	}
	return false
}

export function updateGameInfoLocal(key, value) {
	gameInfoLocal.update(gameInfoLocal_ => {
		gameInfoLocal_[key] = value
		return gameInfoLocal_
	})
	return true
}

export function gifsMatch(gifs) {
	return gifs.length === MAX_CLICKS_ON_GIFS && gifs.allEqual()
}

gameState.subscribe((gameStateNew) => {
	const gifsFound = gameStateNew.gifs?.found ?? []
	if (gifsFound.length >= MAX_CLICKS_ON_GIFS) {
		if (gifsMatch(gifsFound)) {
			gameState.update(gameState => {
				gameState.gifs.matched.push(gifsFound)
				gameState.gifs.found = []
				return gameState
			})
		} else {
			setTimeout(() => {
				gameState.update(gameState => {
					gameState.gifs.found = []
					gameState.host.active = !gameState.host.active
					gameState.client.active = !gameState.client.active
					return gameState
				})
			}, STD_TIME_OUT)
		}
	}
})
