import find from '@rollup/plugin-node-resolve'

export default {
  onwarn: (message) => {
    if (message.code !== 'CIRCULAR_DEPENDENCY') {
      console.warn('(!)', message.toString())
    }
  },
  plugins: [
    find({
      browser: true
    })
  ]
}
