_AOP = require("aop")
local json = require('json')
local class = require('class')

AOPModule = class(function(aop) end)

local AOP = AOPModule()

function AOP:Body()
  local body = {}
  body.id = -1
  body.data = {} -- Used to store custom data
  body.position = { 0, 0, 0 }
  body.rotation = { 0, 0, 0, 1 }
  body.linearVelocity = { 0, 0, 0 }
  body.angularVelocity = { 0, 0, 0 }
  body.motionType = "Dynamic"     -- "Dynamic" | "Static" | "Kinematic"
  body.motionQuality = "Discrete" -- "Discrete" | "LinearCast"
  body.layer = "MOVING"           -- "MOVING" | "NON_MOVING"
  body.shape = "Box"              -- "Box" | "Sphere" | "Capsule" | "Cylinder"
  body.activate = true
  body.enhancedInternalEdgeRemoval = false
  body.allowSleeping = true
  body.friction = 0.2
  body.restitution = 0.0
  body.linearDamping = 0.05
  body.angularDamping = 0.05
  body.maxLinearVelocity = 500.0
  body.maxAngularVelocity = 0.25 * 3.14159265359 * 60.0
  body.gravityFactor = 1.0
  body.size = { 1, 1, 1 }
  body.radius = 0.5
  body.height = 2.0

  function body:Add()
    self.data = json.encode(self.data);
    self.id = math.floor(_AOP.add_body(json.encode(self)))
    self.data = json.decode(self.data);
  end

  function body:SetData(data)
    _AOP.set_data_body(self.id, json.encode(data))
  end

  function body:GetData()
    return json.decode(_AOP.get_data_body(self.id))
  end

  function body:SetLinearVelocity(velocity --[[{x, y, z}]])
    _AOP.set_linear_velocity(self.id, velocity[1], velocity[2], velocity[3])
  end

  function body:SetAngularVelocity(velocity --[[{x, y, z}]])
    _AOP.set_angular_velocity(self.id, velocity[1], velocity[2], velocity[3])
  end

  function body:AddLinearVelocity(velocity --[[{x, y, z}]])
    _AOP.add_linear_velocity(self.id, velocity[1], velocity[2], velocity[3])
  end

  function body:AddAngularVelocity(velocity --[[{x, y, z}]])
    _AOP.add_angular_velocity(self.id, velocity[1], velocity[2], velocity[3])
  end

  function body:AddForce(force --[[{x, y, z}]])
    _AOP.add_force(self.id, force[1], force[2], force[3])
  end

  function body:AddTorque(torque --[[{x, y, z}]])
    _AOP.add_torque(self.id, torque[1], torque[2], torque[3])
  end

  function body:AddImpulse(impulse --[[{x, y, z}]])
    _AOP.add_impulse(self.id, impulse[1], impulse[2], impulse[3])
  end

  function body:CastRay(direction --[[{x, y, z}]])
    local hit = json.decode(_AOP.cast_ray(self.id, direction[1], direction[2], direction[3]))
    local result = {
      hit = hit.hit,
      hitPoint = hit.hitPoint,
      hitBodyID = hit.hitBodyID
    }
    return result
  end

  function body:Remove()
    _AOP.remove_body(self.id)
  end

  return body;
end

function AOP:ConstraintHinge()
  local hingeConstraint = {};
  hingeConstraint.type = "Hinge"
  hingeConstraint.space = "WorldSpace"      -- "WorldSpace" | "LocalToBodyCOM"
  hingeConstraint.point1 = { 0, 0, 0 }      -- [float] x, y, z
  hingeConstraint.hingeAxis1 = { 0, 1, 0 }  -- [float] x, y, z
  hingeConstraint.normalAxis1 = { 1, 0, 0 } -- [float] x, y, z
  hingeConstraint.point2 = { 0, 0, 0 }      -- [float] x, y, z
  hingeConstraint.hingeAxis2 = { 0, 1, 0 }  -- [float] x, y, z
  hingeConstraint.normalAxis2 = { 1, 0, 0 } -- [float] x, y, z
  hingeConstraint.limitsMin = -180.0        -- [Degrees]
  hingeConstraint.limitsMax = 180           -- [float] Degrees
  hingeConstraint.maxFrictionTorque = 0.0
  hingeConstraint.limitsSpringSettings = {
    mode = "FrequencyAndDamping", -- [string] "FrequencyAndDamping" | "StiffnessAndDamping"
    frequency = 0.0,
    stiffness = 0.0,
    damping = 0.0
  }
  hingeConstraint.motorSettings = {
    frequency = 0.0,
    damping = 0.0
  }
  hingeConstraint.motorState = "Off" -- "Off" | "Velocity" | "Position"
  hingeConstraint.targetAngularVelocity = 0.0
  hingeConstraint.targetAngle = 0.0

  function hingeConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function hingeConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return hingeConstraint;
end

function AOP:ConstraintSlider()
  local sliderConstraint = {};
  sliderConstraint.type = "Slider"
  sliderConstraint.space = "WorldSpace"      -- "WorldSpace" | "LocalToBodyCOM"
  sliderConstraint.autoDetectPoint = false
  sliderConstraint.point1 = { 0, 0, 0 }      -- [float] x, y, z
  sliderConstraint.sliderAxis1 = { 1, 0, 0 } -- [float] x, y, z
  sliderConstraint.normalAxis1 = { 0, 1, 0 } -- [float] x, y, z
  sliderConstraint.point2 = { 0, 0, 0 }      -- [float] x, y, z
  sliderConstraint.sliderAxis2 = { 1, 0, 0 } -- [float] x, y, z
  sliderConstraint.normalAxis2 = { 0, 1, 0 } -- [float] x, y, z
  sliderConstraint.limitsMin = -3.40282347e+38
  sliderConstraint.limitsMax = 3.40282347e+38
  sliderConstraint.maxFrictionForce = 0.0
  sliderConstraint.limitsSpringSettings = {
    mode = "FrequencyAndDamping", -- [string] "FrequencyAndDamping" | "StiffnessAndDamping"
    frequency = 0.0,
    stiffness = 0.0,
    damping = 0.0
  }
  sliderConstraint.motorSettings = {
    frequency = 0.0,
    damping = 0.0
  }

  function sliderConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function sliderConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return sliderConstraint;
end

function AOP:ConstraintPulley()
  local pulleyConstraint = {};
  pulleyConstraint.type = "Pulley"
  pulleyConstraint.space = "WorldSpace"      -- "WorldSpace" | "LocalToBodyCOM"
  pulleyConstraint.bodyPoint1 = { 0, 0, 0 }  -- [float] x, y, z
  pulleyConstraint.fixedPoint1 = { 0, 0, 0 } -- [float] x, y, z
  pulleyConstraint.bodyPoint2 = { 0, 0, 0 }  -- [float] x, y, z
  pulleyConstraint.fixedPoint2 = { 0, 0, 0 } -- [float] x, y, z
  pulleyConstraint.ratio = 1.0
  pulleyConstraint.minLength = 0.0
  pulleyConstraint.maxLength = 0.0

  function pulleyConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function pulleyConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return pulleyConstraint;
end

function AOP:ConstraintPoint()
  local pointConstraint = {};
  pointConstraint.type = "Point"
  pointConstraint.space = "WorldSpace" -- "WorldSpace" | "LocalToBodyCOM"
  pointConstraint.point1 = { 0, 0, 0 } -- [float] x, y, z
  pointConstraint.point2 = { 0, 0, 0 } -- [float] x, y, z

  function pointConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function pointConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return pointConstraint;
end

function AOP:ConstraintGear()
  local gearConstraint = {};
  gearConstraint.type = "Gear"
  gearConstraint.space = "WorldSpace" -- "WorldSpace" | "LocalToBodyCOM"
  gearConstraint.numTeeth1 = 1
  gearConstraint.numTeeth2 = 1
  gearConstraint.hingeAxis1 = { 1, 0, 0 } -- [float] x, y, z
  gearConstraint.hingeAxis2 = { 1, 0, 0 } -- [float] x, y, z
  gearConstraint.ratio = 1.0

  function gearConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function gearConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return gearConstraint;
end

function AOP:ConstraintFixed()
  local fixedConstraint = {};
  fixedConstraint.type = "Fixed"
  fixedConstraint.space = "WorldSpace" -- "WorldSpace" | "LocalToBodyCOM"
  fixedConstraint.point1 = { 0, 0, 0 } -- [float] x, y, z
  fixedConstraint.axisX1 = { 0, 1, 0 } -- [float] x, y, z
  fixedConstraint.axisY1 = { 1, 0, 0 } -- [float] x, y, z
  fixedConstraint.point2 = { 0, 0, 0 } -- [float] x, y, z
  fixedConstraint.axisX2 = { 0, 1, 0 } -- [float] x, y, z
  fixedConstraint.axisY2 = { 1, 0, 0 } -- [float] x, y, z

  function fixedConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function fixedConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return fixedConstraint;
end

function AOP:ConstraintDistance()
  local distanceConstraint = {};
  distanceConstraint.type = "Distance"
  distanceConstraint.space = "WorldSpace" -- "WorldSpace" | "LocalToBodyCOM"
  distanceConstraint.point1 = { 0, 0, 0 } -- [float] x, y, z
  distanceConstraint.point2 = { 0, 0, 0 } -- [float] x, y, z
  distanceConstraint.minDistance = -1.0
  distanceConstraint.maxDistance = -1.0
  distanceConstraint.limitsSpringSettings = {
    mode = "FrequencyAndDamping", -- [string] "FrequencyAndDamping" | "StiffnessAndDamping"
    frequency = 0.0,
    stiffness = 0.0,
    damping = 0.0
  }

  function distanceConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function distanceConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return distanceConstraint;
end

function AOP:ConstraintCone()
  local coneConstraint = {};
  coneConstraint.type = "Cone"
  coneConstraint.space = "WorldSpace"     -- "WorldSpace" | "LocalToBodyCOM"
  coneConstraint.point1 = { 0, 0, 0 }     -- [float] x, y, z
  coneConstraint.twistAxis1 = { 0, 1, 0 } -- [float] x, y, z
  coneConstraint.point2 = { 0, 0, 0 }     -- [float] x, y, z
  coneConstraint.twistAxis2 = { 0, 1, 0 } -- [float] x, y, z
  coneConstraint.halfConeAngle = 0.0

  function coneConstraint:Add(body1, body2)
    self.body1ID = body1.id
    self.body2ID = body2.id
    self.id = _AOP.add_constraint(json.encode(self))
    return self.id
  end

  function coneConstraint:Remove()
    _AOP.remove_constraint(self.id)
  end

  return coneConstraint;
end

function AOP:Character()
  local character = {
    canMoveWhileJumping = false,
    speed = 1.0,
    sprintSpeed = 2.0,
    jumpForce = 6.0,
    heightStanding = 1.35,
    radiusStanding = 0.3,
    maxSlopeAngle = 45.0,
    friction = 0.5,
    mass = 0.0,
    gravityFactor = 1.0,
    position = { 0, 0, 0 },
    rotation = { 0, 0, 0, 1 },
    up = { 0, 1, 0 },
    layer = "MOVING", -- "MOVING" | "NON_MOVING"
    activate = true
  }
  character.id = -1;
  function character:Add()
    self.id = math.floor(_AOP.add_character(json.encode(self)))
    return self.id;
  end

  function character:Input()
    local input = {
      x = 0,
      z = 0,
      jump = false,
      sprint = false,
      crouch = false
    }
    return input
  end

  function character:SendInput(data)
    local msg = {
      id = self.id,
      input = { data.x, data.z },
      jump = data.jump,
      sprint = data.sprint,
      crouch = data.crouch
    }
    _AOP.move_character(json.encode(msg))
  end

  return character;
end

function AOP:World()
  local world = {
    gravity = { 0.0, -9.81, 0.0 },
    timeBeforeSleep = 0.5,
    allowSleeping = true,
    maxBodies = 1024,
    numBodyMutexes = 0,
    maxBodyPairs = 1024,
    maxContactConstraints = 1024
  }
  world.WorldStates = {}

  function world:Create()
    _AOP.world_create(json.encode(self))
  end

  function world:Update(steps, deltaTime)
    _AOP.world_update(steps, deltaTime)
  end

  function world:GetState()
    local worldState = _AOP.get_world_state()
    table.insert(self.WorldStates, worldState)
    return worldState
  end

  function world:GetStates()
    local state = [[{ "worldStates": []]
    for i = 1, #self.WorldStates do
      state = state .. self.WorldStates[i] .. ","
    end
    state = state:sub(1, #state - 1)
    state = state .. "]}"
    self.WorldStates = {}
    return state
  end

  function world:Destroy()
    _AOP.world_destroy()
  end

  return world;
end

return AOP
