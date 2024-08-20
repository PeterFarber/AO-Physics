
AOP = require("AOPWrapper")

local framesToSimulate = 1000
local deltaTime = 1.0/60.0

-------------- Create a world --------------
local world_params = AOP.WorldParams:new()
AOP:CreateWorld(world_params)

 -------------- Create a floor --------------
local floorParams = BodyParams:new()
floorParams.position = {0.0, 0.0, 0.0}
floorParams.size = {100.0, 1.0, 100.0}

AOP:CreateFloor(floorParams)

-------------- Create a sphere --------------
local sphereParams = BodyParams:new()
sphereParams.position = {0.0, 10.0, 0.0}

local sphere_id = AOP:CreateSphere(sphereParams)

local modParams = ModParams:new()
modParams.bodyID = sphere_id;
modParams.velocity = {0.0, 19.0, 0.0}

-------------- Update the world --------------
for i = 1, framesToSimulate do
    AOP:UpdateWorld(deltaTime)
    -- if(i % 10 == 0) then
        AOP:GetWorldState()
    -- end
    if(i == 500) then
        AOP:SetLinearVelocity(modParams)
    end
end

print(AOP:GetWorldStates())

-------------- Destroy the world --------------
AOP:DestroyWorld()
return ""