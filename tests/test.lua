AOP = require("AOPNEW")

local framesToSimulate = 1000
local deltaTime = 1.0 / 60.0

local world = AOP:World()
world:Create()


local body = AOP:Body()
body.shape ="Box"
body.size = { 100.0, 1.0, 100.0 }
body.motionType = "Static"
body.layer = "NON_MOVING"
body.activate = false
body:Add()

local sphere = AOP:Body()
sphere.shape = "Sphere"
sphere.radius = 1.0
sphere.position = { 2.0, 2.0, 0.0 }
sphere.layer = "MOVING"
sphere.activate = true
sphere:Add()



local character = AOP:Character()
character.position = { 0.0, 2.0, 0.0 }
character.layer = "MOVING"
character.activate = true
character.canMoveWhileJumping = false
character:Add()
local input = character:Input()
input.x = 1

local constraint = AOP:Constraint()
constraint.type = "Point"
constraint.point1 = { 0, 0, 0 }
constraint.point2 = { 0, 0, 0 }
constraint:Add(sphere, character)


for i = 1, framesToSimulate do
    if(i==100) then
        input.jump = true
    end
    character:SendInput(input)

    world:Update(1, deltaTime)
    world:GetState()
    input.jump = false
end

print(world:GetStates())
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
return ""
