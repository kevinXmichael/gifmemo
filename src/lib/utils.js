let index = 0

export function uid(name = 'id') {
    index++
    return `${index}--${name}`
}

export async function copyToClipboard(value) {
    return await navigator?.clipboard?.writeText?.(value)
}