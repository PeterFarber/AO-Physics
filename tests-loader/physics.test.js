

import { test } from 'node:test'
import * as assert from 'node:assert'
import AoLoader from '@permaweb/ao-loader'
import fs from 'fs'

let simulation = fs.readFileSync("./simulation.lua", "utf8");
let extractedWorldState = fs.readFileSync("/mnt/c/Unity/AOP-Unity/Assets/extracted_world_state.json", "utf8");

const wasm = fs.readFileSync('./process.wasm')
const options = { format: "wasm32-unknown-emscripten4" }

test('Physics', async () => {
    const handle = await AoLoader(wasm, options)

    extractedWorldState = JSON.stringify(JSON.parse(extractedWorldState));
    simulation = simulation.replace("__worldstate__", extractedWorldState);

    const result = await handle(null, getEval(simulation), getEnv());
    console.log(result.Memory.byteLength);
    fs.writeFileSync("simulated_world_state.json", result.Output.data);
    assert.ok(result.Output.data.length >= 1);
})

function getEval(expr) {
    return {
        Target: "AOS",
        From: "FOOBAR",
        Owner: "FOOBAR",

        Module: "FOO",
        Id: "1",

        "Block-Height": "1000",
        Timestamp: Date.now(),
        Tags: [{ name: "Action", value: "Eval" }],
        Data: expr,
    };
}

function getEnv() {
    return {
        Process: {
            Id: "AOS",
            Owner: "FOOBAR",

            Tags: [{ name: "Name", value: "TEST_PROCESS_OWNER" }],
        },
    };
}