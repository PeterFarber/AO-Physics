


    -- if(i == 100) then
    --     AOP.set_linear_velocity(json.encode(mod_params))
    -- end
    -- if(i == 150) then
    --     mod_params.bodyID = sphere2_id
    --     mod_params.velocity = { 0.0, 8, 8.0}
    --     AOP.set_linear_velocity(json.encode(mod_params))
    -- end

-- local sphere_params = {
--     position = {-3.0, 2.0, 0.0},
--     radius = 0.5,
--     motionType = "Dynamic",
--     layer = "MOVING"
-- }

-- local sphere_id = AOP.create_sphere(json.encode(sphere_params))

-- local box_params = {
--     position = {-1.0, 2.0, 0.0},
--     size = {1.0, 1.0, 1.0},
--     motionType = "Dynamic",
--     layer = "MOVING"
-- }

-- local box_id = AOP.create_box(json.encode(box_params))


-- local capsule_params = {
--     position = {1.0, 2.5, 0.0},
--     radius = 0.5,
--     height = 2.0,
--     motionType = "Dynamic",
--     layer = "MOVING"
-- }

-- local capsule_id = AOP.create_capsule(json.encode(capsule_params))

-- local cylinder_params = {
--     position = {3.0, 2.5, 0.0},
--     radius = 0.5,
--     height = 2.0,
--     motionType = "Dynamic",
--     layer = "MOVING"
-- }

-- local cylinder_id = AOP.create_cylinder(json.encode(cylinder_params))

-- sphere_params.position = {5.0, 15.0, 0.0}
-- local sphere2_id = AOP.create_sphere(json.encode(sphere_params))

-- local mod_params = {
--     bodyID = sphere_id,
--     velocity = {12.0, 4, 0.0},
-- }

-- local mod_params2 = {
--     bodyID = sphere_id,
--     otherID = sphere2_id,
-- }
-- AOP.add_constraint(json.encode(mod_params2))

