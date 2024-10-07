AOP = require('.AOP')

local framesToSimulate = 5
local deltaTime = 1.0 / 60.0
--- Create a World ---
local world = AOP:World()
world:Create()
world:LoadWorldState('__worldstate__')

--- Simulate World ---
for i = 1, framesToSimulate do
    world:Update(1, deltaTime)
    world:GetState()
end

--- Get World States ---
print(world:GetStates())

--- Destroy the World ---
world:Destroy()

return ''