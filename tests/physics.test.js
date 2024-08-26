const {describe, it} = require("node:test");
const assert = require("assert");
const fs = require("fs");
const wasm = fs.readFileSync("./process.wasm");
const lua = fs.readFileSync("./test.lua", "utf8");
const AOPWrapper = fs.readFileSync("../AOP/Lua/AOP.lua", "utf8");
const AOPClass = fs.readFileSync("../AOP/Lua/class.lua", "utf8");
const m = require(__dirname + "/process.js");

describe("Physics Tests", async () => {
  var instance;
  const handle = async function (msg, env) {
    const res = await instance.cwrap("handle", "string", ["string", "string"], {
      async: true,
    })(JSON.stringify(msg), JSON.stringify(env));
    console.log("Memory used:", instance.HEAP8.length);
    return JSON.parse(res);
  };

  it("Create instance", async () => {
    console.log("Creating instance...");
    var instantiateWasm = function (imports, cb) {
      WebAssembly.instantiate(wasm, imports).then((result) =>
        cb(result.instance)
      );
      return {};
    };

    instance = await m({
      ARWEAVE: "https://arweave.net",
      mode: "test",
      blockHeight: 100,
      spawn: {
        Scheduler: "TEST_SCHED_ADDR",
      },
      Process: {
        Id: "AOS",
        Owner: "FOOBAR",
        tags: [{name: "Extension", value: "Weave-Drive"}],
      },
      instantiateWasm,
    });
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Instance created.");
    await new Promise((r) => setTimeout(r, 250));

    assert.ok(instance);
  });

  it("Jolt", async () => {
    var formatted = lua.replace(/local json = require\('json'\)/g, "");
    formatted = formatted.replace(/AOP = require\("AOP"\)/g, AOPWrapper);

    
    formatted = formatted.replace(
      /local class = require\('class'\)/g,
      AOPClass
    );
    // console.log(formatted);
    formatted = formatted.replace(/return AOP/g, "");
    const result = await handle(getEval(formatted), getEnv());

    fs.writeFileSync("jolt.json", result.response.Output.data);
    assert.ok(result.response.Output.data.length >= 1);
  });

});

function getEval(expr) {
  return {
    Target: "AOS",
    From: "FOOBAR",
    Owner: "FOOBAR",

    Module: "FOO",
    Id: "1",

    "Block-Height": "1000",
    Timestamp: Date.now(),
    Tags: [{name: "Action", value: "Eval"}],
    Data: expr,
  };
}

function getEnv() {
  return {
    Process: {
      Id: "AOS",
      Owner: "FOOBAR",

      Tags: [{name: "Name", value: "TEST_PROCESS_OWNER"}],
    },
  };
}
/*

local vel = 4;
local pos = 10;
local cubes = 30;
local spheres = 30;
local capsules = 10;

-- Loop 10 times creating boxes, spheres, and capsules with random positions and velocities
for i=1, cubes do
  local x = math.random(-pos, pos)
  local y = math.random(2, 10)
  local z = math.random(-pos, pos)
  local vx = math.random(-vel, vel)
  local vy = math.random(-vel, vel)
  local vz = math.random(-vel, vel)
  local id = jolt.create_box(1,1,1, x, y, z, 'Dynamic', "MOVING")
  jolt.set_linear_velocity(id, vx, vy, vz)
end


for i=1, spheres do
  local x = math.random(-pos, pos)
  local y = math.random(2, 10)
  local z = math.random(-pos, pos)
  local vx = math.random(-vel, vel)
  local vy = math.random(-vel, vel)
  local vz = math.random(-vel, vel)
  local id = jolt.create_sphere(0.5, x,y,z, 'Dynamic')
  jolt.set_linear_velocity(id, vx, vy, vz)
end

for i=1, capsules do
  local x = math.random(-pos, pos)
  local y = math.random(2, 10)
  local z = math.random(-pos, pos)
  local vx = math.random(-vel, vel)
  local vy = math.random(-vel, vel)
  local vz = math.random(-vel, vel)
  local id = jolt.create_capsule(0.5, 2, x, y, z, 'Dynamic')
  jolt.set_linear_velocity(id, vx, vy, vz)
end



local sphere_id = jolt.create_sphere(0.5, -3.0, 2.0, 2.0, 'Dynamic')
local sphere2_id = jolt.create_sphere(0.5, 3.0, 2.0, 2.0, 'Dynamic')

local capsule_id = jolt.create_capsule(0.5, 2, 0.0, 9.0, 2.0, 'Dynamic')
jolt.set_linear_velocity(sphere_id, 3, 0, 0)
jolt.set_linear_velocity(sphere2_id, -3, 0, 0)
local out = [[{ "worldStates": []]
for i=1, 750 do
  jolt.update_world(1, 0.01666666666)
  out = out .. jolt.get_world_state() .. ","
end
out = out:sub(1, #out-1)
out = out .. "]}"

print(out)
*/

// import { test } from 'node:test'
// import * as assert from 'node:assert'
// import AoLoader from '@permaweb/ao-loader'
// import fs from 'fs'

// const wasm = fs.readFileSync('./process.wasm')
// const options = { format: "wasm64-unknown-emscripten-draft_2024_02_15" }

// test('graphql', async () => {
//     const handle = await AoLoader(wasm, options)
//     const env = {
//         Process: {
//             Id: 'AOS',
//             Owner: 'FOOBAR',
//             Tags: [
//                 { name: 'Name', value: 'Thomas' }
//             ]
//         }
//     }
//     const msg = {
//         Target: 'AOS',
//         From: 'FOOBAR',
//         Owner: 'FOOBAR',
//         ['Block-Height']: "1000",
//         Id: "1234xyxfoo",
//         Module: "WOOPAWOOPA",
//         Tags: [
//             { name: 'Action', value: 'Eval' }
//         ],
//         Data: `
// local luagraphqlparser = require('luagraphqlparser')
// local res = luagraphqlparser.parse([[
//     query HeroComparison($first: Int = 3) {
//       leftComparison: hero(episode: EMPIRE) {
//         ...comparisonFields
//       }
//       rightComparison: hero(episode: JEDI) {
//         ...comparisonFields
//       }
//     }

//     fragment comparisonFields on Character {
//       name
//       friendsConnection(first: $first) {
//         totalCount
//         edges {
//           node {
//             name
//           }
//         }
//       }
//     }
// ]])
// return res
// `
//     }

//     // load handler
//     const result = await handle(null, msg, env)

//     console.log(result)

//     assert.ok(true)
// })
