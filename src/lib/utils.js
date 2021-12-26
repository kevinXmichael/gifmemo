let index = 0

export function uid(name = 'id') {
    index++
    return `${index}--${name}`
}

export async function copyToClipboard(value = false) {
    if (value) {
        try {
            await navigator.clipboard.writeText(value)
            return true
        } catch (err) {
            console.error(`❌ copyToClipboard went wrong with value "${value}", error was: ${err}`)
        }
    }
    return false
}
