export const stringContains = (str = '', ...terms) => RegExp(terms.join('|')).test(str)

export const resolveLocalAddress = (url = '') => {
  const { origin } = location
  const { port } = new URL(url)

  return stringContains(origin, 'local', 'test') ? url : `${origin}:${port}`
}

export const websocketAddressFrom = (url = '') => resolveLocalAddress(url).replace(/^http/, 'ws')

export const add = (a, b) => a + b
