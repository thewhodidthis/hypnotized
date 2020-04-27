export const stringContains = (str = '', ...terms) => RegExp(terms.join('|')).test(str)

export const resolveLocalAddress = (url = '') => {
  const { origin } = location

  return stringContains(origin, 'local', 'test') ? url : origin
}

export const websocketAddressFrom = (url = '') => resolveLocalAddress(url).replace(/^http/, 'ws')

export const add = (a, b) => a + b
