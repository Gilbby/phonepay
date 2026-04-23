export function cn(...classes: Array<string | false | null | undefined | Record<string, boolean>>) {
  const out: string[] = []
  for (const c of classes) {
    if (!c) continue
    if (typeof c === 'string') out.push(c)
    else if (typeof c === 'object') {
      for (const key of Object.keys(c)) if ((c as Record<string, boolean>)[key]) out.push(key)
    }
  }
  return out.join(' ')
}

export default cn
