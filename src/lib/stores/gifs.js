import { TENOR_API_KEY } from '@/config.json'
import axios from 'axios'

const GIFS_ONE_PLAYER = 5
const DEFAULT_PLAYERS_COUNT = 2

function gifsCountToFetch(players = DEFAULT_PLAYERS_COUNT) {
	return GIFS_ONE_PLAYER * players
}

export async function fetchGifs(players = DEFAULT_PLAYERS_COUNT) {
	const locale = 'de'
	const contentfilter = 'medium'
	const media_filter = 'minimal'
	const gifsFetchingUrl = `https://g.tenor.com/v1/trending?locale=${locale}&contentfilter=${contentfilter}&media_filter=${media_filter}&limit=${gifsCountToFetch(
		players
	)}&key=${TENOR_API_KEY}`

	const result = await axios.get(gifsFetchingUrl)
	const resultGifs = []
	result?.data?.results?.forEach((gif) => {
		const gif_ = {
			clicked: false,
			foundBy: false,
			url: gif.media[0]?.mp4?.url
		}
		resultGifs.push(gif_, {...gif_}) 
	}) ?? []
	// Yeah, we really shuffle twice here
	return resultGifs.shuffle().shuffle()
}
