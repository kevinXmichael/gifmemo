import { writable } from 'svelte/store'

export const MAX_CLICKS_ON_GIFS = 2

export const foundGifs = writable([])
export const matchedGifs = writable([])

export const resetFoundGifs = () => foundGifs.set([])
export const resetMatchedGifs = () => matchedGifs.set([])

export function gifsMatch(gifs) {
	return gifs.length === MAX_CLICKS_ON_GIFS && gifs.allEqual()
}

foundGifs.subscribe((gifs) => {
	if (gifs.length >= MAX_CLICKS_ON_GIFS) {
		if (gifsMatch(gifs)) {
			matchedGifs.update((val) => [...val, gifs[0]])
			resetFoundGifs()
		} else {
			setTimeout(resetFoundGifs, 2000)
		}
	}
})
