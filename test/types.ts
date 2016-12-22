import * as fs from 'fs'
import * as tiletype from '../'

const dimensions = tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))
const header = tiletype.headers(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))
const type = tiletype.type(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))