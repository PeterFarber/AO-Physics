_AOP = require("AOP")
local json = require('json')

WorldParams = {
  gravity = { 0.0, -9.81, 0.0 },
  timeBeforeSleep = 0.5,
  allowSleeping = true,
  maxBodies = 1024,
  numBodyMutexes = 0,
  maxBodyPairs = 1024,
  maxContactConstraints = 1024
}

function WorldParams:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

BodyParams = {
  position = { 0, 0, 0 },
  rotation = { 0, 0, 0, 1 },
  linearVelocity = { 0, 0, 0 },
  angularVelocity = { 0, 0, 0 },
  motionType = "Dynamic",
  layer = "MOVING",
  enhancedInternalEdgeRemoval = false,
  allowSleeping = true,
  friction = 0.2,
  restitution = 0.0,
  linearDamping = 0.05,
  angularDamping = 0.05,
  maxLinearVelocity = 500.0,
  maxAngularVelocity = 0.25 * 3.14159265359 * 60.0,
  gravityFactor = 1.0,
  size = { 1, 1, 1 },
  radius = 0.5,
  height = 2.0
}

function BodyParams:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

ModParams = {
  bodyID = nil,
  otherID = nil,
  velocity = { 0, 0, 0 },
  rotation = { 0, 0, 0, 1 }
}

function ModParams:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

AOP = {
  BodyParams = BodyParams,
  WorldParams = WorldParams,
  ModParams = ModParams,
  WorldStates = {}
}

function AOP:new(o)
  o = o or {}
  setmetatable(o, self)
  self.__index = self
  return o
end

function AOP:CreateWorld(worldParams)
  _AOP.create_world(json.encode(worldParams))
end

function AOP:UpdateWorld(steps, deltaTime)
  _AOP.update_world(steps, deltaTime)
end

function AOP:GetWorldState()
  local worldState = _AOP.get_world_state()
  table.insert(self.WorldStates, worldState)
  return _AOP.get_world_state()
end

function AOP:GetWorldStates()
  local state = [[{ "worldStates": []]
  for i = 1, #self.WorldStates do
    state = state .. self.WorldStates[i] .. ","
  end
  state = state:sub(1, #state-1)
  state = state .. "]}"
  self.WorldStates = {}
  return state
end

function AOP:DestroyWorld()
  _AOP.destroy_world()
end

function AOP:CreateFloor(bodyParams)
  return math.floor(_AOP.create_floor(json.encode(bodyParams)))
end

function AOP:CreateSphere(bodyParams)
  return math.floor(_AOP.create_sphere(json.encode(bodyParams)))
end

function AOP:CreateBox(bodyParams)
  return math.floor(_AOP.create_box(json.encode(bodyParams)))
end

function AOP:CreateCapsule(bodyParams)
  return math.floor(_AOP.create_capsule(json.encode(bodyParams)))
end

function AOP:CreateCylinder(bodyParams)
  return math.floor(_AOP.create_cylinder(json.encode(bodyParams)))
end

function AOP:SetLinearVelocity(modParams)
  _AOP.set_linear_velocity(json.encode(modParams))
end


return AOP
