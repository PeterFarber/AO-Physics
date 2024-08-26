local framesToSimulate = 1000
local deltaTime = 1.0 / 60.0

--- Create a World ---
local world = AOP:World()
world:Create()


--- Create a Floor ---
local body = AOP:Body()
body.shape ="Box"
body.size = { 100.0, 1.0, 100.0 }
body.motionType = "Static"
body.layer = "NON_MOVING"
body.activate = false
body:Add()

--- Create A Sphere ---
local sphere = AOP:Body()
sphere.shape = "Sphere"
sphere.radius = 0.5
sphere.position = { -3.0, 1, 0.0 }
sphere.layer = "MOVING"
sphere.activate = true
sphere:Add()
sphere:SetLinearVelocity({ 0.0, 0.0, 5.0 })

--- Create A Sphere ---
local sphere2 = AOP:Body()
sphere2.shape = "Sphere"
sphere2.motionType = "Dynamic"
sphere2.radius = 0.5
sphere2.position = { -1.0, 1, 0.0 }
sphere2.layer = "MOVING"
sphere2.activate = true
sphere2:Add()
sphere2:AddForce({ 0.0, 0.0, 100000.0 })

--- Create A Sphere ---
local sphere3 = AOP:Body()
sphere3.shape = "Sphere"
sphere3.radius = 0.5
sphere3.motionType = "Dynamic"
sphere3.position = { 1.0, 1, 0.0 }
sphere3.layer = "MOVING"
sphere3.activate = true
sphere3:Add()
sphere3:AddImpulse({ 0.0, 0.0, 1500.0 })

--- Create A Sphere ---
local sphere4 = AOP:Body()
sphere4.shape = "Sphere"
sphere4.radius = 0.5
sphere4.motionType = "Dynamic"
sphere4.position = { 3.0, 1, 0.0 }
sphere4.layer = "MOVING"
sphere4.activate = true
sphere4:Add()
sphere4:AddTorque({ 50000.0, 0.0, 0 })
-- local cast = sphere4:CastRay({ -1.0, 0.0, 0.0 })

--- Create Constraints ---
-- local constraint = AOP:ConstraintHinge()

--- Update the World ---
for i = 1, framesToSimulate do
    world:Update(1, deltaTime)
    world:GetState()
end


--- Get World States ---
print(world:GetStates())

world:Destroy()

return ""