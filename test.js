import 'cutaway'
import { assert, report } from 'tapeless'
import createPicture from './painter'

const { ok } = assert

const canvas = document.createElement('canvas')
const output = createPicture(canvas)

ok
  .describe('ko', 'will return')
  .test(output)

report()
