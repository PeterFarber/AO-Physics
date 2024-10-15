AOP = require("AOPWrapper")

-- Add a way to set Mass of an Object
-- Add a trigger layer
-- Add Raycasting
-- Set userdata to a body by bodyid to get the userdata back by bodyid
-- Add meta data to a body. Like a name, or a tags
-- Character controller.

local framesToSimulate = 1000
local deltaTime = 1.0 / 60.0

-------------- Create a world --------------
local world_params = AOP.WorldParams:new()
AOP:CreateWorld(world_params)

-------------- Create a floor --------------
local floorParams = BodyParams:new()
floorParams.position = { 0.0, 0.0, 0.0 }
floorParams.size = { 100.0, 1.0, 100.0 }

AOP:CreateFloor(floorParams)

-------------- Create a Box --------------
local box_params = BodyParams:new()
box_params.position = { 0.0, 10.0, 0.0 }
box_params.size = { 1.0, 1.0, 1.0 }
box_params.motionType = "Static"
box_params.layer = "NON_MOVING"
local boxID = AOP:CreateBox(box_params)

local sphereParams = BodyParams:new()
local posy = 10.0
sphereParams.motionType = "Dynamic"
sphereParams.layer = "MOVING"
sphereParams.restitution = 0.5

-- Connect the boxes with spheres using distance constraints
local prevID = boxID
for i=1, 5 do
    posy = posy - 1
    sphereParams.position = {0, posy, 0 }

    local id = AOP:CreateSphere(sphereParams)

    local constraintParams = ConstraintParams:new()
    constraintParams.body1ID = prevID;
    constraintParams.body2ID = id ;
    constraintParams.point1 = { 0, posy+1+0.5, 0.0 }
    constraintParams.point2 = {0, posy+0.5, 0.0 }
    constraintParams.type = "Distance";
    constraintParams.minDistance =  1.0
    constraintParams.maxDistance =  2.0
    AOP:AddContraint(constraintParams);
    prevID = id
end

local modParams = ModParams:new()
modParams.bodyID = prevID

-------------- Update the world --------------
for i = 1, framesToSimulate do
    AOP:UpdateWorld(deltaTime)
    AOP:GetWorldState()
    -- Apply velocity after 100 framesToSimulate to the last sphere in the chain
    if(i==-1) then
        modParams.velocity = { -10.0, 0.0, 0.0 }
        AOP:SetLinearVelocity(modParams)
    end
    if(i==300) then
        modParams.velocity = { 10.0, 0.0, 5.0 }
        AOP:SetLinearVelocity(modParams)
    end
end

print(AOP:GetWorldStates())

-------------- Destroy the world --------------
AOP:DestroyWorld()
return ""
