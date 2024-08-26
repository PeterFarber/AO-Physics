AOP = require("AOP")

local framesToSimulate = 5000
local deltaTime = 1.0 / 60.0
local scenario = "HingeConstraint" -- "BodyForces", "HingeConstraint", "SliderConstraint", "PointConstraint", "ConeConstraint"

--- Create a World ---
local world = AOP:World()
world:Create()

if scenario == "BodyForces" then
    --- Create a Floor ---
    local body = AOP:Body()
    body.shape = "Box"
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

    --- Update the World ---
    for i = 1, framesToSimulate do
        world:Update(1, deltaTime)
        world:GetState()
    end
end

if scenario == "HingeConstraint" then
    --- Create a Floor ---
    local body = AOP:Body()
    body.shape = "Box"
    body.size = { 100.0, 1.0, 100.0 }
    body.motionType = "Static"
    body.layer = "NON_MOVING"
    body.activate = false
    body:Add()

    --- Hinge Constraint ---
    local sphere = AOP:Body()
    sphere.shape = "Box"
    sphere.motionType = "Static"
    sphere.radius = 0.5
    sphere.size = { 1, 1.0, 0.2 }
    sphere.position = { 0, 5, 0.0 }
    sphere.layer = "NON_MOVING"
    sphere.activate = false
    sphere:Add()

    local sphere2 = AOP:Body()
    sphere2.shape = "Box"
    sphere2.motionType = "Dynamic"
    sphere2.radius = 0.5
    sphere2.size = { 0.5, 2.0, 0.2 }
    sphere2.position = { 0, 4.25, -0.2 }
    sphere2.layer = "MOVING"
    sphere2.activate = true
    sphere2:Add()

    local sphere3 = AOP:Body()
    sphere3.shape = "Box"
    sphere3.motionType = "Dynamic"
    sphere3.radius = 0.5
    sphere3.size = { 0.5, 2.0, 0.2 }
    sphere3.position = { 0, 2.75, -0.4 }
    sphere3.layer = "MOVING"
    sphere3.activate = true
    sphere3:Add()

    local constraint = AOP:ConstraintHinge()
    constraint.point1 = { 0, 5, -0.1 }
    constraint.point2 = { 0, 5, -0.1 }
    constraint.hingeAxis1 = { 0, 0, 1 }
    constraint.hingeAxis2 = { 0, 0, 1 }
    constraint.normalAxis1 = { 0, 1, 0 }
    constraint.normalAxis2 = { 0, 1, 0 }
    local degs = 180
    constraint.limitsMin = -degs
    constraint.limitsMax = degs
    constraint.limitsSpringSettings = {
        mode = "FrequencyAndDamping",
        frequency = 2.0,
        damping = 0.5
    }

    constraint:Add(sphere, sphere2)

    local constraint2 = AOP:ConstraintHinge()
    constraint2.point1 = { 0, 3.5, -0.3 }
    constraint2.point2 = { 0, 3.5,  -0.3  }
    constraint2.hingeAxis1 = { 0, 0, 1 }
    constraint2.hingeAxis2 = { 0, 0, 1 }
    constraint2.normalAxis1 = { 0, 1, 0 }
    constraint2.normalAxis2 = { 0, 1, 0 }
    local degs = 180
    constraint.limitsMin = -degs
    constraint.limitsMax = degs
    constraint.limitsSpringSettings = {
        mode = "FrequencyAndDamping",
        frequency = 2.0,
        damping = 0.5
    }

    constraint2:Add(sphere2, sphere3)

    --- Update the World ---
    for i = 1, framesToSimulate do
        world:Update(1, deltaTime)
        world:GetState()
        if (i == 150) then
            sphere2:SetAngularVelocity({ 0.0, 0.0, 125.0 })
        end
    end
end

if scenario == "PointConstraint" then
    --- Create a Floor ---
    local body = AOP:Body()
    body.shape = "Box"
    body.size = { 100.0, 1.0, 100.0 }
    body.motionType = "Static"
    body.layer = "NON_MOVING"
    body.activate = false
    body:Add()

    local sphere = AOP:Body()
    sphere.shape = "Box"
    sphere.motionType = "Static"
    sphere.radius = 0.5
    sphere.size = { 1.0, 1.0, 1.0 }
    sphere.position = { -1.5, 5, 0.0 }
    sphere.layer = "NON_MOVING"
    sphere.activate = false
    sphere:Add()

    local sphere2 = AOP:Body()
    sphere2.shape = "Box"
    sphere2.motionType = "Dynamic"
    sphere2.radius = 0.5
    sphere2.rotation = {0.3535534, -0.1464466, 0.3535534, 0.8535534 }
    sphere2.size = { 1.0, 1.0, 1.0 }
    sphere2.position = { 1.5, 5, 0.0 }
    sphere2.layer = "MOVING"
    sphere2.activate = true
    sphere2:Add()

    -- Preserves the initial Rotation of the object
    local constraint = AOP:ConstraintPoint()
    constraint.point1 = { -1.5, 5, 0 }
    constraint.point2 = { -1.5, 5, 0 }
    constraint:Add(sphere, sphere2)

    
    -- constraint:Add(sphere, sphere2)

    --- Update the World ---
    for i = 1, framesToSimulate do
        world:Update(1, deltaTime)
        world:GetState()
        if (i == 150) then
            sphere2:SetLinearVelocity({ 50.0, 0.0, 0.0 })
        end
    end
end

if scenario == "PointConstraint" then
    --- Create a Floor ---
    local body = AOP:Body()
    body.shape = "Box"
    body.size = { 100.0, 1.0, 100.0 }
    body.motionType = "Static"
    body.layer = "NON_MOVING"
    body.activate = false
    body:Add()

    local sphere = AOP:Body()
    sphere.shape = "Box"
    sphere.motionType = "Static"
    sphere.radius = 0.5
    sphere.size = { 1.0, 1.0, 1.0 }
    sphere.position = { -1.5, 5, 0.0 }
    sphere.layer = "NON_MOVING"
    sphere.activate = false
    sphere:Add()

    local sphere2 = AOP:Body()
    sphere2.shape = "Box"
    sphere2.motionType = "Dynamic"
    sphere2.radius = 0.5
    sphere2.rotation = {0.3535534, -0.1464466, 0.3535534, 0.8535534 }
    sphere2.size = { 1.0, 1.0, 1.0 }
    sphere2.position = { 1.5, 5, 0.0 }
    sphere2.layer = "MOVING"
    sphere2.activate = true
    sphere2:Add()

    -- Preserves the initial Rotation of the object
    local constraint = AOP:ConstraintPoint()
    constraint.point1 = { -1.5, 5, 0 }
    constraint.point2 = { -1.5, 5, 0 }
    constraint:Add(sphere, sphere2)

    
    -- constraint:Add(sphere, sphere2)

    --- Update the World ---
    for i = 1, framesToSimulate do
        world:Update(1, deltaTime)
        world:GetState()
        if (i == 150) then
            sphere2:SetLinearVelocity({ 50.0, 0.0, 0.0 })
        end
    end
end

--- Get World States ---
print(world:GetStates())

--- Destroy the World ---
world:Destroy()

return ""
