import createLoop from '@thewhodidthis/animation'
import { cubic as ease } from '@thewhodidthis/ease'
import fullscream from 'fullscream'
import { add, resolveLocalAddress } from './helper.js'
import createPicture from './painter.js'

const $figure = document.getElementById('figure')

$figure.addEventListener('click', () => {
  fullscream($figure)
})

const totalFrames = 22500
const turningPoint = 625

// Stats
let distance = -0.01 * turningPoint
let bumps = []
let turns = 0

const $canvas = document.getElementById('canvas')

const { renderer, camera, scene } = createPicture($canvas, totalFrames)
const { play, stop } = createLoop((_, frame) => {
  if (turns !== 0) {
    turns += turns > 0 ? -1 : 1
  }

  if (distance >= totalFrames) {
    stop()
  }

  let delta = 0.01

  if (frame % 25 === 0) {
    const step = Math.min(turningPoint, frame)
    const bump = bumps[frame % bumps.length] || 0

    delta += bump * ease.out(step, turningPoint) * 0.001
  }

  distance += delta

  camera.position.z = distance
  camera.rotation.z = turns

  renderer.render(scene, camera)
})

const io = new EventSource(`${resolveLocalAddress('https://localhost:8014')}/io`)

io.addEventListener('message', ({ data }) => {
  const input = JSON.parse(data)
  const notch = Math.max(...input) || 100
  const ratio = notch * 0.01

  // Scale
  bumps = input.map(v => v / ratio)

  const sum = bumps.reduce(add, 0)
  const avg = sum / bumps.length

  // Calc deviations from average
  bumps = bumps.map(v => v - avg).map(Math.round)

  // Add a tiny bit of randomness
  turns = 5 - Math.floor(Math.random() * 10)
})

const $html = document.documentElement

io.addEventListener('open', () => {
  $html.classList.remove('is-waiting')
})

io.addEventListener('error', () => {
  $html.classList.add('do-alert')

  setTimeout(() => {
    $html.classList.remove('do-alert')
  }, 2000)
})

// Has the page been loaded inside of an iframe?
if (window !== window.top) {
  $html.classList.add('is-planted')
}

window.addEventListener('load', () => {
  $html.classList.remove('is-waiting')

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(console.log)
  }

  play()
})
