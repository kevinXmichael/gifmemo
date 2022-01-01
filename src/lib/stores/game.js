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
			found: []
		}
	})
	return true
}

/** Restarts the game and keeps usernames */
export function restartGame() {
	return initGame($gameState.host.username, $gameState.client.username, $gameState.guestIDs)
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
