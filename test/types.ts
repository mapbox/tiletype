import * as fs from 'fs'
import * as tiletype from '../'

tiletype.dimensions(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))
tiletype.headers(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))
tiletype.type(fs.readFileSync(__dirname + '/fixtures/0.jpeg'))