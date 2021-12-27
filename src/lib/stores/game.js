import { writable } from 'svelte/store'
import { fetchGifs } from '@/lib/stores/gifs'

import { io } from 'socket.io-client'
export const socket = io('ws://localhost:3030', { autoConnect: false })

export const MAX_CLICKS_ON_GIFS = 2
const TIMEOUT_IF_NO_MATCH = 2000
const defaultGameInfoLocal = {
	isClient: false,
	isHost: false,
	isGuest: false,
	gameInitialized: false
}

export const gameNetworkStatus = writable(false)
export const gameInfoLocal = writable(defaultGameInfoLocal)
export const gameState = writable({})
export const foundGifs = writable([])
export const matchedGifs = writable([])

export const resetFoundGifs = () => foundGifs.set([])
export const resetMatchedGifs = () => matchedGifs.set([])

export async function initGame(username = 'Player 1') {
	const gifs = await fetchGifs()
	gameState.set({
		host: {
			active: true,
			username,
			id: false,
			score: 0
		},
		client: {
			active: false,
			username: 'Player 2',
			id: false,
			score: 0
		},
		guestIDs: new Set(),
		gifs
	})
	return true
}

export function resetGame() {
	// TODO: maybe store highscore data?
	gameInfoLocal.set(defaultGameInfoLocal)
	gameState.set({})
	resetFoundGifs()
	resetMatchedGifs()
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

foundGifs.subscribe((gifs) => {
	if (gifs.length >= MAX_CLICKS_ON_GIFS) {
		if (gifsMatch(gifs)) {
			matchedGifs.update(val => [...val, gifs[0]])
			resetFoundGifs()
		} else {
			setTimeout(resetFoundGifs, TIMEOUT_IF_NO_MATCH)
		}
	}
})
