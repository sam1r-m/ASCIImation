// character set definitions and mapping

import type { CharsetId } from './types'

// gradients ordered dark -> light (dense chars first)
const CHARSETS: Record<Exclude<CharsetId, 'custom'>, string> = {
  detailed: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ',
  standard: '@%#*+=-:. ',
  blocks: '█▓▒░ ',
  binary: '01 ',
  minimal: '#:. ',
  dense: '█▓▒░@%#*+=-:. ',
}

export function getCharset(id: CharsetId, custom: string): string {
  if (id === 'custom') {
    // user provides their own chars, we add a space at the end if missing
    const c = custom || '@ '
    return c.endsWith(' ') ? c : c + ' '
  }
  return CHARSETS[id]
}

// map a 0..255 luma value to a character in the gradient
export function lumaToChar(luma: number, charset: string): string {
  const idx = Math.round((luma / 255) * (charset.length - 1))
  return charset.charAt(idx)
}
