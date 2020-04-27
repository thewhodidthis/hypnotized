import {
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  TorusKnotGeometry,
  WebGLRenderer
} from 'three'

import { fragmentShader, vertexShader } from './shader'

const createPicture = (canvas, cutoff) => {
  const { width, height } = canvas

  const renderer = new WebGLRenderer({ canvas, antialias: true, devicePixelRatio: 1 })

  // https://github.com/mrdoob/three.js/issues/9716
  renderer.context.getShaderInfoLog = () => ''

  renderer.setClearColor(0x000000, 1)
  renderer.setSize(width, height)
  renderer.domElement.removeAttribute('style')

  const camera = new PerspectiveCamera(120, width / height, 0.1, cutoff)
  const scene = new Scene()

  scene.add(camera)

  const geometry = new TorusKnotGeometry(5, 10, 2000, 5, 200, 0)
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      scale: {
        type: 'f',
        value: 50.0
      }
    }
  })

  const mesh = new Mesh(geometry, material)

  scene.add(mesh)

  return { renderer, camera, scene }
}

export default createPicture
