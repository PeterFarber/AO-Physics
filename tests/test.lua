local jolt = require('jolt')
local json = require('json')
jolt.create_world()

local floor_params = {
    position = {0.0, 1.0, 0.0},
    size = {100.0, 1.0, 100.0},
}

local floor_id = jolt.create_floor(json.encode(floor_params))


-- Json of sphere parameters
local sphere_params = {
    position = {0.0, 2.0, 0.0},
    velocity = {0.0, 0.0, 0.0},
    radius = 0.5,
    motionType = "Dynamic",
    layer = "MOVING"
}

local sphere_id = jolt.create_sphere(json.encode(sphere_params))

local box_params = {
    position = {0.0, 0.0, 0.0},
    size = {1.0, 1.0, 1.0},
    motionType = "Dynamic",
    layer = "MOVING"
}

local box_id = jolt.create_box(json.encode(box_params))


local capsule_params = {
    position = {0.0, 0.0, 0.0},
    radius = 0.5,
    height = 2.0,
    motionType = "Dynamic",
    layer = "MOVING"
}

local capsule_id = jolt.create_capsule(json.encode(capsule_params))

local cylinder_params = {
    position = {0.0, 0.0, 0.0},
    radius = 0.5,
    height = 2.0,
    motionType = "Dynamic",
    layer = "MOVING"
}

local cylinder_id = jolt.create_cylinder(json.encode(cylinder_params))


jolt.update_world(1, 0.01666666666)
local state = [[{ "worldStates": []]
state = state .. jolt.get_world_state() .. ","
state = state:sub(1, #state-1)
state = state .. "]}"
print(state)

jolt.destroy_world()
return ""