

import { test } from 'node:test'
import * as assert from 'node:assert'
import AoLoader from '@permaweb/ao-loader'
import fs from 'fs'

const wasm = fs.readFileSync('./process.wasm')
const options = { format: "wasm64-unknown-emscripten-draft_2024_02_15" }

test('Physics', async () => {
    const handle = await AoLoader(wasm, options)
    const env = {
        Process: {
            Id: 'AOS',
            Owner: 'FOOBAR',
            Tags: [
                { name: 'Name', value: 'Thomas' }
            ]
        }
    }
    const msg = {
        Target: 'AOS',
        From: 'FOOBAR',
        Owner: 'FOOBAR',
        ['Block-Height']: "1000",
        Id: "1234xyxfoo",
        Module: "WOOPAWOOPA",
        Tags: [
            { name: 'Action', value: 'Eval' }
        ],
        Data: `
local jolt = require('jolt')

return jolt.mysin(1)
`
    }

    // load handler
    const result = await handle(null, msg, env)

    console.log(result.Output.data)

    assert.ok(true)
})
