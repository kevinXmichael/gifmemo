import { writable } from 'svelte/store'
import { fetchGifs } from '@/lib/stores/gifs'

const TIMEOUT_IF_NO_MATCH = 2000
export const MAX_CLICKS_ON_GIFS = 2

export const gameInfoLocal = writable({
	isClient: false,
	isHost: false,
	isGuest: false,
	gameInitialized: false
})
export const gameState = writable({})
export const foundGifs = writable([])
export const matchedGifs = writable([])

export const resetFoundGifs = () => foundGifs.set([])
export const resetMatchedGifs = () => matchedGifs.set([])

export async function initGame() {
	const gifs = await fetchGifs()
	gameState.set({
		host: {
			active: true,
			id: false,
			score: 0
		},
		client: {
			active: false,
			id: false,
			score: 0
		},
		guestIDs: new Set(),
		gifs
	})
	return true
}

export function updateGame(newGameState) {
	gameState.set(newGameState)
	return true
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
