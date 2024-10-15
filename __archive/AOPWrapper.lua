-- _AOP = require("AOP")
-- local json = require('json')

-- WorldParams = {
--   gravity = { 0.0, -9.81, 0.0 },
--   timeBeforeSleep = 0.5,
--   allowSleeping = true,
--   maxBodies = 1024,
--   numBodyMutexes = 0,
--   maxBodyPairs = 1024,
--   maxContactConstraints = 1024
-- }

-- function WorldParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- BodyParams = {
--   position = { 0, 0, 0 },
--   rotation = { 0, 0, 0, 1 },
--   linearVelocity = { 0, 0, 0 },
--   angularVelocity = { 0, 0, 0 },
--   motionType = "Dynamic",
--   layer = "MOVING",
--   shape = "Box",
--   activate = true,
--   enhancedInternalEdgeRemoval = false,
--   allowSleeping = true,
--   friction = 0.2,
--   restitution = 0.0,
--   linearDamping = 0.05,
--   angularDamping = 0.05,
--   maxLinearVelocity = 500.0,
--   maxAngularVelocity = 0.25 * 3.14159265359 * 60.0,
--   gravityFactor = 1.0,
--   size = { 1, 1, 1 },
--   radius = 0.5,
--   height = 2.0
-- }

-- function BodyParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- CharacterParams = {
--   canMoveWhileJumping = false,
--   speed = 1.0,
--   sprintSpeed = 2.0,
--   jumpForce = 6.0,
--   heightStanding = 1.35,
--   radiusStanding = 0.3,
--   maxSlopeAngle = 45.0,
--   friction = 0.5,
--   mass = 0.0,
--   gravityFactor = 1.0,
--   position = { 0, 0, 0 },
--   rotation = { 0, 0, 0, 1 },
--   up = { 0, 1, 0 },
--   layer = "MOVING",
--   activate = true
-- }

-- function CharacterParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- -- Input Params
-- -- Vec3 mInput = Vec3::sZero();
-- -- bool mJump = false;
-- -- bool mSprint = false;
-- -- bool mCrouch = false;


-- InputParams = {
--   input = { 0, 0 }, -- X, Z
--   jump = false,
--   sprint = false,
--   crouch = false
-- }

-- function InputParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- ConstraintParams = {
--   body1ID = nil,
--   body2ID = nil,
--   type = "Distance",
--   space = "WorldSpace",
--   autoDetectPoint = false,
--   point1 = { 0, 0, 0 },
--   axisX1 = { 1, 0, 0 },
--   axisY1 = { 0, 1, 0 },
--   twistAxis1 = { 1, 0, 0 },
--   hingeAxis1 = { 0, 1, 0 },
--   normalAxis1 = { 1, 0, 0 },
--   point2 = { 0, 0, 0 },
--   axisX2 = { 1, 0, 0 },
--   axisY2 = { 0, 1, 0 },
--   twistAxis2 = { 1, 0, 0 },
--   hingeAxis2 = { 0, 1, 0 },
--   normalAxis2 = { 1, 0, 0 },
--   bodyPoint1 = { 0, 0, 0 },
--   fixedPoint1 = { 0, 0, 0 },
--   bodyPoint2 = { 0, 0, 0 },
--   fixedPoint2 = { 0, 0, 0 },
--   ratio = 1.0,
--   minLength = 0.0,
--   maxLength = -1.0,
--   minDistance = -1.0,
--   maxDistance = -1.0,
--   limitsMin = -3.14159265359,
--   limitsMax = 3.14159265359,
--   maxFrictionTorque = 0.0,
--   halfConeAngle = 0.0,
-- }

-- function ConstraintParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- ModParams = {
--   bodyID = nil,
--   otherID = nil,
--   velocity = { 0, 0, 0 },
--   rotation = { 0, 0, 0, 1 }
-- }

-- function ModParams:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- AOP = {
--   WorldStates = {}
-- }

-- function AOP:new(o)
--   o = o or {}
--   setmetatable(o, self)
--   self.__index = self
--   return o
-- end

-- function AOP:WorldCreate(worldParams)
--   _AOP.world_create(json.encode(worldParams))
-- end

-- function AOP:WorldUpdate(steps, deltaTime)
--   _AOP.world_update(steps, deltaTime)
-- end

-- function AOP:GetWorldState()
--   local worldState = _AOP.get_world_state()
--   table.insert(self.WorldStates, worldState)
--   return _AOP.get_world_state()
-- end

-- function AOP:GetWorldStates()
--   local state = [[{ "worldStates": []]
--   for i = 1, #self.WorldStates do
--     state = state .. self.WorldStates[i] .. ","
--   end
--   state = state:sub(1, #state-1)
--   state = state .. "]}"
--   self.WorldStates = {}
--   return state
-- end

-- function AOP:WorldDestroy()
--   _AOP.world_destroy()
-- end



-- function AOP:SetLinearVelocity(modParams)
--   _AOP.set_linear_velocity(json.encode(modParams))
-- end

-- function AOP:AddConstraint(constraintParams)
--   _AOP.add_constraint(json.encode(constraintParams))
-- end

-- function AOP:AddBody(bodyParams)
--   return math.floor(_AOP.add_body(json.encode(bodyParams)))
-- end

-- function AOP:AddCharacter(characterParams)
--   return math.floor(_AOP.add_character(json.encode(characterParams)))
-- end

-- function AOP:CharacterSendInput(characterParams)
--   return math.floor(_AOP.move_character(json.encode(characterParams)))
-- end


-- return AOP
