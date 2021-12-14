import { TENOR_API_KEY } from '@/config.json'
import axios from 'axios'

export async function fetchGifs(limit = 25) {
    const locale = 'de'
    const contentfilter = 'medium'
    const media_filter = 'minimal'
    const gifsFetchingUrl = `https://g.tenor.com/v1/trending?locale=${locale}&contentfilter=${contentfilter}&media_filter=${media_filter}&limit=${limit}&key=${TENOR_API_KEY}`

    const result = await axios.get(gifsFetchingUrl)
    return result?.data?.results?.map(gif => gif.media[0]?.mp4?.url) ?? []
}
