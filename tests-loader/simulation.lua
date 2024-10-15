AOP = require('.AOP')

local framesToSimulate = 5
local deltaTime = 1.0 / 60.0
--- Create a World ---
local world = AOP:World()
world:Create()
-- world:LoadWorldState('__worldstate__')

 --- Create a Floor ---
 local body = AOP:Body()
 body.shape = "Box"
 body.size = { 100.0, 1.0, 100.0 }
 body.position = { 0, -0.5, 0 }
 body.motionType = "Static"
 body.layer = "NON_MOVING"
 body.activate = false
 body:Add()


 --- Create A Sphere ---
 local character = AOP:Character()
 character.shape = "Capsule"
 character.radiusStanding = 0.5
 character.heightStanding = 2.0
 character.canMoveWhileJumping = true
 character.position = { 0.0, 1, 0.0 }
 character:Add()


 
 local boxfall = AOP:Body()
 boxfall.shape = "Box"
 boxfall.size = { 1.0, 1.0, 1.0 }
 boxfall.position = { 0, 5, 0 }
 boxfall:Add()

 local box = AOP:Body()
 box.shape = "Box"
 box.size = { 1.0, 0.1, 1.0 }
 box.position = { 0, 0.05, 2 }
 box.motionType = "Static"
 box.layer = "NON_MOVING"
 box.activate = false
 box:Add()

 local input = character:Input()
 input.x = 1.0

 --- Update the World ---
 for i = 1, framesToSimulate do
     -- if (i == 175) then
     --     input.jump = true
     -- end

     if (i > 300) then
         input.crouch = true
     else
         input.crouch = false
     end

     character:SendInput(input)

     world:Update(1, deltaTime)
     world:GetState()
     input.jump = false
 end

-- --- Simulate World ---
-- for i = 1, framesToSimulate do
--     world:Update(1, deltaTime)
--     world:GetState()
-- end

--- Get World States ---
print(world:GetStates())

--- Destroy the World ---
world:Destroy()

return ''