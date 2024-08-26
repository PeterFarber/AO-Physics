


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


--- Destroy the World ---
-- world:Destroy()


-- local sphere = AOP:Body()
-- sphere.shape = "Sphere"
-- sphere.radius = 0.5
-- sphere.position = { 2.0, 2.0, 0.0 }
-- sphere.layer = "MOVING"
-- sphere.activate = true
-- sphere:Add()



-- local character = AOP:Character()
-- character.position = { 0.0, 2.0, 0.0 }
-- character.layer = "MOVING"
-- character.activate = true
-- character.canMoveWhileJumping = false
-- character:Add()
-- local input = character:Input()
-- input.x = 1

-- local constraint = AOP:Constraint()
-- constraint.type = "Point"
-- constraint.point1 = { 0, 0, 0 }
-- constraint.point2 = { 0, 0, 0 }
-- constraint:Add(sphere, character)





-- print("asd")

-- print(world:GetState())

-- local aop = AOP()
-- local body = AOP:Body();
-- body:Add();
-------------- Create a world --------------
-- local world_params = AOP.WorldParams:new()
-- AOP:WorldCreate(world_params)

-- -------------- Create a floor --------------
-- local floorParams = AOP.BodyParams:new()
-- floorParams.position = { 0.0, 0.0, 0.0 }
-- floorParams.size = { 100.0, 1.0, 100.0 }
-- floorParams.motionType = "Static"
-- floorParams.layer = "NON_MOVING"
-- floorParams.shape = "Box"
-- floorParams.activate = false
-- AOP:AddBody(floorParams)

-- -------------- Create stairs --------------

-- for i = 1, 10 do
--     local stairParams = BodyParams:new()
--     local size = i*0.1;
--     stairParams.position = { 0, (size), -2-(i*1) }
--     stairParams.size = { 3.0, 1, 1.0 }
--     stairParams.motionType = "Static"
--     stairParams.layer = "NON_MOVING"
--     stairParams.shape = "Box"
--     stairParams.activate = false
--     AOP:AddBody(stairParams)
-- end

-- -------------- Create a Character Controller --------------

-- local characterParams = CharacterParams:new()
-- characterParams.position = { 0.0, 2.0, 0.0 }
-- AOP:AddCharacter(characterParams)

-- -------------- Character Input Params --------------

-- local characterInputParams = InputParams:new()
-- characterInputParams.input = { 1.0, 0.0 }

-- -------------- Update the world --------------
-- for i = 1, framesToSimulate do

--     AOP:CharacterSendInput(characterInputParams);
--     AOP:UpdateWorld(deltaTime);
--     AOP:GetWorldState();

-- end

-- print(AOP:GetWorldStates())


-- -------------- Destroy the world --------------
-- AOP:WorldDestroy()
